'use client';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

type Country = { iso_code: string; country: string };

export default function ClientDemo() {
  const [rows, setRows] = useState<Country[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('countries').select('iso_code,country').order('country').limit(10)
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setRows(data || []);
      });
  }, []);

  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;

  return (
    <div className="p-6">
      <h2 className="font-semibold mb-2">Client fetch demo</h2>
      <ul className="list-disc pl-6">
        {rows.map(r => <li key={r.iso_code}>{r.country}</li>)}
      </ul>
    </div>
  );
}