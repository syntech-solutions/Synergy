import { initializeApp } from "firebase/app";
//for autentication
import { getAuth, GoogleAuthProvider } from "firebase/auth";
//for db
import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXE1N7iVALEZncLW0N2P-wtZgB7TVJRs4",
  authDomain: "drive-clone-49864.firebaseapp.com",
  projectId: "drive-clone-49864",
  storageBucket: "drive-clone-49864.appspot.com",
  messagingSenderId: "770392829720",
  appId: "1:770392829720:web:e8265c5e3de172d7bd786d",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAuS1xWgIuBKo7p6NF_v3TZqF4BHkPfO1Y",
//   authDomain: "synergy-75d4a.firebaseapp.com",
//   projectId: "synergy-75d4a",
//   storageBucket: "synergy-75d4a.appspot.com",
//   messagingSenderId: "441952728512",
//   appId: "1:441952728512:web:9d0f54bfd9fbd680350425",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//for autentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
//for db
export const storage = getStorage(app);
export const db = getFirestore(app);

const analytics = getAnalytics(app);
