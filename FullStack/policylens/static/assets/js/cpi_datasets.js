// Set up main tab navigation
function setupMainTabs() {
    const tabLinks = document.querySelectorAll('.main-tabs .tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.querySelector('.tab-indicator');
    
    tabLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            tabLinks.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Move the indicator
            const rect = this.getBoundingClientRect();
            const parentRect = this.parentElement.getBoundingClientRect();
            tabIndicator.style.width = `${rect.width}px`;
            tabIndicator.style.left = `${rect.left - parentRect.left}px`;
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            // document.getElementById(tabId).classList.add('active');

            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
             
            
            // Refresh charts if needed to fix rendering issues
            setTimeout(() => {
                Object.values(charts).forEach(chart => {
                    if (chart && typeof chart.resize === 'function') {
                        chart.resize();
                    }
                });
            }, 100);

            // Close any open dropdowns when switching tabs
            closeAllDropdowns();
        });
    });
}

// Close all open dropdowns
function closeAllDropdowns() {
    const openDropdownMenus = document.querySelectorAll('.dropdown-menu');
    openDropdownMenus.forEach(menu => {
        menu.remove();
    });
}

// Create dropdown functionality
function setupDropdowns() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown-select') && !event.target.closest('.dropdown-menu')) {
            closeAllDropdowns();
        }
    });

    // Get the specific dropdown for regional impact
    const regionalDropdown = document.querySelector('#regional-impact .dropdown-select'); // More specific selector

    if (regionalDropdown) { // Check if the dropdown exists
        regionalDropdown.addEventListener('click', function(event) {
            event.stopPropagation();

            // Close any open dropdown menus first
            closeAllDropdowns();

            const dropdownContainer = this.closest('.filter-dropdown');
            const label = dropdownContainer.querySelector('label').textContent;
            let options = [];

            // Determine which options to show based on the label
            options = filterOptions.regions; // Assuming filterOptions is defined elsewhere with regions

            // Create the dropdown menu
            const dropdownMenu = document.createElement('div');
            dropdownMenu.classList.add('dropdown-menu');

            // Add styles to position the dropdown menu (consider moving to CSS)
            dropdownMenu.style.position = 'absolute';
            dropdownMenu.style.top = (this.offsetTop + this.offsetHeight) + 'px';
            dropdownMenu.style.left = this.offsetLeft + 'px';
            dropdownMenu.style.width = this.offsetWidth + 'px';
            dropdownMenu.style.backgroundColor = '#fff';
            dropdownMenu.style.border = '1px solid #dee2e6';
            dropdownMenu.style.borderRadius = '4px';
            dropdownMenu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            dropdownMenu.style.zIndex = '1000';
            dropdownMenu.style.maxHeight = '200px';
            dropdownMenu.style.overflowY = 'auto';

            // Add option items
            options.forEach(option => {
                const optionItem = document.createElement('div');
                optionItem.classList.add('dropdown-item');
                optionItem.textContent = option;

                // Style the option item (consider moving to CSS)
                optionItem.style.padding = '8px 12px';
                optionItem.style.cursor = 'pointer';
                optionItem.style.fontSize = '0.95rem';

                // Hover effect (consider moving to CSS)
                optionItem.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#f8f9fa';
                });

                optionItem.addEventListener('mouseout', function() {
                    this.style.backgroundColor = 'transparent';
                });

                // Select option
                optionItem.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const dropdownValueSpan = regionalDropdown.querySelector('span');
                    dropdownValueSpan.textContent = option;

                    // Apply filter to charts and table
                    applyFilters(); // Call applyFilters when an option is selected

                    // Close the dropdown
                    dropdownMenu.remove();
                });

                dropdownMenu.appendChild(optionItem);
            });

            // Append the dropdown menu to the container
            dropdownContainer.style.position = 'relative'; // Ensure container is positioned
            dropdownContainer.appendChild(dropdownMenu);
        });
    } else {
        console.warn("Regional impact dropdown not found."); // Add a warning if selector fails
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up interactive elements
    setupMainTabs();
    
    // Smooth Transition with left + width for main tabs
    const activeMainTab = document.querySelector('.main-tabs .tab-link.active');
    const mainTabIndicator = document.querySelector('.main-tabs .tab-indicator');
    if (activeMainTab && mainTabIndicator) {
        // Use setTimeout to ensure layout is complete
         setTimeout(() => {
            const rect = activeMainTab.getBoundingClientRect();
            const parentRect = activeMainTab.parentElement.getBoundingClientRect();
            mainTabIndicator.style.width = `${rect.width}px`;
            mainTabIndicator.style.left = `${rect.left - parentRect.left}px`;
         }, 50);
    }

});