import CompareClient from "@/components/CompareClient";
import { getSupabaseLite } from "@/lib/supabase/server-lite";

export default async function ComparePage() {
  const supabase = getSupabaseLite();
  const { data, error } = await supabase
    .from("countries")
    .select("iso_code,country")
    .order("country");

  if (error) {
    return <pre className="p-4 text-red-600">Supabase error: {error.message}</pre>;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Compare Countries</h1>
      <p className="text-sm text-slate-600">
        เลือกประเทศด้านบนเพื่อเปรียบเทียบ CO₂ ตามเวลา (สลับโหมด Total/Per capita และเปิด Log scale ได้)
      </p>
      <CompareClient countries={data ?? []} />
    </main>
  );
}