import { db } from "./firebase.js";

import {

  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc

} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   LOAD FACADES
========================= */

async function loadFacades() {

  const list =
    document.getElementById("facadeList");

  if (!list) return;

  list.innerHTML = "";

  try {

    const snapshot =
      await getDocs(
        collection(db, "facades")
      );

    snapshot.forEach((doc) => {

      const data =
        doc.data();

      const row =
        document.createElement("div");

      row.className =
        "facade-item";

      row.textContent =
        data.name;

      list.appendChild(row);

    });

  }

  catch (error) {

    console.error(
      "Load error:",
      error
    );
  }

}

loadFacades();

/* =========================
   ADD MANUALLY
========================= */

window.addFacade = async function () {

  const input =
    document.getElementById("newFacade");

  const value =
    input.value.trim();

  if (!value) {

    alert("Enter facade name");

    return;
  }

  try {

    await addDoc(

      collection(db, "facades"),

      {
        name: value
      }

    );

    input.value = "";

    loadFacades();

  }

  catch (error) {

    console.error(
      "Add error:",
      error
    );
  }

};

/* =========================
   IMPORT TXT
========================= */

window.importTxt = function () {

  const fileInput =
    document.getElementById("txtFile");

  const file =
    fileInput.files[0];

  if (!file) {

    alert("Select TXT file");

    return;
  }

  const reader =
    new FileReader();

  reader.onload =
    async function (event) {

      try {

        const text =
          event.target.result;

        const lines =
          text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line !== "");

        for (const line of lines) {

          await addDoc(

            collection(db, "facades"),

            {
              name: line
            }

          );

        }

        alert("TXT imported successfully");

        fileInput.value = "";

        loadFacades();

      }

      catch (error) {

        console.error(
          "Import error:",
          error
        );

        alert("TXT import failed");
      }

    };

  reader.readAsText(file);

};
