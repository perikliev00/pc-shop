// Enhanced Navigation System
class Navigation {
  constructor() {
    this.navToggle = document.getElementById('navToggle');
    this.navbar = document.getElementById('navbar');
    this.isMenuOpen = false;
    
    this.init();
  }

  init() {
    if (!this.navToggle || !this.navbar) {
      console.warn('Navigation elements not found');
      return;
    }

    this.bindEvents();
    this.setupResponsiveBehavior();
  }

  bindEvents() {
    // Toggle button click
    this.navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target) && !this.navToggle.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close menu when clicking on navigation links
    this.navbar.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        this.closeMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.navbar.classList.add('active');
    this.navToggle.textContent = '✕';
    this.navToggle.style.color = '#3b82f6';
    this.isMenuOpen = true;
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    // Add focus trap for accessibility
    this.setupFocusTrap();
  }

  closeMenu() {
    this.navbar.classList.remove('active');
    this.navToggle.textContent = '☰';
    this.navToggle.style.color = '';
    this.isMenuOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Remove focus trap
    this.removeFocusTrap();
  }

  setupFocusTrap() {
    // Focus the first navigation link when menu opens
    const firstLink = this.navbar.querySelector('a');
    if (firstLink) {
      firstLink.focus();
    }
  }

  removeFocusTrap() {
    // Return focus to toggle button when menu closes
    this.navToggle.focus();
  }

  handleResize() {
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  setupResponsiveBehavior() {
    // Check initial screen size
    this.handleResize();
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
