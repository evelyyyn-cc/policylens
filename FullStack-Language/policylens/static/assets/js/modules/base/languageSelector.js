export function setupLanguageSelector() {
    const languageSelector = document.querySelector('.language-selector');
    
    if (languageSelector) {
      const selectedLanguage = languageSelector.querySelector('.selected-language span');
      const languageOptions = languageSelector.querySelectorAll('.language-dropdown li');
  
      // Toggle dropdown on click
      languageSelector.querySelector('.selected-language').addEventListener('click', function(e) {
        e.stopPropagation();
        languageSelector.classList.toggle('active');
      });
  
      // Close dropdown when clicking elsewhere
      document.addEventListener('click', function(e) {
        if (!languageSelector.contains(e.target)) {
          languageSelector.classList.remove('active');
        }
      });
  
      // Handle language selection
      languageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
          e.stopPropagation();
  
          // Update selected language text
          selectedLanguage.textContent = this.textContent;
  
          // Update active class
          languageOptions.forEach(opt => opt.classList.remove('active'));
          this.classList.add('active');
  
          // Get language code
          const langCode = this.getAttribute('data-lang');
  
          // This would be where you implement actual language switching
          console.log(`Switching to language: ${langCode}`);
  
          // Example of how you might change the language (placeholder logic)
          document.documentElement.lang = langCode;
  
          // Close dropdown
          languageSelector.classList.remove('active');
        });
      });
    }
  }