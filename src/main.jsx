import React from 'react'
import ReactDOM from 'react-dom/client'
import { translations } from './translations.js'

// --- Routing & React Mounting Logic ---
const path = window.location.pathname.replace(/^\/|\/$/g, '');
const landingPage = document.getElementById('landing-page');
const weddingInvitation = document.getElementById('wedding-invitation');

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
  if (inviteForm) {
    inviteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = inviteForm.querySelector('button[type="submit"]');
      const lang = localStorage.getItem('yesergeleta_lang') || 'en';
      const originalText = btn.innerText;
      btn.innerText = translations[lang].order.sending;
      btn.disabled = true;
      setTimeout(() => {
        alert(translations[lang].order.successMessage);
        btn.innerText = originalText;
        btn.disabled = false;
        inviteForm.reset();
      }, 2000);
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
}

