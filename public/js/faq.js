// FAQ JavaScript - Dedicated file for FAQ functionality
console.log('FAQ JavaScript file loaded!');

// FAQ functionality
class FAQManager {
  constructor() {
    this.faqItems = [];
    this.init();
  }

  init() {
    console.log('Initializing FAQ Manager...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupFAQ());
    } else {
      this.setupFAQ();
    }
  }

  setupFAQ() {
    console.log('Setting up FAQ...');
    
    // Find all FAQ items
    this.faqItems = document.querySelectorAll('.faq-item');
    console.log(`Found ${this.faqItems.length} FAQ items`);
    
    if (this.faqItems.length === 0) {
      console.error('No FAQ items found!');
      return;
    }

    // Setup each FAQ item
    this.faqItems.forEach((item, index) => {
      this.setupFAQItem(item, index);
    });

    console.log('FAQ setup complete!');
    
    // Test if everything is working
    this.testFAQ();
  }

  setupFAQItem(item, index) {
    const container = item.querySelector('.faq-question-container');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    if (!container || !answer || !icon) {
      console.error(`Missing elements for FAQ item ${index}:`, { container, answer, icon });
      return;
    }

    // Set initial styles
    answer.style.maxHeight = '0px';
    answer.style.opacity = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'all 0.3s ease-in-out';

    // Add click event listener
    container.addEventListener('click', (e) => {
      console.log(`FAQ item ${index} clicked!`);
      e.preventDefault();
      e.stopPropagation();
      this.toggleFAQ(item, index);
    });

    // Add touch support for mobile
    container.addEventListener('touchstart', (e) => {
      console.log(`FAQ item ${index} touched!`);
      e.preventDefault();
      this.toggleFAQ(item, index);
    });

    console.log(`FAQ item ${index} setup complete`);
  }

  toggleFAQ(item, index) {
    console.log(`Toggling FAQ item ${index}...`);
    
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    if (!answer || !icon) {
      console.error(`Missing elements for toggle:`, { answer, icon });
      return;
    }

    const isActive = item.classList.contains('active');
    
    if (isActive) {
      // Collapse
      answer.style.maxHeight = '0px';
      answer.style.opacity = '0';
      icon.textContent = '+';
      item.classList.remove('active');
      console.log(`FAQ item ${index} collapsed`);
    } else {
      // Expand
      const scrollHeight = answer.scrollHeight;
      answer.style.maxHeight = scrollHeight + 'px';
      answer.style.opacity = '1';
      icon.textContent = '×';
      item.classList.add('active');
      console.log(`FAQ item ${index} expanded to height: ${scrollHeight}px`);
    }
  }

  testFAQ() {
    console.log('Testing FAQ functionality...');
    
    // Test if elements exist
    const testContainer = document.querySelector('.faq-question-container');
    const testAnswer = document.querySelector('.faq-answer');
    const testIcon = document.querySelector('.faq-icon');
    
    console.log('Test elements:', {
      container: testContainer,
      answer: testAnswer,
      icon: testIcon
    });

    // Test click simulation after 1 second
    setTimeout(() => {
      if (testContainer) {
        console.log('Simulating click on first FAQ item...');
        testContainer.click();
      }
    }, 1000);
  }
}

// Initialize FAQ when script loads
const faqManager = new FAQManager();

// Also expose globally for debugging
window.faqManager = faqManager;

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  console.log('Setting up mobile navigation...');
  
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('navbar');
  
  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      console.log('Mobile nav toggle clicked');
      nav.classList.toggle('active');
      
      // Change icon based on state
      if (nav.classList.contains('active')) {
        navToggle.textContent = '✕';
      } else {
        navToggle.textContent = '☰';
      }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('active');
        navToggle.textContent = '☰';
      }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        navToggle.textContent = '☰';
      });
    });
    
    console.log('Mobile navigation setup complete');
  } else {
    console.log('Mobile navigation elements not found:', { navToggle, nav });
  }
});
