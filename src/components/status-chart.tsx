import useHabitAnalytics from "@/hooks/useHabitAnalytics";
import React, { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

interface IStatusChart {
  status: { date: string }[];
}

function StatusChart({ status }: IStatusChart) {
  const { getChartData } = useHabitAnalytics();

  const data = getChartData(status);

  return (
    <div className="h-60">
      <p className="text-muted-foreground text-md">History</p>
      <ResponsiveContainer className="" width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" tick={{ fontSize: "0.75rem" }} />
          <Bar
            dataKey="times"
            label={{ position: "top", fontSize: 10 }}
            barSize={15}
            style={
              {
                fill: "hsl(var(--foreground))",
              } as React.CSSProperties
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatusChart;
