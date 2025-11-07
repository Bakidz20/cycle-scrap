import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");
const listingDetails = document.getElementById("listingDetails");

async function loadListingDetails() {
  if (!listingId) {
    listingDetails.innerHTML = `<p class="text-center text-red-500">❌ لم يتم العثور على الإعلان.</p>`;
    return;
  }

  try {
    const docRef = doc(db, "listings", listingId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      listingDetails.innerHTML = `<p class="text-center text-red-500">🚫 هذا الإعلان غير موجود.</p>`;
      return;
    }

    const data = docSnap.data();
    const images = data.images && data.images.length > 0 ? data.images : ["https://via.placeholder.com/600"];

    listingDetails.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- ✅ الصورة الرئيسية -->
        <img src="${images[0]}" alt="${data.title}" class="w-full h-96 object-cover rounded-lg mb-4">

        <!-- ✅ الصور المصغّرة -->
        <div class="flex gap-2 overflow-x-auto mb-6">
          ${images.map(img => `
            <img src="${img}" class="w-24 h-20 object-cover rounded cursor-pointer hover:scale-105 transition"
              onclick="this.closest('div').previousElementSibling.src='${img}'">
          `).join("")}
        </div>

        <!-- ✅ العنوان والسعر -->
        <div class="flex justify-between items-center flex-wrap mb-6">
          <h1 class="text-3xl font-bold text-gray-800">${data.title}</h1>
          <div class="relative px-5 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-2xl rounded-lg shadow-md border border-yellow-400">
            <span class="animate-pulse">💰 ${data.price} دج</span>
            <div class="absolute -top-2 -right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
          </div>
        </div>

        <!-- ✅ تفاصيل الإعلان -->
        <div class="detail-box">
          <div class="grid md:grid-cols-2 gap-x-10 gap-y-3">
            <p><strong> التاريخ:</strong> ${new Date(data.createdAt?.seconds * 1000).toLocaleString('ar-DZ') || "غير متاح"}</p>
            <p><strong> الموقع:</strong> ${data.location || "غير محدد"}</p>
            <p><strong> نوع الخردة:</strong> ${data.scrapType || "غير محدد"}</p>
          
            <p><strong> الحالة:</strong> ${data.condition || "غير محدد"}</p>
            <p><strong> رقم الهاتف:</strong> ${data.phone || "غير متوفر"}</p>
          </div>

          <!-- ✅ المواصفات -->
          ${data.specs && data.specs.length > 0 ? `
            <div class="mt-4">
              <strong class="block mb-2">⚙️ المواصفات:</strong>
              ${data.specs.map(s => `<span class="tag">${s}</span>`).join("")}
            </div>
          ` : ""}
        </div>

        <!-- ✅ قسم الوصف -->
        <div class="detail-box">
          <h2 class="text-2xl font-semibold text-yellow-700 mb-3"> الوصف</h2>
          <p class="leading-relaxed text-gray-700">${data.description || "لا يوجد وصف متاح."}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    listingDetails.innerHTML = `<p class="text-center text-red-500">حدث خطأ أثناء تحميل البيانات.</p>`;
  }
}

loadListingDetails();
