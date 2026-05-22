import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const form =
  document.getElementById("assemblyForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const elementId =
    document.getElementById("elementId").value;

  const stage =
    document.getElementById("stage").value;

  const employee =
    document.getElementById("employee").value;

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
