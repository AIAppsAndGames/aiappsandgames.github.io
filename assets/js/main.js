// Main JavaScript Module for AI Apps & Games website
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollEffects();
  initStatsCounter();
  initScrollReveal();
  initPWAInstall();
  initFAQAccordion();
  initForms();
  initScreenshotGallery();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon representation
    const darkIcon = themeToggleBtn.querySelector('.dark-icon');
    const lightIcon = themeToggleBtn.querySelector('.light-icon');
    
    if (theme === 'light') {
      if (darkIcon) darkIcon.style.display = 'none';
      if (lightIcon) lightIcon.style.display = 'block';
    } else {
      if (darkIcon) darkIcon.style.display = 'block';
      if (lightIcon) lightIcon.style.display = 'none';
    }
  };

  // Initial Load
  const currentTheme = getPreferredTheme();
  setTheme(currentTheme);

  // Click Event Listener
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    setTheme(isDark ? 'light' : 'dark');
  });

  // Listen to system changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'light' : 'dark');
    }
  });
}

/* ==========================================================================
   2. Mobile Hamburger Menu
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Toggle active state bars on menu icon
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close menu when clicking links
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

/* ==========================================================================
   3. Scroll Effects & Progress Indicator
   ========================================================================== */
function initScrollEffects() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 1. Scroll Progress Bar
    if (progressBar && height > 0) {
      const scrolled = (windowScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }

    // 2. Back To Top Button visibility
    if (backToTopBtn) {
      if (windowScroll > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   4. Statistics Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.5
  };

  const countUp = (element) => {
    const target = +element.getAttribute('data-target');
    const suffix = element.getAttribute('data-suffix') || '';
    const speed = 200; // lower is faster
    const increment = target / speed;
    let count = 0;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        element.innerText = Math.floor(count) + suffix;
        setTimeout(updateCount, 1);
      } else {
        element.innerText = target + suffix;
      }
    };
    updateCount();
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));
}

/* ==========================================================================
   5. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  reveals.forEach(element => {
    observer.observe(element);
  });
}

/* ==========================================================================
   6. PWA Installation Handler
   ========================================================================== */
let deferredPrompt;

function initPWAInstall() {
  const installBtn = document.getElementById('pwa-install');
  if (!installBtn) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show PWA install button/banner
    installBtn.classList.add('visible');
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install prompt outcome: ${outcome}`);
    deferredPrompt = null;
    installBtn.classList.remove('visible');
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed successfully');
    installBtn.classList.remove('visible');
  });
}

/* ==========================================================================
   7. FAQ Accordion Control
   ========================================================================== */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close other accordion items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. Form Handling (Newsletter, Contact, Support)
   ========================================================================== */
function initForms() {
  // Common visual toast notification generator
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = type === 'success' ? 'var(--success)' : 'var(--error)';
    toast.style.color = '#ffffff';
    toast.style.padding = '0.75rem 2rem';
    toast.style.borderRadius = 'var(--radius-full)';
    toast.style.zIndex = '1000';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = 'var(--shadow-md)';
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };



  // Contact Form (WhatsApp Redirect)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;
      
      const whatsappText = `Hello! My name is ${name} (${email}).\n\nMessage:\n${message}`;
      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/918866737102?text=${encodedText}`;
      
      showToast('Redirecting you to WhatsApp...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        contactForm.reset();
      }, 1000);
    });
  }

  // Support Ticket Form (WhatsApp Redirect)
  const supportForm = document.getElementById('support-form');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('support-email').value;
      const app = document.getElementById('support-app').value;
      const reqType = document.getElementById('support-type').value;
      const message = document.getElementById('support-message').value;
      
      const whatsappText = `Hello! I need support with the app "${app}".\nRequest Type: ${reqType}\nContact: ${email}\n\nDetails:\n${message}`;
      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/918866737102?text=${encodedText}`;
      
      showToast('Redirecting you to WhatsApp Support...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        supportForm.reset();
      }, 1000);
    });
  }
}

/* ==========================================================================
   9. Screenshot Gallery Lightbox
   ========================================================================== */
function initScreenshotGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  // Create lightbox markup
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'gallery-modal';
  modal.innerHTML = `
    <span class="modal-close" id="modal-close">&times;</span>
    <img class="modal-content" id="modal-img" alt="Screenshot Zoom View">
  `;
  document.body.appendChild(modal);

  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.getElementById('modal-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        modal.style.display = 'flex';
        modalImg.src = img.src;
      }
    });
  });

  const closeModal = () => {
    modal.style.display = 'none';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC Key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ==========================================================================
   10. App Filtering and Search Logic (Shared globally, executed on apps.html)
   ========================================================================== */
window.filterApps = function() {
  const searchInput = document.getElementById('app-search');
  const sortSelect = document.getElementById('app-sort');
  const chips = document.querySelectorAll('.categories-scroll .chip');
  const appCards = document.querySelectorAll('.app-grid .card');
  
  if (appCards.length === 0) return;

  let activeCategory = 'all';
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  // Get active chip
  chips.forEach(chip => {
    if (chip.classList.contains('active')) {
      activeCategory = chip.getAttribute('data-category');
    }
  });

  appCards.forEach(card => {
    const title = card.querySelector('.app-card-title').innerText.toLowerCase();
    const desc = card.querySelector('.app-card-desc').innerText.toLowerCase();
    const cardCategory = card.getAttribute('data-category');

    const matchesSearch = title.includes(query) || desc.includes(query);
    const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;

    if (matchesSearch && matchesCategory) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Sorting implementation if dropdown exists
  if (sortSelect) {
    const grid = document.querySelector('.app-grid');
    const visibleCards = Array.from(appCards);
    const sortBy = sortSelect.value;
    
    visibleCards.sort((a, b) => {
      if (sortBy === 'name') {
        const titleA = a.querySelector('.app-card-title').innerText.toLowerCase();
        const titleB = b.querySelector('.app-card-title').innerText.toLowerCase();
        return titleA.localeCompare(titleB);
      } else {
        // Default popular/order sort using data attributes
        const orderA = parseInt(a.getAttribute('data-order') || '100');
        const orderB = parseInt(b.getAttribute('data-order') || '100');
        return orderA - orderB;
      }
    });

    visibleCards.forEach(card => grid.appendChild(card));
  }
};

/* ==========================================================================
   11. Share App Link & Copy Utility Actions
   ========================================================================== */
window.shareAppLink = function(appName, url) {
  if (navigator.share) {
    navigator.share({
      title: appName,
      text: `Check out ${appName} on Google Play!`,
      url: url
    }).then(() => console.log('Successfully shared'))
      .catch((error) => console.log('Error sharing:', error));
  } else {
    // Copy fallback
    navigator.clipboard.writeText(url).then(() => {
      alert('Play Store link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
};

