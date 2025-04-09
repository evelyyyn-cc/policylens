// Diesel Policy Overview Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animate statistics when they come into view
    const animateStats = () => {
        const statElements = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const finalValue = el.textContent;
                    
                    // Skip if already animated
                    if (el.classList.contains('animated')) return;
                    
                    // Mark as animated
                    el.classList.add('animated');
                    
                    // Handle different formats (RM, percentage, etc.)
                    let prefix = '';
                    let suffix = '';
                    let targetNumber = 0;
                    
                    if (finalValue.includes('RM')) {
                        prefix = 'RM ';
                        targetNumber = parseFloat(finalValue.replace('RM', '').replace(/,/g, ''));
                    } else if (finalValue.includes('%')) {
                        suffix = '%';
                        targetNumber = parseFloat(finalValue.replace('%', ''));
                    } else {
                        targetNumber = parseFloat(finalValue.replace(/,/g, ''));
                    }
                    
                    let startValue = 0;
                    const duration = 1500; // ms
                    const startTime = performance.now();
                    
                    const updateCounter = (currentTime) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        
                        // Easing function for smoother animation
                        const easedProgress = 1 - Math.pow(1 - progress, 3);
                        
                        const currentValue = Math.floor(easedProgress * targetNumber);
                        
                        // Format the number with commas
                        const formattedValue = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        el.textContent = `${prefix}${formattedValue}${suffix}`;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    };
                    
                    // Start the animation
                    el.textContent = `${prefix}0${suffix}`;
                    requestAnimationFrame(updateCounter);
                }
            });
        }, { threshold: 0.1 });
        
        statElements.forEach(el => {
            observer.observe(el);
        });
    };
    
    animateStats();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's a tab (already handled)
            if (this.classList.contains('tab')) return;
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 120; // Header + tabs height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Optional: Add fade-in animation for elements
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.chart, .stats-card, .price-card, .criteria-card, .process-step, .status-card, .region-card, .roadmap-step, .benefits-list li');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        elements.forEach(el => {
            el.classList.add('animate-element');
            observer.observe(el);
        });
    };
    
    animateOnScroll();
});

// Add animation styles
document.head.insertAdjacentHTML('beforeend', `
<style>
    .animate-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .animate-element.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
</style>
`);
