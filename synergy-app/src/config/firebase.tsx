import { getAnalytics } from "firebase/analytics";
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
// const firebaseConfig = {};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//for autentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
//for db
export const db = getFirestore(app);
export const storage = getStorage(app);

// const analytics = getAnalytics(app);
