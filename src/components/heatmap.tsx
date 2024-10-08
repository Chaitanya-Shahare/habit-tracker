import React from "react";
import "react-calendar-heatmap/dist/styles.css";
import CalendarHeatmap from "react-calendar-heatmap";
import "./style.css";

interface IHeatmap {
  values: { date: string }[];
}

function Heatmap({ values }: IHeatmap) {
  const today = new Date();
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 144
  );
  return (
    <div>
      <div className="heatmap-container">
        <p className="text-muted-foreground text-md mb-4">Heatmap</p>
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={values}
          classForValue={(value: any) => {
            if (!value) {
              return "color-empty";
            }
            return `color-scale-${value.count} color-filled`;
          }}
          gutterSize={2}
        />
      </div>
    </div>
  );
}

export default Heatmap;
