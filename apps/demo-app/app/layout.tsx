import type { Metadata } from "next";
import { DevtoolsWrapper } from "./devtools-wrapper";

export const metadata: Metadata = {
  title: "Better Auth DevTools Demo",
  description: "Demo app for Better Auth DevTools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const devtoolsEnabled =
    process.env.DEV_AUTH_ENABLED === "true" &&
    process.env.NODE_ENV !== "production";

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "20px", background: "#f5f5f5" }}>
        {children}
        <DevtoolsWrapper enabled={devtoolsEnabled} />
      </body>
    </html>
  );
}
