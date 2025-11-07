// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// إعدادات Firebase الجديدة
const firebaseConfig = {
  apiKey: "AIzaSyDhhczCSH9yOHubM4CDPLJWBEwOec2Z2uY",
  authDomain: "lbhi-fd609.firebaseapp.com",
  projectId: "lbhi-fd609",
  storageBucket: "lbhi-fd609.firebasestorage.app",
  messagingSenderId: "1098419098489",
  appId: "1:1098419098489:web:58cb18ae9db214d6d715a8",
  measurementId: "G-RE086FFMNV"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// تصدير العناصر المهمة
export {
  auth,
  db,
  storage,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL
};
