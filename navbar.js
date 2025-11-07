// ✅ استيراد Firebase
import { auth } from "../firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background-color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        /* 🖤 الشعار */
        .logo {
          font-weight: bold;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .logo span {
          color: var(--secondary, #dc2626); /* كلمة Scrap بالأحمر */
        }

        .logo {
          color: black; /* كلمة Cycle بالأسود */
        }

        /* 🔗 روابط التنقل */
        .nav-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          color: black;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--secondary, #dc2626);
        }

        /* 🧍‍♂️ أزرار الدخول والتسجيل */
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .btn-primary {
          background-color: var(--secondary, #dc2626);
          color: white;
        }

        .btn-outline {
          border: 1px solid black;
          color: black;
        }

        .btn-outline:hover {
          background-color: black;
          color: white;
        }

        /* 🌟 صورة الملف الشخصي */
        .profile-container {
          position: relative;
          display: none;
        }

        .profile-pic {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          cursor: pointer;
          object-fit: cover;
          border: 2px solid #ffc107;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .profile-pic:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px 4px rgba(255, 193, 7, 0.75);
          border-color: #ffea00;
        }

        .dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          display: none;
          flex-direction: column;
          min-width: 150px;
          overflow: hidden;
        }

        .dropdown a, .dropdown button {
          padding: 10px 15px;
          text-align: left;
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          color: #333;
          font-weight: 500;
        }

        .dropdown a:hover, .dropdown button:hover {
          background: #f3f3f3;
        }
      </style>

      <nav>
        <a href="/" class="logo">
          <span>سكراب</span>سايكل
        </a>

        <ul class="nav-links">
          <li><a href="/" class="nav-link">الرئيسية</a></li>
          <li><a href="/buy.html" class="nav-link">الشراء</a></li>
          <li><a href="/sell.html" class="nav-link">البيع</a></li>
          <li><a href="/about.html" class="nav-link">حول</a></li>
        </ul>

        <div class="auth-buttons">
          <a href="/login.html" id="loginBtn" class="btn btn-outline">تسجيل الدخول</a>
          <a href="/register.html" id="registerBtn" class="btn btn-primary">إنشاء حساب</a>

          <!-- صورة الملف الشخصي -->
          <div class="profile-container" id="profileContainer">
            <img id="profilePic" class="profile-pic" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="صورة الحساب">
            <div class="dropdown" id="profileMenu">
              <a href="/profile.html">صفحتي الشخصية</a>
              <button id="logoutBtn">تسجيل الخروج</button>
            </div>
          </div>
        </div>
      </nav>
    `;

    this.afterRender();
  }

  afterRender() {
    const loginBtn = this.shadowRoot.getElementById("loginBtn");
    const registerBtn = this.shadowRoot.getElementById("registerBtn");
    const profileContainer = this.shadowRoot.getElementById("profileContainer");
    const profilePic = this.shadowRoot.getElementById("profilePic");
    const profileMenu = this.shadowRoot.getElementById("profileMenu");
    const logoutBtn = this.shadowRoot.getElementById("logoutBtn");

    // ✅ التحقق من حالة المستخدم
    onAuthStateChanged(auth, (user) => {
      if (user) {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        profileContainer.style.display = "flex";
        if (user.photoURL) profilePic.src = user.photoURL;
      } else {
        loginBtn.style.display = "inline-block";
        registerBtn.style.display = "inline-block";
        profileContainer.style.display = "none";
      }
    });

    // 🎯 فتح القائمة المنسدلة
    profilePic.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.style.display =
        profileMenu.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", () => {
      profileMenu.style.display = "none";
    });

    // 🚪 تسجيل الخروج
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      alert("✅ تم تسجيل الخروج بنجاح");
      window.location.href = "/login.html";
    });
  }
}

customElements.define("custom-navbar", CustomNavbar);
