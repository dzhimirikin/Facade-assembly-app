import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
   GET ID
===================================================== */

const params =
  new URLSearchParams(
    window.location.search
  );

const id =
  params.get("id");

/* =====================================================
   ELEMENTS
===================================================== */

const container =
  document.getElementById(
    "detailContainer"
  );

/* =====================================================
   LOAD DETAIL
===================================================== */

async function loadDetail() {

  if (!id) {

    container.innerHTML =
      "Record ID not found";

    return;

  }

  try {

    const docRef =
      doc(db, "assembly", id);

    const snapshot =
      await getDoc(docRef);

    if (!snapshot.exists()) {

      container.innerHTML =
        "Record not found";

      return;

    }

    const data =
      snapshot.data();

    renderDetail(data);

  }

  catch (error) {

    console.error(error);

    container.innerHTML =
      "Load error";

  }

}

/* =====================================================
   RENDER DETAIL
===================================================== */

function renderDetail(data) {

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

  const photos =
    (data.photos || [])
      .filter(p => p);

  container.innerHTML = `

    <div class="print-toolbar">

      <button onclick="window.print()">
        Print / PDF
      </button>

    </div>

    <div class="print-sheet">

      <h1>
        Assembly Record
      </h1>

      <table class="detail-table">

        <tr>
          <td>Facade</td>
          <td>${data.facadeId || ""}</td>
        </tr>

        <tr>
          <td>Element</td>
          <td>${data.subElementId || ""}</td>
        </tr>

        <tr>
          <td>Operation</td>
          <td>${data.stage || ""}</td>
        </tr>

        <tr>
          <td>Employee</td>
          <td>${data.employee || ""}</td>
        </tr>

        <tr>
          <td>Time</td>
          <td>${tsStr}</td>
        </tr>

        <tr>
          <td>Note</td>
          <td>${data.note || ""}</td>
        </tr>

      </table>

      <div class="photo-section">

        ${photos.map(photo => `

          <div class="photo-card">

            <div class="photo-placeholder">
              ${photo}
            </div>

          </div>

        `).join("")}

      </div>

    </div>

  `;

}

/* =====================================================
   INIT
===================================================== */

window.addEventListener(
  "DOMContentLoaded",
  loadDetail
);
