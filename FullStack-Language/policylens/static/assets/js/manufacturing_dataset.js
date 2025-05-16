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
                // Ensure CPI chart initializes or updates if its tab is now active
                // if (tabId === 'cpi-line-tab' && charts.cpiChart) {
                //    // Chart might already be initialized, could call update if needed
                //    // applyCpiFilters(); // Or directly update
                // } else if (tabId === 'cpi-line-tab' && !charts.cpiChart) {
                //     // Initialize if switching to this tab for the first time after load
                //     initializeCpiChart();
                // }
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

    const dropdowns = document.querySelectorAll('.dropdown-select');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation();
            
            // Close any open dropdown menus first
            closeAllDropdowns();
            
            const dropdownContainer = this.closest('.filter-dropdown');
            const label = dropdownContainer.querySelector('label').textContent;
            let options = [];
            
            // Determine which options to show based on the label
            if (label.includes('Year')) {
                options = filterOptions.years;
            }  else if (label.includes('Region')) {
                options = filterOptions.regions;
            }
            
            // Create the dropdown menu
            const dropdownMenu = document.createElement('div');
            dropdownMenu.classList.add('dropdown-menu');

            // Ensure the container has relative positioning *before* calculating bounds
            dropdownContainer.style.position = 'relative';

            // Use getBoundingClientRect for more reliable positioning
            const selectRect = this.getBoundingClientRect();
            const containerRect = dropdownContainer.getBoundingClientRect();

            // Calculate position relative to the container
            // top = bottom edge of select box relative to container's top edge
            // left = left edge of select box relative to container's left edge
            const topPos = selectRect.bottom - containerRect.top;
            const leftPos = selectRect.left - containerRect.left;
            
            // Add styles to position the dropdown menu
            dropdownMenu.style.position = 'absolute';
            dropdownMenu.style.top = `${topPos}px`; // Position below the select box
            dropdownMenu.style.left = `${leftPos}px`; // Align with the left of the select box
            dropdownMenu.style.width = `${selectRect.width}px`; // Match the width of the select box

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
                
                // Style the option item
                optionItem.style.padding = '8px 12px';
                optionItem.style.cursor = 'pointer';
                optionItem.style.fontSize = '0.85rem';
                
                // Hover effect
                optionItem.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#f8f9fa';
                });
                
                optionItem.addEventListener('mouseout', function() {
                    this.style.backgroundColor = 'transparent';
                });
                
                // Select option
                optionItem.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const dropdownValueSpan = dropdown.querySelector('span');
                    dropdownValueSpan.textContent = option;
                    
                    // Apply filter to charts
                    const parentTab = dropdown.closest('.tab-content');
                     if (parentTab && parentTab.id === 'cpi-line-tab') {
                        applyCpiFilters(); // Specifically trigger CPI update
                     } else {
                         // Handle filters for other tabs if necessary
                         // applyOtherFilters();
                     }
                    
                    // Close the dropdown
                    dropdownMenu.remove();
                });
                
                dropdownMenu.appendChild(optionItem);
            });
            
            // Append the dropdown menu to the container
            dropdownContainer.style.position = 'relative';
            dropdownContainer.appendChild(dropdownMenu);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Set up interactive elements
    setupMainTabs();

    // Initialize charts for the initially active tab
    const activeTabLink = document.querySelector('.main-tabs .tab-link.active');
    // if (activeTabLink) {
    //     const activeTabId = activeTabLink.getAttribute('data-tab');
    //      if (activeTabId === 'cpi-line-tab') {
    //         initializeCpiChart();
    //     } else if (activeTabId === 'mcoicop-tab') {
    //         initializeMCOICOPChart();
    //     }
    //      // Add conditions for other tabs if they have charts
    // } else {
    //     // Fallback: Initialize CPI chart if no tab is marked active initially (or if needed as default)
    //      initializeCpiChart();
    // }


    // Smooth Transition with left + width for main tabs indicator
    const mainTabIndicator = document.querySelector('.main-tabs .tab-indicator');
    if (activeTabLink && mainTabIndicator) {
         setTimeout(() => {
            const rect = activeTabLink.getBoundingClientRect();
            const parentRect = activeTabLink.parentElement.getBoundingClientRect();
            mainTabIndicator.style.width = `${rect.width}px`;
            mainTabIndicator.style.left = `${rect.left - parentRect.left}px`;
            mainTabIndicator.style.opacity = '1'; // Make visible after positioning
         }, 50);
    }

    // Setup dropdowns for all tabs
    setupDropdowns(); 

});