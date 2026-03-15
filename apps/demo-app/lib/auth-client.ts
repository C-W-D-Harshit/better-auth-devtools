import { createAuthClient } from "better-auth/react";
import { devtools } from "./auth-options.mjs";

export const authClient = createAuthClient({
  plugins: [devtools.clientPlugin],
});

export const { useSession, signIn, signOut } = authClient;
