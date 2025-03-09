// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgZh6t_miuSmm7AWI3ZviujZe-9ZuSKY4",
  authDomain: "task-manager-26b1d.firebaseapp.com",
  projectId: "task-manager-26b1d",
  storageBucket: "task-manager-26b1d.firebasestorage.app",
  messagingSenderId: "490733967589",
  appId: "1:490733967589:web:1336f2d5a679eaf8d15c0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut ,db};