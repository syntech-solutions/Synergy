// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../config/firebase";

// const createUserDocument = async (userId: any) => {
//   //check if user exists in firestore
//   try {
//     const ref = doc(db, "userData", userId);
//     const userDoc = await getDoc(ref);
//   } catch (error) {
//     // if ((error as FirebaseError).code === "") {

//     // }
//     console.log(error);
//   }

//   return userDoc;

// };

import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const [user, setUser] = useState([]);
// const auth = getAuth();
// const fireUser = auth.currentUser?.uid;

export const getUserdetails = async (userId: any) => {
  const docRef = doc(db, "userData", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    setUser(docSnap.data() as any);
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};
// useEffect(() => {
//   getUserdetails(fireUser);
// }, []);
