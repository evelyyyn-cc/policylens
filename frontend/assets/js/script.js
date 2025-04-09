// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
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
    
    // Add CSS class for scroll animation effects
    const addScrollAnimations = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Add animate-on-scroll class to elements
    document.querySelectorAll('.service-card, .stat-item, .section-title, .who-content p, .why-matters-content p').forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    addScrollAnimations();
    
    // Featured Policy Slider
    const dots = document.querySelectorAll('.dot');
    const featuredPolicies = [
        {
            title: "Diesel Subsidy Reform: What's Going to Cost You?",
            description: "Subsidies are changing. Prices are rising.<br>Find out how this new policy could hit your wallet—and what it really means for your daily life."
        },
        {
            title: "New Education Budget: The Impact on Schools",
            description: "The government's latest education budget has major implications for schools across Malaysia.<br>Learn how this affects students, teachers, and families."
        },
        {
            title: "Healthcare System Changes: What You Need to Know",
            description: "Major restructuring in our healthcare system is coming.<br>Discover what services will change and how it affects your access to care."
        },
        {
            title: "Environmental Protection Act: New Regulations",
            description: "New environmental regulations are being implemented nationwide.<br>See how these changes will impact businesses and communities."
        }
    ];
    
    let currentSlide = 0;
    const featuredTitle = document.querySelector('#featured-policy h2');
    const featuredDescription = document.querySelector('#featured-policy p');
    
    // Initialize the dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });
    }
    
    function updateSlider() {
        // Update content
        if (featuredTitle && featuredDescription) {
            featuredTitle.textContent = featuredPolicies[currentSlide].title;
            featuredDescription.innerHTML = featuredPolicies[currentSlide].description;
        }
        
        // Update active dot
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Auto rotate slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % featuredPolicies.length;
        updateSlider();
    }, 7000);
    
    // Smooth scrolling for anchor links
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
                if (hamburger && navLinks) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Scroll effects
    const handleScroll = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        // Highlight current section in navigation
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Add animation effect when elements come into view
        const animatedElements = document.querySelectorAll('.service-card, .stat-item, .section-title');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Video Play button timer countdown
    const timerElement = document.querySelector('.timer');
    if (timerElement) {
        let seconds = 60;
        
        const updateTimer = () => {
            timerElement.innerHTML = seconds + '<span>sec</span>';
            
            if (seconds <= 0) {
                // Play video logic would go here
                timerElement.parentElement.innerHTML = '<i class="fas fa-play" style="font-size: 2rem;"></i>';
                return;
            }
            
            seconds--;
            setTimeout(updateTimer, 1000);
        };
        
        // Start the countdown when video container is visible in viewport
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateTimer();
                    observer.disconnect();
                }
            });
            
            observer.observe(videoContainer);
        }
    }
    
    // Language selector dropdown with click toggle
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
    
    // Counter animation for stats section
    const animateCounters = () => {
        const statsSection = document.getElementById('stats');
        const statNumbers = document.querySelectorAll('.stat-number');
        
        // Only run once
        let animated = false;
        
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
        
        observer.observe(statsSection);
    };
    
    // Call the counter animation function
    animateCounters();
    
    // Header scroll effect
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
    
    // Add animation classes
    document.querySelectorAll('.service-card, .stat-item').forEach(element => {
        element.classList.add('transition-element');
    });
});