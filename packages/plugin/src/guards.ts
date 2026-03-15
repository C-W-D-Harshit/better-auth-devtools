export function isDevtoolsEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return process.env.DEV_AUTH_ENABLED === "true";
}
