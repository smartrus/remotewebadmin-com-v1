// NomadX Base Theme — Shared JavaScript

// Navbar scroll effect
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      // Don't close menu when clicking a dropdown parent toggle on mobile
      if (window.innerWidth <= 768 &&
          link.closest('.nav-dropdown, .has-dropdown') &&
          !link.closest('.nav-dropdown-menu, .dropdown-menu')) {
        return;
      }
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Mobile dropdown toggle (touch support)
// Handles both .nav-dropdown/.nav-dropdown-toggle and .has-dropdown/aria-haspopup patterns
document.querySelectorAll('.nav-dropdown, .has-dropdown').forEach(dd => {
  const toggleLink = dd.querySelector('.nav-dropdown-toggle, a[aria-haspopup]');
  if (toggleLink) {
    toggleLink.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = dd.classList.contains('open');
        document.querySelectorAll('.nav-dropdown, .has-dropdown').forEach(d => {
          d.classList.remove('open');
          const t = d.querySelector('.nav-dropdown-toggle, a[aria-haspopup]');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          dd.classList.add('open');
          toggleLink.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-in').forEach(el => {
  observer.observe(el);
});

// Status line typewriter animation (reads phrases from data attribute)
(function () {
  var statusEl = document.getElementById('status-text');
  if (!statusEl) return;
  var phrasesAttr = statusEl.getAttribute('data-phrases');
  var phrases = phrasesAttr ? JSON.parse(phrasesAttr) : [];
  if (phrases.length === 0) return;

  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typeSpeed = 50;
  var deleteSpeed = 30;
  var pauseEnd = 2000;
  var pauseStart = 500;

  function typeStatus() {
    var current = phrases[phraseIndex];
    if (!isDeleting) {
      statusEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeStatus, pauseEnd);
        return;
      }
      setTimeout(typeStatus, typeSpeed);
    } else {
      statusEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeStatus, pauseStart);
        return;
      }
      setTimeout(typeStatus, deleteSpeed);
    }
  }
  typeStatus();
})();
