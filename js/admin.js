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

window.addProject = async function () {

  const name =
    document.getElementById("projectName").value;

  if (!name) return;

  await addDoc(

    collection(db, "projects"),

    {
      name
    }

  );

  loadProjects();

};


async function loadProjects() {

  const select =
    document.getElementById("projectSelect");

  if (!select) return;

  select.innerHTML = "";

  const snapshot =
    await getDocs(
      collection(db, "projects")
    );

  snapshot.forEach((docItem) => {

    const data =
      docItem.data();

    const option =
      document.createElement("option");

    option.value =
      data.name;

    option.textContent =
      data.name;

    select.appendChild(option);

  });

}

loadProjects();


window.setCurrentProject = async function () {

  const project =
    document.getElementById("projectSelect").value;

  await setDoc(

    doc(db, "settings", "currentProject"),

    {
      name: project
    }

  );

  alert(
    `Current project: ${project}`
  );

};

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

      /* CURRENT PROJECT */

      const settingsDoc =
        await getDoc(
          doc(db, "settings", "currentProject")
        );

      const currentProject =
        settingsDoc.data().name;

      /* TXT CONTENT */

      const text =
        event.target.result;

      const lines =
        text
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line !== "");

      /* SAVE FACADES */

      for (const line of lines) {

        await addDoc(

          collection(db, "facades"),

          {

            name: line,

            projectId:
              currentProject

          }

        );

      }

      loadFacades();

      alert(
        "TXT imported successfully"
      );

    }

    catch (error) {

      console.error(error);

      alert("Import error");

    }

  };

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
