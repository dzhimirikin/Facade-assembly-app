/* =====================================================
   LOAD FILTERED DATA
===================================================== */

const data = JSON.parse(

  sessionStorage.getItem(
    "filteredRows"
  ) || "[]"

);

/* =====================================================
   ELEMENTS
===================================================== */

const container =
  document.getElementById(
    "detailContainer"
  );

/* =====================================================
   FORMAT TIME
===================================================== */

function formatTimestamp(timestamp) {

  try {

    /* FIRESTORE OBJECT */

    if (timestamp?.seconds) {

      return new Date(
        timestamp.seconds * 1000
      ).toLocaleString();

    }

    /* NORMAL DATE */

    if (timestamp) {

      return new Date(
        timestamp
      ).toLocaleString();

    }

    return "";

  }

  catch {

    return "";

  }

}

/* =====================================================
   RENDER PDF
===================================================== */

function renderPdf() {

  if (!data.length) {

    container.innerHTML = `

      <div class="print-sheet">

        <h1>
          No filtered data
        </h1>

      </div>

    `;

    return;

  }

  container.innerHTML = `

    <div class="print-toolbar">

      <button onclick="window.print()">
        Print / PDF
      </button>

    </div>

    <div class="print-sheet">

      <h1>
        Assembly Report
      </h1>

      ${data.map((item) => {

        const tsStr =
          formatTimestamp(
            item.timestamp
          );

        const photos =
          (item.photos || [])
            .filter(p => p);

        return `

          <div class="operation-block">

            <h2>
              ${item.stage || ""}
            </h2>

            <table class="detail-table">

              <tr>
                <td>Facade</td>
                <td>${item.facadeId || ""}</td>
              </tr>

              <tr>
                <td>Element</td>
                <td>${item.subElementId || ""}</td>
              </tr>

              <tr>
                <td>Employee</td>
                <td>${item.employee || ""}</td>
              </tr>

              <tr>
                <td>Time</td>
                <td>${tsStr}</td>
              </tr>

              <tr>
                <td>Note</td>
                <td>${item.note || ""}</td>
              </tr>

            </table>

            <div class="photo-section">

              ${photos.map((photo) => `

                <div class="photo-card">

                  ${

                    typeof photo === "string"

                      ? `

                        <div class="old-photo">

                          ${photo}

                        </div>

                      `

                      : `

                        <img
                          src="${photo.data}"
                          class="pdf-photo"
                        />

                      `

                  }

                </div>

              `).join("")}

            </div>

          </div>

        `;

      }).join("")}

    </div>

  `;

}

/* =====================================================
   INIT
===================================================== */

window.addEventListener(

  "DOMContentLoaded",

  renderPdf

);
