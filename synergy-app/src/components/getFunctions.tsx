import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const getDocData = async (collectionName: string) => {
  try {
    const memberDetails: { memberID: string }[] = [];

    // Query a reference to a subcollection
    const querySnapshot = await getDocs(collection(db, collectionName));

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      memberDetails.push({ ...doc.data(), memberID: doc.id });

      // console.log(doc.id, " => ", doc.data());
    });

    return memberDetails;
  } catch (e) {
    console.error(e);
  }
};

export const getUserDetails = async (userID: string) => {
  const docRef = doc(db, "userDetails", userID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

export const getUserSyncData = async (userID: string) => {
  const docRef = doc(db, "userData", userID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

export const getSyncData = async (syncID: string) => {
  const docRef = doc(db, "syncs", syncID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

// export const getSyncMembersUserDetails = async (memberArray: []) => {
//   const docRef = doc(db, "syncs", syncID, "syncMembers");
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());
//     return docSnap.data();
//   } else {
//     // docSnap.data() will be undefined in this case
//     console.log("No such document!");
//   }
// }
