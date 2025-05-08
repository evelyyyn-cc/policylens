export function setupScrollEffects() {
    // Add animation class to elements
    document.querySelectorAll('.service-card, .stat-item, .section-title, .who-content p, .why-matters-content p').forEach(element => {
      element.classList.add('animate-on-scroll');
    });
  
    // Add animation effect when elements come into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, { threshold: 0.1 });
  
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  
    // Header scroll effect
    setupHeaderScrollEffect();
  
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
  }
  
  function setupHeaderScrollEffect() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
  
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
  
      // Hide/show header based on scroll direction
      if (window.scrollY > lastScrollY) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
  
      lastScrollY = window.scrollY;
    });
  }
  
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
  
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
  
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth'
          });
  
          // Close mobile menu if open
          const hamburger = document.getElementById('hamburger');
          const navLinks = document.getElementById('navLinks');
          if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
          }
        }
      });
    });
  }