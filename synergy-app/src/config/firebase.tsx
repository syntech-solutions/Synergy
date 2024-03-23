import { initializeApp } from "firebase/app";
//for autentication
import { getAuth, GoogleAuthProvider } from "firebase/auth";
//for db
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuS1xWgIuBKo7p6NF_v3TZqF4BHkPfO1Y",
  authDomain: "synergy-75d4a.firebaseapp.com",
  projectId: "synergy-75d4a",
  storageBucket: "synergy-75d4a.appspot.com",
  messagingSenderId: "441952728512",
  appId: "1:441952728512:web:9d0f54bfd9fbd680350425",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//for autentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
//for db
export const db = getFirestore(app);
export const storage = getStorage(app);
