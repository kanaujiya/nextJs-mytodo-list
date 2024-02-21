import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2f8638gRoekOMwVAjX1VnZPOQTFvWhQM",
  authDomain: "tooodooo-37fbb.firebaseapp.com",
  projectId: "tooodooo-37fbb",
  storageBucket: "tooodooo-37fbb.appspot.com",
  messagingSenderId: "852904024885",
  appId: "1:852904024885:web:e4ebc8f63f1ece130d4a7c",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
