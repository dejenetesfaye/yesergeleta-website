import React from 'react'
import ReactDOM from 'react-dom/client'
import { translations } from './translations.js'
import RomanticCursor from './components/RomanticCursor'

// --- Routing & React Mounting Logic ---
const path = window.location.pathname.replace(/^\/|\/$/g, '');
const landingPage = document.getElementById('landing-page');
const weddingInvitation = document.getElementById('wedding-invitation');
const cursorRoot = document.getElementById('cursor-root');

// Mount Cursor Component
if (cursorRoot) {
  ReactDOM.createRoot(cursorRoot).render(
    <React.StrictMode>
      <RomanticCursor />
    </React.StrictMode>
  );
}

// Dynamically scan for invitation files (JSX and TSX)
const invitationModules = import.meta.glob('./data/invitations/*.{jsx,tsx}');

async function handleRouting() {
  const fileKeyJsx = `./data/invitations/${path}.jsx`;
  const fileKeyTsx = `./data/invitations/${path}.tsx`;
  const fileKey = invitationModules[fileKeyJsx] ? fileKeyJsx : fileKeyTsx;
  
  if (path && invitationModules[fileKey]) {
    try {
      // Hide landing page, show invitation container
      landingPage.style.display = 'none';
      weddingInvitation.style.display = 'block';
      weddingInvitation.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; color:#D4AF37;">Loading Invitation...</div>';
      
      // Load the specific wedding React component
      const module = await invitationModules[fileKey]();
      const InvitationComponent = module.default;
      
      // Update page title based on slug
      const slugTitle = path.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      document.title = `${slugTitle} | Yesergeleta Invitation`;
      
      // Mount React component
      const root = ReactDOM.createRoot(weddingInvitation);
      root.render(
        <React.StrictMode>
          <InvitationComponent />
        </React.StrictMode>
      );
      
    } catch (error) {
      console.error("Error loading React invitation:", error);
      weddingInvitation.innerHTML = `<div style="padding: 20px; text-align:center;"><h2>Error Loading Invitation</h2><p>${error.message}</p><button onclick="location.reload()">Retry</button></div>`;
    }
  } else {
    showLandingPage();
  }
}

function showLandingPage() {
  landingPage.style.display = 'block';
  weddingInvitation.style.display = 'none';
  initLandingPage();
}

handleRouting();

// --- i18n Logic ---
function getNestedTranslation(obj, path) {
  return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
}

function updateContent(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = getNestedTranslation(translations[lang], key);
    if (translation) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = translation;
      } else {
        el.innerText = translation;
      }
    }
  });

  const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  placeholders.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = getNestedTranslation(translations[lang], key);
    if (translation) {
      el.placeholder = translation;
    }
  });

  document.documentElement.lang = lang;

  // Dynamic Sync: Update theme dropdown in order form based on theme cards
  const themeSelect = document.getElementById('order-theme');
  if (themeSelect) {
    const themeTitles = document.querySelectorAll('.theme-card h3');
    const currentThemeValue = themeSelect.value;
    themeSelect.innerHTML = '';
    themeTitles.forEach(title => {
      const option = document.createElement('option');
      option.value = title.innerText;
      option.innerText = title.innerText;
      themeSelect.appendChild(option);
    });
    // Try to restore previous selection if it still exists
    if (currentThemeValue) themeSelect.value = currentThemeValue;
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initLandingPage() {
  const langSwitcher = document.getElementById('lang-switcher');
  const currentLang = localStorage.getItem('yesergeleta_lang') || 'en';

  if (langSwitcher) {
    langSwitcher.value = currentLang;
    const updateHandler = (e) => {
      const newLang = e.target.value;
      localStorage.setItem('yesergeleta_lang', newLang);
      updateContent(newLang);
    };
    langSwitcher.removeEventListener('change', updateHandler); // Avoid dupes
    langSwitcher.addEventListener('change', updateHandler);
  }

  updateContent(currentLang);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const navbar = document.querySelector('#navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const themeCards = document.querySelectorAll('.theme-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      themeCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  const inviteForm = document.querySelector('#invite-form');
  const orderTgBtn = document.getElementById('order-tg-btn');
  const orderWaBtn = document.getElementById('order-wa-btn');

  const getOrderMessage = () => {
    const name = document.getElementById('order-name')?.value || '';
    const phone = document.getElementById('order-phone')?.value || '';
    const date = document.getElementById('order-date')?.value || '';
    const theme = document.getElementById('order-theme')?.value || '';
    const message = document.getElementById('order-message')?.value || '';
    
    return `New Order from Yesergeleta Website:
Name: ${name}
Phone: ${phone}
Wedding Date: ${date}
Theme: ${theme}
Message: ${message}`;
  };

  if (orderTgBtn) {
    orderTgBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const message = getOrderMessage();
      window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(message)}`, '_blank');
      inviteForm?.reset();
    });
  }

  if (orderWaBtn) {
    orderWaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const message = getOrderMessage();
      window.open(`https://wa.me/251911834473?text=${encodeURIComponent(message)}`, '_blank');
      inviteForm?.reset();
    });
  }

  if (inviteForm) {
    inviteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Default submit behavior if they just press Enter
      const message = getOrderMessage();
      window.open(`https://wa.me/251911834473?text=${encodeURIComponent(message)}`, '_blank');
      inviteForm.reset();
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || '';
      const email = document.getElementById('contact-email')?.value || '';
      const messageText = document.getElementById('contact-message')?.value || '';
      
      const fullMessage = `New Contact Message from Yesergeleta:
Name: ${name}
Email: ${email}
Message: ${messageText}`;
      
      window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(fullMessage)}`, '_blank');
      contactForm.reset();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        
        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.classList.remove('open');
      }
    });
  });

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // ── Preview Modal ──────────────────────────────────────────
  const modal = document.getElementById('preview-modal');
  const iframe = document.getElementById('preview-iframe');
  const modalTitle = document.getElementById('modal-title');
  const modalOpenLink = document.getElementById('modal-open-link');
  const modalClose = document.getElementById('modal-close');

  if (modal && iframe && modalClose) {
    // Open modal when any Preview button is clicked
    document.querySelectorAll('.btn-preview[data-preview]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('data-preview');
        if (!url || url === '#') {
          alert('This template preview is coming soon!');
          return;
        }
        // Get the card title for modal header
        const cardTitle = btn.closest('.theme-info')?.querySelector('h3')?.innerText || 'Invitation Preview';
        if (modalTitle) modalTitle.textContent = cardTitle + ' — Preview';
        if (modalOpenLink) {
          modalOpenLink.onclick = (e) => {
            e.preventDefault();
            window.open(url, '_blank');
          };
        }
        iframe.src = url;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal on X click
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
      iframe.src = '';
      document.body.style.overflow = '';
    });

    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        iframe.src = '';
        document.body.style.overflow = '';
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        iframe.src = '';
        document.body.style.overflow = '';
      }
    });
  }
}

