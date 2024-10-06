
export interface IHabit {
  name: string;
  status: { date: string }[];
  id: string;
  goalPerWeek?: number;
}