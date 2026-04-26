import Link from "next/link";
import "./globals.css";

export const metadata = { title: "CO₂ Dashboard", description: "Global CO₂ insights" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="nav container">
            <Link className="brand" href="/">CO₂ Dashboard</Link>
            <div className="nav-links">
              <Link href="/">Countries</Link>
              <Link href="/compare">Compare</Link>
              <Link href="/scatter">Scatter</Link>
              <Link href="/powerbi">Power BI</Link>
            </div>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container footer-inner">
            <small>Data: OWID (cleaned) · Powered by Supabase &amp; Recharts</small>
            <small><a href="/powerbi">Open report</a></small>
          </div>
        </footer>
      </body>
    </html>
  );
}