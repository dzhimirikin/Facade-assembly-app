import { db } from "./firebase.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
   REALTIME VIEWER
===================================================== */

const table =
  document.getElementById("viewerTable");

/* QUERY */

const assemblyQuery =
  query(

    collection(db, "assembly"),

    orderBy("timestamp", "desc")

  );

/* REALTIME LISTENER */

onSnapshot(

  assemblyQuery,

  (snapshot) => {

    if (!table) return;

    table.innerHTML = "";

    snapshot.forEach((docItem) => {

      const data =
        docItem.data();

      const row =
        document.createElement("tr");

      row.innerHTML = `

        <td>${data.facadeId || ""}</td>

        <td>${data.subElementId || ""}</td>

        <td>${data.stage || ""}</td>

        <td>${data.employee || ""}</td>

        <td>${data.note || ""}</td>

        <td>${data.timestamp || ""}</td>

      `;

      table.appendChild(row);

    });

  },

  (error) => {

    console.error(
      "Viewer realtime error:",
      error
    );

  }

);

/* =====================================================
   SEARCH
===================================================== */

window.searchData = function () {

  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase();

  const rows =
    table.querySelectorAll("tr");

  rows.forEach((row) => {

    const text =
      row.innerText.toLowerCase();

    row.style.display =
      text.includes(search)
        ? ""
        : "none";

  });

};
