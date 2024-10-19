import { auth, db } from "@/app/firebase/config";
import { IHabit } from "@/app/type";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback } from "react";

const useHabits = () => {
  const getUserEmail = (): string | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user).email;
      }
      return auth.currentUser?.email || null;
    }
    return null;
  };

  const userEmail = getUserEmail();

  const addHabit = useCallback(
    async (newHabit: any, uniqueId: string) => {
      if (!userEmail) {
        console.error("User email not found");
        return;
      }

      try {
        const docRef = await setDoc(doc(db, "habit", uniqueId), {
          userEmail,
          name: newHabit.name,
          goalPerWeek: newHabit.goalPerWeek,
          status: [],
        });
        console.log("Document written with ID: ", docRef);
        return docRef;
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    [userEmail]
  );

  const updateHabit= useCallback(async (id: string, habit: IHabit) => {
    try {
      const docRef = doc(db, "habit", id);

      await updateDoc(docRef, {
        name: habit.name,
        goalPerWeek: habit.goalPerWeek,
        status: habit.status,
      });

      return docRef;
    } catch (e) {
      console.error("Error Updating document: ", e);
    }
  }, []);

  const getHabits = useCallback(async () => {
    if (!userEmail) {
      console.error("User email not found");
      return [];
    }

    try {
      const q = query(
        collection(db, "habit"),
        where("userEmail", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } catch (error) {
      console.error("Error fetching habits: ", error);
      return [];
    }
  }, [userEmail]);

  const getHabitById = useCallback(async (id: string) => {
    const docRef = doc(db, "habit", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  },[]);

  const deleteHabit = async (id: string) => {
    const docRef = doc(db, "habit", id);
    await deleteDoc(docRef);
  }

  return {
    getHabits,
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit,
  };
};

export default useHabits;
