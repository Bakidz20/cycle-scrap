import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const listingsContainer = document.getElementById("userListings");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("⚠️ يجب تسجيل الدخول أولاً للوصول إلى حسابك.");
    window.location.href = "/login.html";
    return;
  }

  try {
    const q = query(collection(db, "listings"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      listingsContainer.innerHTML = `<p class="text-center text-gray-400">🚫 لا توجد إعلانات بعد.</p>`;
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const card = document.createElement("div");
      card.className = "bg-gray-800 p-4 rounded-lg shadow";

      card.innerHTML = `
        <img src="${data.images?.[0] || 'https://via.placeholder.com/300'}" class="w-full h-48 object-cover rounded mb-3">
        <h2 class="text-xl font-bold mb-2">${data.title}</h2>
        <p class="text-gray-300 mb-2">${data.description}</p>
        <p class="text-sm text-gray-400 mb-2">📍 ${data.location}</p>
        <p class="text-sm text-gray-400 mb-2">💰 ${data.price} دج</p>
        <button class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded deleteBtn" data-id="${docSnap.id}">🗑️ حذف</button>
      `;

      listingsContainer.appendChild(card);
    });

    // 🗑️ حدث الحذف
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("هل أنت متأكد أنك تريد حذف هذا الإعلان؟")) {
          await deleteDoc(doc(db, "listings", id));
          alert("✅ تم حذف الإعلان بنجاح");
          btn.closest("div").remove();
        }
      });
    });
  } catch (error) {
    console.error("❌ خطأ أثناء جلب الإعلانات:", error);
    listingsContainer.innerHTML = `<p class="text-center text-red-500">حدث خطأ أثناء تحميل الإعلانات.</p>`;
  }
});
