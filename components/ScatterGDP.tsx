'use client';
import { useState } from "react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

export default function ScatterGDP({ data }:{ data:{gdp:number; co2:number; population:number; country?:string}[] }) {
  const [log, setLog] = useState(false);
  const toLog = (v:number)=> v>0 ? Math.log10(v) : 0;
  const plotted = log ? data.map(d=>({ ...d, gdp: toLog(d.gdp), co2: toLog(d.co2) })) : data;

  return (
    <div className="h-72 w-full rounded-2xl bg-white p-3 border">
      <div className="flex items-center gap-2 text-sm mb-1">
        <input type="checkbox" id="log" checked={log} onChange={e=>setLog(e.target.checked)} />
        <label htmlFor="log">Log scale</label>
      </div>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="gdp" name={log?"log₁₀ GDP":"GDP"} />
          <YAxis dataKey="co2" name={log?"log₁₀ CO₂":"CO₂"} />
          <ZAxis dataKey="population" range={[20, 200]} />
          <Tooltip />
          <Scatter data={plotted} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}