import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ message: "Sign in to check access." }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return Response.json({ message: "Denied: this action requires the Admin role." }, { status: 403 });
    }
    return Response.json({ message: `Allowed for ${session.user.email}. No data was changed.` });
  } catch (error) {
    console.error("Admin access check failed", error);
    return Response.json({ message: "Could not check access. See the server log." }, { status: 500 });
  }
}
