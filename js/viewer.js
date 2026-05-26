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

const searchInput =
  document.getElementById("searchInput");

const viewPdfBtn =
  document.getElementById("viewPdfBtn");

/* =====================================================
   DATA
===================================================== */

let allRows = [];

let filteredRows = [];

let unsubscribe = null;

/* =====================================================
   LOAD VIEWER
===================================================== */

function loadViewer() {

  if (unsubscribe)
    unsubscribe();

  const assemblyQuery = query(

    collection(db, "assembly"),

    orderBy("timestamp", "asc")

  );

  unsubscribe = onSnapshot(

    assemblyQuery,

    (snapshot) => {

      allRows = [];

      snapshot.forEach((docItem) => {

        allRows.push({

          id: docItem.id,

          ...docItem.data()

        });

      });

      renderTable(allRows);

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

    /* PHOTO COUNT */

    const photoCount =
      (data.photos || [])
        .filter((photo) => {

          if (!photo)
            return false;

          /* OLD FORMAT */

          if (
            typeof photo === "string"
          )
            return true;

          /* NEW FORMAT */

          return !!photo.data;

        })
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

    /* ROW */

    row.innerHTML = `

      <td>${data.facadeId || ""}</td>

      <td>${data.subElementId || ""}</td>

      <td>${data.stage || ""}</td>

      <td>${data.employee || ""}</td>

      <td>${data.note || ""}</td>

      <td>${photoCount}</td>

      <td>${tsStr}</td>

    `;

    /* EDIT MODE */

    row.addEventListener(

      "dblclick",

      () => {

        window.open(

          `editor.html?id=${data.id}`,

          "_blank"

        );

      }

    );

    table.appendChild(row);

  });

}
/* =====================================================
   FILTER
===================================================== */

window.searchData = function () {

  const q =
    searchInput.value
      .toLowerCase()
      .trim();

  if (!q) {

    filteredRows = [...allRows];

  }

  else {

    filteredRows = allRows.filter((item) => {

      const text = `

        ${item.facadeId || ""}
        ${item.subElementId || ""}
        ${item.stage || ""}
        ${item.employee || ""}
        ${item.note || ""}

      `
        .toLowerCase();

      return text.includes(q);

    });

  }

  renderTable(filteredRows);

  /* ENABLE PDF */

  if (filteredRows.length > 0) {

    viewPdfBtn.classList.remove(
      "disabled"
    );

  }

  else {

    viewPdfBtn.classList.add(
      "disabled"
    );

  }

};

/* =====================================================
   VIEW PDF
===================================================== */

viewPdfBtn?.addEventListener(

  "click",

  () => {

    if (
      viewPdfBtn.classList.contains(
        "disabled"
      )
    ) return;

    if (!filteredRows.length)
      return;

    sessionStorage.setItem(

      "filteredRows",

      JSON.stringify(filteredRows)

    );

    window.open(

      "viewer_detail.html",

      "_blank"

    );

  }

);

/* =====================================================
   INIT
===================================================== */

window.addEventListener(

  "DOMContentLoaded",

  loadViewer

);
