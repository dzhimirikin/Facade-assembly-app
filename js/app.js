import { db }
from "./firebase.js";

import {

  collection,
  addDoc,
  getDocs

} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* LOAD FACADES */

async function loadFacades() {

  const select =
    document.getElementById("elementId");

  select.innerHTML = "";

  const snapshot =
    await getDocs(
      collection(db, "facades")
    );

  snapshot.forEach((doc) => {

    const data =
      doc.data();

    const option =
      document.createElement("option");

    option.value =
      data.name;

    option.textContent =
      data.name;

    select.appendChild(option);

  });

}

loadFacades();

/* SAVE */

window.saveData = async function () {

  const facadeId =
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

  try {

    await addDoc(

      collection(db, "assembly"),

      {

        facadeId,

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
      "Saved successfully";

  }

  catch (error) {

    console.error(error);

    alert("Error saving data");
  }

};
