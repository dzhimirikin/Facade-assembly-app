import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* FIREBASE */

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",
  authDomain: "facade-assembly.firebaseapp.com",
  projectId: "facade-assembly",
  storageBucket: "facade-assembly.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

/* LOAD ALL */

async function loadViewer() {

  const table =
    document.getElementById("viewerTable");

  table.innerHTML = "";

  const snapshot =
    await getDocs(
      collection(db, "assembly")
    );

  snapshot.forEach((doc) => {

    const data = doc.data();

    table.innerHTML += `

      <tr>

        <td>${data.elementId}</td>
        <td>${data.stage}</td>
        <td>${data.employee}</td>
        <td>${data.time}</td>

      </tr>

    `;

  });

}

loadViewer();

/* SEARCH */

window.searchElement = async function() {

  const search =
    document.getElementById("searchInput").value;

  const table =
    document.getElementById("viewerTable");

  table.innerHTML = "";

  const q = query(
    collection(db, "assembly"),
    where("elementId", "==", search)
  );

  const snapshot =
    await getDocs(q);

  snapshot.forEach((doc) => {

    const data = doc.data();

    table.innerHTML += `

      <tr>

        <td>${data.elementId}</td>
        <td>${data.stage}</td>
        <td>${data.employee}</td>
        <td>${data.time}</td>

      </tr>

    `;

  });

};
