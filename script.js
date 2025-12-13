let currentSlide = 0;
const totalSlides = 6;
let autoplayInterval;

// Theme toggle functionality
const storageKey = 'theme-preference';

const getColorPreference = () => {
  if (localStorage.getItem(storageKey))
    return localStorage.getItem(storageKey);
  else
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
};

const theme = {
  value: getColorPreference(),
};

const setPreference = () => {
  localStorage.setItem(storageKey, theme.value);
  reflectPreference();
};

const reflectPreference = () => {
  document.documentElement.setAttribute('data-theme', theme.value);
  document.querySelector('#theme-toggle')?.setAttribute('aria-label', theme.value);

  // Update body class for compatibility
  if (theme.value === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
};

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  setPreference();
};

// Set early so no page flashes
reflectPreference();

// Language toggle functionality
const langStorageKey = 'language-preference';

const getLanguagePreference = () => {
  if (localStorage.getItem(langStorageKey))
    return localStorage.getItem(langStorageKey);
  else
    return 'en';
};

let currentLang = getLanguagePreference();

const setLanguagePreference = () => {
  localStorage.setItem(langStorageKey, currentLang);
  reflectLanguagePreference();
};

const reflectLanguagePreference = () => {
  document.documentElement.setAttribute('data-lang', currentLang);
  document.querySelector('#lang-toggle')?.setAttribute('aria-label', currentLang === 'en' ? 'English' : 'Español');
  updateLanguage();
};

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  setLanguagePreference();
}

// Set early so no page flashes
reflectLanguagePreference();

function updateLanguage() {
  const elements = document.querySelectorAll('[data-en][data-es]');
  elements.forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = el.getAttribute(`data-${currentLang}`);
    } else {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    }
  });
}

function toggleMenu() {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('active');
}

function handleSubmit(e) {
  e.preventDefault();
  const message = currentLang === 'en'
    ? 'Thank you for your message! We will contact you soon.'
    : '¡Gracias por su mensaje! Nos pondremos en contacto pronto.';
  alert(message);
  e.target.reset();
}

// Carousel Functions
function moveCarousel(direction) {
  currentSlide += direction;
  if (currentSlide < 0) currentSlide = totalSlides - 1;
  if (currentSlide >= totalSlides) currentSlide = 0;
  updateCarousel();
  resetAutoplay();
}

function setCarousel(index) {
  currentSlide = index;
  updateCarousel();
  resetAutoplay();
}

function updateCarousel() {
  const carousel = document.getElementById('serviceCarousel');
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update dots
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function startAutoplay() {
  autoplayInterval = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

// Load saved preferences
window.onload = () => {
  // Set theme preference
  reflectPreference();

  // Set up theme toggle click listener
  document.querySelector('#theme-toggle').addEventListener('click', toggleTheme);

  // Set up language toggle click listener
  document.querySelector('#lang-toggle').addEventListener('click', toggleLanguage);

  // Sync with system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches: isDark }) => {
    theme.value = isDark ? 'dark' : 'light';
    setPreference();
  });

  // Set language preference
  reflectLanguagePreference();

  // Start carousel autoplay
  startAutoplay();

  // Close mobile menu when clicking a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mainNav').classList.remove('active');
    });
  });

  // Pause autoplay on hover
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });
  carouselContainer.addEventListener('mouseleave', () => {
    startAutoplay();
  });
};

function toggleFaq(button) {
  const faqItem = button.parentElement;
  const isActive = faqItem.classList.contains('active');

  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });

  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add('active');
  }
}
