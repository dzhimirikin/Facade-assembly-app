const params =

          tsStr =
            ts.toLocaleString();

        }

        catch {

          tsStr =
            item.timestamp || "";

        }

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

              ${photos.map(photo => `

                <div class="photo-card">
                  ${photo}
                </div>

              `).join("")}

            </div>

          </div>

        `;

      }).join("")}

    </div>

  `;

}

window.addEventListener(
  "DOMContentLoaded",
  renderPdf
);
