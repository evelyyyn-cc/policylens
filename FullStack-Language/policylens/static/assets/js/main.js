// Main JavaScript file that imports and initializes all modules
import { setupMobileNavigation } from './modules/base/mobileNavigation.js';
import { setupVideoPlayer } from './modules/index/videoPlayer.js';
import { setupLanguageSelector } from './modules/base/languageSelector.js';
import { setupStatCounters } from './modules/index/statsCounter.js';
import { setupScrollEffects } from './modules/index/scrollEffects.js';
// import { setupFeaturedPolicySlider } from './modules/index/featuredSlider.js';
import { initializeNavigation } from './modules/base/navLinks.js';

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Determine which page we're on
  const isHomePage = document.body.classList.contains('index-page');
  const isPoliciesPage = document.body.classList.contains('policies-page');
  const isDieselPolicyPage = document.body.classList.contains('diesel-policy-page');
  const isDatasetPage = document.body.classList.contains('datasets-page');
  const isCpiImpactPage = document.body.classList.contains('cpi-impact-page');
  const isCpiDatasetsPage = document.body.classList.contains('cpi-datasets-page');
  const isChatbotPage = document.body.classList.contains('chatbot-page');

  // Common components for all pages
  setupMobileNavigation();
  setupLanguageSelector();
  initializeNavigation();
  
  // Home page specific components
  if (isHomePage) {
    setupScrollEffects();
    // setupFeaturedPolicySlider();
    setupStatCounters();
    setupVideoPlayer();
  }

  if (isPoliciesPage){
    import ('./modules/policies/policies.js')
    .then (module => {module.initializePoliciesPage();
    })
    .catch(error => {console.error('Error loading policies page:',error);
    })
  }

    // Diesel Policy page specific components
  if (isDieselPolicyPage) {
    import('./modules/diesel_policy/diesel.js')
      .then(module => {
        module.initializeDieselPolicyPage();
      })
      .catch(error => {
        console.error('Error loading diesel policy page:', error);
      });
  }

    // Chatbot page
  if (isChatbotPage) {
    import('./modules/chatbot/chatbot.js')
      .then(module => {
        module.initChatbotPage();
      })
      .catch(error => {
        console.error('Error loading chatbot page:', error);
      });
  }
  
  // Other page-specific initializations can be added as needed
  // For example:
  /*
  if (isPoliciesPage) {
    import('./modules/policiesPage.js').then(module => {
      module.initializePoliciesPage();
    });
  }
  */
});