"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "@/app/firebase/config";
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
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function Home() {
  const [user] = useAuthState(auth);

  const router = useRouter();

  // Get the last 5 days
  const last5Days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    const date = d.getDate().toString().padStart(2, "0"); // format to 'dd'
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return { day: days[day], date };
  });

  const [habits, setHabits] = useState([
    // {
    //   name: "Play guitar",
    //   status: [true, false, true, false, true],
    // },
    // {
    //   name: "Read a book",
    //   status: [false, false, false, true, true],
    // },
    // {
    //   name: "Exercise",
    //   status: [true, false, true, false, true],
    // },
    // {
    //   name: "Meditate",
    //   status: [false, false, false, true, true],
    // },
    // {
    //   name: "Write",
    //   status: [true, false, true, false, true],
    // },
  ]);

  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);
  const [goal, setGoal] = useState(5);
  const [newHabit, setNewHabit] = useState({
    name: "",
    goalPerWeek: goal,
    status: Array.from({ length: 5 }, () => false),
  });

  const addHabitToFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "habit"), {
        userEmail: auth.currentUser?.email,
        name: newHabit.name,
        goalPerWeek: goal,
        status: [false, false, false, false, false],
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleAddHabit = async () => {
    console.log("handleAddHabit");
    const newHabits = [...habits];
    newHabits.push({
      name: newHabit.name,
      status: Array.from({ length: 5 }, () => false),
    });
    setHabits(newHabits);
    setIsAddHabitModalOpen(false);
    await addHabitToFirestore();
    getHabits();
  };

  const getHabits = async () => {
    // const userEmail = auth.currentUser?.email;
    const userEmail = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!).email
      : auth.currentUser?.email;
    const q = query(
      collection(db, "habit"),
      where("userEmail", "==", userEmail)
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map((doc) => doc.data());
    // console.log(docs);
    return docs;
  };

  useEffect(() => {
    getHabits().then((data) => {
      setHabits(data);
      console.log(data);
    });
    console.log(habits);
  }, []);

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
      <Header />
      <main className="flex justify-between p-4">
        <table className="w-full max-w-md">
          <thead>
            <tr>
              <th className="w-1/2"></th>
              {last5Days.map((day, index) => (
                <th key={index} className="text-muted-foreground">
                  {day.day} {day.date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, index) => (
              <tr key={index} className="border-b-2 h-[60px]">
                <td className="text-md">
                  <Link href={`/habit/${habit.name}`}>{habit.name}</Link>
                </td>
                {habit.status.map((_, i) => {
                  return (
                    <td key={i}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newHabits = [...habits];
                          newHabits[index].status[i] =
                            !newHabits[index].status[i];
                          setHabits(newHabits);
                        }}
                      >
                        {habit.status[i] ? (
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
