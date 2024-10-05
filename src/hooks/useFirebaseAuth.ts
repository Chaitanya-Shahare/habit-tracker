import { auth } from "@/app/firebase/config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const useFirebaseAuth = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async () => {
    try {
      const promise = signInWithEmailAndPassword(auth, email, password);

      toast.promise(
        promise,
        {
          pending: "Signing in...",
          success: "Logged in successfully!",
          error: "Error signing in",
        },
        { theme }
      );

      const res = await promise;
      const user = res?.user;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setEmail("");
        setPassword("");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = (error as any).message || "Error signing in";
      toast.error(errorMessage, { theme });
    }
  };

  const handleSignUp = async () => {
    try {
      const promise = createUserWithEmailAndPassword(auth, email, password);

      toast.promise(
        promise,
        {
          pending: "Signing up...",
          success: "Signed up successfully! Please sign in to continue.",
          error: "Error signing up",
        },
        { theme }
      );

      const res = await promise;
      setEmail("");
      setPassword("");
      router.push("/signin");
    } catch (error) {
      console.error(error);
      const errorMessage = (error as any).message || "Error signing up";
      toast.error(errorMessage, { theme });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const promise = signInWithPopup(auth, new GoogleAuthProvider());

      toast.promise(
        promise,
        {
          pending: "Signing in with Google...",
          success: "Logged in successfully!",
          error: "Error signing in",
        },
        { theme }
      );

      const res = await promise;
      const user = res?.user;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = (error as any).message || "Error signing in";
      toast.error(errorMessage, { theme });
    }
  };

  return {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleSignIn,
    handleSignUp,
    handleGoogleSignIn,
  };
};

export default useFirebaseAuth;
