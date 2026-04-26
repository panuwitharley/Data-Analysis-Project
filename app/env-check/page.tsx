export default function EnvCheck() {
  return (
    <pre style={{padding:16}}>
      URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING'}
      {'\n'}
      ANON: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'MISSING'}
    </pre>
  );
}