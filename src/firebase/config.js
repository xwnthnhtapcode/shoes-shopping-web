import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useEffect, useState } from "react";

//duchaunee
export const firebaseConfig = {
  apiKey: "AIzaSyDUzHs-1GZd5wwcYSplp5T14hagQZ4l8pY",
  authDomain: "shoes-shopping-web.firebaseapp.com",
  projectId: "shoes-shopping-web",
  storageBucket: "shoes-shopping-web.appspot.com",
  messagingSenderId: "979140287595",
  appId: "1:979140287595:web:fb49fba850abadd3f9252e"
};


//biibi2504
// const firebaseConfig = {
//   apiKey: "AIzaSyBkiYSMVck0-9VyqDklXfrGiWPZaES4aS4",
//   authDomain: "shoes-shopping-web-f6dc7.firebaseapp.com",
//   projectId: "shoes-shopping-web-f6dc7",
//   storageBucket: "shoes-shopping-web-f6dc7.appspot.com",
//   messagingSenderId: "184288338593",
//   appId: "1:184288338593:web:9916c5e4642d9bf13e46e0"
// };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app;

