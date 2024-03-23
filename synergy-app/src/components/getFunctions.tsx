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

export const getUserSyncData = async (userID: string) => {
  // try {
  //   const syncArrayName: string[] = [];

  //   const colRef = collection(db, "userData", userID);

  //   const userDoc = await getDocs(colRef);
  //   for (const doc of userDoc.docs) {
  //     const records = doc.data()?.syncId;
  //     for (const [id, record] of Object.entries(records)) {
  //       syncArrayName.push([id, record]);
  //     }
  //   }

  //   return syncArrayName;
  // } catch (e) {
  //   console.error(e);
  //   return [];
  // }

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
