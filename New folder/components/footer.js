class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background-color: var(--primary, #1a1a1a);
          color: white;
          padding: 2rem 1rem;
          margin-top: 3rem;
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        .footer-logo {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-logo span {
          color: var(--secondary, #dc2626);
        }
        .footer-about {
          max-width: 300px;
        }
        .footer-heading {
          font-size: 1.125rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: var(--secondary, #dc2626);
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-link {
          color: #a1a1aa;
          text-decoration: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-link:hover {
          color: white;
        }
        .footer-social {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        .social-icon:hover {
          background-color: var(--secondary, #dc2626);
        }
        .footer-bottom {
          border-top: 1px solid #333;
          padding-top: 1.5rem;
          margin-top: 2rem;
          text-align: center;
          color: #a1a1aa;
          font-size: 0.875rem;
        }
        @media (max-width: 640px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <footer>
        <div class="footer-container">
          <div class="footer-about">
            <div class="footer-logo">
              <span>Scrap</span>Cycle
            </div>
            <p class="text-gray-400">Connecting scrap sellers with buyers since 2023. Making the scrap trade simple and profitable.</p>
            <div class="footer-social">
              <a href="#" class="social-icon">
                <i data-feather="facebook"></i>
              </a>
              <a href="#" class="social-icon">
                <i data-feather="twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i data-feather="instagram"></i>
              </a>
              <a href="#" class="social-icon">
                <i data-feather="linkedin"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="footer-heading">Quick Links</h3>
            <ul class="footer-links">
              <li><a href="/" class="footer-link"><i data-feather="chevron-right"></i> Home</a></li>
              <li><a href="/buy.html" class="footer-link"><i data-feather="chevron-right"></i> Buy Scrap</a></li>
              <li><a href="/sell.html" class="footer-link"><i data-feather="chevron-right"></i> Sell Scrap</a></li>
              <li><a href="/pricing.html" class="footer-link"><i data-feather="chevron-right"></i> Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="footer-heading">Company</h3>
            <ul class="footer-links">
              <li><a href="/about.html" class="footer-link"><i data-feather="chevron-right"></i> About Us</a></li>
              <li><a href="/careers.html" class="footer-link"><i data-feather="chevron-right"></i> Careers</a></li>
              <li><a href="/blog.html" class="footer-link"><i data-feather="chevron-right"></i> Blog</a></li>
              <li><a href="/contact.html" class="footer-link"><i data-feather="chevron-right"></i> Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="footer-heading">Legal</h3>
            <ul class="footer-links">
              <li><a href="/privacy.html" class="footer-link"><i data-feather="chevron-right"></i> Privacy Policy</a></li>
              <li><a href="/terms.html" class="footer-link"><i data-feather="chevron-right"></i> Terms of Service</a></li>
              <li><a href="/cookies.html" class="footer-link"><i data-feather="chevron-right"></i> Cookie Policy</a></li>
              <li><a href="/refund.html" class="footer-link"><i data-feather="chevron-right"></i> Refund Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2023 ScrapCycle. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);