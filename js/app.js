import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   LOAD FACADES
========================= */
async function loadFacades() {
  try {
    const select = document.getElementById("elementId");
    if (!select) return;
    select.innerHTML = "";

    // Current project
    const settingsDoc = await getDoc(doc(db, "settings", "currentProject"));
    if (!settingsDoc.exists()) return;
    const currentProject = settingsDoc.data().name;

    const snapshot = await getDocs(collection(db, "facades"));
    snapshot.forEach((docItem) => {
      const data = docItem.data();
      if (data.projectId !== currentProject) return;
      const option = document.createElement("option");
      option.value = data.name;
      option.textContent = data.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading facades:", error);
  }
}

/* =========================
   LOAD EMPLOYEES
========================= */
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
  } catch (error) {
    console.error("Employee load error:", error);
  }
}

/* =========================
   SAVE DATA / EDIT
========================= */
window.saveData = async function () {
  const facadeId = document.getElementById("elementId").value;
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

  try {
    // Current project
    const settingsDoc = await getDoc(doc(db, "settings", "currentProject"));
    const currentProject = settingsDoc.data()?.name;

    const dataObj = {
      projectId: currentProject,
      facadeId,
      stage,
      employee,
      note,
      timestamp: new Date().toLocaleString(),
      photos: [
        photo1 ? photo1.name : null,
        photo2 ? photo2.name : null,
        photo3 ? photo3.name : null
      ]
    };

    if (window.editDocId) {
      // Update existing document
      await updateDoc(doc(db, "assembly", window.editDocId), dataObj);
      alert("Record updated successfully");
      window.editDocId = null; // clear edit state
    } else {
      // Add new document
      await addDoc(collection(db, "assembly"), dataObj);
      alert("Record added successfully");
    }

    document.getElementById("success").innerText = "Saved successfully";
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data");
  }
};

/* =========================
   INIT
========================= */
async function init() {
  // Загружаем фасады текущего проекта
  await loadFacades();

  // Сразу устанавливаем первый фасад в списке как выбранный
  const facadeSelect = document.getElementById("elementId");
  if (facadeSelect && facadeSelect.options.length > 0) {
    facadeSelect.selectedIndex = 0;
  }

  // Загружаем элементы выбранного фасада
  await loadElements();

  // Загружаем список сотрудников
  await loadEmployees();

  // Обновляем Assembly View сразу
  loadViewer();
}

init();
