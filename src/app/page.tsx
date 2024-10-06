"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { nanoid } from "nanoid";
import { IHabit } from "@/app/type";
import useHabits from "@/hooks/useHabits";
import { withAuth } from "@/components/with-auth";

function Home() {

  // Get the last 5 days
  const last5Days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    const date = d.getDate().toString().padStart(2, "0"); // format to 'dd'
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // format to 'mm'
    const year = d.getFullYear();
    const formattedDate = `${year}-${month}-${date}`;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return { day: days[day], date: date, dateString: formattedDate };
  });

  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);

  const [habits, setHabits] = useState<IHabit[]>([]);

  const [goal, setGoal] = useState(5);

  const [newHabit, setNewHabit] = useState({
    name: "",
    goalPerWeek: goal,
    status: Array.from({ length: 5 }, () => false),
  });

  const { getHabits, addHabit, updateHabit } = useHabits();

  const handleAddHabit = async () => {
    const newHabits = [...habits];
    const uniqueId = nanoid();
    newHabits.push({
      name: newHabit.name,
      status: [],
      goalPerWeek: goal,
      id: uniqueId,
    });
    setHabits(newHabits);
    setIsAddHabitModalOpen(false);
    await addHabit(newHabit, uniqueId);
    getHabits();
  };

  const handleUpdateHabit = async (
    habitIndex: number,
    dayIndex: number,
    dateExists: boolean,
    dayObj: any
  ) => {
    const newHabits = [...habits];
    if (dateExists) {
      newHabits[habitIndex].status = newHabits[habitIndex].status.filter(
        (statusObj) => statusObj.date !== dayObj.dateString
      );
    } else {
      newHabits[habitIndex].status.push({
        date: dayObj.dateString,
      });
    }
    // console.log("newHabits[index]", newHabits[habitIndex]);
    await updateHabit(newHabits[habitIndex].id, newHabits[habitIndex]);
    setHabits(newHabits);
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      getHabits()
        .then((data: any) => {
          setHabits(data);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    }
  }, [getHabits]);

  return (
    <>
      <Dialog open={isAddHabitModalOpen} onOpenChange={setIsAddHabitModalOpen}>
        <DialogTrigger asChild>
          <Button
            className="absolute bottom-8 right-8 w-16 h-16 rounded-2xl"
            onClick={() => {
              setIsAddHabitModalOpen(true);
            }}
          >
            <i className="ri-add-large-fill ri-xl text-bold"></i>
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Start tracking your progress and building positive routines!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="name"
                value={newHabit.name}
                onChange={(event) => {
                  const newHabitCopy = { ...newHabit };
                  newHabitCopy.name = event.target.value;
                  setNewHabit(newHabitCopy);
                }}
                className="col-span-4"
                placeholder="Habit name"
              />
            </div>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => setGoal(goal - 1)}
                  disabled={goal <= 1}
                >
                  <MinusIcon className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">
                    {goal}
                  </div>
                  <div className="text-[0.70rem] uppercase text-muted-foreground">
                    days per week
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => setGoal(goal + 1)}
                  disabled={goal >= 7}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddHabit}>
              Commit to Habit!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Header isAvatar={true} />
      <main className="flex justify-between p-4">
        <table className="w-full max-w-md">
          <thead>
            <tr>
              <th className="w-1/2"></th>
              {last5Days.map((day, index) => (
                <th key={index} className="text-muted-foreground min-w-10">
                  {day.day} {day.date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, habitIndex) => (
              <tr key={habitIndex} className="border-b-2 h-[60px]">
                <td className="text-md">
                  <Link href={`/habit/${habit.id}`}>{habit.name}</Link>
                </td>

                {last5Days.map((dayObj, dayIndex) => {
                  const dateExists = habit.status.some(
                    (statusObj) => statusObj.date === dayObj.dateString
                  );

                  return (
                    <td key={dayIndex}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          handleUpdateHabit(
                            habitIndex,
                            dayIndex,
                            dateExists,
                            dayObj
                          );
                        }}
                      >
                        {dateExists ? (
                          <i className="ri-check-fill ri-xl text-success"></i>
                        ) : (
                          <i className="ri-close-fill  text-error"></i>
                        )}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}

export default withAuth(Home);