import type { Metadata } from "next";
import { Devtools } from "./devtools";

export const metadata: Metadata = {
  title: "Better Auth DevTools Demo",
  description: "Demo app for Better Auth DevTools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "20px", background: "#f5f5f5" }}>
        {children}
        <Devtools />
      </body>
    </html>
  );
}
