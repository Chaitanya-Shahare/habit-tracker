import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

function HabitCalendar({ habitData }) {
  // Transform your habit data into the format needed for CalendarHeatmap
  const heatmapData = habitData.map((habit) => ({
    date: habit.date,
    count: habit.performed ? 1 : 0,
  }));

  return (
    <div>
      <CalendarHeatmap
        startDate={new Date("2022-01-01")} // You can change this based on your data
        endDate={new Date("2022-12-31")} // You can change this based on your data
        values={heatmapData}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-scale-${value.count}`;
        }}
      />
    </div>
  );
}

export default HabitCalendar;
