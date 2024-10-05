import { auth } from "@/app/firebase/config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useFirebaseAuth = () => {
  const router = useRouter();
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
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential?.user;
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
  };

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // console.log("Signup response", res);
      setEmail("");
      setPassword("");
      router.push("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        const user = result.user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          router.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
