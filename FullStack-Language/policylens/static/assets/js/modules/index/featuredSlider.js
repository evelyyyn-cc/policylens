// export function setupFeaturedPolicySlider() {
//     const dots = document.querySelectorAll('.dot');
//     const featuredPolicies = [
//       {
//         title: gettext("Diesel Subsidy Reform: What's Going to Cost You?"),
//         description: gettext("Subsidies are changing. Prices are rising.<br>Find out how this new policy could hit your wallet—and what it really means for your daily life.")
//       },
//       {
//         title: gettext("New Education Budget: The Impact on Schools"),
//         description: gettext("The government's latest education budget has major implications for schools across Malaysia.<br>Learn how this affects students, teachers, and families.")
//       },
//       {
//         title: gettext("Healthcare System Changes: What You Need to Know"),
//         description: gettext("Major restructuring in our healthcare system is coming.<br>Discover what services will change and how it affects your access to care.")
//       },
//       {
//         title: gettext("Environmental Protection Act: New Regulations"),
//         description: gettext("New environmental regulations are being implemented nationwide.<br>See how these changes will impact businesses and communities.")
//       }
//     ];
  
//     let currentSlide = 0;
//     const featuredTitle = document.querySelector('#featured-policy h2');
//     const featuredDescription = document.querySelector('#featured-policy p');
  
//     // Initialize the dots
//     if (dots.length > 0) {
//       dots.forEach((dot, index) => {
//         dot.addEventListener('click', () => {
//           currentSlide = index;
//           updateSlider();
//         });
//       });
//     }
  
//     function updateSlider() {
//       // Update content
//       if (featuredTitle && featuredDescription) {
//         featuredTitle.textContent = featuredPolicies[currentSlide].title;
//         featuredDescription.innerHTML = featuredPolicies[currentSlide].description;
//       }
  
//       // Update active dot
//       dots.forEach((dot, index) => {
//         if (index === currentSlide) {
//           dot.classList.add('active');
//         } else {
//           dot.classList.remove('active');
//         }
//       });
//     }
  
//     // Auto rotate slides
//     setInterval(() => {
//       currentSlide = (currentSlide + 1) % featuredPolicies.length;
//       updateSlider();
//     }, 7000);
//   }