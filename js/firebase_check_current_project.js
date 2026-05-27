// firebase_check_current_project.js — отдельный скрипт для проверки и создания currentProject
// Запуск один раз перед использованием app.js

import { db } from './firebase.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

async function ensureCurrentProject() {
  const docRef = doc(db, 'settings', 'currentProject');
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    console.log('currentProject не найден. Создаём новый...');
    await setDoc(docRef, { name: 'Проект1' }); // заменить на актуальное имя проекта
    console.log('currentProject создан успешно.');
  } else {
    console.log('currentProject уже существует:', snapshot.data().name);
  }
}

ensureCurrentProject().catch(err => console.error('Ошибка при проверке currentProject:', err));

