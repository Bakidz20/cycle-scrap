// Import Firebase Auth
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
          background-color: var(--primary, #1a1a1a);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .logo {
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .logo span {
          color: var(--secondary, #dc2626);
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .nav-link:hover {
          color: var(--secondary, #dc2626);
        }
        .active {
          color: var(--secondary, #dc2626);
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }
        .auth-buttons {
          display: flex;
          gap: 1rem;
          margin-left: 1rem;
          align-items: center;
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
        .btn-primary:hover {
          background-color: #b91c1c;
          transform: translateY(-1px);
        }
        .btn-outline {
          border: 1px solid white;
          color: white;
        }
        .btn-outline:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
          #logoutBtn {
  background-color: var(--secondary, #dc2626);
  color: white;
  border: none;
}

#logoutBtn:hover {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }
          .nav-links, .auth-buttons {
            display: none;
          } 
        }
      </style>
      <nav>
        <a href="/" class="logo">
          <span>Scrap</span>Cycle
        </a>
        <button class="mobile-menu-btn">
          <i data-feather="menu"></i>
        </button>
        
        <ul class="nav-links">
          <li><a href="/" class="nav-link active"><i data-feather="home"></i> Home</a></li>
          <li><a href="/buy.html" class="nav-link"><i data-feather="shopping-cart"></i> Buy</a></li>
          <li><a href="/sell.html" class="nav-link"><i data-feather="dollar-sign"></i> Sell</a></li>
          <li><a href="/about.html" class="nav-link"><i data-feather="info"></i> About</a></li>
          <li><a href="/contact.html" class="nav-link"><i data-feather="mail"></i> Contact</a></li>
          <li><a href="/buy.html" class="nav-link"><i data-feather="shopping-bag"></i> Buy Scrap</a></li>
          <li><a href="/sell.html" class="nav-link"><i data-feather="dollar-sign"></i> Sell Scrap</a></li>
        </ul>

        <div class="auth-buttons">
          <a href="/login.html" id="loginBtn" class="btn btn-outline"><i data-feather="log-in"></i> Login</a>
          <a href="/register.html" id="registerBtn" class="btn btn-primary"><i data-feather="user-plus"></i> Register</a>
          <span id="userInfo" style="color:white; display:none;"></span>
          <button id="logoutBtn" class="btn btn-outline" style="display:none;">Logout</button>
        </div>
      </nav>
      
    `;

    // Wait for elements to be ready
    this.afterRender();
  }

  afterRender() {
    const loginBtn = this.shadowRoot.getElementById("loginBtn");
    const registerBtn = this.shadowRoot.getElementById("registerBtn");
    const userInfo = this.shadowRoot.getElementById("userInfo");
    const logoutBtn = this.shadowRoot.getElementById("logoutBtn");

    // 🔥 Firebase Auth state listener
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ User is logged in
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        userInfo.style.display = "inline-block";
        logoutBtn.style.display = "inline-block";

       userInfo.innerHTML = `👋 <span id="userName">${user.displayName || user.email}</span>`;

// نضيف الحدث بعد ما نعرض الاسم
const userNameSpan = this.shadowRoot.getElementById("userName");
userNameSpan.style.cursor = "pointer";
userNameSpan.style.textDecoration = "underline"; // اختياري
userNameSpan.addEventListener("click", () => {
  window.location.href = "/profile.html"; // 👈 يوجه المستخدم إلى صفحة الحساب
});

      } else {
        // ❌ Not logged in
        loginBtn.style.display = "inline-block";
        registerBtn.style.display = "inline-block";
        userInfo.style.display = "none";
        logoutBtn.style.display = "none";
      }
    });

    // 🚪 Logout
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      alert("You’ve been logged out.");
      window.location.href = "/login.html";
    });
  }
}

customElements.define("custom-navbar", CustomNavbar);
