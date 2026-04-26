import Link from "next/link";

const EMBED_URL = process.env.NEXT_PUBLIC_POWERBI_EMBED_URL || "https://app.powerbi.com/view?r=eyJrIjoiZDU0ZDMzOGQtNDhmNy00MmNmLTgzYWQtY2VjOWYwZWE4NDNhIiwidCI6ImZkMjA2NzE1LTc1MDktNGFlNS05Yjk2LTc2YmI5Nzg4NmE4NCIsImMiOjEwfQ%3D%3D"; // ใส่ลิงก์ publish-to-web

export default function PowerBIPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Power BI Report</h1>

      <div
        className="card"
        // สูงเท่าหน้าจอ (เผื่อ header/padding ~ 220px)
        style={{ height: "calc(100vh - 220px)", padding: 0, overflow: "hidden" }}
      >
        {EMBED_URL ? (
          <iframe
            src={EMBED_URL}
            title="Power BI"
            style={{ width: "100%", height: "100%", border: 0 }}
            allowFullScreen
          />
        ) : (
          <div className="p-6 text-sm text-red-300">
            Missing <code>NEXT_PUBLIC_POWERBI_EMBED_URL</code> in <code>.env.local</code>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400">
        * รายงานนี้สาธารณะ (Publish to web) ·{" "}
        {EMBED_URL && (
          <Link
            href={EMBED_URL}
            target="_blank"
            className="underline hover:text-gray-200"
          >
            Open report
          </Link>
        )}
      </div>
    </div>
  );
}