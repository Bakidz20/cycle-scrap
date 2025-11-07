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
      card.className =
        "card bg-white rounded-xl shadow-md border border-gray-100 transition hover:shadow-lg p-4";

      card.innerHTML = `
        <img 
          src="${data.images?.[0] || 'https://via.placeholder.com/400x250?text=No+Image'}"
          alt="صورة المنتج"
          class="w-full h-48 object-cover rounded-lg mb-3 border"
        >
        <h2 class="text-xl font-semibold text-gray-800 mb-1">${data.title}</h2>
        <p class="font-bold text-yellow-600 mb-3">💰 السعر: ${data.price || "غير محدد"} دج</p>

        <div class="flex items-center justify-between mt-3">
          <span class="status ${data.active ? "status-active" : "status-expired"}">
            ${data.active ? "منشور" : "منتهي"}
          </span>

          <div class="flex flex-col sm:flex-row gap-2">
            <button 
              class="viewBtn bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-md font-semibold text-sm transition shadow-sm hover:shadow-md"
              data-id="${docSnap.id}">
              👁️ عرض التفاصيل
            </button>

            <button 
              class="editBtn bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-md font-semibold text-sm transition shadow-sm hover:shadow-md"
              data-id="${docSnap.id}">
              ✏️ تعديل الإعلان
            </button>

            <button 
              class="deleteBtn bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-md font-semibold text-sm transition shadow-sm hover:shadow-md"
              data-id="${docSnap.id}">
              🗑️ حذف
            </button>
          </div>
        </div>
      `;

      listingsContainer.appendChild(card);
    });

    // 🗑️ حذف الإعلان
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("هل أنت متأكد أنك تريد حذف هذا الإعلان؟")) {
          await deleteDoc(doc(db, "listings", id));
          alert("✅ تم حذف الإعلان بنجاح");
          btn.closest("div.card").remove();
        }
      });
    });

    // 👁️ عرض التفاصيل
    document.querySelectorAll(".viewBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        window.location.href = `/listing-details.html?id=${id}`;
      });
    });

    // ✏️ تعديل الإعلان
    document.querySelectorAll(".editBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        window.location.href = `/edit-listing.html?id=${id}`;
      });
    });
  } catch (error) {
    console.error("❌ خطأ أثناء جلب الإعلانات:", error);
    listingsContainer.innerHTML = `<p class="text-center text-red-500">حدث خطأ أثناء تحميل الإعلانات.</p>`;
  }
});
