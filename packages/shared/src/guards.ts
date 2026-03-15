/**
 * Check if devtools feature is enabled based on environment.
 * Requires DEV_AUTH_ENABLED=true AND non-production NODE_ENV.
 */
export function isDevtoolsEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  return process.env.DEV_AUTH_ENABLED === "true";
}
