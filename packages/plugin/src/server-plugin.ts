import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { DevtoolsPluginConfig } from "@better-auth-devtools/core";
import {
  ENDPOINTS,
  isValidTemplateKey,
  filterAllowedPatchKeys,
} from "@better-auth-devtools/core";
import { isDevtoolsEnabled, ErrorCode } from "@better-auth-devtools/shared";

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

export const devtoolsPlugin = (config: DevtoolsPluginConfig) => {
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
            users.map((u: Record<string, unknown>) => ({
              id: u.id,
              userId: u.userId,
              templateKey: u.templateKey,
              label: u.label,
              email: u.email,
              createdAt: u.createdAt,
            }))
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

          const body = ctx.body as { template?: string } | undefined;
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
                id: record.id,
                userId: record.userId,
                templateKey: record.templateKey,
                label: record.label,
                email: record.email,
                createdAt: record.createdAt,
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
            // Create a new session using Better Auth's internal adapter
            const session =
              await ctx.context.internalAdapter.createSession(
                userId,
                ctx.request
              );

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

            // Set session cookie
            const sessionCookie = ctx.context.createAuthCookie("session_token");
            ctx.setHeader(
              "Set-Cookie",
              `${sessionCookie.name}=${session.token};Path=/;HttpOnly;SameSite=Lax`
            );

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
            | { patch?: Record<string, unknown> }
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
              patch: allowed,
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
