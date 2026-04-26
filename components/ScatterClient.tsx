"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CartesianGrid,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis, YAxis, ZAxis
} from "recharts";

type Row = { iso: string; country: string; co2: number; gdp: number; pop: number };

/** ── Tooltip กำหนดเอง: แสดงชื่อประเทศ (Country), ISO, ปี ── */
function CustomTooltip({ active, payload, year, log }: any) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload as Row;

  const fmtVal = (v: number) =>
    log ? (typeof v === "number" ? v.toFixed(3) : v) : Number(v).toLocaleString();

  return (
    <div
      style={{
        background: "#111115",
        border: "1px solid #2b2b31",
        borderRadius: 12,
        color: "#f5f6fa",
        padding: "10px 12px",
        minWidth: 240,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        {p.country} ({p.iso}) — Year {year}
      </div>
      <div>CO₂ (Mt){log ? " [log₁₀]" : ""}: <b>{fmtVal(p.co2)}</b></div>
      <div>GDP (USD){log ? " [log₁₀]" : ""}: <b>{fmtVal(p.gdp)}</b></div>
      <div>Population: <b>{Number(p.pop).toLocaleString()}</b></div>
    </div>
  );
}

export default function ScatterClient({ initialYear }: { initialYear?: number }) {
  const [year, setYear] = useState<number>(initialYear ?? 2020);
  const [years, setYears] = useState<number[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [log, setLog] = useState(false);
  const [loading, setLoading] = useState(true);

  /** โหลดข้อมูลตามปี */
  const fetchYear = async (y: number) => {
    setLoading(true);
    const res = await fetch(`/api/scatter?year=${y}`);
    const json = await res.json();
    setRows(json.rows || []);
    setYears(json.years || []);
    setYear(json.year || y);
    setLoading(false);
  };

  useEffect(() => {
    fetchYear(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ปุ่มปีถัดไป/ปีก่อนหน้า */
  const idx = years.findIndex((v) => v === year);
  const canPrev = idx > 0;
  const canNext = idx >= 0 && idx < years.length - 1;
  const goPrev = () => canPrev && fetchYear(years[idx - 1]);
  const goNext = () => canNext && fetchYear(years[idx + 1]);

  /** แปลง log เฉพาะค่าบวก */
  const plotted = useMemo(() => {
    if (!log) return rows;
    const L = (v: number) => (v > 0 ? Math.log10(v) : null);
    return rows
      .map((r) => ({ ...r, co2: L(r.co2) as any, gdp: L(r.gdp) as any }))
      .filter((r) => r.co2 !== null && r.gdp !== null) as Row[];
  }, [rows, log]);

  return (
    <div className="space-y-12">
      {/* Controls */}
      <div
        className="card"
        style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}
      >
        <div className="badge">Scatter: GDP vs CO₂</div>
        <label className="badge" style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={log}
            onChange={(e) => setLog(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Log scale
        </label>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn btn-outline"
            onClick={goPrev}
            disabled={!canPrev}
            title="Previous year"
            style={{ width: 38 }}
          >
            ◀
          </button>

          <select
            className="input"
            style={{ width: 140 }}
            value={year}
            onChange={(e) => fetchYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            className="btn btn-outline"
            onClick={goNext}
            disabled={!canNext}
            title="Next year"
            style={{ width: 38 }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="card" style={{ height: 480 }}>
        {loading ? (
          <div
            className="h-full w-full animate-pulse"
            style={{ background: "#0f0f12", borderRadius: 12 }}
          />
        ) : (
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid stroke="#2a2a33" />
              <XAxis
                dataKey="gdp"
                name={log ? "log₁₀ GDP (USD)" : "GDP (USD)"}
                tick={{ fill: "#e6e7ea" }}
              />
              <YAxis
                dataKey="co2"
                name={log ? "log₁₀ CO₂ (Mt)" : "CO₂ (Mt)"
                }
                tick={{ fill: "#e6e7ea" }}
              />
              <ZAxis dataKey="pop" range={[18, 160]} name="Population" />

              {/* ใช้ Tooltip แบบกำหนดเอง */}
              <Tooltip content={<CustomTooltip year={year} log={log} />} />

              {/* จุดสีฟ้าโปร่ง + ขอบอ่อน */}
              <Scatter data={plotted} fill="#7db7ff" stroke="#a9ccff" fillOpacity={0.85} />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="text-xs" style={{ color: "#9aa0a6" }}>
        * จุดแต่ละจุดคือ 1 ประเทศในปีที่เลือก · ขนาดฟอง = ประชากร · สามารถสลับเป็น Log scale ได้
      </p>
    </div>
  );
}