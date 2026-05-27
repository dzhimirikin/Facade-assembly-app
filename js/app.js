// app.js — доработка интерфейса: индикатор загрузки, уведомления о пустых фасадах/элементах, проверка размера фото

import { db } from './firebase.js';
import { collection, addDoc, getDocs, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

console.log('APP START');

// ================== Индикатор загрузки ==================
const loader = document.createElement('div');
loader.id = 'loader';
loader.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:2em;color:#fff;z-index:1000;display:none;';
loader.innerText = 'Загрузка...';
document.body.appendChild(loader);
function showLoader() { loader.style.display = 'flex'; }
function hideLoader() { loader.style.display = 'none'; }

// ================== IMAGE -> BASE64 ==================
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 700;
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img,0,0,width,height);
      resolve({ name: file.name, data: canvas.toDataURL('image/jpeg',0.35) });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ================== LOAD FACADES ==================
async function loadFacades() {
  const select = document.getElementById('elementId');
  if (!select) return;
  select.innerHTML = '';

  showLoader();
  let currentProject;
  try {
    const settingsSnapshot = await getDoc(doc(db,'settings','currentProject'));
    if (!settingsSnapshot.exists()) {
      console.log('Current project not found');
      hideLoader();
      return;
    }
    currentProject = settingsSnapshot.data().name;
    console.log('Current project:', currentProject);

    const snapshot = await getDocs(collection(db,'facades'));
    let hasFacades = false;
    snapshot.forEach(docItem => {
      const data = docItem.data();
      if (data.projectId !== currentProject) return;
      hasFacades = true;
      const option = document.createElement('option');
      option.value = data.name;
      option.textContent = data.name;
      select.appendChild(option);
    });
    if (!hasFacades) alert('Нет фасадов для текущего проекта');
  } catch (err) {
    console.error('Error loading facades:',err);
  } finally {
    hideLoader();
  }
}

// ================== LOAD ELEMENTS ==================
async function loadElements() {
  const facadeSelect = document.getElementById('elementId');
  const elementSelect = document.getElementById('subElementId');
  if (!facadeSelect || !elementSelect) return;
  elementSelect.innerHTML = '';

  showLoader();
  let currentProject;
  try {
    const settingsSnapshot = await getDoc(doc(db,'settings','currentProject'));
    currentProject = settingsSnapshot.data()?.name;

    const currentFacade = facadeSelect.value;
    const snapshot = await getDocs(collection(db,'elements'));
    let hasElements = false;
    snapshot.forEach(docItem => {
      const data = docItem.data();
      if (data.projectId !== currentProject || data.facadeId !== currentFacade) return;
      hasElements = true;
      const option = document.createElement('option');
      option.value = data.name;
      option.textContent = data.name;
      elementSelect.appendChild(option);
    });
    if (!hasElements) alert('Нет элементов для выбранного фасада');
  } catch(err) {
    console.error('Error loading elements:',err);
  } finally {
    hideLoader();
  }
}

// ================== SAVE DATA ==================
window.saveData = async function(){
  const facadeId = document.getElementById('elementId').value;
  const subElementId = document.getElementById('subElementId').value;
  const stage = document.getElementById('stage').value;
  const employee = document.getElementById('employee').value;
  const note = document.getElementById('note').value;
  const photosInputs = ['photo1','photo2','photo3'].map(id=>document.getElementById(id).files[0]);

  if (!facadeId || !employee){ alert('Заполните обязательные поля'); return; }

  const maxFileSize = 5*1024*1024; // 5MB
  for(const file of photosInputs){
    if(file && file.size>maxFileSize){ alert('Фото превышает 5MB'); return; }
  }

  showLoader();
  let currentProject;
  try {
    const settingsDoc = await getDoc(doc(db,'settings','currentProject'));
    currentProject = settingsDoc.data()?.name;

    const photos=[];
    for(const file of photosInputs){ if(file) photos.push(await fileToBase64(file)); }

    await addDoc(collection(db,'assembly'),{
      projectId: currentProject,
      facadeId, subElementId, stage, employee, note,
      timestamp: new Date(), photos
    });

    const success = document.getElementById('success');
    if(success) success.innerText='Данные успешно сохранены';

    document.getElementById('note').value='';
    photosInputs.forEach((_,i)=>document.getElementById('photo'+(i+1)).value='');
    console.log('Record saved');
  } catch(err){
    console.error('Error saving data:',err);
    alert('Ошибка при сохранении данных');
  } finally{
    hideLoader();
  }
};

// ================== INIT ==================
async function init(){
  await loadFacades();
  await loadElements();
}

init();

// ================== EVENTS ==================
document.getElementById('elementId')?.addEventListener('change', loadElements);
