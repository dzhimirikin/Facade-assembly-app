import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
   ELEMENT VIEWER
===================================================== */

const table = document.getElementById("viewerTable");
const facadeSelect = document.getElementById("elementId");
const elementSelect = document.getElementById("subElementId");

let unsubscribe = null;

/* =====================================================
   LOAD VIEWER
===================================================== */

function loadViewer() {
  if (!table) return;

  const currentFacade = facadeSelect?.value || "";
  const currentElement = elementSelect?.value || "";

  // Убираем старый слушатель
  if (unsubscribe) unsubscribe();

  // Запрос к коллекции assembly
  const assemblyQuery = query(
    collection(db, "assembly"),
    orderBy("timestamp", "desc")
  );

  // Подключаем real-time слушатель
  unsubscribe = onSnapshot(
    assemblyQuery,
    (snapshot) => {
      table.innerHTML = "";

      snapshot.forEach((docItem) => {
        const data = docItem.data();

        // Фильтры по фасаду и элементу
        if (currentFacade && data.facadeId !== currentFacade) return;
        if (currentElement && data.subElementId !== currentElement) return;

        // Создаем строку
        const row = document.createElement("tr");
        row.classList.add("assembly-row");
        row.dataset.docId = docItem.id;

        // Количество фото
        const photoCount = (data.photos || []).filter(p => p).length;

        // Форматируем timestamp
        const ts = data.timestamp?.toDate?.() || new Date(data.timestamp);
        const tsStr = ts.toLocaleString();

        // Заполняем строку
        row.innerHTML = `
          <td>${data.facadeId || ""}</td>
          <td>${data.subElementId || ""}</td>
          <td>${data.stage || ""}</td>
          <td>${data.employee || ""}</td>
          <td>${data.note || ""}</td>
          <td>${photoCount}</td>
          <td>${tsStr}</td>
        `;

        table.appendChild(row);
      });
    },
    (error) => {
      console.error("Viewer error:", error);
    }
  );
}

/* =====================================================
   EVENTS
===================================================== */

// Фильтры
facadeSelect?.addEventListener("change", () => {
  setTimeout(loadViewer, 200);
});

elementSelect?.addEventListener("change", loadViewer);

/* =====================================================
   SEARCH
===================================================== */

window.searchData = function () {
  const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const rows = table.querySelectorAll("tr");

  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(search) ? "" : "none";
  });
};

/* =====================================================
   INIT
===================================================== */

window.addEventListener("DOMContentLoaded", loadViewer);
