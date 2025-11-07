import { auth, db } from "./firebase.js"; // ✅ أضفنا auth هنا
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const form = document.getElementById("listForm");
const submitBtn = document.getElementById("submitBtn");

// 🗝️ مفتاح Imgbb
const imgbbApiKey = "a1d6477473b5aade79065030993cb9cc";


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ جاري النشر...";

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const location = document.getElementById("location").value.trim();
  const scrapType = document.querySelector('input[name="scrap-type"]:checked')?.value;
  const photoInput = document.getElementById("photo");
  const phone = document.getElementById("phone").value.trim();

  if (!title || !description || !price || !quantity || !scrapType) {
    alert("⚠️ يرجى ملء جميع الحقول المطلوبة!");
    submitBtn.disabled = false;
    submitBtn.textContent = "📤 عرض للبيع";
    return;
  }

  try {
    const imageUrls = [];

  // 🖼️ رفع الصور إلى Imgbb
for (let file of photoInput.files) {
  // تحويل الصورة إلى Base64
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // نأخذ فقط البيانات بدون header
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // رفع الصورة
  const formData = new FormData();
  formData.append("image", base64);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    imageUrls.push(data.data.url);
  } else {
    console.error("❌ Upload failed:", data);
    throw new Error("Image upload failed");
  }
}

    // 💾 إضافة البيانات إلى Firestore
    await addDoc(collection(db, "listings"), {
      title,
      description,
      price,
      quantity,
      location,
      phone,
      scrapType,
      images: imageUrls,
      createdAt: serverTimestamp(),
      userId: auth.currentUser ? auth.currentUser.uid : null,
    });

    alert("✅ تم نشر إعلانك بنجاح!");
    form.reset();
  } catch (error) {
    console.error("❌ خطأ أثناء النشر:", error);
    alert("حدث خطأ أثناء رفع الإعلان. تحقق من الاتصال بالإنترنت أو مفتاح Imgbb.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "📤 عرض للبيع";
  }
});
