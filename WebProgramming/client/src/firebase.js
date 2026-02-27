// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "safehouse-dbf67.firebaseapp.com",
  projectId: "safehouse-dbf67",
  storageBucket: "safehouse-dbf67.firebasestorage.app",
  messagingSenderId: "968557171028",
  appId: "1:968557171028:web:31e5ee153de9cb0fcb78c1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);