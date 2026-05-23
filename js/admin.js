import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   PROJECTS
========================= */

window.addProject = async function () {

  const input =
    document.getElementById("projectName");

  const name =
    input.value.trim();

  if (!name) {

    alert("Enter project name");

    return;
  }

  try {

    await addDoc(

      collection(db, "projects"),

      {
        name
      }

    );

    input.value = "";

    loadProjects();

  }

  catch (error) {

    console.error(
      "Project add error:",
      error
    );

  }

};

/* =========================
   LOAD PROJECTS
========================= */

async function loadProjects() {

  const select =
    document.getElementById("projectSelect");

  if (!select) return;

  select.innerHTML = "";

  try {

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

  catch (error) {

    console.error(
      "Project load error:",
      error
    );

  }

}

loadProjects();

/* =========================
   SET CURRENT PROJECT
========================= */

window.setCurrentProject = async function () {

  const project =
    document.getElementById("projectSelect").value;

  if (!project) {

    alert("Select project");

    return;
  }

  try {

    await setDoc(

      doc(db, "settings", "currentProject"),

      {
        name: project
      }

    );

    alert(
      `Current project: ${project}`
    );

    loadFacades();

  }

  catch (error) {

    console.error(
      "Set project error:",
      error
    );

  }

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

    /* CURRENT PROJECT */

    const settingsDoc =
      await getDoc(
        doc(db, "settings", "currentProject")
      );

    const currentProject =
      settingsDoc.data()?.name;

    if (!currentProject) return;

    /* LOAD FACADES */

    const snapshot =
      await getDocs(
        collection(db, "facades")
      );

    snapshot.forEach((docItem) => {

      const data =
        docItem.data();

      /* FILTER */

      if (
        data.projectId !== currentProject
      ) return;

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
   ADD FACADE
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

    /* CURRENT PROJECT */

    const settingsDoc =
      await getDoc(
        doc(db, "settings", "currentProject")
      );

    const currentProject =
      settingsDoc.data()?.name;

    if (!currentProject) {

      alert(
        "Set current project first"
      );

      return;
    }

    /* SAVE */

    await addDoc(

      collection(db, "facades"),

      {

        name: value,

        projectId:
          currentProject

      }

    );

    input.value = "";

    loadFacades();

  }

  catch (error) {

    console.error(
      "Add facade error:",
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
          settingsDoc.data()?.name;

        if (!currentProject) {

          alert(
            "Set current project first"
          );

          return;
        }

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

        fileInput.value = "";

        loadFacades();

        alert(
          "TXT imported successfully"
        );

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

/* =========================
   EMPLOYEES
========================= */

async function loadEmployees() {

  const list =
    document.getElementById("employeeList");

  if (!list) return;

  list.innerHTML = "";

  const snapshot =
    await getDocs(
      collection(db, "employees")
    );

  snapshot.forEach((docItem) => {

    const data =
      docItem.data();

    const row =
      document.createElement("div");

    row.className =
      "facade-item";

    row.textContent =
      data.name;

    list.appendChild(row);

  });

}

loadEmployees();

window.addEmployee = async function () {

  const input =
    document.getElementById("employeeName");

  const value =
    input.value.trim();

  if (!value) return;

  await addDoc(

    collection(db, "employees"),

    {
      name: value
    }

  );

  input.value = "";

  loadEmployees();

};

/* =========================
   LOAD FACADE SELECT
========================= */

async function loadFacadeSelect() {

  const select =
    document.getElementById("facadeSelect");

  if (!select) return;

  select.innerHTML = "";

  const settingsDoc =
    await getDoc(
      doc(db, "settings", "currentProject")
    );

  const currentProject =
    settingsDoc.data()?.name;

  const snapshot =
    await getDocs(
      collection(db, "facades")
    );

  snapshot.forEach((docItem) => {

    const data =
      docItem.data();

    if (
      data.projectId !== currentProject
    ) return;

    const option =
      document.createElement("option");

    option.value =
      data.name;

    option.textContent =
      data.name;

    select.appendChild(option);

  });

}

loadFacadeSelect();

/* =========================
   ADD ELEMENT
========================= */

window.addElement = async function () {

  const facadeId =
    document.getElementById("facadeSelect").value;

  const name =
    document.getElementById("newElement").value;

  const settingsDoc =
    await getDoc(
      doc(db, "settings", "currentProject")
    );

  const currentProject =
    settingsDoc.data()?.name;

  await addDoc(

    collection(db, "elements"),

    {

      projectId:
        currentProject,

      facadeId,

      name

    }

  );

  loadElementsList();

};

/* =========================
   LOAD ELEMENTS LIST
========================= */

async function loadElementsList() {

  const list =
    document.getElementById("elementList");

  if (!list) return;

  list.innerHTML = "";

  const facadeId =
    document.getElementById("facadeSelect").value;

  const snapshot =
    await getDocs(
      collection(db, "elements")
    );

  snapshot.forEach((docItem) => {

    const data =
      docItem.data();

    if (
      data.facadeId !== facadeId
    ) return;

    const row =
      document.createElement("div");

    row.className =
      "facade-item";

    row.textContent =
      data.name;

    list.appendChild(row);

  });

}

document
  .getElementById("facadeSelect")
  ?.addEventListener(

    "change",

    () => {

      loadElementsList();

    }

  );

loadElementsList();
