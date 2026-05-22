import { initializeApp }
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore }
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain:
    "facade-assembly.firebaseapp.com",

  projectId:
    "facade-assembly",

  storageBucket:
    "facade-assembly.firebasestorage.app",

  messagingSenderId:
    "676074892011",

  appId:
    "YOUR_APP_ID"

};

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

export { db };
