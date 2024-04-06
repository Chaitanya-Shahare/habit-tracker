"use client";
import Header from "@/components/header";
import "react-calendar-heatmap/dist/styles.css";
import CalendarHeatmap from "react-calendar-heatmap";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    month: "Apr",
    times: 20,
  },
  {
    month: "Mar",
    times: 15,
  },
  {
    month: "Feb",
    times: 10,
  },
  {
    month: "Jan",
    times: 5,
  },
  {
    month: "Dec",
    times: 0,
  },
  {
    month: "Nov",
    times: 0,
  },
  {
    month: "Oct",
    times: 0,
  },
  {
    month: "Sep",
    times: 0,
  },
  {
    month: "Aug",
    times: 0,
  },
  {
    month: "Jul",
    times: 0,
  },
  {
    month: "Jun",
    times: 0,
  },
  {
    month: "May",
    times: 0,
  },
].reverse();

export default function HabitPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const today = new Date();
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 144
  );

  return (
    <div>
      <Header title={id} isBackButton />

      <main className="px-8 py-4 flex flex-col gap-8">
        <div className="">
          <p className="text-muted-foreground text-md">Current Streak</p>
          <div className="flex-1 text-center mt-8">
            <div className="text-7xl font-bold tracking-tighter">{10}</div>
            <div className="text-[0.70rem] uppercase text-muted-foreground">
              days
            </div>
          </div>
        </div>

        <div className=" h-60">
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

        <div className="heatmap-container">
          <p className="text-muted-foreground text-md mb-4">Heatmap</p>
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={[
              { date: "2024-04-01", count: 12 },
              { date: "2024-01-22", count: 122 },
              { date: "2024-01-30", count: 38 },
              // ...and so on
            ]}
            classForValue={(value: any) => {
              if (!value) {
                return "color-empty";
              }
              return `color-scale-${value.count}`;
            }}
            gutterSize={2}
          />
        </div>
      </main>
    </div>
  );
}
