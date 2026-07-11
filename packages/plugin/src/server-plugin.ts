import type { BetterAuthPlugin } from "better-auth";
import {
  APIError,
  createAuthEndpoint,
  createAuthMiddleware,
  formCsrfMiddleware,
  getSessionFromCtx,
  originCheckMiddleware,
} from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import * as z from "zod";
import { ENDPOINTS, ROUTE_PREFIX } from "./endpoints.js";
import { ErrorCode } from "./errors.js";
import { isDevtoolsEnabled } from "./guards.js";
import type {
  DevtoolsOptions,
  DevtoolsSessionPatch,
  DevtoolsSessionView,
  EditableFieldConfig,
  ManagedTestUserRecord,
  ManagedTestUserTemplate,
} from "./types.js";
import { filterAllowedPatchKeys, isValidTemplateKey } from "./validation.js";

const DEFAULT_TEMPLATES = {
  user: { label: "Test User" },
} as const satisfies Record<string, ManagedTestUserTemplate>;

const createUserBody = z.object({ template: z.string().min(1) });
const deleteUserBody = z.object({ userId: z.string().min(1) });
const loginBody = z.object({ userId: z.string().min(1) });
const updateSessionBody = z.object({
  patch: z.record(z.string(), z.unknown()),
});

function guardCheck(configured?: boolean | (() => boolean)) {
  if (!isDevtoolsEnabled(configured)) {
    return {
      enabled: false,
      error: {
        code: ErrorCode.FEATURE_DISABLED,
        message: "Better Auth DevTools is unavailable in this environment.",
      },
    } as const;
  }

  return { enabled: true } as const;
}

type HttpErrorStatus =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR";

function fail(
  status: HttpErrorStatus,
  code: (typeof ErrorCode)[keyof typeof ErrorCode],
  message: string
): never {
  throw new APIError(status, { code, message });
}

const trustedRequestMiddleware = createAuthMiddleware(async (ctx) => {
  const requestOrigin = ctx.request?.headers.get("origin");
  if (
    requestOrigin &&
    !ctx.context.isTrustedOrigin(requestOrigin, { allowRelativePaths: false })
  ) {
    fail(
      "FORBIDDEN",
      ErrorCode.UNTRUSTED_ORIGIN,
      "The request origin is not trusted."
    );
  }
});

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

function createEmail(templateKey: string, template: ManagedTestUserTemplate) {
  const random = globalThis.crypto.randomUUID().slice(0, 8);
  const suffix = `${Date.now().toString(36)}-${random}`;
  const safeKey = templateKey.toLowerCase().replace(/[^a-z0-9._-]/g, "-");

  if (!template.emailPattern) {
    return `${safeKey}+${suffix}@test.local`;
  }
  if (template.emailPattern.includes("{{n}}")) {
    return template.emailPattern.replaceAll("{{n}}", suffix);
  }

  const at = template.emailPattern.lastIndexOf("@");
  return at > 0
    ? `${template.emailPattern.slice(0, at)}+${suffix}${template.emailPattern.slice(at)}`
    : `${template.emailPattern}+${suffix}`;
}

function defaultSessionView<
  TFields extends Record<string, unknown>,
  TEditableKey extends keyof TFields & string,
>(
  user: Record<string, unknown>,
  session: Record<string, unknown>,
  editableFields: EditableFieldConfig<TEditableKey>[]
): DevtoolsSessionView<TFields, TEditableKey> {
  return {
    userId: String(user.id),
    email: typeof user.email === "string" ? user.email : undefined,
    label: typeof user.name === "string" ? user.name : undefined,
    fields: ({
      ...user,
      session,
    } as unknown) as TFields,
    editableFields: editableFields.map((field) => field.key),
  };
}

function isValidFieldValue(field: EditableFieldConfig, value: unknown) {
  if (field.validate && !field.validate(value)) {
    return false;
  }

  switch (field.type ?? "string") {
    case "boolean":
      return typeof value === "boolean";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "select":
      return typeof value === "string" && Boolean(field.options?.includes(value));
    default:
      return typeof value === "string";
  }
}

export const devtools = <
  TTemplates extends Record<string, ManagedTestUserTemplate> = typeof DEFAULT_TEMPLATES,
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
>(
  config: DevtoolsOptions<TTemplates, TFields, TEditableKey> = {}
) => {
  const templates = (config.templates ?? DEFAULT_TEMPLATES) as TTemplates;
  const editableFields = config.editableFields ?? [];
  const editableKeys = new Set<string>();
  for (const field of editableFields) {
    if (editableKeys.has(field.key)) {
      throw new Error(`Duplicate Better Auth DevTools field: ${field.key}`);
    }
    if (field.type === "select" && (!field.options || field.options.length === 0)) {
      throw new Error(
        `Better Auth DevTools select field "${field.key}" requires options.`
      );
    }
    editableKeys.add(field.key);
  }

  return {
    id: "better-auth-devtools",

    schema: {
      devtoolsUser: {
        fields: {
          userId: {
            type: "string",
            required: true,
            unique: true,
            references: {
              model: "user",
              field: "id",
              onDelete: "cascade",
            },
          },
          templateKey: { type: "string", required: true },
          label: { type: "string", required: true },
          email: { type: "string", required: true, unique: true },
          createdAt: { type: "date", required: true },
          updatedAt: { type: "date", required: true },
        },
        modelName: "devtoolsUser",
      },
    },

    endpoints: {
      getDevtoolsConfig: createAuthEndpoint(
        ENDPOINTS.CONFIG,
        { method: "GET" },
        async (ctx) => {
          const guard = guardCheck(config.enabled);
          if (!guard.enabled) {
            fail("FORBIDDEN", guard.error.code, guard.error.message);
          }

          return ctx.json({
            enabled: true as const,
            templates: Object.entries(templates).map(([key, template]) => ({
              key,
              label: template.label,
            })),
            editableFields: editableFields.map((field) => ({
              key: field.key,
              label: field.label,
              type: field.type,
              options: field.options,
            })),
            capabilities: {
              createUsers: true as const,
              deleteUsers: true as const,
              editSession: editableFields.length > 0,
            },
          });
        }
      ),

      listDevtoolsUsers: createAuthEndpoint(
        ENDPOINTS.LIST_USERS,
        { method: "GET" },
        async (ctx) => {
          const guard = guardCheck(config.enabled);
          if (!guard.enabled) {
            fail("FORBIDDEN", guard.error.code, guard.error.message);
          }

          const users = await ctx.context.adapter.findMany({
            model: "devtoolsUser",
            limit: 100,
            sortBy: { field: "createdAt", direction: "desc" },
          });

          return ctx.json(
            (users as Record<string, unknown>[]).map(toManagedTestUserRecord)
          );
        }
      ),

      createDevtoolsUser: createAuthEndpoint(
        ENDPOINTS.CREATE_USER,
        {
          method: "POST",
          body: createUserBody,
          use: [trustedRequestMiddleware, originCheckMiddleware, formCsrfMiddleware],
        },
        async (ctx) => {
          const guard = guardCheck(config.enabled);
          if (!guard.enabled) {
            fail("FORBIDDEN", guard.error.code, guard.error.message);
          }

          const templateKey = ctx.body.template;
          if (!isValidTemplateKey(templateKey, templates)) {
            fail(
              "BAD_REQUEST",
              ErrorCode.INVALID_TEMPLATE,
              "Choose one of the configured test-user templates."
            );
          }

          const template = templates[templateKey];
          const email = createEmail(templateKey, template);
          let createdUserId: string | undefined;

          try {
            const result = config.createManagedUser
              ? await config.createManagedUser({
                  templateKey,
                  template: template as TTemplates[keyof TTemplates & string],
                  email,
                })
              : await ctx.context.internalAdapter.createUser({
                  ...(template.user ?? {}),
                  name: template.label,
                  email,
                  emailVerified: true,
                });

            createdUserId = "userId" in result ? result.userId : result.id;
            const resultEmail =
              typeof result.email === "string" ? result.email : email;
            const resultLabel =
              "label" in result && typeof result.label === "string"
                ? result.label
                : template.label;
            const now = new Date();
            const record = await ctx.context.adapter.create({
              model: "devtoolsUser",
              data: {
                userId: createdUserId,
                templateKey,
                label: resultLabel,
                email: resultEmail,
                createdAt: now,
                updatedAt: now,
              },
            });

            return ctx.json({
              user: toManagedTestUserRecord(record as Record<string, unknown>),
            });
          } catch (error) {
            if (createdUserId) {
              await ctx.context.internalAdapter.deleteUser(createdUserId).catch(
                (cleanupError: unknown) =>
                  ctx.context.logger.error(
                    "Better Auth DevTools failed to roll back a managed user",
                    cleanupError
                  )
              );
            }
            ctx.context.logger.error(
              "Better Auth DevTools failed to create a managed user",
              error
            );
            fail(
              "INTERNAL_SERVER_ERROR",
              ErrorCode.CREATION_FAILED,
              "Could not create the test user. Check the server log."
            );
          }
        }
      ),

      deleteDevtoolsUser: createAuthEndpoint(
        ENDPOINTS.DELETE_USER,
        {
          method: "POST",
          body: deleteUserBody,
          use: [trustedRequestMiddleware, originCheckMiddleware, formCsrfMiddleware],
        },
        async (ctx) => {
          const guard = guardCheck(config.enabled);
          if (!guard.enabled) {
            fail("FORBIDDEN", guard.error.code, guard.error.message);
          }

          const managed = await ctx.context.adapter.findOne({
            model: "devtoolsUser",
            where: [{ field: "userId", value: ctx.body.userId }],
          });
          if (!managed) {
            fail(
              "FORBIDDEN",
              ErrorCode.UNMANAGED_USER,
              "Only DevTools-managed users can be deleted."
            );
          }

          await ctx.context.internalAdapter.deleteUser(ctx.body.userId);
          await ctx.context.adapter.deleteMany({
            model: "devtoolsUser",
            where: [{ field: "userId", value: ctx.body.userId }],
          });

          return ctx.json({ success: true as const });
        }
      ),

      devtoolsLogin: createAuthEndpoint(
        ENDPOINTS.LOGIN,
        {
          method: "POST",
          body: loginBody,
          use: [trustedRequestMiddleware, originCheckMiddleware, formCsrfMiddleware],
        },
        async (ctx) => {
          const guard = guardCheck(config.enabled);
          if (!guard.enabled) {
            fail("FORBIDDEN", guard.error.code, guard.error.message);
          }

          const userId = ctx.body.userId;
          const managed = await ctx.context.adapter.findOne({
            model: "devtoolsUser",
            where: [{ field: "userId", value: userId }],
          });
          if (!managed) {
            fail(
              "FORBIDDEN",
              ErrorCode.UNMANAGED_USER,
              "Only DevTools-managed users can be switched to."
            );
          }

          try {
            const user = await ctx.context.internalAdapter.findUserById(userId);
            if (!user) {
              fail(
                "NOT_FOUND",
                ErrorCode.USER_NOT_FOUND,
                "The managed test user no longer exists."
              );
            }

            const session = await ctx.context.internalAdapter.createSession(userId);
            await setSessionCookie(ctx, { session, user });
            const sessionView = config.getSessionView
              ? await config.getSessionView({ userId, sessionId: session.id })
              : defaultSessionView(
                  user as Record<string, unknown>,
                  session as Record<string, unknown>,
                  editableFields
                );

            return ctx.json({ session: sessionView });
          } catch (error) {
            if (error instanceof APIError) {
              throw error;
            }
            ctx.context.logger.error(
              "Better Auth DevTools failed to switch sessions",
              error
            );
            fail(
              "INTERNAL_SERVER_ERROR",
              ErrorCode.SESSION_CREATION_FAILED,
              "Could not switch sessions. Check the server log."
            );
          }
        }
      ),

      getDevtoolsSession: createAuthEndpoint(
        ENDPOINTS.SESSION,
        { method: "GET" },
        async (ctx) => {
          const guard = guardCheck(config.enabled);
          if (!guard.enabled) {
            fail("FORBIDDEN", guard.error.code, guard.error.message);
          }

          const current = await getSessionFromCtx(ctx);
          if (!current) {
            return ctx.json({ session: null });
          }

          try {
            const sessionView = config.getSessionView
              ? await config.getSessionView({
                  userId: current.user.id,
                  sessionId: current.session.id,
                })
              : defaultSessionView(
                  current.user as Record<string, unknown>,
                  current.session as Record<string, unknown>,
                  editableFields
                );

            return ctx.json({ session: sessionView });
          } catch (error) {
            ctx.context.logger.error(
              "Better Auth DevTools failed to read the current session",
              error
            );
            fail(
              "INTERNAL_SERVER_ERROR",
              ErrorCode.INVALID_CONFIG,
              "Could not inspect the session. Check the server log."
            );
          }
        }
      ),

      updateDevtoolsSession: createAuthEndpoint(
        ENDPOINTS.UPDATE_SESSION,
        {
          method: "POST",
          body: updateSessionBody,
          use: [trustedRequestMiddleware, originCheckMiddleware, formCsrfMiddleware],
        },
        async (ctx) => {
          const guard = guardCheck(config.enabled);
          if (!guard.enabled) {
            fail("FORBIDDEN", guard.error.code, guard.error.message);
          }

          if (editableFields.length === 0) {
            fail(
              "BAD_REQUEST",
              ErrorCode.INVALID_PATCH,
              "No editable fields are configured."
            );
          }

          const { allowed, disallowed } = filterAllowedPatchKeys(
            ctx.body.patch,
            editableFields
          );
          if (disallowed.length > 0 || Object.keys(allowed).length === 0) {
            fail(
              "BAD_REQUEST",
              ErrorCode.INVALID_PATCH,
              "The patch contains unsupported fields."
            );
          }

          for (const field of editableFields) {
            if (field.key in allowed && !isValidFieldValue(field, allowed[field.key])) {
              fail(
                "BAD_REQUEST",
                ErrorCode.INVALID_PATCH,
                `Invalid value for ${field.label}.`
              );
            }
          }

          const current = await getSessionFromCtx(ctx);
          if (!current) {
            fail(
              "UNAUTHORIZED",
              ErrorCode.NO_ACTIVE_SESSION,
              "Sign in before editing session data."
            );
          }

          try {
            if (config.patchSession) {
              const sessionView = await config.patchSession({
                userId: current.user.id,
                sessionId: current.session.id,
                patch: allowed as DevtoolsSessionPatch<TFields, TEditableKey>,
              });
              return ctx.json({ session: sessionView });
            }

            const user = await ctx.context.internalAdapter.updateUser(
              current.user.id,
              allowed
            );
            const sessionView = config.getSessionView
              ? await config.getSessionView({
                  userId: current.user.id,
                  sessionId: current.session.id,
                })
              : defaultSessionView(
                  user as Record<string, unknown>,
                  current.session as Record<string, unknown>,
                  editableFields
                );
            return ctx.json({ session: sessionView });
          } catch (error) {
            ctx.context.logger.error(
              "Better Auth DevTools failed to update session data",
              error
            );
            fail(
              "INTERNAL_SERVER_ERROR",
              ErrorCode.INVALID_PATCH,
              "Could not update the field. Check the server log."
            );
          }
        }
      ),
    },

    rateLimit: [
      {
        pathMatcher: (path) => path.startsWith(ROUTE_PREFIX),
        max: 60,
        window: 60,
      },
    ],
  } satisfies BetterAuthPlugin;
};

/** @deprecated Use `devtools()` for the zero-config API. */
export const devtoolsPlugin = devtools;
