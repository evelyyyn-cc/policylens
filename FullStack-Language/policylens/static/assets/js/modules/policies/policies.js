export function initializePolicyCards() {
  const policyCards = document.querySelectorAll(".policy-card");

  // Add fade-in animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  // Observe each policy card
  policyCards.forEach((card) => {
    card.classList.add("animate-policy-card");
    observer.observe(card);
  });
}

// export function highlightPolicyNavLink() {
//   const navLinks = document.querySelectorAll(".nav-links a");
//   navLinks.forEach((link) => {
//     link.classList.remove("active");
//     if (link.getAttribute("href") === "/policies/") {
//       link.classList.add("active");
//     }
//   });
// }

export function setupFilters() {
  // Placeholder for future filter implementation
  console.log(gettext("Ready to implement policy filters"));
}

// Main initialization function for the policies page
export function initializePoliciesPage() {
  // Add animation styles
  addAnimationStyles();

  // Initialize policy cards
  initializePolicyCards();

  // Highlight correct nav link
  // highlightPolicyNavLink();
}

// Add animation styles
function addAnimationStyles() {
  // Add CSS dynamically if needed, though you might want to move this to your CSS files
  if (!document.getElementById("policy-animations-style")) {
    const styleElement = document.createElement("style");
    styleElement.id = "policy-animations-style";
    styleElement.textContent = `
        .animate-policy-card {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
  
        .animate-policy-card.fade-in {
          opacity: 1;
          transform: translateY(0);
        }
      `;
    document.head.appendChild(styleElement);
  }
}
