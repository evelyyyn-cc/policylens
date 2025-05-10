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

                // Initialize category tabs when regional-impact-tab is activated
                if (tabId === 'regional-impact-tab') {
                    initializeCategoryTabIndicator();
                }
                
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

// Format number as currency
function formatCurrency(number) {
    return new Intl.NumberFormat('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

function calculatePercentage(number1, number2) {
    return (number1 - number2)/number2
}

function calculateImpact() {
    // Get values from sliders
    const transport = parseFloat(transportSlider.value);
    const food = parseFloat(foodSlider.value);
    const housing = parseFloat(housingSlider.value);
    const other = parseFloat(otherSlider.value);
    const location = locationSelect.value;
    
    // Initialize impact rates with default values
    let transportRate, foodRate, housingRate, otherRate;
    
    // Set rates based on location using data from the provided dataset calculatePercentage(,)
    switch(location) {
        case "Johor":
            transportRate = cpi_impact_data.Johor.transport_Rate;
            foodRate = cpi_impact_data.Johor.food_Rate;
            housingRate = cpi_impact_data.Johor.housing_Rate;
            otherRate = cpi_impact_data.Johor.restaurant_accommodation_Rate;
            break;
        case "Kedah":
            transportRate = cpi_impact_data.Kedah.transport_Rate;
            foodRate = cpi_impact_data.Kedah.food_Rate;
            housingRate = cpi_impact_data.Kedah.housing_Rate;
            otherRate = cpi_impact_data.Kedah.restaurant_accommodation_Rate;
            break;
        case "Kelantan":
            transportRate = cpi_impact_data.Kelantan.transport_Rate;
            foodRate = cpi_impact_data.Kelantan.food_Rate;
            housingRate = cpi_impact_data.Kelantan.housing_Rate;
            otherRate = cpi_impact_data.Kelantan.restaurant_accommodation_Rate;
            break;
        case "Melaka":
            transportRate = cpi_impact_data.Melaka.transport_Rate;
            foodRate = cpi_impact_data.Melaka.food_Rate;
            housingRate = cpi_impact_data.Melaka.housing_Rate;
            otherRate = cpi_impact_data.Melaka.restaurant_accommodation_Rate;
            break;
        case "Negeri Sembilan":
            transportRate = cpi_impact_data.Negeri_Sembilan.transport_Rate;
            foodRate = cpi_impact_data.Negeri_Sembilan.food_Rate;
            housingRate = cpi_impact_data.Negeri_Sembilan.housing_Rate;
            otherRate = cpi_impact_data.Negeri_Sembilan.restaurant_accommodation_Rate;
            break;
        case "Pahang":
            transportRate = cpi_impact_data.Pahang.transport_Rate;
            foodRate = cpi_impact_data.Pahang.food_Rate;
            housingRate = cpi_impact_data.Pahang.housing_Rate;
            otherRate = cpi_impact_data.Pahang.restaurant_accommodation_Rate;
            break;
        case "Perak":
            transportRate = cpi_impact_data.Perak.transport_Rate;
            foodRate = cpi_impact_data.Perak.food_Rate;
            housingRate = cpi_impact_data.Perak.housing_Rate;
            otherRate = cpi_impact_data.Perak.restaurant_accommodation_Rate;
            break;
        case "Perlis":
            transportRate = cpi_impact_data.Perlis.transport_Rate;
            foodRate = cpi_impact_data.Perlis.food_Rate;
            housingRate = cpi_impact_data.Perlis.housing_Rate;
            otherRate = cpi_impact_data.Perlis.restaurant_accommodation_Rate;
            break;
        case "Pulau Pinang":
            transportRate = cpi_impact_data.Pulau_Pinang.transport_Rate;
            foodRate = cpi_impact_data.Pulau_Pinang.food_Rate;
            housingRate = cpi_impact_data.Pulau_Pinang.housing_Rate;
            otherRate = cpi_impact_data.Pulau_Pinang.restaurant_accommodation_Rate;
            break;
        case "Sabah":
            transportRate = cpi_impact_data.Sabah.transport_Rate;
            foodRate = cpi_impact_data.Sabah.food_Rate;
            housingRate = cpi_impact_data.Sabah.housing_Rate;
            otherRate = cpi_impact_data.Sabah.restaurant_accommodation_Rate;
            break;
        case "Sarawak":
            transportRate = cpi_impact_data.Sarawak.transport_Rate;
            foodRate = cpi_impact_data.Sarawak.food_Rate;
            housingRate = cpi_impact_data.Sarawak.housing_Rate;
            otherRate = cpi_impact_data.Sarawak.restaurant_accommodation_Rate;
            break;
        case "Selangor":
            transportRate = cpi_impact_data.Selangor.transport_Rate;
            foodRate = cpi_impact_data.Selangor.food_Rate;
            housingRate = cpi_impact_data.Selangor.housing_Rate;
            otherRate = cpi_impact_data.Selangor.restaurant_accommodation_Rate;
            break;
        case "Terengganu":
            transportRate = cpi_impact_data.Terengganu.transport_Rate;
            foodRate = cpi_impact_data.Terengganu.food_Rate;
            housingRate = cpi_impact_data.Terengganu.housing_Rate;
            otherRate = cpi_impact_data.Terengganu.restaurant_accommodation_Rate;
            break;
        case "W.P. Kuala Lumpur":            // W.P. Kuala Lumpur in dataset
            transportRate = cpi_impact_data.W_P_Kuala_Lumpur.transport_Rate;
            foodRate = cpi_impact_data.W_P_Kuala_Lumpur.food_Rate;
            housingRate = cpi_impact_data.W_P_Kuala_Lumpur.housing_Rate;
            otherRate = cpi_impact_data.W_P_Kuala_Lumpur.restaurant_accommodation_Rate;
            break;
        case "W.P. Labuan":                  // W.P. Labuan in dataset
            transportRate = cpi_impact_data.W_P_Labuan.transport_Rate;
            foodRate = cpi_impact_data.W_P_Labuan.food_Rate;
            housingRate = cpi_impact_data.W_P_Labuan.housing_Rate;
            otherRate = cpi_impact_data.W_P_Labuan.restaurant_accommodation_Rate;
            break;
        case "W.P. Putrajaya":               // W.P. Putrajaya in dataset
            transportRate = cpi_impact_data.W_P_Putrajaya.transport_Rate;
            foodRate = cpi_impact_data.W_P_Putrajaya.food_Rate;
            housingRate = cpi_impact_data.W_P_Putrajaya.housing_Rate;
            otherRate = cpi_impact_data.W_P_Putrajaya.restaurant_accommodation_Rate;
            break;
            
        case "All States":               // W.P. Putrajaya in dataset
            transportRate = cpi_impact_data.All_States.transport_Rate;
            foodRate = cpi_impact_data.All_States.food_Rate;
            housingRate = cpi_impact_data.All_States.housing_Rate;
            otherRate = cpi_impact_data.All_States.restaurant_accommodation_Rate;
            break;
        default:
            // Default rates if location not found
            transportRate = 0.01;        // 1%
            foodRate = 0.015;            // 1.5%
            housingRate = 0.005;         // 0.5%
            otherRate = 0.01;            // 1%
            break;
    }
    
    // Calculate impacts
    const transportImpact = transport * transportRate;
    const foodImpact = food * foodRate;
    const housingImpact = housing * housingRate;
    const otherImpact = other * otherRate;
    
    // Total monthly impact
    const totalImpact = transportImpact + foodImpact + housingImpact + otherImpact;
    const totalMonthly = transport + food + housing + other;
    const percentageIncrease = (totalImpact / totalMonthly) * 100;
    const totalMonthlyAfter = totalMonthly + totalImpact;
    
    // Update the impact display
    // document.getElementById('transportImpact').textContent = `+ RM ${formatCurrency(transportImpact)}`;
    updateFinancialDisplay('transportImpact', transportImpact, transportImpact, true);
    document.getElementById('transportPercentage').textContent = `(${(transportRate * 100).toFixed(3)}% increase)`;
    
    // document.getElementById('foodImpact').textContent = `+ RM ${formatCurrency(foodImpact)}`;
    updateFinancialDisplay('foodImpact', foodImpact, foodImpact, true);
    document.getElementById('foodPercentage').textContent = `(${(foodRate * 100).toFixed(3)}% increase)`;
    
    // document.getElementById('housingImpact').textContent = `+ RM ${formatCurrency(housingImpact)}`;
    updateFinancialDisplay('housingImpact', housingImpact, housingImpact, true);
    document.getElementById('housingPercentage').textContent = `(${(housingRate * 100).toFixed(3)}% increase)`;
    
    // document.getElementById('otherImpact').textContent = `+ RM ${formatCurrency(otherImpact)}`;
    updateFinancialDisplay('otherImpact', otherImpact, otherImpact, true);
    document.getElementById('otherPercentage').textContent = `(${(otherRate * 100).toFixed(3)}% increase)`;
    
    // Update Monthly comparison
    document.getElementById('monthlyBefore').textContent = `RM ${formatCurrency(totalMonthly)}`;
    // document.getElementById('monthlyAfter').textContent = `RM ${formatCurrency(totalMonthly + totalImpact)}`;
    // document.getElementById('monthlyDifference').textContent = `+ RM ${formatCurrency(totalImpact)}`;
    document.getElementById('monthlyPercentage').textContent = `(${percentageIncrease.toFixed(1)}% increase from your total expenses)`;

    // For "After Policy", display the total value, but color based on the *impact*
    updateFinancialDisplay('monthlyAfter', totalMonthlyAfter, totalImpact, true);
    updateFinancialDisplay('monthlyDifference', totalImpact, totalImpact, true);
    
    // Update Yearly comparison
    const yearlyBefore = totalMonthly * 12;
    const yearlyAfter = totalMonthlyAfter * 12;
    const yearlyImpact = totalImpact * 12;
    
    document.getElementById('yearlyBefore').textContent = `RM ${formatCurrency(yearlyBefore)}`;
    // document.getElementById('yearlyAfter').textContent = `RM ${formatCurrency(yearlyAfter)}`;
    document.getElementById('yearlyDifference').textContent = `+ RM ${formatCurrency(yearlyImpact)}`;
    document.getElementById('yearlyPercentage').textContent = `(${percentageIncrease.toFixed(1)}% increase from your total yearly expenses)`;

    updateFinancialDisplay('yearlyAfter', yearlyAfter, yearlyImpact, true);
    updateFinancialDisplay('yearlyDifference', yearlyImpact, yearlyImpact, true);
}

/**
 * Updates the text content and CSS classes for an element to reflect financial values.
 * @param {string} elementId - The ID of the HTML element to update.
 * @param {number} valueToDisplay - The numerical value to be displayed.
 * @param {number} valueForColoring - The numerical value that determines the color (e.g., a change or impact).
 * @param {boolean} [isCurrency=true] - Whether the value is a currency.
 * @param {string} [prefixPositive="+ "] - Prefix for positive values (for differences/impacts).
 * @param {string} [prefixNegative="- "] - Prefix for negative values (for differences/impacts).
 * @param {string} [neutralPrefix="RM "] - Neutral prefix, typically for "After Policy" totals.
 */
function updateFinancialDisplay(elementId, valueToDisplay, valueForColoring, isCurrency = true, prefixPositive = "+ ", prefixNegative = "- ", neutralPrefix = "RM ") {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with ID ${elementId} not found.`);
        return;
    }

    const absValueToDisplay = Math.abs(valueToDisplay);
    const formattedDisplayValue = isCurrency ? `RM ${formatCurrency(absValueToDisplay)}` : `${absValueToDisplay.toFixed(2)}%`; // Adjust toFixed as needed for percentages

    let textContent;

    // Remove previous color classes
    element.classList.remove('text--positive', 'text--negative');

    // Determine text content and add new color class
    if (element.classList.contains('comparison-value--after')) { // For "After Policy" totals
        textContent = `${neutralPrefix}${formatCurrency(valueToDisplay)}`; // Display the actual total
        if (valueForColoring >= 0) {
            element.classList.add('text--positive');
        } else {
            element.classList.add('text--negative');
        }
    } else { // For differences and impact breakdown items
        if (valueForColoring >= 0) {
            textContent = `${prefixPositive}${formattedDisplayValue}`;
            element.classList.add('text--positive');
        } else {
            textContent = `${prefixNegative}${formattedDisplayValue}`;
            element.classList.add('text--negative');
        }
    }
    element.textContent = textContent;

    // Update associated percentage text and class
    // Assumes percentage element ID is derived (e.g., 'monthlyDifference' -> 'monthlyPercentage')
    // const percentageElementId = elementId.replace('Difference', 'Percentage').replace('Impact', 'Percentage').replace('After', 'Percentage');
    // const percentageElement = document.getElementById(percentageElementId);

    // if (percentageElement) {
    //     percentageElement.classList.remove('text--positive', 'text--negative');
    //     let percentageText = "";
    //     let percentageChangeForColoring = 0; // This will be the actual % change.

    //     // Calculate base values for percentage calculation
    //     const transportBase = parseFloat(transportSlider.value);
    //     const foodBase = parseFloat(foodSlider.value);
    //     const housingBase = parseFloat(housingSlider.value);
    //     const otherBase = parseFloat(otherSlider.value);
    //     const totalMonthlyOriginal = transportBase + foodBase + housingBase + otherBase;

    //     if (elementId.includes('monthly') || elementId.includes('yearly')) { // Covers After and Difference for overall summary
    //         let changeAmountForPercentage = valueForColoring; // For 'Difference', valueForColoring is the change.
    //          if (elementId.includes('After')) { // For 'After Policy', valueForColoring is totalImpact/yearlyImpact.
    //              // The displayed percentage should still be based on this change.
    //          }

    //         if (totalMonthlyOriginal > 0) {
    //             percentageChangeForColoring = (changeAmountForPercentage / totalMonthlyOriginal) * 100;
    //             if (percentageChangeForColoring >= 0) {
    //                 percentageText = `(${percentageChangeForColoring.toFixed(1)}% increase)`;
    //                 percentageElement.classList.add('text--positive');
    //             } else {
    //                 percentageText = `(${Math.abs(percentageChangeForColoring).toFixed(1)}% decrease)`;
    //                 percentageElement.classList.add('text--negative');
    //             }
    //         } else {
    //              percentageText = "(N/A)"; // Or empty if preferred
    //         }
    //     } else if (element.classList.contains('impact-value')) { // For breakdown items
    //         let originalItemValue = 0;
    //         if (elementId === 'transportImpact') originalItemValue = transportBase;
    //         else if (elementId === 'foodImpact') originalItemValue = foodBase;
    //         else if (elementId === 'housingImpact') originalItemValue = housingBase;
    //         else if (elementId === 'otherImpact') originalItemValue = otherBase;

    //         if (originalItemValue > 0) {
    //             percentageChangeForColoring = (valueForColoring / originalItemValue) * 100; // valueForColoring is the item's impact
    //             if (percentageChangeForColoring >= 0) {
    //                 percentageText = `(${percentageChangeForColoring.toFixed(1)}% increase)`;
    //                 percentageElement.classList.add('text--positive');
    //             } else {
    //                 percentageText = `(${Math.abs(percentageChangeForColoring).toFixed(1)}% decrease)`;
    //                 percentageElement.classList.add('text--negative');
    //             }
    //         } else {
    //             percentageText = "(N/A)"; // Or empty
    //         }
    //     }
    //     percentageElement.textContent = percentageText;
    // }
}

function setupCategoryTabs() {
    const categoryTabLinks = document.querySelectorAll('.category-tabs .category-tab-link');
    const categoryTabContents = document.querySelectorAll('.category-tab-content');
    const categoryTabIndicator = document.querySelector('.category-tab-indicator');
    
    // Immediately position the indicator for the active tab on page load
    const activeTab = document.querySelector('.category-tabs .category-tab-link.active');
    if (activeTab && categoryTabIndicator) {
        setTimeout(() => {
            const rect = activeTab.getBoundingClientRect();
            const parentRect = activeTab.parentElement.getBoundingClientRect();
            categoryTabIndicator.style.width = `${rect.width}px`;
            categoryTabIndicator.style.left = `${rect.left - parentRect.left}px`;
        }, 50); // Small delay to ensure DOM is ready
    }
    
    categoryTabLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            categoryTabLinks.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Move the indicator
            const rect = this.getBoundingClientRect();
            const parentRect = this.parentElement.getBoundingClientRect();
            categoryTabIndicator.style.width = `${rect.width}px`;
            categoryTabIndicator.style.left = `${rect.left - parentRect.left}px`;
            
            // Hide all tab contents
            categoryTabContents.forEach(content => content.classList.remove('active'));
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
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
            if (typeof closeAllDropdowns === 'function') {
                closeAllDropdowns();
            }
        });
    });
}

// Create a new function to initialize the category tab indicator
function initializeCategoryTabIndicator() {
    // Allow a small delay for the tab to be properly rendered
    setTimeout(() => {
        const activeCategoryTab = document.querySelector('.category-tabs .category-tab-link.active');
        const categoryTabIndicator = document.querySelector('.category-tab-indicator');
        if (activeCategoryTab && categoryTabIndicator) {
            const rect = activeCategoryTab.getBoundingClientRect();
            const parentRect = activeCategoryTab.parentElement.getBoundingClientRect();
            categoryTabIndicator.style.width = `${rect.width}px`;
            categoryTabIndicator.style.left = `${rect.left - parentRect.left}px`;
        }
    }, 50); // A short delay to ensure the tab is fully rendered
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

// Initialize Categories bar chart
function initializeCategoryCharts() {
    const ctxCategories = document.getElementById('categoriesChart').getContext('2d');
    // Initial data (e.g., for Johor)
    const initialLocation = 'Johor';
    const initialData = cpi_impact_data[initialLocation];
    const initialChartData = [
        (initialData.food_Rate * 100).toFixed(3),
        (initialData.restaurant_accommodation_Rate * 100).toFixed(3),
        (initialData.housing_Rate * 100).toFixed(3),
        (initialData.transport_Rate * 100).toFixed(3)
    ];

    charts.categoriesChart = new Chart(ctxCategories, { // Store instance in charts object
        type: 'bar',
        data: {
            labels: ['Food & Beverages', 'Restaurant & Accommodation Services', 'Housing, Water, Electricity, Gas & Others', 'Transport'],
            datasets: [{
                label: 'CPI Difference (%)', // Updated label
                data: initialChartData, // Use initial data
                backgroundColor: [
                    '#4285F4', // blue
                    '#DB4437', // red
                    '#0F9D58', // green
                    '#F4B400', // yellow
                ],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `CPI Difference by Category for ${initialLocation} (%)`, // Dynamic title
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                     callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(3) + '%';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Include a percent sign in the ticks
                        callback: function(value, index, ticks) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Helper function to get impact level class based on percentage
function getImpactLevelClass(percentage) {
    if (percentage < 0.5) return 'impact-low';
    if (percentage < 1.5) return 'impact-medium';
    return 'impact-high';
}

// Helper function to set impact meter style
function setImpactMeterStyle(element, impactClass) {
    element.className = 'impact-fill'; // Reset classes
    element.classList.add(impactClass);
    // Adjust width based on class (optional, can refine logic)
    // if (impactClass === 'impact-low') element.style.width = '30%';
    // else if (impactClass === 'impact-medium') element.style.width = '60%';
    // else element.style.width = '85%';
}

// Updates category bar chart and Table
function applyFilters() {
    const selectedLocationElement = document.querySelector('#regional-impact .dropdown-select span');
    if (!selectedLocationElement) {
        console.error("Could not find selected location element.");
        return;
    }
    const selectedLocation = selectedLocationElement.textContent.trim();

    // Sanitize location name for object key access (replace spaces, dots with underscores)
    const locationKey = selectedLocation.replace(/[\s.]+/g, '_');


    const locationData = cpi_impact_data[locationKey];

    if (!locationData) {
        console.error(`Data for location "${selectedLocation}" (key: "${locationKey}") not found.`);
        return; // Exit if data for the selected location isn't found
    }

    // --- Update Chart ---
    if (charts.categoriesChart) {
        const newData = [
            (locationData.food_Rate * 100),
            (locationData.restaurant_accommodation_Rate * 100),
            (locationData.housing_Rate * 100),
            (locationData.transport_Rate * 100)
        ];

        // Update chart data directly
        charts.categoriesChart.data.datasets[0].data = newData;

        // Update chart title
        charts.categoriesChart.options.plugins.title.text = `CPI Difference by Category for ${selectedLocation} (%)`;

        // Update the chart
        charts.categoriesChart.update();
    } else {
        console.error("Category chart instance not found.");
    }

    // *** IMPORTANT: Check if locationData exists FIRST ***
    if (!locationData) {
        console.error(`Data for location key "${locationKey}" not found.`);
        // Optionally clear the table or show a message
        // Clear previous data to avoid confusion
        document.getElementById('food-cpi-diff').textContent = '-';
        setImpactMeterStyle(document.getElementById('food-impact-meter'), '');
        document.getElementById('restaurant-cpi-diff').textContent = '-';
        setImpactMeterStyle(document.getElementById('restaurant-impact-meter'), '');
        document.getElementById('housing-cpi-diff').textContent = '-';
        setImpactMeterStyle(document.getElementById('housing-impact-meter'), '');
        document.getElementById('transport-cpi-diff').textContent = '-';
        setImpactMeterStyle(document.getElementById('transport-impact-meter'), '');
        // Clear or update chart title if needed
        if (charts.categoriesChart) {
             charts.categoriesChart.options.plugins.title.text = `Data not available for ${selectedLocation}`;
             charts.categoriesChart.data.datasets[0].data = [0, 0, 0, 0]; // Clear chart data
             charts.categoriesChart.update();
        }
        return; // Exit if data for the selected location isn't found
    }

     console.log("Location Data Found:", locationData); // Debug log

    // --- Update Table ---
    const foodCpiDiff = document.getElementById('food-cpi-diff');
    const foodImpactMeter = document.getElementById('food-impact-meter');
    const restaurantCpiDiff = document.getElementById('restaurant-cpi-diff');
    const restaurantImpactMeter = document.getElementById('restaurant-impact-meter');
    const housingCpiDiff = document.getElementById('housing-cpi-diff');
    const housingImpactMeter = document.getElementById('housing-impact-meter');
    const transportCpiDiff = document.getElementById('transport-cpi-diff');
    const transportImpactMeter = document.getElementById('transport-impact-meter');

    // Check if elements exist before updating
    if (foodCpiDiff && foodImpactMeter) {
        const foodPercent = (locationData.food_Rate * 100);
        foodCpiDiff.textContent = `${foodPercent.toFixed(3)}%`;
        const foodImpactClass = getImpactLevelClass(foodPercent);
        setImpactMeterStyle(foodImpactMeter, foodImpactClass);
         console.log(`Updated Food: ${foodPercent.toFixed(3)}%`, foodImpactClass); // Debug log
    } else {
         console.error("Food row elements not found");
    }

     if (restaurantCpiDiff && restaurantImpactMeter) {
        const restaurantPercent = (locationData.restaurant_accommodation_Rate * 100);
        restaurantCpiDiff.textContent = `${restaurantPercent.toFixed(3)}%`;
        const restaurantImpactClass = getImpactLevelClass(restaurantPercent);
         setImpactMeterStyle(restaurantImpactMeter, restaurantImpactClass);
         console.log(`Updated Restaurant: ${restaurantPercent.toFixed(3)}%`, restaurantImpactClass); // Debug log
    } else {
         console.error("Restaurant row elements not found");
    }

     if (housingCpiDiff && housingImpactMeter) {
        const housingPercent = (locationData.housing_Rate * 100);
        housingCpiDiff.textContent = `${housingPercent.toFixed(3)}%`;
        const housingImpactClass = getImpactLevelClass(housingPercent);
        setImpactMeterStyle(housingImpactMeter, housingImpactClass);
         console.log(`Updated Housing: ${housingPercent.toFixed(3)}%`, housingImpactClass); // Debug log
    } else {
         console.error("Housing row elements not found");
    }

    if (transportCpiDiff && transportImpactMeter) {
        const transportPercent = (locationData.transport_Rate * 100);
        transportCpiDiff.textContent = `${transportPercent.toFixed(3)}%`;
        const transportImpactClass = getImpactLevelClass(transportPercent);
        setImpactMeterStyle(transportImpactMeter, transportImpactClass);
         console.log(`Updated Transport: ${transportPercent.toFixed(3)}%`, transportImpactClass); // Debug log
    } else {
         console.error("Transport row elements not found");
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
    
    // Personal Price Impact Calculator
    // Get all sliders and their corresponding value displays
    const transportSlider = document.getElementById('transportSlider');
    const transportValue = document.getElementById('transportValue');
    const foodSlider = document.getElementById('foodSlider');
    const foodValue = document.getElementById('foodValue');
    const housingSlider = document.getElementById('housingSlider');
    const housingValue = document.getElementById('housingValue');
    const otherSlider = document.getElementById('otherSlider');
    const otherValue = document.getElementById('otherValue');
    const calculateBtn = document.getElementById('calculateBtn');
    const locationSelect = document.getElementById('locationSelect');
    
    // Update the value displays when sliders change
    transportSlider.addEventListener('input', function() {
        transportValue.textContent = `RM ${this.value}`;
    });
    
    foodSlider.addEventListener('input', function() {
        foodValue.textContent = `RM ${this.value}`;
    });
    
    housingSlider.addEventListener('input', function() {
        housingValue.textContent = `RM ${this.value}`;
    });
    
    otherSlider.addEventListener('input', function() {
        otherValue.textContent = `RM ${this.value}`; // Fixed: was using thiscategory-tab-indicator.value
    });

    // Calculate button functionality
    calculateBtn.addEventListener('click', calculateImpact);

    // Initialize with default values
    calculateImpact();

    // setup Regional CPI Categories
    setupCategoryTabs()

    // setupChartTypeToggle();
    setupDropdowns();

    // Initializecategory bar chart
    initializeCategoryCharts();

    // Apply filters initially based on the default selected location in the regional dropdown
    // Ensure the DOM is fully ready before trying to read the dropdown value
    setTimeout(() => {
        applyFilters();
    }, 100); // Delay slightly to ensure chart and dropdown are ready

    const mapTabLink = document.querySelector('.main-tabs .tab-link[data-tab="regional-map-tab"]');

    if (mapTabLink) {
        mapTabLink.addEventListener('click', function() {
            // Short delay to ensure the tab content is visible
            setTimeout(checkAndInitializeMap, 100);
        });
    }

    setTimeout(checkAndInitializeMap, 500);

});

// CPI Impact Page Data
const cpi_impact_data = {
    Johor: {
        transport_Rate: calculatePercentage(123.1,122.1),                // 0.819001%
        food_Rate: calculatePercentage(164.9,161.0),                     // 2.42236%
        housing_Rate: calculatePercentage(130.8,130.4),                  // 0.306748%
        restaurant_accommodation_Rate: calculatePercentage(153.7,151.7), // 1.318392%
        overall_Rate: calculatePercentage(137.0,136.0)
    },
    Kedah: {
        transport_Rate: calculatePercentage(116.3,115.5),                // 0.692641%
        food_Rate: calculatePercentage(141.8,140.7),                     // 0.781805%
        housing_Rate: calculatePercentage(132.7,132.5),                  // 0.150943%
        restaurant_accommodation_Rate: calculatePercentage(148.2,143.6), // 3.203343%
        overall_Rate: calculatePercentage(127.4,127.3)
    },
    Kelantan: {
        transport_Rate: calculatePercentage(117.3,117.2),                // 0.085324%
        food_Rate: calculatePercentage(146.5,146.4),                     // 0.068306%
        housing_Rate: calculatePercentage(120.3,120.0),                  // 0.25%
        restaurant_accommodation_Rate: calculatePercentage(131.9,130.8), // 0.840979%
        overall_Rate: calculatePercentage(129.3,129.4)
    },
    Melaka: {
        transport_Rate: calculatePercentage(113.0,111.7),                // 1.163832%
        food_Rate: calculatePercentage(156.0,152.9),                     // 2.027469%
        housing_Rate: calculatePercentage(132.5,131.4),                  // 0.837139%
        restaurant_accommodation_Rate: calculatePercentage(140.1,138.4), // 1.228324%
        overall_Rate: calculatePercentage(129.7,128.7)
    },
    Negeri_Sembilan: {
        transport_Rate: calculatePercentage(119.2,118.8),                // 0.3367%
        food_Rate: calculatePercentage(153.6,150.0),                     // 2.4%
        housing_Rate: calculatePercentage(127.8,126.0),                  // 1.428571%
        restaurant_accommodation_Rate: calculatePercentage(139.6,136.7), // 2.121434%
        overall_Rate: calculatePercentage(131.8,130.8)
    },
    Pahang: {
        transport_Rate: calculatePercentage(118.6,117.4),                // 1.022147%
        food_Rate: calculatePercentage(154.4,152.3),                     // 1.378858%
        housing_Rate: calculatePercentage(129.4,129.1),                  // 0.232378%
        restaurant_accommodation_Rate: calculatePercentage(140.2,137.9), // 1.667875%
        overall_Rate: calculatePercentage(131.6,131.1)
    },
    Perak: {
        transport_Rate: calculatePercentage(118.6,117.7),                // 0.764656%
        food_Rate: calculatePercentage(146.6,144.7),                     // 1.313062%
        housing_Rate: calculatePercentage(121.0,120.3),                  // 0.581879%
        restaurant_accommodation_Rate: calculatePercentage(147.9,146.7), // 0.817996%
        overall_Rate: calculatePercentage(128.3,127.7)
    },
    Perlis: {
        transport_Rate: calculatePercentage(114.6,113.6),                // 0.880282%
        food_Rate: calculatePercentage(139.0,137.4),                     // 1.164483%
        housing_Rate: calculatePercentage(119.8,119.9),                  // -0.083403%
        restaurant_accommodation_Rate: calculatePercentage(148.0,148.7), // -0.470746%
        overall_Rate: calculatePercentage(125.1,124.9)
    },
    Pulau_Pinang: {
        transport_Rate: calculatePercentage(120.0,119.8),                // 0.166945%
        food_Rate: calculatePercentage(163.4,161.1),                     // 1.427685%
        housing_Rate: calculatePercentage(137.0,136.4),                  // 0.439883%
        restaurant_accommodation_Rate: calculatePercentage(157.2,154.6), // 1.681759%
        overall_Rate: calculatePercentage(136.3,135.9)
    },
    Sabah: {
        transport_Rate: calculatePercentage(114.4,114.1),                // 0.262927%
        food_Rate: calculatePercentage(138.9,137.3),                     // 1.165331%
        housing_Rate: calculatePercentage(113.6,113.5),                  // 0.088106%
        restaurant_accommodation_Rate: calculatePercentage(163.0,157.3), // 3.623649%
        overall_Rate: calculatePercentage(122.5,122.2)
    },
    Sarawak: {
        transport_Rate: calculatePercentage(124.5,123.9),                // 0.484262%
        food_Rate: calculatePercentage(149.0,147.8),                     // 0.811908%
        housing_Rate: calculatePercentage(119.2,118.8),                  // 0.3367%
        restaurant_accommodation_Rate: calculatePercentage(148.7,145.8), // 1.989026%
        overall_Rate: calculatePercentage(127.9,127.6)
    },
    Selangor: {
        transport_Rate: calculatePercentage(127.2,127.4),                // -0.156986%
        food_Rate: calculatePercentage(171.0,167.7),                     // 1.9678%
        housing_Rate: calculatePercentage(135.4,134.5),                  // 0.669145%
        restaurant_accommodation_Rate: calculatePercentage(164.1,163.1), // 0.613121%
        overall_Rate: calculatePercentage(139.5,139)
    },
    Terengganu: {
        transport_Rate: calculatePercentage(118.8,118.3),                // 0.422654%
        food_Rate: calculatePercentage(146.9,143.8),                     // 2.155772%
        housing_Rate: calculatePercentage(118.2,117.9),                  // 0.254453%
        restaurant_accommodation_Rate: calculatePercentage(136.5,134.3), // 1.638124%
        overall_Rate: calculatePercentage(128.0,127.2)
    },
    W_P_Kuala_Lumpur: { // W.P. Kuala Lumpur in dataset
        transport_Rate: calculatePercentage(124.0,122.5),                // 1.22449%
        food_Rate: calculatePercentage(157.2,153.4),                     // 2.477184%
        housing_Rate: calculatePercentage(137.3,136.3),                  // 0.733676%
        restaurant_accommodation_Rate: calculatePercentage(154.7,151.4), // 2.179657%
        overall_Rate: calculatePercentage(133.6,132.5)
    },
    W_P_Labuan: { // W.P. Labuan in dataset
        transport_Rate: calculatePercentage(115.7,115.6),                // 0.086505%
        food_Rate: calculatePercentage(136.8,135.1),                     // 1.258327%
        housing_Rate: calculatePercentage(123.3,122.9),                  // 0.325468%
        restaurant_accommodation_Rate: calculatePercentage(147.8,145.8), // 1.371742%
        overall_Rate: calculatePercentage(123.2,123.2)
    },
    W_P_Putrajaya: { // W.P. Putrajaya in dataset
        transport_Rate: calculatePercentage(135.0,136.0),                // -0.735294%
        food_Rate: calculatePercentage(176.0,172.5),                     // 2.028986%
        housing_Rate: calculatePercentage(138.1,138.1),                  // 0%
        restaurant_accommodation_Rate: calculatePercentage(174.3,178.1), // -2.133633%
        overall_Rate: calculatePercentage(140.5,140.3)
    },
    All_States: {
        transport_Rate: calculatePercentage(121.8,121.3),                // 
        food_Rate: calculatePercentage(157.2,154.5),                     // 
        housing_Rate: calculatePercentage(130.0,129.3),                  // 
        restaurant_accommodation_Rate: calculatePercentage(153.6,151.6), // 
        overall_Rate: calculatePercentage(133.4,132.8)
    },
};

const filterOptions = {
    regions: [
        "All States",
        "Johor",
        "Kedah",
        "Kelantan",
        "Melaka",
        "Negeri Sembilan",
        "Pahang",
        "Perak",
        "Perlis",
        "Pulau Pinang",
        "Sabah",
        "Sarawak",
        "Selangor",
        "Terengganu",
        "W.P. Kuala Lumpur",
        "W.P. Labuan",
        "W.P. Putrajaya" 
    ]
}

// Imapct By Categories
const categories = Object.keys(cpi_impact_data.Johor);

const cpiImpactByCategory = categories.reduce((byCat, category) => {
    byCat[category] = Object.fromEntries(
      Object.entries(cpi_impact_data).map(([state, metrics]) => [
        state,
        metrics[category] * 100
      ])
    );
    return byCat;
  }, {});

function updateCategoryDetail(category, rateValue) {
    const valueElement = document.getElementById(`${category}ImpactValue`);
    const barElement = document.getElementById(`${category}ImpactBar`);
    const containerElement = valueElement.closest('.impact-category-item');
    
    if (valueElement && barElement) {
        const percentage = (rateValue * 100).toFixed(2);
        valueElement.textContent = `${percentage}%`;
        
        // Calculate bar width (max out at 100% for values over 3%)
        const barWidth = Math.min(percentage * 25, 100);
        barElement.style.width = `${barWidth}%`;
        
        // Set color based on impact level
        barElement.className = 'impact-bar ' + getImpactClass(percentage);

        const containerElement = valueElement.closest('.impact-category-item');
        if (containerElement) {
            containerElement.classList.add ('highlighted-category');
        }
    }
}

// Get impact class based on percentage value
function getImpactClass(percentage) {
    const value = parseFloat(percentage);
    if (value < 0) return 'impact-negative';
    if (value < 0.5) return 'impact-low';
    if (value < 2.0) return 'impact-medium';
    return 'impact-high';
}

function updateMapColors() {
    if (!geoJsonLayer) return;
    
    // Update each feature's style based on new category
    geoJsonLayer.eachLayer(function(layer) {
        layer.setStyle(getFeatureStyle(layer.feature));
    });
    
    // Update legend text
    updateLegendForCategory();
    
    // If a region is selected, update its details
    if (selectedRegion) {
        updateRegionDetails(selectedRegion.feature);
    }
}

function updateLegendForCategory() {
    // Customize legend titles based on the selected category
    const categoryTitles = {
        'overall_Rate': 'Overall Price Impact',
        'transport_Rate': 'Transportation',
        'food_Rate': 'Food & Beverages',
        'housing_Rate': 'Housing & Utilities',
        'restaurant_accommodation_Rate': 'Restaurants & Accommodation'
    };
    
    const legendTitle = document.querySelector('.map-legend h6');
    if (legendTitle) {
        legendTitle.textContent = categoryTitles[currentCategory] || 'Impact Level';
    }
}

function checkAndInitializeMap() {
    // Check if the map tab is active
    const mapTab = document.getElementById('regional-map-tab');
    
    if (mapTab && mapTab.classList.contains('active') && !malaysiaMap) {
        // Initialize map if not already initialized
        initializeMap();
    }
}

function attachFeatureEvents(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: selectRegion
    });
}

function highlightFeature(e) {
    const layer = e.target;
    
    // Don't highlight if this is the selected region
    if (selectedRegion === layer) return;
    
    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.8
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Reset highlight on mouseout
function resetHighlight(e) {
    const layer = e.target;
    
    // Don't reset if this is the selected region
    if (selectedRegion === layer) return;
    
    geoJsonLayer.resetStyle(layer);
}

// Handle region selection on click
function selectRegion(e) {
    const layer = e.target;
    const feature = layer.feature;
    
    // Reset previous selection if exists
    if (selectedRegion) {
        geoJsonLayer.resetStyle(selectedRegion);
    }
    
    // Set new selection
    selectedRegion = layer;
    
    // Highlight selected region
    layer.setStyle({
        weight: 3,
        color: '#222',
        dashArray: '',
        fillOpacity: 0.9
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    
    // Update details panel with selected region data
    updateRegionDetails(feature);
}

//Update the details panel with data from the selected region
function updateRegionDetails(feature) {
    const properties = feature.properties;
    const cpiData = properties.cpi_data;
    
    if (!cpiData) {
        console.warn('No CPI data for selected region');
        return;
    }
    
    // Update region name
    const regionNameElement = document.getElementById('selectedRegionName');
    if (regionNameElement) {
        regionNameElement.textContent = properties.name;
    }
    
    // Update overall impact value
    const overallImpactElement = document.getElementById('overallImpactValue');
    if (overallImpactElement) {
        const overallValue = (cpiData.overall_Rate * 100).toFixed(2);
        overallImpactElement.textContent = `${overallValue}%`;
        
        // Set class based on impact level
        overallImpactElement.className = 'summary-value ' + getImpactClass(overallValue);
    }
    
    // Update category values and bars
    updateCategoryDetail('transport', cpiData.transport_Rate);
    updateCategoryDetail('food', cpiData.food_Rate);
    updateCategoryDetail('housing', cpiData.housing_Rate);
    updateCategoryDetail('restaurant', cpiData.restaurant_accommodation_Rate);
    
    // Update regional factors based on selected region
    updateRegionalFactors(properties.name);
}// Add to the end of cpi_impact.js file

// Malaysia map-related functions
let malaysiaMap; // Global map variable
let geoJsonLayer; // Global layer variable to allow updates
let currentCategory = 'overall_Rate'; // Default selected category
let selectedRegion = null; // Track the currently selected region

// Map Initialization
function initializeMap() {
    // Check if map element exists
    const mapElement = document.getElementById('malaysiaMap');
    if (!mapElement) return;
    
    // Initialize the map centered on Malaysia
    malaysiaMap = L.map('malaysiaMap', {
        center: [4.2105, 109.6284], // Center coordinates for Malaysia
        zoom: 5,
        minZoom: 5,
        maxZoom: 9,
        zoomControl: true,
        attributionControl: true
    });
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(malaysiaMap);
    
    
    // Load and display Malaysia GeoJSON
    loadMalaysiaGeoJson();

    //addLegendToMap();
    
    // Set up event listener for category select dropdown
    const impactCategorySelect = document.getElementById('impactCategorySelect');
    if (impactCategorySelect) {
        impactCategorySelect.addEventListener('change', function() {
            currentCategory = this.value;
            updateMapColors();
        });
    }
    //legend.addTo(malaysiaMap); //changed here
}

// Fetch and load Malaysia GeoJSON
async function loadMalaysiaGeoJson() {
    try {
        // Fetch GeoJSON data from the provided GitHub gist
        //const response = await fetch('https://gist.githubusercontent.com/heiswayi/81a169ab39dcf749c31a/raw/4da7998b09fcbc77b9e282d3878601bd45b542f1/malaysia.geojson');
        const response = await fetch('/static/my.json');

        if (!response.ok) {
            throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
        }
        
        const geojsonData = await response.json();
        
        // Process GeoJSON to map feature properties to our CPI dataset
        processGeoJson(geojsonData);
        
        // Add the GeoJSON layer to the map
        addGeoJsonToMap(geojsonData);
        
    } catch (error) {
        console.error('Error loading Malaysia GeoJSON:', error);
        // Show user-friendly error message
        const mapElement = document.getElementById('malaysiaMap');
        if (mapElement) {
            mapElement.innerHTML = '<div class="map-error">Failed to load map data. Please try again later.</div>';
        }
    }
}

// Process GeoJSON to add CPI impact data
function processGeoJson(geojsonData) {
    // Map state names in GeoJSON to our CPI impact dataset keys
    const stateNameMapping = {
        'Johor': 'Johor',
        'Kedah': 'Kedah',
        'Kelantan': 'Kelantan',
        'Melaka': 'Melaka',
        'Negeri Sembilan': 'Negeri_Sembilan',
        'Pahang': 'Pahang',
        'Perak': 'Perak',
        'Perlis': 'Perlis',
        'Pulau Pinang': 'Pulau_Pinang',
        'Sabah': 'Sabah',
        'Sarawak': 'Sarawak',
        'Selangor': 'Selangor',
        'Terengganu': 'Terengganu',
        'Kuala Lumpur': 'W_P_Kuala_Lumpur',
        'Labuan': 'W_P_Labuan',
        'Putrajaya': 'W_P_Putrajaya',
        'W.P. Kuala Lumpur': 'W_P_Kuala_Lumpur',
        'W.P. Labuan': 'W_P_Labuan',
        'W.P. Putrajaya': 'W_P_Putrajaya'
    };

    // Add CPI impact data to each feature
    geojsonData.features.forEach(feature => {
        const stateName = feature.properties.name;
        const mappedName = stateNameMapping[stateName];
        
        if (mappedName && cpi_impact_data[mappedName]) {
            // Add CPI data to the feature properties
            feature.properties.cpi_data = cpi_impact_data[mappedName];
            // Add original property name to simplify lookup later
            feature.properties.data_key = mappedName;
        } else {
            console.warn(`No CPI data found for state: ${stateName}`);
            // Add empty data to prevent errors
            feature.properties.cpi_data = {
                overall_Rate: 0,
                transport_Rate: 0,
                food_Rate: 0,
                housing_Rate: 0,
                restaurant_accommodation_Rate: 0
            };
        }
    });
}

// Add the GeoJSON layer to the map with styling
function addGeoJsonToMap(geojsonData) {
    // Remove existing layer if present
    if (geoJsonLayer) {
        malaysiaMap.removeLayer(geoJsonLayer);
    }
    
    // Add new layer with styles
    geoJsonLayer = L.geoJson(geojsonData, {
        style: getFeatureStyle,
        onEachFeature: attachFeatureEvents
    }).addTo(malaysiaMap);
    
    // Fit map bounds to GeoJSON layer
    malaysiaMap.fitBounds(geoJsonLayer.getBounds());
}

// Get style for each feature based on CPI impact
function getFeatureStyle(feature) {
    const impactValue = getImpactValue(feature, currentCategory);
    const color = getColorFromImpact(impactValue);
    
    return {
        fillColor: color,
        weight: 1,
        opacity: 1,
        color: '#fff',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Get impact value for a feature based on current category
function getImpactValue(feature, category) {
    if (!feature.properties.cpi_data) return 0;
    
    // Get the value and convert it to percentage
    const value = feature.properties.cpi_data[category] || 0;
    return value * 100; // Convert to percentage
}

// Get color based on impact value
function getColorFromImpact(impact) {
    if (impact <= -2.0) return '#053061'; // Dark blue for highly negative
    if (impact <= -1.5) return '#2166ac'; 
    if (impact <= -1.0) return '#4393c3';
    if (impact <= -0.5) return '#92c5de';
    if (impact <= 0.0) return '#d1e5f0';
    //if (impact <= 0) return '#6baed6'; // Negative or zero (blue shade)
    
    // Color scale from light yellow to dark red
    if (impact < 0.1) return '#ffffcc';
    if (impact < 0.25) return '#ffeda0';
    if (impact < 0.5) return '#fed976';
    if (impact < 0.75) return '#feb24c';
    if (impact < 1.0) return '#fd8d3c';
    if (impact < 1.5) return '#fc4e2a';
    if (impact < 2.0) return '#e31a1c';
    return '#b10026'; // 3.5+ (dark red)
}

// Global object to store chart instances
const charts = {};