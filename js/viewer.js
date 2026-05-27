/* =====================================================
   ELEMENTS
===================================================== */
const table = document.getElementById("viewerTable");
const searchInput = document.getElementById("searchInput");

// Создаем контейнер для новых кнопок
const toolbarContainer = document.createElement("div");
toolbarContainer.className = "viewer-toolbar";
table.parentNode.parentNode.insertBefore(toolbarContainer, table.parentNode);

/* =====================================================
   DATA
===================================================== */
let allRows = [];
let filteredRows = [];
let unsubscribe = null;

/* =====================================================
   LOAD VIEWER
===================================================== */
function loadViewer() {
  if (unsubscribe) unsubscribe();

  const assemblyQuery = query(
    collection(db, "assembly"),
    orderBy("timestamp", "asc")
  );

  unsubscribe = onSnapshot(assemblyQuery, (snapshot) => {
    allRows = [];
    snapshot.forEach((docItem) => {
      allRows.push({ id: docItem.id, ...docItem.data() });
    });

    renderTable(allRows);
    updateButtons();
  });
}

/* =====================================================
   RENDER TABLE
===================================================== */
function renderTable(dataArray) {
  table.innerHTML = "";

  dataArray.forEach((data) => {
    const row = document.createElement("tr");
    const photoCount = (data.photos || []).filter(p => p).length;

    let tsStr = "";
    try {
      const ts = data.timestamp?.toDate?.() || new Date(data.timestamp);
      tsStr = ts.toLocaleString();
    } catch {
      tsStr = data.timestamp || "";
    }

    row.innerHTML = `
      <td>${data.facadeId || ""}</td>
      <td>${data.subElementId || ""}</td>
      <td>${data.stage || ""}</td>
      <td>${data.employee || ""}</td>
      <td>${data.note || ""}</td>
      <td>${photoCount}</td>
      <td>${tsStr}</td>
    `;

    row.addEventListener("dblclick", () => {
      window.open(`editor.html?id=${data.id}`, "_blank");
    });

    table.appendChild(row);
  });
}

/* =====================================================
   FILTER
===================================================== */
window.searchData = function () {
  const q = searchInput.value.toLowerCase().trim();

  if (!q) {
    filteredRows = [...allRows];
  } else {
    filteredRows = allRows.filter(item => {
      const text = `
        ${item.facadeId || ""}
        ${item.subElementId || ""}
        ${item.stage || ""}
        ${item.employee || ""}
        ${item.note || ""}
      `.toLowerCase();
      return text.includes(q);
    });
  }

  renderTable(filteredRows);
  updateButtons();
};

/* =====================================================
   UPDATE BUTTONS
===================================================== */
function updateButtons() {
  toolbarContainer.innerHTML = "";

  if (!filteredRows.length) return;

  const facadeBtn = document.createElement("button");
  facadeBtn.textContent = "Preview Facade";
  facadeBtn.className = "preview-btn";
  facadeBtn.onclick = () => openDetail("facade");

  const elementBtn = document.createElement("button");
  elementBtn.textContent = "Preview Element";
  elementBtn.className = "preview-btn";
  elementBtn.onclick = () => openDetail("element");

  toolbarContainer.appendChild(facadeBtn);
  toolbarContainer.appendChild(elementBtn);
}

/* =====================================================
   OPEN DETAIL
===================================================== */
function openDetail(mode) {
  sessionStorage.setItem("filteredRows", JSON.stringify(filteredRows));
  sessionStorage.setItem("reportMode", mode); // "facade" или "element"
  window.open("viewer_detail.html", "_blank");
}

/* =====================================================
   INIT
===================================================== */
window.addEventListener("DOMContentLoaded", loadViewer);
