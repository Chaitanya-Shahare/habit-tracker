"use client";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { set } from "firebase/database";

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
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
    console.log("email", email);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    console.log("password", password);
  };

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const router = useRouter();

  const handleSubmit = async () => {
    // e.preventDefault();
    // Add your signup logic here
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log(res);
      setEmail("");
      setPassword("");
      router.push("/signin");
    } catch (error) {
      console.error(error);
    }
  };

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
                handleSubmit();
              }}
            >
              SignUp
            </Button>
          </div>

          <div className="text-center mt-4 text-muted-foreground">OR</div>

          <div className="mt-4">
            <Button className="w-full" variant="outline">
              <i className="ri-google-fill mr-2 ri-xl"></i>
              Sign Up with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
