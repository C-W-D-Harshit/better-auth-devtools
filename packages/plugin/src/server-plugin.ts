import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { ENDPOINTS } from "./endpoints.js";
import { filterAllowedPatchKeys, isValidTemplateKey } from "./validation.js";
import type {
  DevtoolsPluginConfig,
  DevtoolsSessionPatch,
  ManagedTestUserRecord,
  ManagedTestUserTemplate,
} from "./types.js";
import { ErrorCode } from "./errors.js";
import { isDevtoolsEnabled } from "./guards.js";
import type {
  CreateUserRequest,
  UpdateSessionRequest,
} from "./payloads.js";

function guardCheck() {
  if (!isDevtoolsEnabled()) {
    return {
      enabled: false,
      error: {
        code: ErrorCode.FEATURE_DISABLED,
        message:
          "DevTools is disabled. Set DEV_AUTH_ENABLED=true in a non-production environment.",
      },
    } as const;
  }
  return { enabled: true } as const;
}

function toManagedTestUserRecord(
  record: Record<string, unknown>
): ManagedTestUserRecord {
  return {
    id: String(record.id),
    userId: String(record.userId),
    templateKey: String(record.templateKey),
    label: String(record.label),
    email: String(record.email),
    createdAt:
      record.createdAt instanceof Date
        ? record.createdAt.toISOString()
        : String(record.createdAt),
  };
}

export const devtoolsPlugin = <
  TTemplates extends Record<string, ManagedTestUserTemplate>,
  TFields extends Record<string, unknown>,
  TEditableKey extends keyof TFields & string,
>(
  config: DevtoolsPluginConfig<TTemplates, TFields, TEditableKey>
) => {
  return {
    id: "better-auth-devtools",

    schema: {
      devtoolsUser: {
        fields: {
          userId: { type: "string", required: true },
          templateKey: { type: "string", required: true },
          label: { type: "string", required: true },
          email: { type: "string", required: true },
          createdAt: { type: "date", required: true },
          updatedAt: { type: "date", required: true },
        },
        modelName: "devtoolsUser",
      },
    },

    endpoints: {
      listDevtoolsUsers: createAuthEndpoint(
        ENDPOINTS.LIST_USERS,
        { method: "GET" },
        async (ctx) => {
          const guard = guardCheck();
          if (!guard.enabled) {
            return ctx.json({ error: guard.error }, { status: 403 });
          }

          const users = await ctx.context.adapter.findMany({
            model: "devtoolsUser",
          });

          return ctx.json(
            (users as Record<string, unknown>[]).map(toManagedTestUserRecord)
          );
        }
      ),

      createDevtoolsUser: createAuthEndpoint(
        ENDPOINTS.CREATE_USER,
        { method: "POST" },
        async (ctx) => {
          const guard = guardCheck();
          if (!guard.enabled) {
            return ctx.json({ error: guard.error }, { status: 403 });
          }

          const body = ctx.body as
            | CreateUserRequest<keyof TTemplates & string>
            | undefined;
          const templateKey = body?.template;

          if (!templateKey || !isValidTemplateKey(templateKey, config.templates)) {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.INVALID_TEMPLATE,
                  message: `Invalid template key: ${templateKey}. Available: ${Object.keys(config.templates).join(", ")}`,
                },
              },
              { status: 400 }
            );
          }

          const template = config.templates[templateKey];

          // Count existing users for this template to generate unique email
          const existing = await ctx.context.adapter.findMany({
            model: "devtoolsUser",
            where: [{ field: "templateKey", value: templateKey }],
          });
          const nextNum = existing.length + 1;

          const email = template.emailPattern
            ? template.emailPattern.replace("{{n}}", String(nextNum))
            : `${templateKey}+${nextNum}@test.local`;

          try {
            const result = await config.createManagedUser({
              templateKey,
              template,
              email,
            });

            const now = new Date();
            const record = await ctx.context.adapter.create({
              model: "devtoolsUser",
              data: {
                userId: result.userId,
                templateKey,
                label: result.label ?? template.label,
                email: result.email ?? email,
                createdAt: now,
                updatedAt: now,
              },
            });

            return ctx.json({
              user: {
                ...toManagedTestUserRecord(record as Record<string, unknown>),
              },
            });
          } catch (e) {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.CREATION_FAILED,
                  message:
                    e instanceof Error ? e.message : "Failed to create managed user",
                },
              },
              { status: 500 }
            );
          }
        }
      ),

      devtoolsLogin: createAuthEndpoint(
        ENDPOINTS.LOGIN,
        { method: "POST" },
        async (ctx) => {
          const guard = guardCheck();
          if (!guard.enabled) {
            return ctx.json({ error: guard.error }, { status: 403 });
          }

          const body = ctx.body as { userId?: string } | undefined;
          const userId = body?.userId;

          if (!userId) {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.USER_NOT_FOUND,
                  message: "userId is required",
                },
              },
              { status: 400 }
            );
          }

          // Verify user is devtools-managed
          const managed = await ctx.context.adapter.findMany({
            model: "devtoolsUser",
            where: [{ field: "userId", value: userId }],
          });

          if (!managed || managed.length === 0) {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.UNMANAGED_USER,
                  message:
                    "User is not a devtools-managed test user. Only managed test users can be switched to.",
                },
              },
              { status: 403 }
            );
          }

          try {
            const user = await ctx.context.internalAdapter.findUserById(userId);
            if (!user) {
              return ctx.json(
                {
                  error: {
                    code: ErrorCode.USER_NOT_FOUND,
                    message: "Managed test user no longer exists",
                  },
                },
                { status: 404 }
              );
            }

            // Create a new session using Better Auth's internal adapter
            const session = await ctx.context.internalAdapter.createSession(userId);

            if (!session) {
              return ctx.json(
                {
                  error: {
                    code: ErrorCode.SESSION_CREATION_FAILED,
                    message: "Failed to create session",
                  },
                },
                { status: 500 }
              );
            }

            await setSessionCookie(ctx, {
              session,
              user,
            });

            // Get session view from host
            const sessionView = await config.getSessionView({
              userId,
              sessionId: session.id,
            });

            return ctx.json({ session: sessionView });
          } catch (e) {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.SESSION_CREATION_FAILED,
                  message:
                    e instanceof Error
                      ? e.message
                      : "Failed to create session for user",
                },
              },
              { status: 500 }
            );
          }
        }
      ),

      getDevtoolsSession: createAuthEndpoint(
        ENDPOINTS.SESSION,
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const guard = guardCheck();
          if (!guard.enabled) {
            return ctx.json({ error: guard.error }, { status: 403 });
          }

          const session = ctx.context.session;

          try {
            const sessionView = await config.getSessionView({
              userId: session.user.id,
              sessionId: session.session.id,
            });

            return ctx.json({ session: sessionView });
          } catch {
            return ctx.json({ session: null });
          }
        }
      ),

      updateDevtoolsSession: createAuthEndpoint(
        ENDPOINTS.UPDATE_SESSION,
        {
          method: "POST",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const guard = guardCheck();
          if (!guard.enabled) {
            return ctx.json({ error: guard.error }, { status: 403 });
          }

          const body = ctx.body as
            | UpdateSessionRequest<TFields, TEditableKey>
            | undefined;
          const patch = body?.patch;

          if (!patch || typeof patch !== "object") {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.INVALID_PATCH,
                  message: "patch object is required",
                },
              },
              { status: 400 }
            );
          }

          if (!config.editableFields || config.editableFields.length === 0) {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.INVALID_PATCH,
                  message: "No editable fields configured",
                },
              },
              { status: 400 }
            );
          }

          const { allowed, disallowed } = filterAllowedPatchKeys(
            patch,
            config.editableFields
          );

          if (disallowed.length > 0) {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.INVALID_PATCH,
                  message: `Disallowed patch keys: ${disallowed.join(", ")}`,
                },
              },
              { status: 400 }
            );
          }

          if (Object.keys(allowed).length === 0) {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.INVALID_PATCH,
                  message: "No valid patch keys provided",
                },
              },
              { status: 400 }
            );
          }

          // Validate individual field values
          for (const field of config.editableFields) {
            if (field.key in allowed && field.validate) {
              if (!field.validate(allowed[field.key])) {
                return ctx.json(
                  {
                    error: {
                      code: ErrorCode.INVALID_PATCH,
                      message: `Invalid value for field: ${field.key}`,
                    },
                  },
                  { status: 400 }
                );
              }
            }
          }

          const session = ctx.context.session;

          try {
            const sessionView = await config.patchSession({
              userId: session.user.id,
              sessionId: session.session.id,
              patch: allowed as DevtoolsSessionPatch<TFields, TEditableKey>,
            });

            return ctx.json({ session: sessionView });
          } catch (e) {
            return ctx.json(
              {
                error: {
                  code: ErrorCode.INVALID_PATCH,
                  message:
                    e instanceof Error
                      ? e.message
                      : "Failed to update session",
                },
              },
              { status: 500 }
            );
          }
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};
