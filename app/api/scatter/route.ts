import { getSupabaseLite } from "@/lib/supabase/server-lite";
import { NextResponse } from "next/server";

const MIN_YEAR = 1960;
const MAX_YEAR = 2023;
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const y = Number(searchParams.get("year") || MAX_YEAR);

  // clamp ปีให้อยู่ในช่วง
  const year = Math.min(Math.max(y, MIN_YEAR), MAX_YEAR);

  const supabase = getSupabaseLite();

  // ข้อมูลของปีที่เลือก (ดึงชื่อประเทศด้วย)
  const { data, error } = await supabase
    .from("co2_yearly")
    .select("iso_code, year, co2, gdp_currentusd, population, countries(country)")
    .eq("year", year);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []).map((r: any) => ({
    iso: r.iso_code,
    country: r.countries?.country ?? r.iso_code,
    co2: r.co2 ?? 0,
    gdp: r.gdp_currentusd ?? 0,
    pop: r.population ?? 0,
  }));

  // ส่งปีแบบ “ต่อเนื่อง” ให้ dropdown เสมอ
  return NextResponse.json({ year, years: YEARS, rows });
}