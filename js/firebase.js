import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyA7cHiDj4BAMbw1LoTpgbxXIcrhDnm0lX8",

  authDomain:
    "facade-assembly.firebaseapp.com",

  projectId:
    "facade-assembly",

  storageBucket:
    "facade-assembly.appspot.com",

  messagingSenderId:
    "676074892011",

  appId:
    "1:676074892011:web:792ebcdf46e2098f972cae"

};

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

export { db };
