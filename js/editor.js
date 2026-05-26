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
   IMAGE -> BASE64
===================================================== */

async function fileToBase64(file) {

  return new Promise((resolve, reject) => {

    const img =
      new Image();

    const reader =
      new FileReader();

    reader.onload = (e) => {

      img.src =
        e.target.result;

    };

    img.onload = () => {

      const canvas =
        document.createElement(
          "canvas"
        );

      const maxWidth = 700;

      let width =
        img.width;

      let height =
        img.height;

      if (width > maxWidth) {

        height *=
          maxWidth / width;

        width =
          maxWidth;

      }

      canvas.width =
        width;

      canvas.height =
        height;

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      const data =
        canvas.toDataURL(
          "image/jpeg",
          0.35
        );

      resolve({

        name: file.name,

        data

      });

    };

    reader.onerror =
      reject;

    reader.readAsDataURL(file);

  });

}

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

    <div class="editor-layout">

      <!-- LEFT -->

      <div class="editor-left">

        <div class="input-panel">

          <h2>Edit Record</h2>

          <label>Facade ID</label>

          <input
            type="text"
            value="${data.facadeId || ""}"
            disabled
          />

          <label>Element</label>

          <input
            type="text"
            value="${data.subElementId || ""}"
            disabled
          />

          <label>Operation</label>

          <input
            type="text"
            value="${data.stage || ""}"
            disabled
          />

          <label>Employee</label>

          <input
            type="text"
            value="${data.employee || ""}"
            disabled
          />

          <label>Comment</label>

          <textarea
            id="editNote"
            rows="8"
          >${data.note || ""}</textarea>

          <label>
            Existing Photos
          </label>

          <div class="existing-photos">

            ${photos.length

              ? photos.map((photo, index) => `

                <div class="photo-row">

                  <div class="photo-name">

                    ${photo.name}

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

          ${freeSlots > 0

            ? `

              <label>
                Add Photos
              </label>

              ${Array.from(

                { length: freeSlots },

                () => `

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

      </div>

      <!-- RIGHT -->

      <div class="editor-right">

        <h2>
          Photo Preview
        </h2>

        <div
          class="preview-grid"
          id="previewGrid"
        ></div>

      </div>

    </div>

  `;

  const previewGrid =
    document.getElementById(
      "previewGrid"
    );

/* EXISTING PREVIEW */

photos.forEach((photo) => {

  const card =
    document.createElement("div");

  card.className =
    "preview-card";

  /* OLD FORMAT */

  if (
    typeof photo === "string"
  ) {

    card.innerHTML = `

      <div class="old-photo">

        OLD PHOTO

      </div>

      <div class="preview-name">

        ${photo}

      </div>

    `;

  }

  /* NEW FORMAT */

  else {

    card.innerHTML = `

      <img src="${photo.data}" />

      <div class="preview-name">

        ${photo.name}

      </div>

    `;

  }

  previewGrid.appendChild(card);

});

  /* ADD PREVIEW */

  function addPreview(file) {

    const url =
      URL.createObjectURL(file);

    const card =
      document.createElement("div");

    card.className =
      "preview-card";

    card.innerHTML = `

      <img src="${url}" />

      <div class="preview-name">

        ${file.name}

      </div>

    `;

    previewGrid.appendChild(card);

  }

  /* NEW PHOTOS */

  document
    .querySelectorAll(
      ".newPhoto"
    )
    .forEach((input) => {

      input.addEventListener(

        "change",

        () => {

          const file =
            input.files[0];

          if (!file) return;

          addPreview(file);

        }

      );

    });

  /* REPLACE PHOTOS */

  document
    .querySelectorAll(
      ".replacePhoto"
    )
    .forEach((input) => {

      input.addEventListener(

        "change",

        () => {

          const file =
            input.files[0];

          if (!file) return;

          addPreview(file);

        }

      );

    });

  /* SAVE */

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

    let updatedPhotos =
      [...(data.photos || [])]
        .filter(p => p);

    /* REPLACE */

    const replaceInputs =
      document.querySelectorAll(
        ".replacePhoto"
      );

    for (const input of replaceInputs) {

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

        const uploaded =
          await fileToBase64(file);

        updatedPhotos[index] =
          uploaded;

      }

    }

    /* ADD */

    const newInputs =
      document.querySelectorAll(
        ".newPhoto"
      );

    for (const input of newInputs) {

      const file =
        input.files[0];

      if (!file)
        continue;

      if (
        updatedPhotos.length >= 3
      )
        continue;

      const uploaded =
        await fileToBase64(file);

      updatedPhotos.push(
        uploaded
      );

    }

    updatedPhotos =
      updatedPhotos
        .filter(p => p)
        .slice(0, 3);

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
