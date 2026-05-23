import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("viewerTable");
const facadeSelect = document.getElementById("elementId");
const elementSelect = document.getElementById("subElementId");

let unsubscribe = null;
let selectedRow = null;
window.editDocId = null;

/* =========================
   LOAD VIEWER
========================= */
function loadViewer() {
  if (!table) return;

  const currentFacade = facadeSelect?.value;
  const currentElement = elementSelect?.value;

  if (unsubscribe) unsubscribe();

  const assemblyQuery = query(
    collection(db, "assembly"),
    orderBy("timestamp", "desc")
  );

  unsubscribe = onSnapshot(assemblyQuery, snapshot => {
    table.innerHTML = "";

    snapshot.forEach(docItem => {
      const data = docItem.data();

      if (data.facadeId !== currentFacade) return;
      if (data.subElementId !== currentElement) return;

      const row = document.createElement("tr");
      row.dataset.docId = docItem.id;
      row.classList.add("assembly-row");

      row.innerHTML = `
        <td>${data.facadeId || ""}</td>
        <td>${data.subElementId || ""}</td>
        <td>${data.stage || ""}</td>
        <td>${data.employee || ""}</td>
        <td>${data.note || ""}</td>
        <td>${data.photos?.length || 0}</td>
        <td>${data.timestamp || ""}</td>
      `;

      // Click -> select
      row.addEventListener("click", () => {
        if (selectedRow) selectedRow.classList.remove("selected");
        selectedRow = row;
        row.classList.add("selected");
      });

      // Double-click -> edit
      row.addEventListener("dblclick", () => {
        if (selectedRow) selectedRow.classList.remove("selected");
        selectedRow = row;
        row.classList.add("selected");

        document.getElementById("elementId").value = data.facadeId;
        document.getElementById("subElementId").value = data.subElementId;
        document.getElementById("stage").value = data.stage;
        document.getElementById("employee").value = data.employee;
        document.getElementById("note").value = data.note || "";

        document.getElementById("photo1").value = "";
        document.getElementById("photo2").value = "";
        document.getElementById("photo3").value = "";

        window.editDocId = docItem.id;
      });

      table.appendChild(row);
    });
  }, error => {
    console.error("Viewer realtime error:", error);
  });
}

/* =========================
   SAVE DATA (EDIT)
========================= */
window.saveData = async function () {
  const facadeId = document.getElementById("elementId").value;
  const elementId = document.getElementById("subElementId").value;
  const stage = document.getElementById("stage").value;
  const employee = document.getElementById("employee").value;
  const note = document.getElementById("note").value;

  if (!facadeId || !employee) {
    alert("Fill required fields");
    return;
  }

  try {
    if (window.editDocId) {
      const docRef = doc(db, "assembly", window.editDocId);

      await updateDoc(docRef, {
        facadeId,
        subElementId: elementId,
        stage,
        employee,
        note,
        timestamp: serverTimestamp()
      });

      window.editDocId = null;
      alert("Entry updated successfully!");
    } else {
      // обычное сохранение, если это новая запись
    }
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data");
  }
};

/* =========================
   EVENTS
========================= */
facadeSelect?.addEventListener("change", () => setTimeout(loadViewer, 200));
elementSelect?.addEventListener("change", loadViewer);

/* =========================
   SEARCH
========================= */
window.searchData = function () {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const rows = table.querySelectorAll("tr");
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(search) ? "" : "none";
  });
};

/* =========================
   INIT
========================= */
setTimeout(loadViewer, 500);
