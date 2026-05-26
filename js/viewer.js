import { db } from "./firebase.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
   ELEMENTS
===================================================== */

const table =
  document.getElementById("viewerTable");

const facadeSelect =
  document.getElementById("elementId");

const elementSelect =
  document.getElementById("subElementId");

const searchInput =
  document.getElementById("searchInput");

/* =====================================================
   DATA
===================================================== */

let allRows = [];

let unsubscribe = null;

/* =====================================================
   LOAD VIEWER
===================================================== */

function loadViewer() {

  if (!table) return;

  const currentFacade =
    facadeSelect?.value || "";

  const currentElement =
    elementSelect?.value || "";

  if (unsubscribe)
    unsubscribe();

  const assemblyQuery = query(
    collection(db, "assembly"),
    orderBy("timestamp", "desc")
  );

  unsubscribe = onSnapshot(

    assemblyQuery,

    (snapshot) => {

      allRows = [];

      snapshot.forEach((docItem) => {

        const data =
          docItem.data();

        if (
          currentFacade &&
          data.facadeId !== currentFacade
        ) return;

        if (
          currentElement &&
          data.subElementId !== currentElement
        ) return;

        allRows.push({

          id: docItem.id,

          ...data

        });

      });

      renderTable(allRows);

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
   RENDER TABLE
===================================================== */

function renderTable(dataArray) {

  table.innerHTML = "";

  dataArray.forEach((data) => {

    const row =
      document.createElement("tr");

    row.classList.add(
      "assembly-row"
    );

    row.dataset.docId =
      data.id;

    /* PHOTO COUNT */

    const photoCount =
      (data.photos || [])
        .filter(p => p)
        .length;

    /* TIMESTAMP */

    let tsStr = "";

    try {

      const ts =
        data.timestamp?.toDate?.()
        || new Date(data.timestamp);

      tsStr =
        ts.toLocaleString();

    }

    catch {

      tsStr =
        data.timestamp || "";

    }

    /* HTML */

    row.innerHTML = `

      <td>${data.facadeId || ""}</td>

      <td>${data.subElementId || ""}</td>

      <td>${data.stage || ""}</td>

      <td>${data.employee || ""}</td>

      <td>${data.note || ""}</td>

      <td>${photoCount}</td>

      <td>${tsStr}</td>

    `;

    /* DOUBLE CLICK */

    row.addEventListener(

      "dblclick",

      () => {

        window.open(

          `viewer_detail.html?id=${data.id}`,

          "_blank"

        );

      }

    );

    table.appendChild(row);

  });

}

/* =====================================================
   SEARCH
===================================================== */

window.searchData = function () {

  const q =
    searchInput?.value
      .toLowerCase()
      .trim() || "";

  if (!q) {

    renderTable(allRows);

    return;

  }

  const filtered =
    allRows.filter((item) => {

      const text = `

        ${item.facadeId || ""}
        ${item.subElementId || ""}
        ${item.stage || ""}
        ${item.employee || ""}
        ${item.note || ""}
        ${(item.photos || []).join(" ")}
        ${item.timestamp || ""}

      `
        .toLowerCase();

      return text.includes(q);

    });

  renderTable(filtered);

};

/* =====================================================
   LIVE SEARCH
===================================================== */

searchInput?.addEventListener(
  "input",
  searchData
);

/* =====================================================
   EVENTS
===================================================== */

facadeSelect?.addEventListener(

  "change",

  () => {

    setTimeout(
      loadViewer,
      200
    );

  }

);

elementSelect?.addEventListener(
  "change",
  loadViewer
);

/* =====================================================
   INIT
===================================================== */

window.addEventListener(
  "DOMContentLoaded",
  loadViewer
);
