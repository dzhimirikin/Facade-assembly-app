import { db } from "./firebase.js";

import {

  collection,

  getDocs

} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table =
  document.getElementById("viewerTable");

async function loadData() {

  table.innerHTML = "";

  const querySnapshot =
    await getDocs(
      collection(db, "assembly")
    );

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    const row = `

      <tr>

        <td>${data.facadeId}</td>

        <td>${data.stage}</td>

        <td>${data.employee}</td>

        <td>${data.note || ""}</td>

        <td>${data.timestamp}</td>

      </tr>

    `;

    table.innerHTML += row;

  });

}

window.searchData = async function () {

  const search =
    document.getElementById("searchInput")
      .value
      .toLowerCase();

  const rows =
    table.getElementsByTagName("tr");

  for (let row of rows) {

    const id =
      row.cells[0]
        .innerText
        .toLowerCase();

    if (
      id.includes(search)
    ) {

      row.style.display = "";

    } else {

      row.style.display = "none";
    }
  }

};

loadData();
