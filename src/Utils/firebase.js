import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const app = initializeApp({
  apiKey: "AIzaSyCulhoqTG2MPZhi9zFlRuKTpPx1qoMT-I8",
  authDomain: "booking-system-ce000.firebaseapp.com",
  projectId: "booking-system-ce000",
  storageBucket: "booking-system-ce000.appspot.com",
  messagingSenderId: "337296457431",
  appId: "1:337296457431:web:b33dc3338f19b52967fa92"
});

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };