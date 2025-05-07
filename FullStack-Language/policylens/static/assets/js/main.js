// Main JavaScript file that imports and initializes all modules
import { setupMobileNavigation } from './modules/base/mobileNavigation.js';
import { setupVideoPlayer } from './modules/videoPlayer.js';
import { setupLanguageSelector } from './modules/base/languageSelector.js';
import { setupStatCounters } from './modules/statsCounter.js';
import { setupScrollEffects } from './modules/scrollEffects.js';
import { setupFeaturedPolicySlider } from './modules/featuredSlider.js';

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Determine which page we're on
  const isHomePage = document.body.classList.contains('index-page');
  const isPoliciesPage = document.body.classList.contains('policies-page');
  const isDieselPolicyPage = document.body.classList.contains('diesel-policy-page');
  const isDatasetPage = document.body.classList.contains('datasets-page');
  const isCpiImpactPage = document.body.classList.contains('cpi-impact-page');
  const isCpiDatasetsPage = document.body.classList.contains('cpi-datasets-page');

  // Common components for all pages
  setupMobileNavigation();
  setupLanguageSelector();
  
  // Home page specific components
  if (isHomePage) {
    setupScrollEffects();
    setupFeaturedPolicySlider();
    setupStatCounters();
    setupVideoPlayer();
  }

  if (isPoliciesPage){
    import ('./modules/policies.js')
    .then (module => {module.initializePoliciesPage();
    })
    .catch(error => {console.error('Error loading policies page:',error);
    })
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