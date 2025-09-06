const navToggle = document.getElementById('navToggle');
const navbar = document.getElementById('navbar');

navToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
  
  // Update toggle icon
  if (navbar.classList.contains('active')) {
    navToggle.textContent = '✕';
    navToggle.style.color = '#3b82f6';
  } else {
    navToggle.textContent = '☰';
    navToggle.style.color = '';
  }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !navToggle.contains(e.target)) {
    navbar.classList.remove('active');
    navToggle.textContent = '☰';
    navToggle.style.color = '';
  }
});

// Close mobile menu when window is resized to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navbar.classList.remove('active');
    navToggle.textContent = '☰';
    navToggle.style.color = '';
  }
});

// Close mobile menu when clicking on a link
navbar.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navbar.classList.remove('active');
    navToggle.textContent = '☰';
    navToggle.style.color = '';
  }
});
