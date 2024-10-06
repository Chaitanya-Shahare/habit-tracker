"use client";
import { useEffect, useLayoutEffect } from "react";
import { redirect, useRouter } from "next/navigation";

export const withAuth = (WrappedComponent: any) => {
  return function WithAuth(props: any) {
    const router = useRouter()
    useLayoutEffect(() => {
      if (!localStorage.getItem("user")) {
        router.replace("/signin");  
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};
