// GLOBALS
let selectedRow = null;
window.editDocId = null;

// Function to load Assembly Viewer
function loadViewer() {
  const table = document.getElementById("viewerTable");
  const facadeSelect = document.getElementById("elementId");
  const elementSelect = document.getElementById("subElementId");

  if (!table) return;

  const currentFacade = facadeSelect?.value;
  const currentElement = elementSelect?.value;

  // Firestore query
  const assemblyQuery = query(
    collection(db, "assembly"),
    orderBy("timestamp", "desc")
  );

  onSnapshot(assemblyQuery, (snapshot) => {
    table.innerHTML = "";

    snapshot.forEach((docItem) => {
      const data = docItem.data();

      // Filter current facade and element
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
        <td>${data.timestamp || ""}</td>
      `;

      // Single click -> select row
      row.addEventListener("click", () => {
        if (selectedRow) selectedRow.classList.remove("selected");
        selectedRow = row;
        row.classList.add("selected");
      });

      // Double click -> load for editing
      row.addEventListener("dblclick", () => {
        if (selectedRow) selectedRow.classList.remove("selected");
        selectedRow = row;
        row.classList.add("selected");

        // Load data into input panel
        document.getElementById("elementId").value = data.facadeId;
        document.getElementById("subElementId").value = data.subElementId;
        document.getElementById("stage").value = data.stage;
        document.getElementById("employee").value = data.employee;
        document.getElementById("note").value = data.note || "";

        document.getElementById("photo1").value = "";
        document.getElementById("photo2").value = "";
        document.getElementById("photo3").value = "";

        // Keep current docId for saving
        window.editDocId = docItem.id;
      });

      table.appendChild(row);
    });
  });
}

// Attach listeners
document.getElementById("elementId")?.addEventListener("change", loadViewer);
document.getElementById("subElementId")?.addEventListener("change", loadViewer);

// Initial load
setTimeout(loadViewer, 500);
