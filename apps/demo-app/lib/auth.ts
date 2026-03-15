import { betterAuth } from "better-auth";
import { authOptions } from "./auth-options.mjs";

export const auth = betterAuth(authOptions);
