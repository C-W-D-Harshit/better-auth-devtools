import type { EditableFieldConfig, ManagedTestUserTemplate } from "./types.js";

export function isValidTemplateKey(
  key: string,
  templates: Record<string, ManagedTestUserTemplate>
): boolean {
  return key in templates;
}

export function filterAllowedPatchKeys(
  patch: Record<string, unknown>,
  editableFields: EditableFieldConfig[]
): {
  allowed: Record<string, unknown>;
  disallowed: string[];
} {
  const allowedKeys = new Set(editableFields.map((field) => field.key));
  const allowed: Record<string, unknown> = {};
  const disallowed: string[] = [];

  for (const [key, value] of Object.entries(patch)) {
    if (allowedKeys.has(key)) {
      allowed[key] = value;
    } else {
      disallowed.push(key);
    }
  }

  return { allowed, disallowed };
}
