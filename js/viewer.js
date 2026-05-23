import { db } from "./firebase.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
   ELEMENT VIEWER
===================================================== */

const table =
  document.getElementById("viewerTable");

const facadeSelect =
  document.getElementById("elementId");

const elementSelect =
  document.getElementById("subElementId");

let unsubscribe = null;

/* =====================================================
   LOAD VIEWER
===================================================== */

function loadViewer() {

  if (!table) return;

  const currentFacade =
    facadeSelect?.value;

  const currentElement =
    elementSelect?.value;

  /* REMOVE OLD LISTENER */

  if (unsubscribe) {

    unsubscribe();

  }

  /* QUERY */

  const assemblyQuery =
    query(

      collection(db, "assembly"),

      orderBy("timestamp", "desc")

    );

  /* REALTIME */

  unsubscribe = onSnapshot(

    assemblyQuery,

    (snapshot) => {

      table.innerHTML = "";

      snapshot.forEach((docItem) => {

        const data =
          docItem.data();

        /* FILTER */

        if (
          data.facadeId !== currentFacade
        ) return;

        if (
          data.subElementId !== currentElement
        ) return;

        /* ROW */

        // Считаем количество фото
        const photoCount = (data.photos || []).filter(p => p).length;

        row.innerHTML = `
          <td>${data.facadeId || ""}</td>
          <td>${data.subElementId || ""}</td>
          <td>${data.stage || ""}</td>
          <td>${data.employee || ""}</td>
          <td>${data.note || ""}</td>
          <td>${photoCount}</td>
          <td>${data.timestamp || ""}</td>

        `;

        table.appendChild(row);

      });

    },

    (error) => {

      console.error(
        "Viewer error:",
        error
      );

    }

  );

}

/* =====================================================
   EVENTS
===================================================== */

facadeSelect?.addEventListener(

  "change",

  () => {

    setTimeout(() => {

      loadViewer();

    }, 200);

  }

);

elementSelect?.addEventListener(

  "change",

  () => {

    loadViewer();

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

/* =====================================================
   INIT
===================================================== */

setTimeout(() => {

  loadViewer();

}, 500);
