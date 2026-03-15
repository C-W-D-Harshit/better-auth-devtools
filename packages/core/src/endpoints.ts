export const ROUTE_PREFIX = "/better-auth-devtools";

export const ENDPOINTS = {
  LIST_USERS: `${ROUTE_PREFIX}/users`,
  CREATE_USER: `${ROUTE_PREFIX}/users`,
  LOGIN: `${ROUTE_PREFIX}/login`,
  SESSION: `${ROUTE_PREFIX}/session`,
  UPDATE_SESSION: `${ROUTE_PREFIX}/update-session`,
} as const;
