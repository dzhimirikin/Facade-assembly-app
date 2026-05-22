import { db } from "./firebase.js";

import {

  collection,

  addDoc

} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* SAVE DATA */

window.saveData = async function () {

  const elementId =
    document.getElementById("elementId").value;

  const stage =
    document.getElementById("stage").value;

  const employee =
    document.getElementById("employee").value;

  const note =
    document.getElementById("note").value;

  const photo1 =
    document.getElementById("photo1").files[0];

  const photo2 =
    document.getElementById("photo2").files[0];

  const photo3 =
    document.getElementById("photo3").files[0];

  if (!elementId || !employee) {

    alert("Fill required fields");

    return;
  }

  try {

    await addDoc(

      collection(db, "assembly"),

      {

        facadeId: elementId,

        stage,

        employee,

        note,

        timestamp:
          new Date().toLocaleString(),

        photos: [

          photo1
            ? photo1.name
            : null,

          photo2
            ? photo2.name
            : null,

          photo3
            ? photo3.name
            : null

        ]

      }

    );

    document.getElementById("success").innerText =
      "Data saved successfully";

  }

  catch (error) {

    console.error(error);

    alert("Error saving data");
  }

};

/* RESIZER */

const resizer =
  document.getElementById("resizer");

const leftPanel =
  document.querySelector(".input-panel");

let isResizing = false;

resizer.addEventListener("mousedown", () => {

  isResizing = true;

  document.body.style.cursor =
    "col-resize";
});

document.addEventListener("mousemove", (e) => {

  if (!isResizing) return;

  leftPanel.style.width =
    e.clientX + "px";
});

document.addEventListener("mouseup", () => {

  isResizing = false;

  document.body.style.cursor =
    "default";
});
