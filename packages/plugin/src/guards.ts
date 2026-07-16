export function isDevtoolsEnabled(
  configured?: boolean | (() => boolean)
): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  if (process.env.DEV_AUTH_ENABLED === "false") {
    return false;
  }

  if (typeof configured === "function") {
    return configured();
  }

  return configured ?? process.env.DEV_AUTH_ENABLED === "true";
}
