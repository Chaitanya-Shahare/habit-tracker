"use client";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function HabitPage() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push("/");
  }, [router]);

  return (
    <div>
      {/* <Header title="" /> */}
      not habit description page
    </div>
  );
}
