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
  document.getElementById(
    "viewerTable"
  );

const searchInput =
  document.getElementById(
    "searchInput"
  );

const viewPdfBtn =
  document.getElementById(
    "viewPdfBtn"
  );

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

    orderBy("timestamp", "desc")

  );

  unsubscribe = onSnapshot(

    assemblyQuery,

    (snapshot) => {

      allRows = [];

      snapshot.forEach((docItem) => {

        try {

          const data =
            docItem.data();

          allRows.push({

            id: docItem.id,

            ...data

          });

        }

        catch (error) {

          console.error(
            "ROW ERROR:",
            error
          );

        }

      });

      console.log(
        "ROWS:",
        allRows
      );

      renderTable(allRows);

    },

    (error) => {

      console.error(
        "SNAPSHOT ERROR:",
        error
      );

    }

  );

}

/* =====================================================
   PHOTO COUNT
===================================================== */

function getPhotoCount(photos) {

  return (photos || [])
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

}

/* =====================================================
   TIMESTAMP
===================================================== */

function formatTimestamp(timestamp) {

  try {

    if (!timestamp)
      return "";

    const ts =
      timestamp?.toDate?.()
      || new Date(timestamp);

    return ts.toLocaleString();

  }

  catch (error) {

    console.error(
      "TIMESTAMP ERROR:",
      error
    );

    return "";

  }

}

/* =====================================================
   RENDER TABLE
===================================================== */

function renderTable(dataArray) {

  table.innerHTML = "";

  dataArray.forEach((data) => {

    try {

      const row =
        document.createElement("tr");

      const photoCount =
        getPhotoCount(
          data.photos
        );

      const tsStr =
        formatTimestamp(
          data.timestamp
        );

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

    }

    catch (error) {

      console.error(
        "RENDER ERROR:",
        error
      );

    }

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

    filteredRows =
      [...allRows];

  }

  else {

    filteredRows =
      allRows.filter((item) => {

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

  if (
    filteredRows.length > 0
  ) {

    viewPdfBtn?.classList.remove(
      "disabled"
    );

  }

  else {

    viewPdfBtn?.classList.add(
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
    )
      return;

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
