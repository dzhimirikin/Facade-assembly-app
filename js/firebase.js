import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "ВАШ_API_KEY",

  authDomain: "ВАШ_AUTH_DOMAIN",

  projectId: "ВАШ_PROJECT_ID",

  storageBucket: "ВАШ_STORAGE_BUCKET",

  messagingSenderId: "ВАШ_MESSAGING_SENDER_ID",

  appId: "ВАШ_APP_ID"

};

const app =
  initializeApp(
    firebaseConfig
  );

export const db =
  getFirestore(app);
