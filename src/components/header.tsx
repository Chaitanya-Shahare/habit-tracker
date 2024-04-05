import { ModeToggle } from "./mode-toggle";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Header() {
  const a = "a";
  const { theme, setTheme } = useTheme();
  return (
    <header className="border-b-2 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Habit Tracker</h1>
      <div className="flex justify-center gap-4">
        {/* <ModeToggle /> */}
        <Button
          variant={"ghost"}
          onClick={() => {
            if (theme == "light") setTheme("dark");
            else setTheme("light");
          }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
