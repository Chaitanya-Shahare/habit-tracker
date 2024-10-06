"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import "remixicon/fonts/remixicon.css";
import useAuth from "@/hooks/useAuth";

const SignupPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      router.replace("/");
    }
  }, [router]);

  const {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleSignUp,
    handleGoogleSignIn,
  } = useAuth();

  return (
    <div className="min-h-screen flex flex-col gap-24">
      <Header />
      <Card className="mx-auto max-w-sm ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Enter your email and password to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                required
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              onClick={() => {
                handleSignUp();
              }}
            >
              Sign Up
            </Button>
          </div>

          <div className="text-center mt-4 text-muted-foreground">OR</div>

          <div className="mt-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={handleGoogleSignIn}
            >
              <i className="ri-google-fill mr-2 ri-xl"></i>
              Sign Up with Google
            </Button>
          </div>

          <div className="mt-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                router.push("/signin");
              }}
            >
              Login to your account, Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
