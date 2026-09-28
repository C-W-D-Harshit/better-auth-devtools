import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1>Better Auth DevTools demo</h1>
      <p>Open the real Auth DevTools panel at the bottom right. Create a Viewer and an Admin, then select Switch for each one.</p>
      <p><Link href="/dashboard">Open application session and access check</Link></p>
      <ol>
        <li>As Viewer, the app should show the Viewer email and role. The server access check should deny the action.</li>
        <li>Switch to Admin. The app should show the Admin email and role. The same server action should succeed.</li>
      </ol>
      <p>The app reads its own Better Auth session and enforces access on the server. DevTools only creates the test personas and switches the session.</p>
    </main>
  );
}
