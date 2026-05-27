/* =====================================================
   VIEWER.JS - UPDATED
===================================================== */

/* =====================================================
   LOAD FILTERED DATA
===================================================== */
const filteredData = JSON.parse(
  sessionStorage.getItem("filteredRows") || "[]"
);

/* =====================================================
   ELEMENTS
===================================================== */
const viewerTable = document.getElementById("viewerTable");

/* =====================================================
   RENDER VIEWER
===================================================== */

function renderViewer({ mode = "facade" } = {}) {
  if (!filteredData.length) {
    viewerTable.innerHTML = `
      <tr><td colspan="7" style="text-align:center;">No data available. Apply a filter first.</td></tr>
    `;
    return;
  }

  // Group data by facade or element
  const groups = {};
  filteredData.forEach(item => {
    const key = mode === "facade" ? item.facadeId : `${item.facadeId}.${item.subElementId}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  let html = "";

  Object.keys(groups).forEach(groupKey => {
    const groupItems = groups[groupKey];

    html += `
      <tr class="group-header">
        <td colspan="7" style="font-weight:600; background:#eee;">
          ${mode === "facade" ? "Facade" : "Element"}: ${groupKey}
        </td>
      </tr>
    `;

    groupItems.forEach(item => {
      const timestamp = item.timestamp?.seconds
        ? new Date(item.timestamp.seconds * 1000).toLocaleString()
        : item.timestamp || "";

      const photos = (item.photos || []).filter(p => p);

      html += `
        <tr>
          <td>${item.facadeId || ""}</td>
          <td>${item.subElementId || ""}</td>
          <td>${item.stage || ""}</td>
          <td>${item.employee || ""}</td>
          <td>${item.note || ""}</td>
          <td>
            ${photos
              .map(photo =>
                typeof photo === "string"
                  ? `<div class="old-photo">${photo}</div>`
                  : `<img src="${photo.data}" style="max-width:100px; max-height:80px; display:block; margin-bottom:4px;" />`
              ).join("")
            }
          </td>
          <td>${timestamp}</td>
        </tr>
      `;
    });
  });

  viewerTable.innerHTML = html;
}

/* =====================================================
   BUTTONS - Switch Mode
===================================================== */
const previewFacadeBtn = document.createElement("button");
previewFacadeBtn.textContent = "Preview Facade";
previewFacadeBtn.className = "menu-btn";
previewFacadeBtn.style.marginRight = "8px";
previewFacadeBtn.onclick = () => renderViewer({ mode: "facade" });

const previewElementBtn = document.createElement("button");
previewElementBtn.textContent = "Preview Element";
previewElementBtn.className = "menu-btn";
previewElementBtn.onclick = () => renderViewer({ mode: "element" });

// Add buttons dynamically after DOM loads
window.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu");
  if (menu) {
    menu.insertBefore(previewFacadeBtn, menu.children[1]);
    menu.insertBefore(previewElementBtn, menu.children[2]);
  }

  // Initial render in facade mode
  renderViewer({ mode: "facade" });
});
