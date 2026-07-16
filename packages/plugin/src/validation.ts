import type {
  DevtoolsSessionPatch,
  EditableFieldConfig,
  ManagedTestUserTemplate,
} from "./types.js";

export function isValidTemplateKey<
  TTemplates extends Record<string, ManagedTestUserTemplate>,
>(key: string, templates: TTemplates): key is keyof TTemplates & string {
  return Object.hasOwn(templates, key);
}

export function filterAllowedPatchKeys<
  TFields extends Record<string, unknown>,
  TEditableKey extends keyof TFields & string,
>(
  patch: Record<string, unknown>,
  editableFields: EditableFieldConfig<TEditableKey>[]
): {
  allowed: DevtoolsSessionPatch<TFields, TEditableKey>;
  disallowed: string[];
} {
  const allowedKeys = new Set(editableFields.map((field) => field.key));
  const allowed: Partial<Record<TEditableKey, unknown>> = {};
  const disallowed: string[] = [];

  for (const [key, value] of Object.entries(patch)) {
    if (allowedKeys.has(key as TEditableKey)) {
      allowed[key as TEditableKey] = value;
    } else {
      disallowed.push(key);
    }
  }

  return {
    allowed: allowed as DevtoolsSessionPatch<TFields, TEditableKey>,
    disallowed,
  };
}
