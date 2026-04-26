"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Row = { iso_code: string; country: string };

export default function SearchList({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => rows.filter(r => (r.country + r.iso_code).toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );

  return (
    <div className="card">
      <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search country / ISO…" />
      <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12}}>
        {filtered.slice(0, 200).map(r => (
          <Link key={r.iso_code} href={`/country/${r.iso_code}`} className="btn btn-outline" title={r.country}>
            {r.country} <span style={{opacity:.7}}>({r.iso_code})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}