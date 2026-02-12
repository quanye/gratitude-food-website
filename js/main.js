/* ============================================
   GRATITUDE FOODSERVICE - Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- DOM Elements ---
  const header = document.getElementById('header');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link, .mobile-nav__cta');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const formSubmit = document.getElementById('form-submit');

  // --- Mobile Nav Backdrop ---
  const backdrop = document.createElement('div');
  backdrop.classList.add('mobile-nav-backdrop');
  document.body.appendChild(backdrop);

  // --- Mobile Navigation Toggle ---
  function toggleMobileNav() {
    const isOpen = mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open');
    navToggle.classList.toggle('active');
    backdrop.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', !isOpen);
    mobileNav.setAttribute('aria-hidden', isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    navToggle.classList.remove('active');
    backdrop.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileNav);
  backdrop.addEventListener('click', closeMobileNav);
  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // --- Active Nav Link Tracking ---
  var sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // --- Sticky Header ---
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // --- Scroll Reveal (Intersection Observer) ---
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Contact Form ---
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      var requiredFields = contactForm.querySelectorAll('[required]');
      var isValid = true;

      requiredFields.forEach(function (field) {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }
        if (field.type === 'email' && field.value.trim()) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            field.classList.add('error');
            isValid = false;
          }
        }
      });

      if (!isValid) {
        formStatus.textContent = 'Please fill in all required fields correctly.';
        formStatus.className = 'form-status error';
        return;
      }

      // Submit via fetch
      formSubmit.disabled = true;
      formSubmit.textContent = 'Sending...';
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          if (response.ok) {
            formStatus.textContent =
              'Thank you! Your request has been sent. We\'ll be in touch soon.';
            formStatus.className = 'form-status success';
            contactForm.reset();
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          formStatus.textContent =
            'Something went wrong. Please try again or email us directly at hello@gratitude.food';
          formStatus.className = 'form-status error';
        })
        .finally(function () {
          formSubmit.disabled = false;
          formSubmit.textContent = 'Send Request';
        });
    });

    // Remove error styling on input
    contactForm.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('input', function () {
        this.classList.remove('error');
      });
    });
  }
})();
