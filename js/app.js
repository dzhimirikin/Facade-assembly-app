import { db }
from "./firebase.js";

import {

  collection,
  addDoc,
  getDocs,
  doc,
  getDoc

} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   LOAD FACADES
========================= */

async function loadFacades() {

  const select =
    document.getElementById("elementId");

  if (!select) return;

  select.innerHTML = "";

  /* CURRENT PROJECT */

  const settingsDoc =
    await getDoc(
      doc(db, "settings", "currentProject")
    );

  const currentProject =
    settingsDoc.data().name;

  /* FACADES */

  const snapshot =
    await getDocs(
      collection(db, "facades")
    );

  snapshot.forEach((docItem) => {

    const data =
      docItem.data();

    if (
      data.projectId !== currentProject
    ) return;

    const option =
      document.createElement("option");

    option.value =
      data.name;

    option.textContent =
      data.name;

    select.appendChild(option);

  });

}

  catch (error) {

    console.error(
      "Error loading facades:",
      error
    );
  }

}

loadFacades();

/* =========================
   SAVE DATA
========================= */

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

  if (!facadeId || !employee) {

    alert("Fill required fields");

    return;
  }

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
      "Data saved successfully";

  }

  catch (error) {

    console.error(error);

    alert("Error saving data");
  }

};
