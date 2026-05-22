import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.showTab = function(tabName) {

  document
    .querySelectorAll(".tab-content")
    .forEach(tab => {
      tab.classList.remove("active");
    });

  document
    .querySelectorAll(".tab")
    .forEach(tab => {
      tab.classList.remove("active");
    });

  document
    .getElementById(tabName)
    .classList.add("active");

  event.target.classList.add("active");

}

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

      elementId,
      stage,
      employee,
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

window.loadData = async function () {

  const searchId =
    document.getElementById("searchId").value;

  const results =
    document.getElementById("results");

  results.innerHTML = "";

  const q = query(
    collection(db, "assemblyLogs"),
    where("elementId", "==", searchId)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    const row = `
      <tr>
        <td>${data.elementId}</td>
        <td>${data.stage}</td>
        <td>${data.employee}</td>
        <td>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</td>
      </tr>
    `;

    results.innerHTML += row;

  });

}

// TEMP ADMIN ACCESS

const isAdmin = true;

if (isAdmin) {

  document
    .getElementById("adminTab")
    .style.display = "inline-block";

}
