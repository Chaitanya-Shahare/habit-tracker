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

  const handleSignIn = () => {
    // Signin logic
    const promise = signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const user = res?.user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setEmail("");
          setPassword("");
          router.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });

      toast.promise(
        promise,
        {
          pending: "Signing in...",
          success: "Logged in successfully!",
          error: "Error signing in",
        },
        { theme }
      );
  };

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      router.push("/signin");
      toast.success("Signed up successfully!", { theme });
      toast.info("Please sign in to continue", { theme });
    } catch (error) {
      console.error(error);
      toast.error("Error signing up", { theme });
    }
  };

  const handleGoogleSignIn = () => {
    const promise = signInWithPopup(auth, new GoogleAuthProvider())
      .then((res) => {
        const user = res.user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          router.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    toast.promise(
      promise,
      {
        pending: "Signing in with Google...",
        success: "Logged in successfully!",
        error: "Error signing in",
      },
      { theme }
    );
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
