import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* FIREBASE */

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "facade-assembly",
  storageBucket: "facade-assembly.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

/* IMAGE PREVIEW */

const photoInput = document.getElementById("photo");

if (photoInput) {

  photoInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {

      const preview =
        document.getElementById("preview");

      preview.src = event.target.result;

      preview.style.display = "block";

    };

    reader.readAsDataURL(file);

  });

}

/* SAVE */

window.saveData = async function() {

  const elementId =
    document.getElementById("elementId").value;

  const stage =
    document.getElementById("stage").value;

  const employee =
    document.getElementById("employee").value;

  if (!elementId || !employee) {

    alert("Fill all fields");

    return;

  }

  try {

    await addDoc(
      collection(db, "assembly"),
      {

        elementId,
        stage,
        employee,

        time:
          new Date().toLocaleString()

      }
    );

    document.getElementById("success").innerText =
      "Saved successfully";

    loadViewer();

  }

  catch (error) {

    console.error(error);

    alert("Error saving data");

  }

};

/* VIEWER */

async function loadViewer() {

  const table =
    document.getElementById("viewerTable");

  if (!table) return;

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
