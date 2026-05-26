import { db } from "./firebase.js";

      <tr>
        <td>Facade</td>
        <td>${data.facadeId}</td>
      </tr>

      <tr>
        <td>Element</td>
        <td>${data.subElementId}</td>
      </tr>

      <tr>
        <td>Operation</td>
        <td>${data.stage}</td>
      </tr>

    </table>

    <br>

    <label>Comment</label>

    <textarea
      id="editNote"
      rows="6"
    >${data.note || ""}</textarea>

    <br><br>

    <label>Add Photo</label>

    <input
      type="file"
      id="editPhoto"
    >

    <br><br>

    <button id="saveBtn">
      OK
    </button>

  `;

  document
    .getElementById("saveBtn")
    .addEventListener(
      "click",
      saveRecord
    );

}

async function saveRecord() {

  const note =
    document.getElementById(
      "editNote"
    ).value;

  await updateDoc(

    doc(db, "assembly", id),

    {
      note,
      timestamp: new Date()
    }

  );

  alert("Saved");

}

window.addEventListener(
  "DOMContentLoaded",
  loadRecord
);
