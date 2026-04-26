import SearchList from "@/components/SearchList";
import { getSupabaseLite } from "@/lib/supabase/server-lite";

export default async function Page() {
  const supabase = getSupabaseLite();
  const { data, error } = await supabase
    .from("countries")
    .select("iso_code,country")
    .order("country")
    .limit(200);

  if (error) {
    return (
      <pre className="p-4 text-red-600">
        Supabase error: {error.message}
      </pre>
    );
  }

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Countries</h1>
      <SearchList rows={data ?? []} />
    </main>
  );
}