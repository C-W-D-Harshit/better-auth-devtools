import type { ManagedTestUserTemplate, EditableFieldConfig } from "./types.js";

/**
 * Check if a template key exists in the provided templates map.
 */
export function isValidTemplateKey(
  key: string,
  templates: Record<string, ManagedTestUserTemplate>
): boolean {
  return key in templates;
}

/**
 * Filter a patch object to only include keys that are in the editable fields list.
 * Returns { allowed, disallowed } so the caller can decide how to handle rejected keys.
 */
export function filterAllowedPatchKeys(
  patch: Record<string, unknown>,
  editableFields: EditableFieldConfig[]
): {
  allowed: Record<string, unknown>;
  disallowed: string[];
} {
  const allowedKeys = new Set(editableFields.map((f) => f.key));
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
