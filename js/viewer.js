/* =====================================================
   VIEWER FOR PDF / PRINT
===================================================== */

const data = JSON.parse(sessionStorage.getItem("filteredRows") || "[]");

const container = document.getElementById("detailContainer");

/* =====================================================
   RENDER REPORT
===================================================== */

function renderViewer(viewBy = "facade") {
  if (!data.length) {
    container.innerHTML = `<div class="print-sheet"><h1>No filtered data</h1></div>`;
    return;
  }

  // Группировка данных
  let grouped;
  if (viewBy === "facade") {
    grouped = data.reduce((acc, item) => {
      const key = item.facadeId || "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  } else if (viewBy === "element") {
    grouped = data.reduce((acc, item) => {
      const key = `${item.facadeId || "Unknown"}_${item.subElementId || "Unknown"}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  container.innerHTML = `
    <div class="print-toolbar">
      <button onclick="window.print()">Print / PDF</button>
    </div>
    ${Object.keys(grouped).map(groupKey => {
      const items = grouped[groupKey];
      // Название фасада или элемента
      const headerTitle = viewBy === "facade"
        ? `ASSEMBLY REPORT<br>${groupKey}`
        : `ASSEMBLY REPORT<br>${items[0].subElementId || groupKey} of facade ${items[0].facadeId || ""}`;

      return `
        <div class="print-sheet">
          <h1>${headerTitle}</h1>
          ${items.map(item => {
            const photos = (item.photos || []).filter(p => p);
            let tsStr = "";
            try {
              const ts = item.timestamp?.seconds
                ? new Date(item.timestamp.seconds * 1000)
                : new Date(item.timestamp || "");
              tsStr = ts ? ts.toLocaleString() : "";
            } catch {
              tsStr = item.timestamp || "";
            }

            return `
              <table class="detail-table">
                <tr><td>Operation</td><td>${item.stage || ""}</td></tr>
                <tr><td>Employee</td><td>${item.employee || ""}</td></tr>
                <tr><td>Time</td><td>${tsStr}</td></tr>
                <tr><td>Note</td><td>${item.note || ""}</td></tr>
              </table>
              <div class="photo-section">
                ${photos.map(photo => `
                  <div class="photo-card">
                    ${typeof photo === "string"
                      ? `<div class="old-photo">${photo}</div>`
                      : `<img src="${photo.data}" class="pdf-photo" />`}
                  </div>
                `).join("")}
              </div>
              <hr />
            `;
          }).join("")}
        </div>
      `;
    }).join("")}
  `;
}

/* =====================================================
   BUTTONS / INIT
===================================================== */

// Создаем кнопки для выбора режима
const toolbar = document.createElement("div");
toolbar.className = "print-toolbar";
toolbar.innerHTML = `
  <button id="viewFacadeBtn">Preview Facade</button>
  <button id="viewElementBtn">Preview Element</button>
`;
container.parentNode.insertBefore(toolbar, container);

document.getElementById("viewFacadeBtn").addEventListener("click", () => renderViewer("facade"));
document.getElementById("viewElementBtn").addEventListener("click", () => renderViewer("element"));

// Автозагрузка по фасаду
window.addEventListener("DOMContentLoaded", () => renderViewer("facade"));
