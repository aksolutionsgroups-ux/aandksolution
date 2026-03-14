/**
 * A&K Solutions — script.js
 *
 * Sections:
 *  1.  Configuration
 *  2.  DOMContentLoaded — init calls
 *  3.  Theme Toggle (dark / light mode)
 *  4.  Loading Screen
 *  5.  Navigation (hamburger, scroll hide/show)
 *  6.  Scroll Animations (IntersectionObserver)
 *  7.  Testimonial Slider
 *  8.  Contact Form (validation + Google Sheets submit)
 *  9.  Notification Toast
 *  10. Smooth Scrolling
 *  11. WhatsApp Button reveal
 *  12. Analytics helpers
 *  13. Utility functions
 */


/* ============================================================
   1. CONFIGURATION
============================================================ */
const CONFIG = {
  googleSheetsURL: 'https://script.google.com/macros/s/AKfycbytKCYjeuBObo-oqRcsRcFeuJppn3tUzyjfccDCck7N6OSQVtL6NdGmwPOLLgLU6bV2Bw/exec',
  fallbackEmail:   'aksolutionsgroups@gmail.com',
};


/* ============================================================
   2. DOM CONTENT LOADED — INIT CALLS
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLoadingScreen();
  initNavigation();
  initScrollAnimations();
  initTestimonialSlider();
  initContactForm();
  initNotificationSystem();
  initSmoothScrolling();
  initWhatsAppButton();
  initAnalytics();
});


/* ============================================================
   3. THEME TOGGLE
   Persists choice in localStorage.
   Falls back to time-of-day (IST) when no saved preference.
============================================================ */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const icon = toggle.querySelector('i');

  // Apply saved theme or auto-detect based on IST time
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    applyLightMode(icon);
  } else if (!savedTheme) {
    autoThemeByTime(icon);
  }

  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    if (isLight) {
      applyDarkMode(icon);
      localStorage.setItem('theme', 'dark');
    } else {
      applyLightMode(icon);
      localStorage.setItem('theme', 'light');
    }
  });
}

function applyLightMode(iconEl) {
  document.body.classList.add('light-mode');
  iconEl.classList.replace('fa-sun', 'fa-moon');
}

function applyDarkMode(iconEl) {
  document.body.classList.remove('light-mode');
  iconEl.classList.replace('fa-moon', 'fa-sun');
}

/** Set theme based on Indian Standard Time (UTC+5:30).
 *  Light mode: 06:00–18:00 IST, dark mode otherwise. */
function autoThemeByTime(iconEl) {
  const istOffset = 5.5 * 60 * 60 * 1000; // ms
  const istHour   = new Date(Date.now() + istOffset).getUTCHours();

  if (istHour >= 6 && istHour < 18) {
    applyLightMode(iconEl);
  }
}


/* ============================================================
   4. LOADING SCREEN
   Hides the loading overlay after page load (max 3 s fallback).
============================================================ */
function initLoadingScreen() {
  const loading = document.getElementById('loading');
  if (!loading) return;

  const hideLoading = () => {
    loading.classList.add('hidden');
    setTimeout(() => { loading.style.display = 'none'; }, 500);
  };

  window.addEventListener('load', () => setTimeout(hideLoading, 800));
  setTimeout(hideLoading, 3000); // fallback
}


/* ============================================================
   5. NAVIGATION
   - Hamburger menu toggle for mobile
   - Navbar shadow + hide-on-scroll-down behaviour
============================================================ */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  const navbar    = document.querySelector('.navbar');

  if (!hamburger || !navMenu) return;

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMobileMenu();
  });

  // Scroll behaviour: shadow + hide-on-scroll-down
  let lastScrollY = 0;
  window.addEventListener('scroll', debounce(() => {
    const y = window.scrollY;

    navbar.style.boxShadow = y > 80 ? '0 2px 20px rgba(0,0,0,0.3)' : 'none';
    navbar.style.transform = (y > lastScrollY && y > 200) ? 'translateY(-100%)' : 'translateY(0)';
    lastScrollY = y;
  }, 50));

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
}


/* ============================================================
   6. SCROLL ANIMATIONS
   Uses IntersectionObserver to fade cards in as they enter viewport.
============================================================ */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.benefit-card, .service-card, .pricing-card, .portfolio-item');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
}


/* ============================================================
   7. TESTIMONIAL SLIDER
   Auto-advances every 5 s. Dot buttons allow manual navigation.
   Exposed as window.currentSlide(index) for inline onclick handlers.
============================================================ */
function initTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial');
  const dots         = document.querySelectorAll('.testimonial-dots .dot');

  if (testimonials.length === 0) return;

  let current  = 0;
  let interval = null;

  /** Show the testimonial at the given index. */
  function showSlide(index) {
    current = (index + testimonials.length) % testimonials.length;

    testimonials.forEach((t, i) => t.classList.toggle('active', i === current));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current);
    });
  }

  function startAuto() {
    interval = setInterval(() => showSlide(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(interval);
  }

  // Dot click handlers
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); stopAuto(); startAuto(); });
  });

  // Pause on hover
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
  }

  startAuto();

  // Expose for inline onclick in HTML
  window.currentSlide = showSlide;
}


/* ============================================================
   8. CONTACT FORM
   - Real-time field validation on blur / input
   - Submits data to Google Sheets via fetch (no-cors)
============================================================ */
function initContactForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  // Real-time validation
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur',  () => validateField(field));
    field.addEventListener('input', () => clearFieldError(field));
  });
}

/** Validate a single form field. Returns true if valid. */
function validateField(field) {
  const errorEl = document.getElementById(`${field.id}-error`);
  if (!errorEl) return true;

  field.classList.remove('error');
  errorEl.textContent = '';

  // Required check
  if (field.hasAttribute('required') && !field.value.trim()) {
    showFieldError(field, errorEl, 'This field is required');
    return false;
  }

  // Email format
  if (field.type === 'email' && field.value) {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    if (!valid) {
      showFieldError(field, errorEl, 'Please enter a valid email address');
      return false;
    }
  }

  // Phone format
  if (field.type === 'tel' && field.value) {
    const valid = /^[\d\s+\-()]{10,}$/.test(field.value);
    if (!valid) {
      showFieldError(field, errorEl, 'Please enter a valid phone number');
      return false;
    }
  }

  return true;
}

function showFieldError(field, errorEl, message) {
  field.classList.add('error');
  errorEl.textContent = message;
}

function clearFieldError(field) {
  const errorEl = document.getElementById(`${field.id}-error`);
  if (errorEl) {
    field.classList.remove('error');
    errorEl.textContent = '';
  }
}

/** Called by the form's onsubmit attribute. */
window.submitForm = function (e) {
  e.preventDefault();

  const form      = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validate all fields
  let isValid = true;
  form.querySelectorAll('input, select, textarea').forEach(field => {
    if (!validateField(field)) isValid = false;
  });

  if (!isValid) {
    showNotification('Please fix the errors in the form.', 'error');
    return;
  }

  // Show loading state
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;

  const data = {
    name:         form.name.value,
    email:        form.email.value,
    whatsapp:     form.whatsapp.value || '',
    businessType: form.businessType.value,
    websiteType:  form.websiteType.value,
    budget:       form.budget.value,
    message:      form.message.value,
  };

  submitToGoogleSheets(data)
    .then(() => {
      form.reset();
      showNotification("Thank you! We'll get back to you within 2 hours.", 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      trackEvent('form_submit', 'engagement', 'quote_request_success');
    })
    .catch(() => {
      showNotification('Something went wrong. Please email us directly or try again.', 'error');
      trackEvent('form_submit_error', 'engagement', 'quote_request_failed');
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled    = false;
    });
};

/** Send form data to Google Sheets (no-cors, fire-and-forget style). */
async function submitToGoogleSheets(data) {
  await fetch(CONFIG.googleSheetsURL, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body:    JSON.stringify(data),
  });
  // no-cors means we can't read the response; assume success if no exception
}


/* ============================================================
   9. NOTIFICATION TOAST
   showNotification(message, type) is exposed globally.
   type: 'success' | 'error' | 'info'
============================================================ */
function initNotificationSystem() {
  const notification = document.getElementById('notification');
  const messageEl    = document.getElementById('notification-message');
  const closeBtn     = document.querySelector('.notification-close');

  if (!notification || !messageEl) return;

  let hideTimer = null;

  window.showNotification = function (message, type = 'info') {
    clearTimeout(hideTimer);
    messageEl.textContent = message;
    notification.className = `notification ${type} show`;
    notification.setAttribute('aria-hidden', 'false');

    hideTimer = setTimeout(hideNotification, 5000);
  };

  function hideNotification() {
    notification.classList.remove('show');
    notification.setAttribute('aria-hidden', 'true');
  }

  closeBtn?.addEventListener('click', hideNotification);
}


/* ============================================================
   10. SMOOTH SCROLLING
   Intercepts all anchor links that point to an #id and scrolls
   smoothly with a 80 px offset to clear the fixed navbar.
============================================================ */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ============================================================
   11. WHATSAPP BUTTON REVEAL
   Fades in the floating button 1 s after page load.
============================================================ */
function initWhatsAppButton() {
  const btn = document.querySelector('.whatsapp-btn');
  if (!btn) return;

  setTimeout(() => {
    btn.style.opacity   = '1';
    btn.style.transform = 'scale(1)';
  }, 1000);
}


/* ============================================================
   12. ANALYTICS HELPERS
   Safe wrappers around gtag so the site works even if gtag
   fails to load (e.g. ad blockers).
============================================================ */
function initAnalytics() {
  if (typeof gtag === 'undefined') return;

  // Track scroll depth at 25 % intervals
  let maxScroll = 0;
  window.addEventListener('scroll', debounce(() => {
    const pct = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (pct > maxScroll && pct % 25 === 0) {
      maxScroll = pct;
      trackEvent('scroll', 'engagement', `${pct}%`);
    }
  }, 500));

  // Track WhatsApp button clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('click', 'engagement', 'whatsapp_contact'));
  });
}

/** Safe gtag event wrapper. */
function trackEvent(action, category, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, { event_category: category, event_label: label });
  }
}


/* ============================================================
   13. UTILITY FUNCTIONS
============================================================ */

/** Debounce: delay execution until `wait` ms after last call. */
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Global error handler (logs, does not alert user)
window.addEventListener('error', e => console.error('JS error:', e.error));
window.addEventListener('unhandledrejection', e => console.error('Unhandled promise:', e.reason));
