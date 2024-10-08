import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { EllipsisVertical, Moon, Pencil, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import "remixicon/fonts/remixicon.css";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFirebaseAuth from "@/hooks/useAuth";
import { auth } from "@/app/firebase/config";

export default function Header({
  title,
  isBackButton = false,
  isEditButton = false,
  editButtonCallback,
  isMoreButton = false,
  isAvatar = false,
  deleteHabitCallback,
}: {
  title?: string;
  isBackButton?: boolean;
  isEditButton?: boolean;
  editButtonCallback?: () => void;
  isMoreButton?: boolean;
  isAvatar?: boolean;
  deleteHabitCallback?: () => void;
}) {

  const { theme, setTheme } = useTheme();
  const router = useRouter();

   const {handleSignOut} = useFirebaseAuth();

  // const [user] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));

  return (
    <>
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
          <h2 className="text-xl font-bold">
            {title ? title : "Habit Tracker"}
          </h2>
        </div>
        <div className="flex justify-center gap-4">
          {isEditButton && (
            <Button variant={"ghost"} onClick={editButtonCallback}>
              <Pencil className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-100" />
            </Button>
          )}
          {!isMoreButton ? (
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
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} onClick={editButtonCallback}>
                  <EllipsisVertical className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={deleteHabitCallback}>
                  Delete habit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <Button variant="outline">Open</Button> */}
              {isAvatar && (
                <Avatar>
                  <AvatarImage
                    src={
                      auth.currentUser?.photoURL ||
                      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                  />
                  {/* TODO: uncomment below line */}
                   {/* <AvatarFallback>
                     {user.email.split("")[0].toUpperCase()}
                   </AvatarFallback> */}
                </Avatar>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="https://github.com/Chaitanya-Shahare/habit-tracker">
                  GitHub
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Log out
                {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
