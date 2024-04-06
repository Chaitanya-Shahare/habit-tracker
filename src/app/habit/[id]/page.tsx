"use client";
import Header from "@/components/header";
import "react-calendar-heatmap/dist/styles.css";
import CalendarHeatmap from "react-calendar-heatmap";
import "./style.css";

import { doc, getDoc } from "firebase/firestore";

import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { auth, db } from "@/app/firebase/config";
import { useEffect, useLayoutEffect, useState } from "react";
import { IHabit } from "@/app/page";
import { redirect } from "next/navigation";

// const data = [
//   {
//     month: "Apr",
//     times: 20,
//   },
//   {
//     month: "Mar",
//     times: 15,
//   },
//   {
//     month: "Feb",
//     times: 10,
//   },
//   {
//     month: "Jan",
//     times: 5,
//   },
//   {
//     month: "Dec",
//     times: 0,
//   },
//   {
//     month: "Nov",
//     times: 0,
//   },
//   {
//     month: "Oct",
//     times: 0,
//   },
//   {
//     month: "Sep",
//     times: 0,
//   },
//   {
//     month: "Aug",
//     times: 0,
//   },
//   {
//     month: "Jul",
//     times: 0,
//   },
//   {
//     month: "Jun",
//     times: 0,
//   },
//   {
//     month: "May",
//     times: 0,
//   },
// ].reverse();

export default function HabitPage({
  params: { id },
}: {
  params: { id: string };
}) {
  useLayoutEffect(() => {
    if (!auth.currentUser) {
      redirect("/signin");
    }
  }, []);
  const today = new Date();
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 144
  );

  const getHabitById = async (id: string) => {
    const docRef = doc(db, "habit", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  };

  const [habit, setHabit] = useState<IHabit>({
    name: "",
    status: [{ date: "" }],
    id: "",
    goalPerWeek: 0,
  });

  interface Status {
    date: string;
  }

  interface Habit {
    status: any[];
  }

  interface ChartData {
    month: string;
    times: number;
  }

  function getChartData(habit: Habit): ChartData[] {
    // Initialize an empty object for the counts
    let counts: Record<string, number> = {};

    // Iterate over the status array
    for (let status of habit.status) {
      // Extract the month from the date
      let month = new Date(status.date).toLocaleString("default", {
        month: "short",
      });

      // If the month is not yet in the counts object, add it with a count of 1
      // Otherwise, increment the count for the month
      counts[month] = (counts[month] || 0) + 1;
    }

    // Create an array of month names
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the current month index
    let currentMonthIndex = new Date().getMonth();

    // Create a new array starting from the current month and ending with the month 11 months ago
    let orderedMonths = months
      .slice(currentMonthIndex + 1)
      .concat(months.slice(0, currentMonthIndex + 1))
      .reverse();

    // Map the months to the desired output format
    let data: ChartData[] = orderedMonths.map((month) => ({
      month: month,
      times: counts[month] || 0,
    }));

    return data.reverse();
  }

  function getCurrentStreak(status: { date: string }[]) {
    // Sort the status array in descending order of date
    status.sort(
      (a: Status, b: Status) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight

    // Check if the first date in the sorted array is not today's date but is yesterday's date
    let firstDate = new Date(status[0]?.date);
    firstDate.setHours(0, 0, 0, 0);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (firstDate.getTime() === yesterday.getTime()) {
      streak = 0;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    for (let i = 0; i < status.length; i++) {
      // Convert status date to Date object at midnight
      let statusDate = new Date(status[i].date);
      statusDate.setHours(0, 0, 0, 0);

      // If the status date is not equal to the current date, break the loop
      if (statusDate.getTime() !== currentDate.getTime()) {
        break;
      }

      // Increment the streak and decrement the current date by one day
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  const data = getChartData(habit as Habit);

  useEffect(() => {
    getHabitById(id).then((data) => {
      console.log(data);
      setHabit(data as IHabit);
    });
  }, [id]);

  return (
    <div>
      <Header title={habit.name} isBackButton />

      <main className="px-8 py-4 flex flex-col gap-8">
        <div className="">
          <p className="text-muted-foreground text-md">Current Streak</p>
          <div className="flex-1 text-center mt-8">
            <div className="text-7xl font-bold tracking-tighter">
              {getCurrentStreak(habit.status)}
            </div>
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
            values={habit.status}
            classForValue={(value: any) => {
              if (!value) {
                return "color-empty";
              }
              return `color-scale-${value.count} color-filled`;
            }}
            gutterSize={2}
          />
        </div>
      </main>
    </div>
  );
}
