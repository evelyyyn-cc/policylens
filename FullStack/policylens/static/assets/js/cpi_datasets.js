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
    // console.log("Calculated Percentages:", percentages); 

    const chartOptions = {
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
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        const labelIndex = context.dataIndex;
                        const label = context.chart.data.labels[labelIndex] || '';
                        const value = context.dataset.data[labelIndex] || 0;
                        const percentage = percentages[labelIndex];
                        const generatedString = `${label}: ${value} subclasses (${percentage}%)`;

                        // *** Your console log (should run if callback is called) ***
                        // console.log(`Tooltip Callback - Index: ${labelIndex}, Label: ${label}, Value: ${value}, Percentage: ${percentage}, Generated: "${generatedString}"`);

                        return generatedString;
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
        };

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
        options: chartOptions // Pass the options object
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
    const mapTabLink = document.querySelector('.main-tabs .tab-link[data-tab="state-data-map-tab"]');
    
    if (mapTabLink) {
        mapTabLink.addEventListener('click', function() {
            // Short delay to ensure the tab content is visible
            setTimeout(initializeMap, 100);
        });
    }
    
    // Also check if we need to initialize the map on page load
    setTimeout(function() {
        const mapTab = document.getElementById('state-data-map-tab');
        if (mapTab && mapTab.classList.contains('active')) {
            initializeMap();
        }
    }, 500);
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


// Malaysia map-related functions
let malaysiaMap; // Global map variable
let geoJsonLayer; // Global layer variable to allow updates
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
    
    // Add legend to map
    //addLegendToMap();
}

// function addLegendToMap() {
//     const legend = L.control({ position: 'bottomleft' });
    
//     legend.onAdd = function(map) {
//         const div = L.DomUtil.create('div', 'map-legend');
//         div.innerHTML = `
//             <h6>CPI Value Range</h6>
//             <div class="legend-gradient">
//                 <span>Lower</span>
//                 <div class="gradient-bar"></div>
//                 <span>Higher</span>
//             </div>
//         `;
//         return div;
//     };
    
//     legend.addTo(malaysiaMap);
// }

async function loadMalaysiaGeoJson() {
    try {
        // Fetch CPI data from the API
        const cpiData = await getCPIByStateByMonthName();
        
        // Fetch GeoJSON data 
        const response = await fetch('/static/my.json');

        if (!response.ok) {
            throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
        }
        
        const geojsonData = await response.json();
        
        // Process GeoJSON to map feature properties to our CPI dataset
        processGeoJson(geojsonData, cpiData);
        
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

function processGeoJson(geojsonData, cpiData) {
    // Map state names in GeoJSON to our CPI dataset keys
    const stateNameMapping = {
        'Johor': 'Johor',
        'Kedah': 'Kedah',
        'Kelantan': 'Kelantan',
        'Melaka': 'Melaka',
        'Negeri Sembilan': 'Negeri Sembilan',
        'Pahang': 'Pahang',
        'Perak': 'Perak',
        'Perlis': 'Perlis',
        'Pulau Pinang': 'Pulau Pinang',
        'Sabah': 'Sabah',
        'Sarawak': 'Sarawak',
        'Selangor': 'Selangor',
        'Terengganu': 'Terengganu',
        'Kuala Lumpur': 'W.P. Kuala Lumpur',
        'Labuan': 'W.P. Labuan',
        'Putrajaya': 'W.P. Putrajaya'
    };

    // Get the latest month from the data (assuming all states have the same latest month)
    let latestMonth = '';
    if (cpiData && Object.keys(cpiData).length > 0) {
        const firstState = Object.keys(cpiData)[0];
        latestMonth = Object.keys(cpiData[firstState])[0];
    }
    
    // Add CPI data to each feature
    geojsonData.features.forEach(feature => {
        const stateName = feature.properties.name;
        const mappedName = stateNameMapping[stateName];
        
        if (mappedName && cpiData[mappedName] && cpiData[mappedName][latestMonth]) {
            // Add CPI data to the feature properties
            feature.properties.cpi_data = cpiData[mappedName][latestMonth];
            // Add month information
            feature.properties.month = latestMonth;
        } else {
            console.warn(`No CPI data found for state: ${stateName} in month: ${latestMonth}`);
            // Add empty data to prevent errors
            feature.properties.cpi_data = {
                overall: 0,
                '01': 0,
                '04': 0, 
                '07': 0,
                '11': 0
            };
            feature.properties.month = latestMonth || 'Unknown';
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

// Get style for each feature based on CPI value
function getFeatureStyle(feature) {
    const overallCPI = feature.properties.cpi_data?.overall || 0;
    const color = getColorFromCPI(overallCPI);
    
    return {
        fillColor: color,
        weight: 1,
        opacity: 1,
        color: '#fff',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function getColorFromCPI(cpi) {
    // Color scale from light to dark
    // Assuming CPI values range roughly from 110 to 150 based on your data
    if (cpi <= 0) return '#f7f7f7';  // For missing data
    if (cpi < 120) return '#ffffcc';
    if (cpi < 125) return '#ffeda0';
    if (cpi < 130) return '#fed976';
    if (cpi < 135) return '#feb24c';
    if (cpi < 140) return '#fd8d3c';
    if (cpi < 145) return '#fc4e2a';
    if (cpi < 150) return '#e31a1c';
    return '#b10026'; // 150+ (dark red)
}

// Attach events to map features (states)
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

// Update the details panel with data from the selected region
function updateRegionDetails(feature) {
    const properties = feature.properties;
    const cpiData = properties.cpi_data;
    const month = properties.month;
    
    if (!cpiData) {
        console.warn('No CPI data for selected region');
        return;
    }
    
    // Update region name
    const regionNameElement = document.getElementById('selectedRegionName');
    if (regionNameElement) {
        regionNameElement.textContent = `${properties.name} (${month})`;
    }
    
    // Update overall CPI value
    const overallImpactElement = document.getElementById('overallImpactValue');
    if (overallImpactElement) {
        overallImpactElement.textContent = cpiData.overall ? cpiData.overall.toFixed(1) : 'N/A';
        
        // Set class based on value level
        const cpiLevel = getCPILevelClass(cpiData.overall);
        overallImpactElement.className = `summary-value ${cpiLevel}`;
    }
    
    // Update category values and bars
    updateCategoryDetail('transport', cpiData['07']);
    updateCategoryDetail('food', cpiData['01']);
    updateCategoryDetail('housing', cpiData['04']);
    updateCategoryDetail('restaurant', cpiData['11']);
}

// Update a category detail in the panel
function updateCategoryDetail(category, value) {
    const valueElement = document.getElementById(`${category}ImpactValue`);
    const barElement = document.getElementById(`${category}ImpactBar`);
    
    if (valueElement && barElement) {
        valueElement.textContent = value ? value.toFixed(1) : 'N/A';
        
        // Calculate bar width based on CPI value
        // Assuming values might range from 110 to 180
        const minCPI = 110; // baseline
        const maxCPI = 180; // high end
        const percentage = value ? Math.min(100, Math.max(0, ((value - minCPI) / (maxCPI - minCPI)) * 100)) : 0;
        barElement.style.width = `${percentage}%`;
        
        // Set color based on CPI level
        barElement.className = `impact-bar ${getCPILevelClass(value)}`;
    }
}

// Get class to represent CPI level
function getCPILevelClass(value) {
    if (!value || value <= 0) return 'impact-neutral';
    if (value < 130) return 'impact-low';
    if (value < 150) return 'impact-medium';
    return 'impact-high';
}

// Fetch latest CPI data by state
async function getLatestCPIByState() {
    try {
        const baseUrl = 'https://api.data.gov.my/data-catalogue';
        const dataId = 'cpi_state';
      
        // 1) Fetch the single most recent date
        const latestResp = await fetch(
            `${baseUrl}?id=${dataId}&sort=-date&limit=1`
        );
        
        if (!latestResp.ok) {
            throw new Error(`Failed to fetch latest date: ${latestResp.status}`);
        }
        
        const latestJson = await latestResp.json();
        
        if (!latestJson || !latestJson.length) {
            console.warn('No data found when fetching latest date');
            return [];
        }
        
        const latestDate = latestJson[0]['date']; 
        // e.g. "2025-03-01"
      
        // 2) Fetch all records for that date
        //    (we pick a high limit to ensure we grab all divisions)
        const allResp = await fetch(
            `${baseUrl}`
            + `?id=${dataId}`
            + `&date_start=${latestDate}@date`
            + `&date_end=${latestDate}@date`
            + `&limit=1000`
        );
        
        if (!allResp.ok) {
            throw new Error(`Failed to fetch data for date ${latestDate}: ${allResp.status}`);
        }
        
        const allJson = await allResp.json();
      
        // 3) Client-side filter for our five divisions
        const wanted = new Set(['overall','01','04','07','11']);
        const filtered = allJson.filter(r => wanted.has(r.division));
      
        return filtered;
    } catch (error) {
        console.error('Error fetching CPI data:', error);
        
        // For demonstration purposes, return mock data if API fails
        // This is just an example - in production, handle API failures more gracefully
        return getMockCPIData();
    }
}

// Transform raw CPI data into a structured format organized by state and month
async function getCPIByStateByMonthName() {
    try {
        const raw = await getLatestCPIByState();
        
        if (!raw || !raw.length) {
            console.warn('No data returned from getLatestCPIByState');
            return {};
        }

        const pivot = raw.reduce((acc, { date, state, division, index }) => {
            // derive the month name from the ISO date:
            // e.g. new Date("2025-03-01") → month "March"
            const monthName = new Date(date).toLocaleString('en-US', { month: 'long' });

            // init your state bucket
            if (!acc[state]) acc[state] = {};

            // init this month in that state
            if (!acc[state][monthName]) {
                acc[state][monthName] = {
                    overall: null,
                    '01': null,
                    '04': null,
                    '07': null,
                    '11': null
                };
            }

            // fill in the division
            acc[state][monthName][division] = index;
            return acc;
        }, {});

        return pivot;
    } catch (error) {
        console.error('Error processing CPI data:', error);
        return {};
    }
}