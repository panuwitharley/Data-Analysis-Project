import { getSupabaseLite } from "@/lib/supabase/server-lite";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isoParam = searchParams.get("iso") || "";
  const isos = isoParam.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);
  if (isos.length === 0) return NextResponse.json({ series: [] });

  const supabase = getSupabaseLite();
  const { data, error } = await supabase
    .from("co2_yearly")
    .select("iso_code,year,co2,co2_per_capita,gdp_currentusd,population")
    .in("iso_code", isos)
    .order("year");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // จัดกลุ่มตาม iso_code
  const byIso: Record<string, any[]> = {};
  for (const r of data ?? []) {
    (byIso[r.iso_code] ||= []).push({
      year: r.year,
      co2: r.co2 ?? 0,
      co2_per_capita: r.co2_per_capita ?? 0,
      gdp_currentusd: r.gdp_currentusd ?? 0,
      population: r.population ?? 0,
    });
  }
  return NextResponse.json({ series: byIso });
}