import { auth, db, storage } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// عناصر الصفحة
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const locInput = document.getElementById("location");
const priceInput = document.getElementById("price");
const imgInput = document.getElementById("imageUpload");
const preview = document.getElementById("previewImage");
const form = document.getElementById("editForm");
const phoneInput = document.getElementById("phone");

// 🔍 استخراج ID الإعلان من الرابط
const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");

if (!listingId) {
  alert("❌ لم يتم العثور على الإعلان.");
  window.location.href = "/profile.html";
}

// ✅ تحميل البيانات القديمة
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("⚠️ يجب تسجيل الدخول أولاً.");
    window.location.href = "/login.html";
    return;
  }

  const docRef = doc(db, "listings", listingId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    alert("🚫 لم يتم العثور على الإعلان.");
    window.location.href = "/profile.html";
    return;
  }

  const data = docSnap.data();
  if (data.userId !== user.uid) {
    alert("🚫 لا يمكنك تعديل إعلان ليس لك.");
    window.location.href = "/profile.html";
    return;
  }

  // ملء الحقول بالبيانات القديمة
  titleInput.value = data.title;
  descInput.value = data.description;
  locInput.value = data.location;
  priceInput.value = data.price;
  phoneInput.value = data.phone || "";

  if (data.images?.[0]) {
    preview.src = data.images[0];
    preview.classList.remove("hidden");
  }

  // 🖼️ عرض الصورة الجديدة عند التبديل
  imgInput.addEventListener("change", () => {
    const file = imgInput.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.classList.remove("hidden");
    }
  });

  // 💾 عند حفظ التعديلات
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

const updatedData = {
  title: titleInput.value,
  description: descInput.value,
  location: locInput.value,
  price: priceInput.value,
  phone: phoneInput.value
};

    try {
      // إذا تم اختيار صورة جديدة
      if (imgInput.files.length > 0) {
        const file = imgInput.files[0];
        const storageRef = ref(storage, `listings/${listingId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        updatedData.images = [downloadURL];
      }

      // تحديث الوثيقة في Firestore
      await updateDoc(docRef, updatedData);

      alert("✅ تم تحديث الإعلان بنجاح!");
      window.location.href = "/profile.html";
    } catch (error) {
      console.error("خطأ في التحديث:", error);
      alert("❌ حدث خطأ أثناء حفظ التعديلات.");
    }
  });
});
