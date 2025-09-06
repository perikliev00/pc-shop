// ===== MODERN MOBILE NAVIGATION SYSTEM =====
// This file provides a smooth, modern mobile navigation experience

class MobileNavigation {
  constructor() {
    this.isOpen = false;
    this.navToggle = null;
    this.mobileNavOverlay = null;
    this.mobileNavClose = null;
    this.body = document.body;
    
    this.init();
  }

  init() {
    // Create mobile navigation elements
    this.createMobileNavigation();
    
    // Get references to elements
    this.navToggle = document.getElementById('mobile-nav-toggle');
    this.mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    this.mobileNavClose = document.getElementById('mobile-nav-close');
    
    // Bind events
    this.bindEvents();
    
    // Initial setup for responsive behavior
    this.handleResize();
    
    // Ensure button visibility on mobile immediately
    this.ensureButtonVisibility();
  }

  ensureButtonVisibility() {
    // Force button visibility check on mobile
    if (window.innerWidth <= 768) {
      if (this.navToggle) {
        this.navToggle.style.display = 'block';
        this.navToggle.style.visibility = 'visible';
        this.navToggle.style.opacity = '1';
      }
    }
  }

  createAuthDependentItems(linksContainer) {
    // Create login/register items (shown when not logged in)
    this.loginLi = document.createElement('li');
    this.loginLi.className = 'mobile-login-link';
    const loginA = document.createElement('a');
    loginA.href = '/login';
    loginA.innerHTML = '🔐 Login';
    this.loginLi.appendChild(loginA);
    
    this.registerLi = document.createElement('li');
    this.registerLi.className = 'mobile-register-link';
    const registerA = document.createElement('a');
    registerA.href = '/register';
    registerA.innerHTML = '📝 Register';
    this.registerLi.appendChild(registerA);
    
    // Create logout/admin items (shown when logged in)
    this.logoutLi = document.createElement('li');
    this.logoutLi.className = 'mobile-logout-link';
    this.logoutLi.style.display = 'none';
    const logoutA = document.createElement('a');
    logoutA.href = '#';
    logoutA.innerHTML = '🚪 Logout';
    logoutA.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleLogout();
    });
    this.logoutLi.appendChild(logoutA);
    
    this.adminLi = document.createElement('li');
    this.adminLi.className = 'mobile-admin-link';
    this.adminLi.style.display = 'none';
    const adminA = document.createElement('a');
    // Match desktop path and server route
    adminA.href = '/admin';
    adminA.innerHTML = '⚙️ Admin Panel';
    adminA.classList.add('admin-link');
    this.adminLi.appendChild(adminA);
    
    // Add all items to the navigation
    linksContainer.appendChild(this.loginLi);
    linksContainer.appendChild(this.registerLi);
    linksContainer.appendChild(this.logoutLi);
    linksContainer.appendChild(this.adminLi);
  }

  async checkAuthAndUpdateNav() {
    try {
      const response = await fetch('/session-status', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();

      if (data.isLoggedIn) {
        // User is logged in - show logout/admin, hide login/register
        if (this.loginLi) this.loginLi.style.display = 'none';
        if (this.registerLi) this.registerLi.style.display = 'none';
        if (this.logoutLi) this.logoutLi.style.display = 'block';

        // Show admin panel if user is admin
        if (data.email === 'admin@email.com') {
          if (this.adminLi) this.adminLi.style.display = 'block';
        } else {
          if (this.adminLi) this.adminLi.style.display = 'none';
        }
      } else {
        // User is not logged in - show login/register, hide logout/admin
        if (this.loginLi) this.loginLi.style.display = 'block';
        if (this.registerLi) this.registerLi.style.display = 'block';
        if (this.logoutLi) this.logoutLi.style.display = 'none';
        if (this.adminLi) this.adminLi.style.display = 'none';
      }
    } catch (error) {
      console.error('Error checking auth status for mobile nav:', error);
    }
  }

  async handleLogout() {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Clear any stored session data
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('loggedIn');
        
        // Update mobile navigation to show login/register
        this.checkAuthAndUpdateNav();
        
        // Close mobile navigation
        this.close();
        
        // Redirect to home page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  createMobileNavigation() {
    // Create mobile navigation overlay
    const overlay = document.createElement('div');
    overlay.id = 'mobile-nav-overlay';
    overlay.className = 'mobile-nav-overlay';
    
    // Create mobile navigation content
    const content = document.createElement('div');
    content.className = 'mobile-nav-content';
    
    // Create logo section with the same SVG logo as desktop
    const logo = document.createElement('div');
    logo.className = 'mobile-nav-logo';
    logo.innerHTML = `
      <div class="mobile-logo-container">
        <svg class="mobile-logo-icon" viewBox="0 0 40 40" aria-hidden="true">
          <rect x="2" y="2" width="36" height="28" rx="3" fill="none" stroke="#3b82f6" stroke-width="2"/>
          <rect x="6" y="6" width="28" height="20" rx="1" fill="none" stroke="#3b82f6" stroke-width="1"/>
          <rect x="16" y="32" width="8" height="4" fill="none" stroke="#3b82f6" stroke-width="2"/>
          <circle cx="20" cy="20" r="6" fill="none" stroke="#3b82f6" stroke-width="2"/>
          <path d="M18 18l4 4M22 18l-4 4" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="mobile-logo-text">PCSHOP</span>
      </div>
      <p>BUILD YOUR DREAM PC</p>
    `;
    
    // Create navigation links container
    const links = document.createElement('ul');
    links.className = 'mobile-nav-links';
    
    // Get current page to determine active link
    const currentPath = window.location.pathname;
    
    // Define base navigation items (always shown)
    const baseNavItems = [
      { href: '/', text: 'Home', icon: '🏠' },
      { href: '/cart', text: 'Cart', icon: '🛒' }
    ];
    
    // Create base navigation links
    baseNavItems.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.innerHTML = `${item.icon} ${item.text}`;
      
      // Add active class if current page
      if (currentPath === item.href) {
        a.classList.add('active');
      }
      
      li.appendChild(a);
      links.appendChild(li);
    });
    
    // Add authentication-dependent items (will be updated by updateMobileNav())
    this.createAuthDependentItems(links);
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.id = 'mobile-nav-close';
    closeBtn.className = 'mobile-nav-close';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Close mobile navigation');
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'mobile-nav-footer';
    footer.innerHTML = ''; // Remove copyright text
    
    // Assemble the mobile navigation
    content.appendChild(logo);
    content.appendChild(links);
    content.appendChild(footer);
    overlay.appendChild(content);
    overlay.appendChild(closeBtn);
    
    // Add to body
    document.body.appendChild(overlay);
    
    // Store reference to links container for updates
    this.mobileNavLinks = links;
    
    // Check authentication status and update navigation
    this.checkAuthAndUpdateNav();
  }

  bindEvents() {
    // Toggle button click
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggle());
    }
    
    // Close button click
    if (this.mobileNavClose) {
      this.mobileNavClose.addEventListener('click', () => this.close());
    }
    
    // Overlay click to close
    if (this.mobileNavOverlay) {
      this.mobileNavOverlay.addEventListener('click', (e) => {
        if (e.target === this.mobileNavOverlay) {
          this.close();
        }
      });
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Window resize to close on desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.close();
      }
    });
    
    // Prevent body scroll when navigation is open
    this.mobileNavOverlay?.addEventListener('touchmove', (e) => {
      if (this.isOpen) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Listen for login/logout events to update navigation
    window.addEventListener('storage', (e) => {
      if (e.key === 'loggedIn' || e.key === 'email') {
        this.checkAuthAndUpdateNav();
      }
    });
    
    // Also listen for custom events
    document.addEventListener('userLoggedIn', () => {
      this.checkAuthAndUpdateNav();
    });
    
    document.addEventListener('userLoggedOut', () => {
      this.checkAuthAndUpdateNav();
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    
    // Add active class
    this.mobileNavOverlay?.classList.add('active');
    
    // Add body class for overflow control
    this.body.classList.add('mobile-nav-open');
    
    // Prevent body scroll
    this.body.style.overflow = 'hidden';
    
    // Add animation class
    setTimeout(() => {
      this.mobileNavOverlay?.classList.add('fade-in');
    }, 10);
    
    // Focus management for accessibility
    this.mobileNavClose?.focus();
    
    // Announce to screen readers
    this.announceToScreenReader('Mobile navigation opened');
  }

  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    
    // Remove body class immediately
    this.body.classList.remove('mobile-nav-open');
    
    // Restore body scroll immediately
    this.body.style.overflow = '';
    
    // Add fade out animation
    this.mobileNavOverlay?.classList.add('fade-out');
    
    // Wait for animation to complete, then clean up classes
    setTimeout(() => {
      this.mobileNavOverlay?.classList.remove('active', 'fade-in', 'fade-out');
    }, 250);
    
    // Return focus to toggle button
    this.navToggle?.focus();
    
    // Announce to screen readers
    this.announceToScreenReader('Mobile navigation closed');
  }

  announceToScreenReader(message) {
    // Create temporary announcement element for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  handleResize() {
    // Close menu if resized to desktop view
    if (window.innerWidth > 768 && this.isOpen) {
      this.close();
    }
    
    // Ensure toggle button visibility is correct on resize
    if (window.innerWidth <= 768) {
      if (this.navToggle) {
        this.navToggle.style.display = 'block';
        this.navToggle.style.visibility = 'visible';
        this.navToggle.style.opacity = '1';
      }
    } else {
      if (this.navToggle) {
        this.navToggle.style.display = 'none';
      }
    }
  }
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileNavigation();
  
  // Fallback: Ensure button visibility even if class fails
  setTimeout(() => {
    const navToggle = document.getElementById('mobile-nav-toggle');
    if (navToggle && window.innerWidth <= 768) {
      navToggle.style.display = 'block';
      navToggle.style.visibility = 'visible';
      navToggle.style.opacity = '1';
    }
  }, 100);
});

// Also initialize on window load as backup
window.addEventListener('load', () => {
  const navToggle = document.getElementById('mobile-nav-toggle');
  if (navToggle && window.innerWidth <= 768) {
    navToggle.style.display = 'block';
    navToggle.style.visibility = 'visible';
    navToggle.style.opacity = '1';
  }
});

// Export for potential use in other scripts
window.MobileNavigation = MobileNavigation;
