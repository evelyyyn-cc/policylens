import { isMobileDevice } from './base/mobileNavigation.js';

export function setupStatCounters() {
  const animateCounters = () => {
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');

    // Only run once
    let animated = false;

    if (isMobileDevice()) {
      const mobileObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
          animated = true;

          statNumbers.forEach(counter => {
            // For mobile, just set the final value directly
            const target = counter.getAttribute('data-target') || counter.textContent;
            counter.textContent = target;
          });

          mobileObserver.disconnect();
        }
      }, { threshold: 0.2 }); // Lower threshold for mobile

      if (statsSection) {
        mobileObserver.observe(statsSection);
      }
    } else {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
          animated = true;

          statNumbers.forEach(counter => {
            const target = counter.textContent;
            let isDecimal = target.includes('.');
            let hasSlash = target.includes('/');

            // Set starting point
            counter.textContent = '0';
            if (hasSlash) {
              counter.textContent = '0/100';
            }

            let start = 0;
            const duration = 2000; // ms
            const startTime = performance.now();

            if (hasSlash) {
              // Handle fraction like 50/100
              const targetValue = parseInt(target.split('/')[0]);

              const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentValue = Math.floor(progress * targetValue);

                counter.textContent = `${currentValue}/100`;

                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                }
              };

              requestAnimationFrame(updateCounter);
            } else if (isDecimal) {
              // Handle decimal like 32.8M
              const suffix = target.match(/[A-Za-z]+$/)[0]; // Extract M, K, etc.
              const targetValue = parseFloat(target.replace(suffix, ''));

              const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentValue = (progress * targetValue).toFixed(1);

                counter.textContent = `${currentValue}${suffix}`;

                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                }
              };

              requestAnimationFrame(updateCounter);
            } else {
              // Handle whole number
              const targetValue = parseInt(target);

              const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentValue = Math.floor(progress * targetValue);

                counter.textContent = currentValue;

                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                }
              };

              requestAnimationFrame(updateCounter);
            }
          });

          // Disconnect after animation is done
          observer.disconnect();
        }
      }, { threshold: 0.5 });

      if (statsSection) {
        observer.observe(statsSection);
      }
    }
  };

  // Call the counter animation function
  animateCounters();
}