import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

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
