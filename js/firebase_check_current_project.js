// firebase_check_current_project.js
import { db } from './firebase.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export async function ensureCurrentProject() {
    const docRef = doc(db, 'settings', 'currentProject');
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
        console.log('currentProject не найден. Создаём новый...');
        await setDoc(docRef, { name: 'Project1' });  // можно подставить актуальное имя проекта
        console.log('currentProject создан успешно.');
    } else {
        console.log('currentProject уже существует:', snapshot.data().name);
    }
}
