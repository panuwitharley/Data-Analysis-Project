"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function LineCO2({
  data,
  title = "CO₂ by year",
}: {
  data: { year: number; co2: number }[];
  title?: string;
}) {
  return (
    <div className="card" style={{ height: 420 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ width: "100%", height: "calc(100% - 28px)" }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="co2" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}