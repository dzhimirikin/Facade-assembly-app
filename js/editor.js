import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
   PARAMS
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
    "editorContainer"
  );

/* =====================================================
   LOAD
===================================================== */

async function loadRecord() {

  if (!id) {

    container.innerHTML =
      "Record not found";

    return;

  }

  try {

    const snapshot =
      await getDoc(
        doc(db, "assembly", id)
      );

    if (!snapshot.exists()) {

      container.innerHTML =
        "Record not found";

      return;

    }

    const data =
      snapshot.data();

    renderEditor(data);

  }

  catch (error) {

    console.error(error);

    container.innerHTML =
      "Load error";

  }

}

/* =====================================================
   RENDER
===================================================== */

function renderEditor(data) {

  container.innerHTML = `

    <table class="detail-table">

      <tr>
        <td>Facade</td>
        <td>${data.facadeId}</td>
      </tr>

      <tr>
        <td>Element</td>
        <td>${data.subElementId}</td>
      </tr>

      <tr>
        <td>Operation</td>
        <td>${data.stage}</td>
      </tr>

    </table>

    <br>

    <label>Comment</label>

    <textarea
      id="editNote"
      rows="8"
    >${data.note || ""}</textarea>

    <br><br>

    <button id="saveBtn">
      OK
    </button>

  `;

  document
    .getElementById("saveBtn")
    .addEventListener(
      "click",
      saveRecord
    );

}

/* =====================================================
   SAVE
===================================================== */

async function saveRecord() {

  try {

    const note =
      document.getElementById(
        "editNote"
      ).value;

    await updateDoc(

      doc(db, "assembly", id),

      {

        note,

        timestamp: new Date()

      }

    );

    alert("Saved");

    window.close();

  }

  catch (error) {

    console.error(error);

    alert("Save error");

  }

}

/* =====================================================
   INIT
===================================================== */

window.addEventListener(

  "DOMContentLoaded",

  loadRecord

);
