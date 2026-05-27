// app.js — полностью переписанный и безопасный вариант для проекта учета фасадных элементов
// Сохраняет все функции, добавляет try/catch для всех асинхронных операций, логи для отладки

import { db } from "./firebase.js";
import { collection, addDoc, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("APP START");

/* =====================================================
   IMAGE -> BASE64
===================================================== */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => { img.src = e.target.result; };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 700;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve({ name: file.name, data: canvas.toDataURL("image/jpeg", 0.35) });
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* =====================================================
   LOAD FACADES
===================================================== */
async function loadFacades() {
  const select = document.getElementById("elementId");
  if (!select) return;
  select.innerHTML = "";

  let currentProject;
  try {
    const settingsSnapshot = await getDoc(doc(db, "settings", "currentProject"));
    if (!settingsSnapshot.exists()) {
      console.log("Current project not found");
      return;
    }
    currentProject = settingsSnapshot.data().name;
    console.log("Current project:", currentProject);
  } catch (err) {
    console.error("Error getting current project:", err);
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, "facades"));
    snapshot.forEach((docItem) => {
      const data = docItem.data();
      if (data.projectId !== currentProject) return;
      const option = document.createElement("option");
      option.value = data.name;
      option.textContent = data.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading facades:", err);
  }
}

/* =====================================================
   LOAD ELEMENTS
===================================================== */
async function loadElements() {
  const facadeSelect = document.getElementById("elementId");
  const elementSelect = document.getElementById("subElementId");
  if (!facadeSelect || !elementSelect) return;
  elementSelect.innerHTML = "";

  let currentProject;
  try {
    const settingsSnapshot = await getDoc(doc(db, "settings", "currentProject"));
    currentProject = settingsSnapshot.data()?.name;
  } catch (err) {
    console.error("Error getting current project for elements:", err);
    return;
  }

  const currentFacade = facadeSelect.value;

  try {
    const snapshot = await getDocs(collection(db, "elements"));
    snapshot.forEach((docItem) => {
      const data = docItem.data();
      if (data.projectId !== currentProject) return;
      if (data.facadeId !== currentFacade) return;
      const option = document.createElement("option");
      option.value = data.name;
      option.textContent = data.name;
      elementSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading elements:", err);
  }
}

/* =====================================================
   LOAD EMPLOYEES
===================================================== */
async function loadEmployees() {
  const select = document.getElementById("employee");
  if (!select) return;
  select.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "employees"));
    snapshot.forEach((docItem) => {
      const data = docItem.data();
      const option = document.createElement("option");
      option.value = data.name;
      option.textContent = data.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading employees:", err);
  }
}

/* =====================================================
   INIT
===================================================== */
async function init() {
  await loadFacades();
  await loadElements();
  await loadEmployees();
}

init();

/* =====================================================
   EVENTS
===================================================== */
document.getElementById("elementId")?.addEventListener("change", loadElements);

/* =====================================================
   SAVE DATA
===================================================== */
window.saveData = async function () {
  const facadeId = document.getElementById("elementId").value;
  const subElementId = document.getElementById("subElementId").value;
  const stage = document.getElementById("stage").value;
  const employee = document.getElementById("employee").value;
  const note = document.getElementById("note").value;
  const photo1 = document.getElementById("photo1").files[0];
  const photo2 = document.getElementById("photo2").files[0];
  const photo3 = document.getElementById("photo3").files[0];

  if (!facadeId || !employee) {
    alert("Fill required fields");
    return;
  }

  let currentProject;
  try {
    const settingsDoc = await getDoc(doc(db, "settings", "currentProject"));
    currentProject = settingsDoc.data()?.name;
  } catch (err) {
    console.error("Error getting current project for save:", err);
    alert("Error getting project");
    return;
  }

  const photos = [];
  for (const file of [photo1, photo2, photo3]) {
    if (file) photos.push(await fileToBase64(file));
  }

  try {
    await addDoc(collection(db, "assembly"), {
      projectId: currentProject,
      facadeId,
      subElementId,
      stage,
      employee,
      note,
      timestamp: new Date(),
      photos
    });

    const success = document.getElementById("success");
    if (success) success.innerText = "Data saved successfully";

    document.getElementById("note").value = "";
    document.getElementById("photo1").value = "";
    document.getElementById("photo2").value = "";
    document.getElementById("photo3").value = "";

    console.log("Record saved");
  } catch (err) {
    console.error("Error saving data:", err);
    alert("Error saving data");
  }
};
