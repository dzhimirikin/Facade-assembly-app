import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7cHiDj4BAMbw1LoTpgbxXIcrhDnm0lX8",
  authDomain: "facade-assembly.firebaseapp.com",
  projectId: "facade-assembly",
  storageBucket: "facade-assembly.firebasestorage.app",
  messagingSenderId: "676074892011",
  appId: "1:676074892011:web:792ebcdf46e2098f972cae",
  measurementId: "G-ZVSZ1L3FQZ"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const form = document.getElementById("assemblyForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const elementId = document.getElementById("elementId").value;

  const stage = document.getElementById("stage").value;

  const employee = document.getElementById("employee").value;

  try {

    await addDoc(collection(db, "assemblyLogs"), {

      elementId: elementId,
      stage: stage,
      employee: employee,
      timestamp: new Date()

    });

    document.getElementById("success").innerText =
      "Saved successfully";

    form.reset();

  } catch (error) {

    console.error(error);

    document.getElementById("success").innerText =
      "Error saving data";

  }

});
