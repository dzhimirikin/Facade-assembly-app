import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("viewerTable");
const facadeSelect = document.getElementById("elementId");
const elementSelect = document.getElementById("subElementId");

let unsubscribe = null;

function loadViewer() {
  if (!table) return;

  const currentFacade = facadeSelect?.value;
  const currentElement = elementSelect?.value;

  if (unsubscribe) unsubscribe();

  const assemblyQuery = query(
    collection(db, "assembly"),
    orderBy("timestamp", "desc")
  );

  unsubscribe = onSnapshot(
    assemblyQuery,
    (snapshot) => {
      table.innerHTML = "";
      snapshot.forEach((docItem) => {
        const data = docItem.data();
        if (data.facadeId !== currentFacade) return;
        if (data.subElementId !== currentElement) return;

        const row = document.createElement("tr");
        row.classList.add("assembly-row");
        row.innerHTML = `
          <td>${data.facadeId || ""}</td>
          <td>${data.subElementId || ""}</td>
          <td>${data.stage || ""}</td>
          <td>${data.employee || ""}</td>
          <td>${data.note || ""}</td>
          <td>${data.timestamp || ""}</td>
        `;
        row.addEventListener("dblclick", () => editRow(docItem.id, data));
        table.appendChild(row);
      });
    },
    (error) => console.error("Viewer error:", error)
  );
}

/* =========================
   EDIT ROW
========================= */
function editRow(docId, data) {
  // Подставляем данные в панель ввода
  document.getElementById("elementId").value = data.facadeId;
  document.getElementById("subElementId").value = data.subElementId;
  document.getElementById("stage").value = data.stage;
  document.getElementById("employee").value = data.employee;
  document.getElementById("note").value = data.note || "";

  // Для файлов оставляем пустыми (пользователь может добавить новые)
  document.getElementById("photo1").value = "";
  document.getElementById("photo2").value = "";
  document.getElementById("photo3").value = "";

  // Указываем редактируемый документ
  window.editDocId = docId;
}

/* =========================
   EVENTS
========================= */
facadeSelect?.addEventListener("change", loadViewer);
elementSelect?.addEventListener("change", loadViewer);

window.searchData = function () {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const rows = table.querySelectorAll("tr");
  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(search) ? "" : "none";
  });
};

/* =========================
   INIT
========================= */
loadViewer();
