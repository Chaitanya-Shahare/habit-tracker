import { Button } from "@/components/ui/button";
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
import { MinusIcon, PlusIcon } from "lucide-react";

interface IAddHabitModal {
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
  newHabit: any;
  setNewHabit: (h: any) => void;
  goal: number;
  setGoal: (g: number) => void;
  handleAddHabit: any;
  isFab?: boolean;
}

export function AddHabitModal({
  isModalOpen,
  setIsModalOpen,
  newHabit,
  setNewHabit,
  goal,
  setGoal,
  handleAddHabit,
  isFab = true,
}: IAddHabitModal) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        {isFab && (
          <Button
            className="absolute bottom-8 right-8 w-16 h-16 rounded-2xl"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <i className="ri-add-large-fill ri-xl text-bold"></i>
          </Button>
        )}
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
  );
}
