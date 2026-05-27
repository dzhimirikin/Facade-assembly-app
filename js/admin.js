import { db } from './firebase.js';
import { collection, getDocs, doc, deleteDoc } from '[https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js](https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js)';

/* =====================================================
PROJECTS FUNCTIONS
===================================================== */
// Пример: addProject, setCurrentProject и функции импорта TXT
async function addProject() { /* ваш существующий код */ }
async function setCurrentProject() { /* ваш существующий код */ }
async function importTxt() { /* ваш существующий код */ }

/* =====================================================
FACADE FUNCTIONS
===================================================== */
async function addFacade() { /* ваш существующий код */ }
async function loadFacades() { /* ваш существующий код */ }
async function loadFacadeSelect() { /* ваш существующий код */ }

/* =====================================================
ELEMENT FUNCTIONS
===================================================== */
async function addElement() { /* ваш существующий код */ }
async function importElementsTxt() { /* ваш существующий код */ }
async function loadElementsList() { /* ваш существующий код */ }

/* =====================================================
EMPLOYEES FUNCTIONS
===================================================== */
async function addEmployee() { /* ваш существующий код */ }
async function loadEmployees() { /* ваш существующий код */ }

/* =====================================================
CLEAR DATABASE
===================================================== */
const clearDatabaseBtn = document.getElementById('clearDatabaseBtn');

clearDatabaseBtn.addEventListener('click', async () => {
const confirmed = confirm('⚠️ This will permanently delete all data. Are you sure?');
if (!confirmed) return;

const collections = ['projects', 'facades', 'elements', 'employees', 'assembly', 'settings'];

try {
for (const colName of collections) {
const snapshot = await getDocs(collection(db, colName));
const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, colName, docSnap.id)));
await Promise.all(deletePromises);
}

```
alert('Database cleared successfully!');

// Обновляем интерфейс после очистки
loadProjects?.();
loadFacades?.();
loadFacadeSelect?.();
loadElementsList?.();
loadEmployees?.();
```

} catch (err) {
console.error('Error clearing database:', err);
alert('Error clearing database: ' + err.message);
}
});
