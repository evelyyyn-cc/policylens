// Policies page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation for policy cards
    const policyCards = document.querySelectorAll('.policy-card');
    
    // Add fade-in animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observe each policy card
    policyCards.forEach(card => {
        card.classList.add('animate-policy-card');
        observer.observe(card);
    });
    
    // Update header highlight for policy page
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '/policies/') {
            link.classList.add('active');
        }
    });
    
    // Optional: Filter functionality for policies
    // This can be expanded based on requirements
    const setupFilters = () => {
        // Placeholder for future filter implementation
        console.log('Ready to implement policy filters');
    };
    
    // Optional: Load more policies functionality
    let currentPage = 1;
    const loadMorePolicies = async (page) => {
        // This would typically fetch more policies from an API
        // For now, it's a placeholder
        console.log(`Loading page ${page} of policies`);
        
        // Mock API call
        // const response = await fetch(`/api/policies?page=${page}`);
        // const data = await response.json();
        // renderPolicies(data);
    };
    
    // Function to render policies (would be used with real data)
    
    const renderPolicies = (policiesData) => {
        const container = document.querySelector('.policies-container');
        
        policiesData.forEach(policy => {
            const policyCard = document.createElement('div');
            policyCard.className = 'policy-card animate-policy-card';
            policyCard.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${policy.imageUrl}')`;
            
            policyCard.innerHTML = `
                <div class="policy-content">
                    <h3>${policy.title}</h3>
                    <div class="policy-meta">${policy.date} : ${policy.type}</div>
                    <p>${policy.description}</p>
                    <a href="${policy.detailUrl}" class="read-more-btn">Read More</a>
                </div>
            `;
            
            container.appendChild(policyCard);
            observer.observe(policyCard);
        });
    };
});

// Add animation styles
document.head.insertAdjacentHTML('beforeend', `
<style>
    .animate-policy-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-policy-card.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
</style>
`);
