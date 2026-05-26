import { db } from "./firebase.js";
  const q =
    searchInput.value
      .toLowerCase()
      .trim();

  if (!q) {

    filteredRows = [...allRows];

  }

  else {

    filteredRows = allRows.filter((item) => {

      const text = `

        ${item.facadeId || ""}
        ${item.subElementId || ""}
        ${item.stage || ""}
        ${item.employee || ""}
        ${item.note || ""}

      `
        .toLowerCase();

      return text.includes(q);

    });

  }

  renderTable(filteredRows);

  viewPdfBtn.classList.remove(
    "disabled"
  );

};

viewPdfBtn?.addEventListener(

  "click",

  () => {

    if (
      viewPdfBtn.classList.contains(
        "disabled"
      )
    ) return;

    const encoded = encodeURIComponent(
      JSON.stringify(filteredRows)
    );

    window.open(
      `viewer_detail.html?data=${encoded}`,
      "_blank"
    );

  }

);

window.addEventListener(
  "DOMContentLoaded",
  loadViewer
);
