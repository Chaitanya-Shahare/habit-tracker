"use client";
import Header from "@/components/header";
import "react-calendar-heatmap/dist/styles.css";
import { useEffect, useState } from "react";
import { IHabit } from "@/app/type";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/with-auth";
import { AddHabitModal } from "@/components/add-habit-modal";
import useHabits from "@/hooks/useHabits";
import Heatmap from "@/components/heatmap";
import StatusChart from "@/components/status-chart";
import useHabitAnalytics from "@/hooks/useHabitAnalytics";

function HabitPage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();

  const { getHabitById, deleteHabit, updateHabit } = useHabits();

  const [habit, setHabit] = useState<IHabit>({
    name: "",
    status: [{ date: "" }],
    id: "",
    goalPerWeek: 0,
  });

  const { getCurrentStreak } = useHabitAnalytics();

  const [isEditHabitModalOpen, setIsEditHabitModalOpen] = useState(false);
  const [goal, setGoal] = useState(5);
  const [newHabit, setNewHabit] = useState<IHabit>({
    name: "",
    status: [{ date: "" }],
    id: "",
    goalPerWeek: 0,
  });

  const handleEditHabit = async () => {
    setHabit({ ...newHabit, goalPerWeek: goal });
    setIsEditHabitModalOpen(false);
    await updateHabit(id, { ...newHabit, goalPerWeek: goal });
  };

  const handleDeleteHabit = async () => {
    deleteHabit(id);
    router.push("/");
  };

  useEffect(() => {
    getHabitById(id).then((data) => {
      console.log(data);
      setHabit(data as IHabit);
      setNewHabit(data as IHabit);
      setGoal(data?.goalPerWeek);
    });
  }, [getHabitById, id]);

  return (
    <div>
      <Header
        title={habit.name}
        isBackButton
        isEditButton
        editButtonCallback={() => {
          console.log("Edit button clicked");
          setIsEditHabitModalOpen(true);
        }}
        isMoreButton
        deleteHabitCallback={handleDeleteHabit}
      />

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

        <StatusChart status={habit.status} />

        <Heatmap values={habit.status} />
      </main>

      <AddHabitModal
        isModalOpen={isEditHabitModalOpen}
        setIsModalOpen={setIsEditHabitModalOpen}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        goal={goal}
        setGoal={setGoal}
        handleAddHabit={handleEditHabit}
        isFab={false}
      />
    </div>
  );
}

export default withAuth(HabitPage);
