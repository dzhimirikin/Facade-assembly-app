import { db }
from "./firebase.js";

import {

  collection,
  addDoc,
  getDocs

} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* LOAD LIST */

async function loadFacades() {

  const container =
    document.getElementById("facadeList");

  container.innerHTML = "";

  const snapshot =
    await getDocs(
      collection(db, "facades")
    );

  snapshot.forEach((doc) => {

    const data =
      doc.data();

    container.innerHTML += `

      <div class="facade-item">

        ${data.name}

      </div>

    `;

  });

}

loadFacades();

/* ADD */

window.addFacade = async function () {

  const value =
    document.getElementById("newFacade").value;

  if (!value) return;

  await addDoc(

    collection(db, "facades"),

    {
      name: value
    }

  );

  document.getElementById("newFacade").value = "";

  loadFacades();

};

/* IMPORT TXT */

window.importTxt = async function () {

  const file =
    document.getElementById("txtFile").files[0];

  if (!file) return;

  const text =
    await file.text();

  const lines =
    text.split("\n");

  for (const line of lines) {

    const value =
      line.trim();

    if (!value) continue;

    await addDoc(

      collection(db, "facades"),

      {
        name: value
      }

    );

  }

  alert("Import complete");

  loadFacades();

};
