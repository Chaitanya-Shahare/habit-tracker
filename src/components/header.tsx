import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import "remixicon/fonts/remixicon.css";
import { auth } from "@/app/firebase/config";

export default function Header({
  title,
  isBackButton = false,
}: {
  title?: string;
  isBackButton?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  return (
    <header className="border-b-2 p-4 flex justify-between items-center">
      <div className="flex items-center gap-1">
        {isBackButton && (
          <Button
            variant={"ghost"}
            onClick={() => {
              router.push("/");
            }}
          >
            <i className="ri-arrow-left-line ri-xl"></i>
            <span className="sr-only">Back to home</span>
          </Button>
        )}
        <h2 className="text-xl font-bold">{title ? title : "Habit Tracker"}</h2>
      </div>
      <div className="flex justify-center gap-4">
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
          <AvatarImage
            src={auth.currentUser?.photoURL || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>CS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
