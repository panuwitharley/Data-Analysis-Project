import ScatterClient from "@/components/ScatterClient";

export default async function ScatterPage() {
  return (
    <div className="space-y-4">
      <h1 style={{fontSize:24, fontWeight:700}}>Scatter: GDP vs CO₂</h1>
      <p style={{color:'#9aa0a6'}}>เปรียบเทียบ GDP กับ CO₂ ต่อประเทศในปีที่เลือก (ปรับเป็น Log scale ได้)</p>
      <ScatterClient />
    </div>
  );
}