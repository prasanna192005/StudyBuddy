import { initializeApp,getApps,getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAx64Ycq4qsIK73qA5N10sdMobsA7mwB8g",
  authDomain: "se-implementation-896a9.firebaseapp.com",
  projectId: "se-implementation-896a9",
  storageBucket: "se-implementation-896a9.firebasestorage.app",
  messagingSenderId: "285630469771",
  appId: "1:285630469771:web:e8946548d9dd4fc22b668e",
  measurementId: "G-RXZD58CBEB"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage=getStorage(app);
