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
                if (tabId === 'cpi-line-tab' && charts.cpiChart) {
                   // Chart might already be initialized, could call update if needed
                   // applyCpiFilters(); // Or directly update
                } else if (tabId === 'cpi-line-tab' && !charts.cpiChart) {
                    // Initialize if switching to this tab for the first time after load
                    initializeCpiChart();
                }
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

// Initialize MCOICOP donut chart
function initializeMCOICOPChart() {
    const ctxMCOICOP = document.getElementById('mcoicopChart')?.getContext('2d');
    if (!ctxMCOICOP) return; // Exit if canvas not found

     // Prevent re-initialization
    if (charts.mcoicop) {
        charts.mcoicop.destroy();
    }
    
    // Get the 5-digit MCOICOP data
    const fiveDigitData = mcoicop_data.five_digit;
    
    // Prepare the data for Chart.js
    const labels = [
        'Food & Beverages',
        'Alcoholic Beverages & Tobacco',
        'Clothing & Footwear',
        'Housing, Water, Electricity, Gas & Other Fuels',
        'Furnishings & Household Equipment',
        'Health',
        'Transport',
        'Information & Communication',
        'Recreation, Sport & Culture',
        'Education',
        'Restaurant & Accommodation Services',
        'Insurance & Financial Services',
        'Personal Care & Miscellaneous'
    ];
    
    const data = [
        fiveDigitData.Food_Beverages,
        fiveDigitData.Alcoholic,
        fiveDigitData.Clothing_Footwear,
        fiveDigitData.Housing_Utilities,
        fiveDigitData.Furnishings,
        fiveDigitData.Health,
        fiveDigitData.Transport,
        fiveDigitData.Information,
        fiveDigitData.Recreation,
        fiveDigitData.Education,
        fiveDigitData.Restaurant_Accommodation,
        fiveDigitData.Insurance_Financial,
        fiveDigitData.Miscellaneous
    ];
    
    // Define more distinct colors for each segment
    const colors = [
        '#E63946', // Food & Beverages - bright red
        '#264cb5', // Alcoholic - dark blue
        '#F1C40F', // Clothing - vivid yellow
        '#2ECC71', // Housing - emerald green
        '#9B59B6', // Furnishings - amethyst purple
        '#FF9F1C', // Health - bright orange
        '#5f9cfe', // Transport - vibrant blue
        '#06D6A0', // Information - mint
        '#FF5733', // Recreation - persimmon
        '#8E44AD', // Education - wisteria
        '#F39C12', // Restaurant - orange
        '#16A085', // Insurance - green sea
        '#D35400'  // Personal Care - pumpkin
    ];
    
    // Calculate percentages for better display in tooltips
    const total = data.reduce((sum, value) => sum + value, 0);
    const percentages = data.map(value => ((value / total) * 100).toFixed(2));
    
    // Create and configure the chart
    charts.mcoicop = new Chart(ctxMCOICOP, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        fontSize: 12,
                        boxWidth: 15,
                        fontColor: '#333',
                        padding: 15
                    }
                },
                // title: {
                //     display: true,
                //     text: 'MCOICOP 5-Digit Subclasses Distribution',
                //     fontSize: 25,
                //     fontColor: '#333',
                //     padding: 20
                // },
                tooltips: {
                    enabled: true, // Make sure tooltips are enabled
                    callbacks: {
                        label: function(tooltipItem, data) {
                            const label = data.labels[tooltipItem.index];
                            const value = data.datasets[0].data[tooltipItem.index];
                            const percentage = percentages[tooltipItem.index];
                            return `${label}: ${value} subclasses (${percentage}%)`;
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.8)', // Darker tooltip background
                     titleFont: { size: 14 }, // Modern way to set font size
                     bodyFont: { size: 13 },
                     padding: 12
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1500
            },
            cutout: '45%' // Use percentage string
        }
    });
    console.log("MCOICOP Chart Initialized");
}

// ----- CPI Chart Specific Functions Start -----
// Fetch CPI data from the API
async function fetchCpiData(year, state) {
    const apiUrl = `http://127.0.0.1:8000/api/cpidata/?year=${year}&state=${state}`;
    const cpiChartContainer = document.getElementById('cpiChart')?.closest('.cpi-chart-container');

    try {
        // Add loading indication (Optional but recommended)
        if (cpiChartContainer && !cpiChartContainer.querySelector('.loading-overlay')) {
            cpiChartContainer.classList.add('loading');
            const loadingOverlay = document.createElement('div');
            loadingOverlay.classList.add('loading-overlay');
            loadingOverlay.innerHTML = '<div class="spinner"></div><p>Loading CPI data...</p>';
            cpiChartContainer.appendChild(loadingOverlay);
        }

        const response = await fetch(apiUrl);

        // Remove loading indication
         if (cpiChartContainer) {
            const loadingOverlay = cpiChartContainer.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
            cpiChartContainer.classList.remove('loading');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(`Fetched CPI data for ${year}, ${state}:`, data);
        return data;

    } catch (error) {
        console.error(`Error fetching CPI data for ${year}, ${state}:`, error);
         // Remove loading indication on error
         if (cpiChartContainer) {
            const loadingOverlay = cpiChartContainer.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
            cpiChartContainer.classList.remove('loading');
        }
        // Optionally display an error message to the user on the chart container
        if (cpiChartContainer) {
             cpiChartContainer.innerHTML = '<p class="error-message">Could not load CPI data. Please try again later.</p>';
        }
        return null; // Indicate failure
    }
}

// Transform API data into Chart.js format for the line chart
function transformCpiDataToChartFormat(apiData) {
    if (!apiData || apiData.length === 0) {
        return { labels: [], datasets: [] }; // Return empty structure if no data
    }

    // Extract labels (months) - handle partial year data automatically
    const labels = apiData.map(item => {
        const date = new Date(item.date + '-01'); // Add day for Date object
        return date.toLocaleString('default', { month: 'short' }); // Format as 'Jan', 'Feb', etc.
    });

    // Define the CPI categories and their colors
    const categories = [
        { key: 'Food & Beverages', color: '#E63946' }, // bright red
        { key: 'Utilities', color: '#2ECC71' }, // emerald green
        { key: 'Transport', color: '#5f9cfe' }, // vibrant blue
        { key: 'Restaurant & Accommodation', color: '#F39C12' }, // orange
        { key: 'Overall CPI', color: '#6c757d' } // gray (similar to diesel in example)
    ];

    // Create datasets for each category
    const datasets = categories.map(category => ({
        label: category.key,
        data: apiData.map(item => item[category.key]),
        borderColor: category.color,
        backgroundColor: category.color.replace(')', ', 0.1)').replace('rgb', 'rgba'), // Semi-transparent fill
        borderWidth: 2,
        fill: false, // Set to true if you want area fill under the lines
        tension: 0.1 // Slight curve to the lines
    }));

    return { labels, datasets };
}


// Initialize the CPI Line Chart
async function initializeCpiChart() {
    const ctxCpi = document.getElementById('cpiChart')?.getContext('2d');
    if (!ctxCpi) {
        console.error("CPI Chart canvas not found!");
        return;
    }

    // Prevent re-initialization
    if (charts.cpiChart) {
        charts.cpiChart.destroy();
    }

    // Get initial filter values (e.g., from the dropdown spans)
    const initialYear = document.querySelector('#cpi-line-tab .filter-dropdown:nth-child(1) .dropdown-select span')?.textContent || '2024';
    const initialState = document.querySelector('#cpi-line-tab .filter-dropdown:nth-child(2) .dropdown-select span')?.textContent || 'Johor';

    const apiData = await fetchCpiData(initialYear, initialState);

    let chartData;
    if (apiData) {
        chartData = transformCpiDataToChartFormat(apiData);
        dateArray = apiData.map(item => item.date); // Extract YYYY-MM dates
    } else {
        // Provide empty data structure if fetch failed to prevent Chart.js errors
         chartData = {
            labels: ['Failed to load data'],
            datasets: [{
                label: 'Error',
                data: [],
                borderColor: 'red',
                borderWidth: 1
            }]
        };
    }


    charts.cpiChart = new Chart(ctxCpi, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow chart to fill container height
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'CPI Value'
                    },
                    beginAtZero: false, // CPI values might not start at 0
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                },
                x: {
                     title: {
                        display: true,
                        text: 'Month'
                    },
                    grid: {
                        display: false // Hide vertical grid lines if desired
                    },
                     ticks: {
                       // maxRotation: 45, // Rotate labels if they overlap
                       // minRotation: 45,
                        autoSkip: false // Show all month labels
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top', // Or 'bottom', 'left', 'right'
                },
                tooltip: {
                    // Show tooltips for all datasets at the same x-index
                    mode: 'index', // 'nearest' to display only the hovered data point
                    intersect: false, // 'true' to display only the hovered data point
                    customData: {
                        dates: dateArray // Store initial dates here
                    },
                    callbacks: {
                        title: function(tooltipItems) {
                            // Access dates from chart options
                            const chart = tooltipItems[0].chart; // Get chart instance
                            
                            // Retrieve the stored dates
                            const currentDates = chart.options.plugins.tooltip.customData.dates;
                            const dataIndex = tooltipItems[0].dataIndex; // Get index of hovered point

                            // Check if dates and index are valid
                            if (currentDates && currentDates.length > dataIndex) {
                                const dateStr = currentDates[dataIndex]; // Get YYYY-MM string
                                if (dateStr) {
                                    const date = new Date(dateStr + '-01'); // Append day for Date object
                                    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
                                }
                            }
                            return ''; // Fallback
                        }
                    }
                }
            },
             animation: {
                duration: 500 // Shorter animation duration
            }
        }
    });
    console.log("CPI Chart Initialized");
}

// Update CPI chart with filtered data
async function updateCpiChart(year, state) {
     if (!charts.cpiChart) {
        console.log("CPI chart not initialized yet. Initializing first.");
        await initializeCpiChart(); // Initialize if called before ready
        return; // Initialization handles the first data load
    }

    const apiData = await fetchCpiData(year, state);

    if (apiData) {
        const updatedData = transformCpiDataToChartFormat(apiData);
        const newDateArray = apiData.map(item => item.date); // Extract new dates

        // Update chart data and labels
        charts.cpiChart.data.labels = updatedData.labels;
        charts.cpiChart.data.datasets = updatedData.datasets;

        // Update the stored dates in the chart options ***
        charts.cpiChart.options.plugins.tooltip.customData.dates = newDateArray;

        // Optional: Adjust Y-axis scale dynamically if needed
        // Find min/max across all datasets
        let minY = Infinity;
        let maxY = -Infinity;
        updatedData.datasets.forEach(dataset => {
            dataset.data.forEach(value => {
                if (value < minY) minY = value;
                if (value > maxY) maxY = value;
            });
        });

        // Add some padding to the Y-axis
        const padding = (maxY - minY) * 0.1; // 10% padding
         charts.cpiChart.options.scales.y.min = Math.floor(minY - padding); // Adjust as needed
         charts.cpiChart.options.scales.y.max = Math.ceil(maxY + padding); // Adjust as needed


        // Update the chart
        charts.cpiChart.update();
        console.log(`CPI Chart updated for ${year}, ${state}`);
    } else {
         console.error(`Failed to update CPI chart for ${year}, ${state} due to fetch error.`);
         // Optionally clear the chart or show an error message
         charts.cpiChart.data.labels = ['Failed to load data'];
         charts.cpiChart.data.datasets = [{ label: 'Error', data: [], borderColor: 'red' }];

         // Optionally clear stored dates on error
         charts.cpiChart.options.plugins.tooltip.customData.dates = [];

         charts.cpiChart.update();
    }
}


// Apply CPI filters when dropdowns change
function applyCpiFilters() {
     const cpiTab = document.getElementById('cpi-line-tab');
     if (!cpiTab || !cpiTab.classList.contains('active')) {
         return; // Only apply if the CPI tab is active
     }

     const yearFilter = cpiTab.querySelector('.filter-dropdown:nth-child(1) .dropdown-select span')?.textContent;
     const stateFilter = cpiTab.querySelector('.filter-dropdown:nth-child(2) .dropdown-select span')?.textContent;

     console.log('Applying CPI Filters:', { year: yearFilter, state: stateFilter });

     if (yearFilter && stateFilter) {
         updateCpiChart(yearFilter, stateFilter);
     } else {
         console.warn("Could not read CPI filter values.");
     }
}
// ----- CPI Chart Specific Functions End -----

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up interactive elements
    setupMainTabs();

    // Setup dropdowns for all tabs
    setupDropdowns(); 

    // Initialize charts for the initially active tab
    const activeTabLink = document.querySelector('.main-tabs .tab-link.active');
    if (activeTabLink) {
        const activeTabId = activeTabLink.getAttribute('data-tab');
         if (activeTabId === 'cpi-line-tab') {
            initializeCpiChart();
        } else if (activeTabId === 'mcoicop-tab') {
            initializeMCOICOPChart();
        }
         // Add conditions for other tabs if they have charts
    } else {
        // Fallback: Initialize CPI chart if no tab is marked active initially (or if needed as default)
         initializeCpiChart();
    }


    // Initialize MCOICOP chart if its tab exists (it might not be active initially)
     if (document.getElementById('mcoicop-tab')) {
         // Delay initialization slightly if it's not the active tab to potentially improve load performance
         if (!activeTabLink || activeTabLink.getAttribute('data-tab') !== 'mcoicop-tab') {
            setTimeout(initializeMCOICOPChart, 500);
         }
    }


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
});

// MCOICOP Data
const mcoicop_data = {
    four_digit: {
        Food_Beverages: 17,
        Alcoholic: 4,
        Clothing_Footwear: 4,
        Housing_Utilities: 8,
        Furnishings: 10,
        Health: 8,
        Transport: 12,
        Information: 8,
        Recreation: 13,
        Education: 5,
        Restaurant_Accommodation: 2,
        Insurance_Financial: 3,
        Miscellaneous: 7,
    },
    five_digit: {
        Food_Beverages: 58,
        Alcoholic: 4,
        Clothing_Footwear: 9,
        Housing_Utilities: 10,
        Furnishings: 21,
        Health: 16,
        Transport: 23,
        Information: 11,
        Recreation: 24,
        Education: 5,
        Restaurant_Accommodation: 3,
        Insurance_Financial: 3,
        Miscellaneous: 24,
    }
}

// Global object to store chart instances
const charts = {};

const filterOptions = {
    years: [
        '2010',
        '2011',
        '2012',
        '2013',
        '2014',
        '2015',
        '2016',
        '2017',
        '2018',
        '2019',
        '2020',
        '2021',
        '2022',
        '2023', 
        '2024', 
        '2025'],
    regions: [
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
};