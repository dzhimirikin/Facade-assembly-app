import { db } from "./firebase.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("viewerTable");
const facadeSelect = document.getElementById("elementId");
const elementSelect = document.getElementById("subElementId");
let unsubscribe = null;
let selectedRow = null;

function loadViewer() {
  if (!table) return;

  const currentFacade = facadeSelect?.value;
  const currentElement = elementSelect?.value;

  if (unsubscribe) unsubscribe();

  const assemblyQuery = query(collection(db, "assembly"), orderBy("timestamp", "desc"));

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
        <td>${data.photos?.filter(p => p).length || 0}</td>
        <td>${data.timestamp || ""}</td>
      `;

      // Click select
      row.addEventListener("click", () => {
        if (selectedRow) selectedRow.classList.remove("selected");
        selectedRow = row;
        row.classList.add("selected");
      });

      // Double-click edit
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
  }, error => console.error("Viewer realtime error:", error));
}

facadeSelect?.addEventListener("change", () => {
  loadElements(); // обновляем список элементов
  setTimeout(loadViewer, 200);
});
elementSelect?.addEventListener("change", loadViewer);

window.searchData = function() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  table.querySelectorAll("tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(search) ? "" : "none";
  });
};

setTimeout(loadViewer, 500);
