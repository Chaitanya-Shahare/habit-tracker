interface Status {
  date: string;
}

interface ChartData {
  month: string;
  times: number;
}

const useHabitAnalytics = () => {
  const getCurrentStreak = (status: { date: string }[]) => {
    // Remove duplicates by ensuring unique dates
    status = status.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.date === value.date)
    );

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
  };

  const getChartData = (habitStatus: { date: string }[]): ChartData[] => {
    // Initialize an empty object for the counts
    let counts: Record<string, number> = {};

    // Iterate over the status array
    for (let status of habitStatus) {
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
      .concat(months.slice(0, currentMonthIndex + 1));

    // Map the months to the desired output format
    let data: ChartData[] = orderedMonths.map((month) => ({
      month: month,
      times: counts[month] || 0,
    }));

    return data;
  };

  return {
    getCurrentStreak,
    getChartData,
  };
};

export default useHabitAnalytics;
