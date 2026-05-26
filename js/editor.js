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
   LOAD RECORD
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
   RENDER EDITOR
===================================================== */

function renderEditor(data) {

  const photos =
    (data.photos || [])
      .filter(p => p);

  const freeSlots =
    3 - photos.length;

  container.innerHTML = `

    <div class="input-panel">

      <h2>Edit Record</h2>

      <!-- FACADE -->

      <label>Facade ID</label>

      <input
        type="text"
        value="${data.facadeId || ""}"
        disabled
      />

      <!-- ELEMENT -->

      <label>Element</label>

      <input
        type="text"
        value="${data.subElementId || ""}"
        disabled
      />

      <!-- OPERATION -->

      <label>Operation</label>

      <input
        type="text"
        value="${data.stage || ""}"
        disabled
      />

      <!-- EMPLOYEE -->

      <label>Employee</label>

      <input
        type="text"
        value="${data.employee || ""}"
        disabled
      />

      <!-- NOTE -->

      <label>Comment</label>

      <textarea
        id="editNote"
        rows="6"
      >${data.note || ""}</textarea>

      <!-- EXISTING PHOTOS -->

      <label>
        Existing Photos
      </label>

      <div class="existing-photos">

        ${photos.length
          ? photos.map((photo, index) => `

            <div class="photo-row">

              <div class="photo-name">

                ${photo}

              </div>

              <input
                type="file"
                class="replacePhoto"
                data-index="${index}"
                accept="image/*"
              />

            </div>

          `).join("")
          : "<div>No photos uploaded</div>"
        }

      </div>

      <!-- FREE SLOTS -->

      ${freeSlots > 0
        ? `

          <label>
            Add Photos
          </label>

          ${Array.from(
            { length: freeSlots },
            (_, i) => `

              <input
                type="file"
                class="newPhoto"
                accept="image/*"
              />

            `
          ).join("")}

        `
        : `

          <div class="photo-limit">

            Maximum 3 photos uploaded

          </div>

        `
      }

      <button
        id="saveBtn"
        class="submit-btn"
      >
        OK
      </button>

    </div>

  `;

  document
    .getElementById("saveBtn")
    .addEventListener(
      "click",
      () => saveRecord(data)
    );

}

/* =====================================================
   SAVE RECORD
===================================================== */

async function saveRecord(data) {

  try {

    const note =
      document.getElementById(
        "editNote"
      ).value;

    /* =========================================
       START WITH CLEAN ARRAY
    ========================================= */

    let updatedPhotos =
      [...(data.photos || [])]
        .filter(p => p);

    /* =========================================
       REPLACE EXISTING
    ========================================= */

    const replaceInputs =
      document.querySelectorAll(
        ".replacePhoto"
      );

    replaceInputs.forEach((input) => {

      const file =
        input.files[0];

      const index =
        parseInt(
          input.dataset.index
        );

      if (
        file &&
        index >= 0 &&
        index < updatedPhotos.length
      ) {

        updatedPhotos[index] =
          file.name;

      }

    });

    /* =========================================
       ADD NEW
    ========================================= */

    const newInputs =
      document.querySelectorAll(
        ".newPhoto"
      );

    newInputs.forEach((input) => {

      const file =
        input.files[0];

      if (!file) return;

      if (
        updatedPhotos.length >= 3
      ) return;

      updatedPhotos.push(
        file.name
      );

    });

    /* =========================================
       FINAL CLEANUP
    ========================================= */

    updatedPhotos =
      updatedPhotos
        .filter(p => p)
        .slice(0, 3);

    console.log(
      "UPDATED PHOTOS:",
      updatedPhotos
    );

    /* =========================================
       SAVE
    ========================================= */

    await updateDoc(

      doc(db, "assembly", id),

      {

        note,

        photos: updatedPhotos,

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
