// modules/base/navigationHighlighter.js

/**
 * Navigation Highlighter Module
 * Handles highlighting the current navigation link based on the current page
 */
export function highlightCurrentNavLink() {
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPath = window.location.pathname;
    
    navLinks.forEach((link) => {
      // Remove any existing active class
      link.classList.remove("active");
      
      // Get the link's href
      const linkPath = link.getAttribute("href");
      
      // Check for different page patterns
      if (
        // Exact match
        linkPath === currentPath ||
        // Home page
        (currentPath === "/" && linkPath === "/index/") ||
        // Policies page or any subpage
        (currentPath.includes("/policies/") && linkPath === "/policies/") ||
        // Diesel policy page
        (currentPath.includes("/diesel_policy/") && linkPath === "/diesel_policy/") ||
        // Datasets page
        (currentPath.includes("/datasets_page/") && linkPath === "/datasets_page/") ||
        // CPI impact page
        (currentPath.includes("/cpi_impact/") && linkPath === "/cpi_impact/") ||
        // CPI datasets page
        (currentPath.includes("/cpi_dataset/") && linkPath === "/cpi_dataset/")
      ) {
        link.classList.add("active");
      }
    });
  }
  
  /**
   * Sets up click handlers for navigation links
   */
  export function setupNavClickHandlers() {
    const navLinks = document.querySelectorAll(".nav-links a");
    
    navLinks.forEach((link) => {
      link.addEventListener("click", function() {
        // Remove active class from all links
        navLinks.forEach((item) => item.classList.remove("active"));
        
        // Add active class to clicked link
        this.classList.add("active");
      });
    });
  }
  
  /**
   * Initialize both highlighting and click handlers
   */
  export function initializeNavigation() {
    highlightCurrentNavLink();
    setupNavClickHandlers();
  }