import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
   PROJECTS
===================================================== */

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

    await loadProjects();

  }

  catch (error) {

    console.error(
      "Project add error:",
      error
    );

  }

};

/* =====================================================
   LOAD PROJECTS
===================================================== */

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

/* =====================================================
   SET CURRENT PROJECT
===================================================== */

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

    await loadFacades();

    await loadFacadeSelect();

    await loadElementsList();

  }

  catch (error) {

    console.error(
      "Set current project error:",
      error
    );

  }

};

/* =====================================================
   LOAD FACADES
===================================================== */

async function loadFacades() {

  const list =
    document.getElementById("facadeList");

  if (!list) return;

  list.innerHTML = "";

  try {

    const settingsDoc =
      await getDoc(
        doc(db, "settings", "currentProject")
      );

    const currentProject =
      settingsDoc.data()?.name;

    if (!currentProject) return;

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
      "Facade load error:",
      error
    );

  }

}

/* =====================================================
   ADD FACADE
===================================================== */

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

    await addDoc(

      collection(db, "facades"),

      {
        name: value,
        projectId: currentProject
      }

    );

    input.value = "";

    await loadFacades();

    await loadFacadeSelect();

  }

  catch (error) {

    console.error(
      "Add facade error:",
      error
    );

  }

};

/* =====================================================
   IMPORT FACADES TXT
===================================================== */

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
              name: line,
              projectId: currentProject
            }

          );

        }

        fileInput.value = "";

        await loadFacades();

        await loadFacadeSelect();

        alert(
          "TXT imported successfully"
        );

      }

      catch (error) {

        console.error(
          "TXT import error:",
          error
        );

        alert(
          "TXT import failed"
        );

      }

    };

  reader.readAsText(file);

};

/* =====================================================
   EMPLOYEES
===================================================== */

async function loadEmployees() {

  const list =
    document.getElementById("employeeList");

  if (!list) return;

  list.innerHTML = "";

  try {

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

  catch (error) {

    console.error(
      "Employee load error:",
      error
    );

  }

}

window.addEmployee = async function () {

  const input =
    document.getElementById("employeeName");

  const value =
    input.value.trim();

  if (!value) return;

  try {

    await addDoc(

      collection(db, "employees"),

      {
        name: value
      }

    );

    input.value = "";

    await loadEmployees();

  }

  catch (error) {

    console.error(
      "Employee add error:",
      error
    );

  }

};

/* =====================================================
   LOAD FACADE SELECT
===================================================== */

async function loadFacadeSelect() {

  const select =
    document.getElementById("facadeSelect");

  if (!select) return;

  select.innerHTML = "";

  try {

    const settingsDoc =
      await getDoc(
        doc(db, "settings", "currentProject")
      );

    const currentProject =
      settingsDoc.data()?.name;

    if (!currentProject) return;

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

  catch (error) {

    console.error(
      "Facade select load error:",
      error
    );

  }

}

/* =====================================================
   ADD ELEMENT
===================================================== */

window.addElement = async function () {

  const facadeId =
    document.getElementById("facadeSelect").value;

  const input =
    document.getElementById("newElement");

  const name =
    input.value.trim();

  if (!facadeId || !name) {

    alert(
      "Fill all fields"
    );

    return;

  }

  try {

    const settingsDoc =
      await getDoc(
        doc(db, "settings", "currentProject")
      );

    const currentProject =
      settingsDoc.data()?.name;

    await addDoc(

      collection(db, "elements"),

      {
        projectId: currentProject,
        facadeId,
        name
      }

    );

    input.value = "";

    await loadElementsList();

  }

  catch (error) {

    console.error(
      "Add element error:",
      error
    );

  }

};

/* =====================================================
   IMPORT ELEMENTS TXT
===================================================== */

window.importElementsTxt = function () {

  const fileInput =
    document.getElementById("elementTxt");

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

        const facadeId =
          document.getElementById("facadeSelect").value;

        if (!facadeId) {

          alert(
            "Select facade"
          );

          return;

        }

        const settingsDoc =
          await getDoc(
            doc(db, "settings", "currentProject")
          );

        const currentProject =
          settingsDoc.data()?.name;

        const text =
          event.target.result;

        const lines =
          text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line !== "");

        for (const line of lines) {

          await addDoc(

            collection(db, "elements"),

            {
              projectId: currentProject,
              facadeId,
              name: line
            }

          );

        }

        fileInput.value = "";

        await loadElementsList();

        alert(
          "Elements imported"
        );

      }

      catch (error) {

        console.error(
          "Elements import error:",
          error
        );

      }

    };

  reader.readAsText(file);

};

/* =====================================================
   LOAD ELEMENTS LIST
===================================================== */

async function loadElementsList() {

  const list =
    document.getElementById("elementList");

  if (!list) return;

  list.innerHTML = "";

  try {

    const facadeId =
      document.getElementById("facadeSelect")?.value;

    if (!facadeId) return;

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

  catch (error) {

    console.error(
      "Elements load error:",
      error
    );

  }

}

/* =====================================================
   EVENTS
===================================================== */

document
  .getElementById("facadeSelect")
  ?.addEventListener(

    "change",

    async () => {

      await loadElementsList();

    }

  );

/* =====================================================
   INITIAL LOAD
===================================================== */

async function init() {

  await loadProjects();

  await loadFacades();

  await loadFacadeSelect();

  await loadEmployees();

  await loadElementsList();

}

init();

import { db } from "./firebase.js";
import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
CLEAR DATABASE
===================================================== */
const clearDatabaseBtn = document.getElementById('clearDatabaseBtn');

clearDatabaseBtn.addEventListener('click', async () => {
  const confirmed = confirm('⚠️ This will permanently delete all data. Are you sure?');
  if (!confirmed) return;

  const collections = ['projects', 'facades', 'elements', 'employees', 'assembly', 'settings'];

  try {
    for (const colName of collections) {
      const snapshot = await getDocs(collection(db, colName));
      const deletePromises = [];
      snapshot.forEach(docItem => {
        deletePromises.push(deleteDoc(doc(db, colName, docItem.id)));
      });
      await Promise.all(deletePromises);
    }

    alert('Database cleared successfully!');

    // Обновляем интерфейс после очистки (вызываем ваши функции загрузки данных)
    loadProjects?.();
    loadFacades?.();
    loadFacadeSelect?.();
    loadElementsList?.();
    loadEmployees?.();

  } catch (err) {
    console.error('Error clearing database:', err);
    alert('Error clearing database: ' + err.message);
  }
});

// Привязываем к кнопке
document.getElementById("clearDatabaseBtn").addEventListener("click", clearDatabase);
