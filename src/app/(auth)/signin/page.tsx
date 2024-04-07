"use client";
import React, { useEffect, useState } from "react";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
  useSignInWithGithub,
} from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
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

import "remixicon/fonts/remixicon.css";
import Link from "next/link";

const SignInPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      router.replace("/");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleSubmit = async () => {
    // Add your signup logic here
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log(res);
      console.log("name", auth.currentUser);
      setEmail("");
      setPassword("");
      if (res) {
        localStorage.setItem("user", JSON.stringify(res.user));
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signInWithGithub] = useSignInWithGithub(auth);

  const handleGoogleSignIn = async () => {
    const res = await signInWithGoogle();
    // const res = await signInWithGithub();
    console.log(res);
    if (res) {
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-24">
      <Header />
      <Card className="mx-auto max-w-sm ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to log in to your account
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
            <Button className="w-full" type="submit" onClick={handleSubmit}>
              Login
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
              Sign In with Google
            </Button>
          </div>
          <Link href="/signup"> Signup</Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
