import type {
  DevtoolsPanelFieldConfig,
  DevtoolsSessionView,
} from "../types.js";

export type DraftValue = string | boolean;

export function fieldValue(
  session: DevtoolsSessionView | null,
  field: DevtoolsPanelFieldConfig,
): DraftValue {
  const value = session?.fields[field.key];
  return field.type === "boolean"
    ? value === true
    : value == null
      ? ""
      : String(value);
}

export function changedFields(
  session: DevtoolsSessionView | null,
  fields: DevtoolsPanelFieldConfig[],
  draft: Record<string, DraftValue>,
): { patch: Record<string, unknown>; errors: Record<string, string> } {
  const patch: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  if (!session) return { patch, errors };

  for (const field of fields) {
    if (!Object.hasOwn(draft, field.key)) continue;
    const value = draft[field.key];
    if (Object.is(value, fieldValue(session, field))) continue;
    if (field.type === "number") {
      const text = String(value).trim();
      if (!text || !Number.isFinite(Number(text))) {
        errors[field.key] =
          `${field.label} needs a finite number. Clearing this field is not supported.`;
      } else {
        patch[field.key] = Number(text);
      }
    } else if (field.type === "select") {
      if (typeof value !== "string" || !field.options?.includes(value)) {
        errors[field.key] =
          `Choose a valid ${field.label.toLowerCase()}. Clearing this field is not supported.`;
      } else {
        patch[field.key] = value;
      }
    } else if (field.type === "boolean") {
      patch[field.key] = value === true;
    } else {
      patch[field.key] = String(value);
    }
  }
  return { patch, errors };
}
