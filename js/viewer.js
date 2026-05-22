import { db }
from "./firebase.js";

import {

  collection,
  getDocs

} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table =
  document.getElementById("viewerTable");

/* LOAD DATA */

async function loadData() {

  table.innerHTML = "";

  const snapshot =
    await getDocs(
      collection(db, "assembly")
    );

  snapshot.forEach((doc) => {

    const data =
      doc.data();

    table.innerHTML += `

      <tr>

        <td>${data.facadeId}</td>

        <td>${data.stage}</td>

        <td>${data.employee}</td>

        <td>${data.note || ""}</td>

        <td>${data.timestamp}</td>

      </tr>

    `;

  });

}

/* SEARCH */

window.searchData = async function () {

  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase();

  const rows =
    table.getElementsByTagName("tr");

  for (let row of rows) {

    const text =
      row.innerText.toLowerCase();

    row.style.display =
      text.includes(search)
        ? ""
        : "none";
  }

};

loadData();
