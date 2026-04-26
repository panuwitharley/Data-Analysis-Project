import LineCO2 from "@/components/LineCO2";
import { getSupabaseLite } from "@/lib/supabase/server-lite";
import { notFound } from "next/navigation";

const fmt = (n: number | null | undefined, d = 1) =>
  n == null ? "–" : n.toLocaleString(undefined, { maximumFractionDigits: d });

export default async function CountryPage({
  params,
}: {
  params: Promise<{ iso: string }>;
}) {
  const { iso } = await params;          // Next ใหม่: params เป็น Promise
  const ISO = iso?.toUpperCase();
  if (!ISO) notFound();

  const supabase = getSupabaseLite();

  // ชื่อประเทศ
  const { data: meta, error: metaErr } = await supabase
    .from("countries")
    .select("country")
    .eq("iso_code", ISO)
    .maybeSingle();
  if (metaErr) throw new Error(metaErr.message);
  if (!meta) notFound();

  // series + ตัวเลขรวม
  const { data: rows, error } = await supabase
    .from("co2_yearly")
    .select("year, co2, co2_per_capita, gdp_currentusd, population")
    .eq("iso_code", ISO)
    .order("year");
  if (error) throw new Error(error.message);

  let totalCO2 = 0, totalGDP = 0, totalPop = 0, sumPC = 0, cntPC = 0;
  const series = (rows ?? []).map(r => {
    if (r.co2) totalCO2 += r.co2;
    if (r.gdp_currentusd) totalGDP += r.gdp_currentusd;
    if (r.population) totalPop += r.population;
    if (r.co2_per_capita != null) { sumPC += r.co2_per_capita; cntPC++; }
    return { year: r.year, co2: r.co2 ?? 0 };
  });

  const avgPC = cntPC ? sumPC / cntPC : null;

  return (
    <div className="space-y-4">
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>
        {meta.country} ({ISO})
      </h1>

      {/* KPI cards */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">Total CO₂ (Mt)</div>
          <div className="value">{fmt(totalCO2, 0)}</div>
        </div>
        <div className="kpi">
          <div className="label">Avg CO₂ per capita (t)</div>
          <div className="value">{fmt(avgPC, 2)}</div>
        </div>
        <div className="kpi">
          <div className="label">Population</div>
          <div className="value">{fmt(totalPop, 0)}</div>
        </div>
        <div className="kpi">
          <div className="label">GDP (USD)</div>
          <div className="value">{fmt(totalGDP, 0)}</div>
        </div>
      </div>

      {/* Chart card */}
      {series.length > 0 ? (
        <LineCO2 data={series} title="Total CO₂ (Mt) by year" />
      ) : (
        <div className="card">No yearly data found for this country.</div>
      )}
    </div>
  );
}