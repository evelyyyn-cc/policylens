// Helper function to check if we're on a mobile device
function isMobileDevice() { 
    return (window.innerWidth <= 768) || 
           (window.navigator.userAgent.match(/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i));
  }
  
  export function setupMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
  
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
      
      const navItems = navLinks.querySelectorAll('a');
      navItems.forEach(item => {
        item.addEventListener('click', function() {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          document.body.classList.remove('menu-open');
        });
      });
      
      document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)) {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      });
    }
  }
  
  export { isMobileDevice };