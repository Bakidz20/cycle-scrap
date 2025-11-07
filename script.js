import { auth, db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const form = document.getElementById("listForm");
const submitBtn = document.getElementById("submitBtn");
const imgbbApiKey = "a1d6477473b5aade79065030993cb9cc";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("✅ تم الضغط على زر عرض للبيع");

  if (!auth.currentUser) {
    alert("⚠️ يجب تسجيل الدخول قبل نشر الإعلان.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ جاري النشر...";

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const location = document.getElementById("location").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const scrapType = document.getElementById("scrapType").value;
  const metalType = document.getElementById("metalType")?.value || "";
  const photoInput = document.getElementById("photo");

  if (!title || !description || !price || !scrapType || !location || !phone) {
    alert("⚠️ يرجى ملء جميع الحقول المطلوبة!");
    submitBtn.disabled = false;
    submitBtn.textContent = "📤 عرض للبيع";
    return;
  }

  try {
    const imageUrls = [];

    for (let file of photoInput.files) {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

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
        throw new Error("Image upload failed");
      }
    }

    await addDoc(collection(db, "listings"), {
      title,
      description,
      price,
      location,
      phone,
      scrapType,
      metalType,
      images: imageUrls,
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid,
    });

    alert("✅ تم نشر إعلانك بنجاح!");
    form.reset();
  } catch (err) {
    console.error("❌ خطأ أثناء النشر:", err);
    alert("حدث خطأ أثناء رفع الإعلان. تحقق من الاتصال أو مفتاح Imgbb.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "📤 عرض للبيع";
  }
});
