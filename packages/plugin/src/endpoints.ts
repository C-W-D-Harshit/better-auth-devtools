export const ROUTE_PREFIX = "/better-auth-devtools";

export const ENDPOINTS = {
  CONFIG: `${ROUTE_PREFIX}/config`,
  LIST_USERS: `${ROUTE_PREFIX}/users`,
  CREATE_USER: `${ROUTE_PREFIX}/users`,
  DELETE_USER: `${ROUTE_PREFIX}/users/delete`,
  LOGIN: `${ROUTE_PREFIX}/login`,
  SESSION: `${ROUTE_PREFIX}/session`,
  UPDATE_SESSION: `${ROUTE_PREFIX}/update-session`,
} as const;
