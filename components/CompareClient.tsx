"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CartesianGrid, Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from "recharts";

type Country = { iso_code: string; country: string };
type Point = {
  year: number;
  co2: number;
  co2_per_capita: number;
  gdp_currentusd: number;
  population: number;
};
type SeriesMap = Record<string, Point[]>;

export default function CompareClient({
  countries,
  defaults = ["USA", "CHN", "IND"],
}: {
  countries: Country[];
  defaults?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(defaults);
  const [log, setLog] = useState(false);
  const [mode, setMode] = useState<"co2" | "co2_per_capita">("co2");
  const [data, setData] = useState<SeriesMap>({});
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  // ── fetch series for selected ISOs
  useEffect(() => {
    const run = async () => {
      if (selected.length === 0) {
        setData({});
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/series?iso=${selected.join(",")}`);
      const json = await res.json();
      setData(json.series || {});
      setLoading(false);
    };
    run();
  }, [selected]);

  // ── union of years
  const years = useMemo(() => {
    const y = new Set<number>();
    Object.values(data).forEach((arr) => arr.forEach((p) => y.add(p.year)));
    return Array.from(y).sort((a, b) => a - b);
  }, [data]);

  // ── dataset for recharts
  const merged = useMemo(() => {
    return years.map((year) => {
      const row: any = { year };
      for (const iso of Object.keys(data)) {
        const hit = data[iso].find((p) => p.year === year);
        row[iso] = !hit ? null : mode === "co2" ? hit.co2 : hit.co2_per_capita;
      }
      return row;
    });
  }, [years, data, mode]);

  const displayRows = useMemo(() => {
    if (!log) return merged;
    return merged.map((row) => {
      const r: any = { year: row.year };
      for (const k of Object.keys(row)) {
        if (k === "year") continue;
        const v = row[k] as number | null;
        r[k] = v && v > 0 ? Math.log10(v) : null;
      }
      return r;
    });
  }, [merged, log]);

  // ── UI helpers
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return countries;
    return countries.filter((c) =>
      (c.country + c.iso_code).toLowerCase().includes(qq)
    );
  }, [countries, q]);

  const addIso = (iso: string) =>
    setSelected((s) => (s.includes(iso) ? s : s.length >= 6 ? s : [...s, iso]));

  const removeIso = (iso: string) =>
    setSelected((s) => s.filter((x) => x !== iso));

  const clearAll = () => setSelected([]);

  const exportCSV = () => {
    const header = ["year", ...Object.keys(data)].join(",");
    const rows = displayRows.map((r) =>
      [r.year, ...Object.keys(data).map((iso) => (r as any)[iso] ?? "")].join(",")
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `compare_${mode}${log ? "_log" : ""}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <strong>Compare Countries</strong>
          <label className="badge">
            <input
              type="radio"
              name="mode"
              value="co2"
              checked={mode === "co2"}
              onChange={() => setMode("co2")}
            />{" "}
            Total CO₂ (Mt)
          </label>
          <label className="badge">
            <input
              type="radio"
              name="mode"
              value="co2_per_capita"
              checked={mode === "co2_per_capita"}
              onChange={() => setMode("co2_per_capita")}
            />{" "}
            CO₂ per capita (t)
          </label>
          <label className="badge" style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={log}
              onChange={(e) => setLog(e.target.checked)}
            />{" "}
            Log scale
          </label>

          <div style={{ marginLeft: "auto" }} />
          <button className="btn btn-outline" onClick={exportCSV}>
            Export CSV
          </button>
          <button
            className="btn"
            onClick={clearAll}
            disabled={selected.length === 0}
            style={{ opacity: selected.length === 0 ? 0.5 : 1 }}
          >
            Clear all
          </button>
        </div>

        {/* Selected chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {selected.map((iso) => (
            <span
              key={iso}
              className="badge"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              {iso}
              <button
                onClick={() => removeIso(iso)}
                className="btn btn-outline"
                style={{ padding: "2px 6px" }}
              >
                x
              </button>
            </span>
          ))}
          {selected.length === 0 && (
            <span className="badge">เลือกประเทศได้สูงสุด 6</span>
          )}
        </div>

        {/* Search + list */}
        <input
          className="input"
          placeholder="Search country / ISO…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div
          className="card"
          style={{
            maxHeight: 220,
            overflow: "auto",
            background: "#0f0f12",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: 8,
            }}
          >
            {filtered.map((c) => {
              const picked = selected.includes(c.iso_code);
              return (
                <button
                  key={c.iso_code}
                  disabled={picked}
                  onClick={() => addIso(c.iso_code)}
                  className="btn"
                  style={{
                    opacity: picked ? 0.45 : 1,
                    cursor: picked ? "not-allowed" : "pointer",
                  }}
                  title={c.country}
                >
                  {c.iso_code}
                </button>
              );
            })}
          </div>
        </div>

        <small style={{ color: "#9aa0a6" }}>
          * เลือกได้สูงสุด 6 ประเทศ · Log scale = log₁₀
        </small>
      </div>

      {/* Chart */}
      <div className="card" style={{ height: 420 }}>
        {loading ? (
          <div
            className="h-full w-full animate-pulse"
            style={{ background: "#0f0f12", borderRadius: 12 }}
          />
        ) : Object.keys(data).length === 0 ? (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              height: "100%",
              color: "#9aa0a6",
            }}
          >
            เลือกประเทศอย่างน้อย 1 ประเทศเพื่อแสดงกราฟ
          </div>
        ) : (
          <ResponsiveContainer>
            <LineChart data={displayRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(data).map((iso) => (
                <Line key={iso} type="monotone" dataKey={iso} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}