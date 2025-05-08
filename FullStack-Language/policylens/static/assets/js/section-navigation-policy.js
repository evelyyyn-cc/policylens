document.addEventListener('DOMContentLoaded', function() {
    // Get all scroll indicators
    const scrollIndicators = document.querySelectorAll('.scroll-indicator-diesel-policy');
    
    // Add click event to each indicator
    scrollIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            // Check which icon is present to determine navigation direction
            const hasDownArrow = this.querySelector('.fa-arrow-down');
            const hasUpArrow = this.querySelector('.fa-arrow-up');
            const hasLongUpArrow = this.querySelector('.fa-arrow-up-long');
            
            if (hasDownArrow) {
                // Navigate to next section
                const currentSection = this.closest('section');
                const nextSection = currentSection.nextElementSibling;
                if (nextSection && nextSection.tagName === 'SECTION') {
                    smoothScrollTo(nextSection);
                }
            } else if (hasUpArrow) {
                // Navigate to previous section
                const currentSection = this.closest('section');
                const prevSection = currentSection.previousElementSibling;
                if (prevSection && prevSection.tagName === 'SECTION') {
                    smoothScrollTo(prevSection);
                }
            } else if (hasLongUpArrow) {
                // Navigate to top of page
                smoothScrollTo(document.body);
            }
        });
        
        // Add pointer cursor on hover to indicate it's clickable
        indicator.style.cursor = 'pointer';
    });
    
    // Smooth scroll function
    function smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});