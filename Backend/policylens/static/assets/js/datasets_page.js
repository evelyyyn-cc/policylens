async function fetchFuelPrices(fuelType, startDate, endDate) {
    try {
        // Add a loading indication
        const dieselChartContainer = document.querySelector('#dieselPriceChart').closest('.chart-container');
        if (dieselChartContainer) {
            dieselChartContainer.classList.add('loading');
            
            // Create a loading overlay if it doesn't exist
            if (!dieselChartContainer.querySelector('.loading-overlay')) {
                const loadingOverlay = document.createElement('div');
                loadingOverlay.classList.add('loading-overlay');
                loadingOverlay.innerHTML = '<div class="spinner"></div><p>Loading data...</p>';
                dieselChartContainer.appendChild(loadingOverlay);
            }
        }
        
        // Fetch from the API
        const response = await fetch(`http://localhost:8000/api/fuel-prices/?fuel_type=${fuelType}&start_date=${startDate}&end_date=${endDate}`);
        
        // Remove loading indication
        if (dieselChartContainer) {
            const loadingOverlay = dieselChartContainer.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
            dieselChartContainer.classList.remove('loading');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${fuelType} data:`, error);
        
        // Remove loading indication in case of error
        const dieselChartContainer = document.querySelector('#dieselPriceChart').closest('.chart-container');
        if (dieselChartContainer) {
            const loadingOverlay = dieselChartContainer.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
            dieselChartContainer.classList.remove('loading');
        }
        
        return null;
    }
}

// Format dates for x-axis labels (from YYYY-MM-DD to DD MMM YYYY)
function formatDateLabels(dateArray) {
    return dateArray.map(dateStr => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
    });
}

// Transform API data to chart.js format
function transformApiDataToChartFormat(apiData, fuelType) {
    // Determine which data property to use based on the fuelType
    let fuelTypeKey = fuelType.toLowerCase().replace(' ', '_');
    console.log('Fuel Type Key:', fuelTypeKey);
    if(fuelTypeKey === 'diesel_euro5') {
        fuelTypeKey = 'diesel_eastern';}
    const dataValues = apiData[fuelTypeKey] || [];
    
    // Generate the color based on fuel type
    let borderColor, backgroundColor;
    
    switch(fuelType) {
        case 'RON95':
            borderColor = '#4fc3f7';
            backgroundColor = 'rgba(79, 195, 247, 0.3)';
            break;
        case 'RON97':
            borderColor = '#5c6bc0';
            backgroundColor = 'rgba(92, 107, 192, 0.1)';
            break;
        case 'Diesel':
            borderColor = '#6c757d';
            backgroundColor = 'rgba(108, 117, 125, 0.1)';
            break;
        case 'Diesel Euro5':
            borderColor = '#0d47a1';
            backgroundColor = 'rgba(13, 71, 161, 0.1)';
            break;
        default:
            borderColor = '#4fc3f7';
            backgroundColor = 'rgba(79, 195, 247, 0.3)';
    }
    
    // Create a dataset with the fuel prices
    const transformedData = {
        labels: formatDateLabels(apiData.date),
        datasets: [
            {
                label: fuelType,
                data: dataValues,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }
        ]
    };
    
    return transformedData;
}

// Dummy data for all charts (will be updated with API data where available)
const chartData = {
    // Diesel Vehicle Types Distribution (2024)
    vehicleTypesData: {
        labels: ['Diesel', 'Petrol', 'Hybrid', 'Other', 'Other', 'Other'],
        datasets: [
            {
                label: 'Number of Registered Vehicles',
                data: [300000, 200000, 60000, 30000, 60000, 15000],
                backgroundColor: [
                    'rgba(79, 195, 247, 0.8)', // Diesel - light blue
                    'rgba(63, 92, 125, 0.8)',  // Petrol - navy blue
                    'rgba(142, 195, 230, 0.8)', // Hybrid - medium blue
                    'rgba(205, 229, 247, 0.8)', // Other 1 - very light blue
                    'rgba(142, 195, 230, 0.8)', // Other 2 - medium blue
                    'rgba(224, 243, 255, 0.8)'  // Other 3 - lightest blue
                ],
                borderWidth: 1,
                borderColor: '#ffffff'
            }
        ]
    },
    
    // Total Registered Diesel Vehicles Over Time
    totalRegisteredVehiclesData: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'Total Registered Diesel Vehicles',
                data: [420000, 450000, 510000, 550000, 590000, 600000],
                borderColor: '#4fc3f7',
                backgroundColor: 'rgba(79, 195, 247, 0.2)',
                fill: true,
                tension: 0.4,
                borderWidth: 2
            }
        ]
    },
    
    // Diesel Price dataset - Line chart data (will be updated with API data)
    dieselPriceData: {
        labels: ['Jan 2018', 'Jul 2018', 'Jan 2020', 'Jul 2020', 'Jan 2021', 'Jul 2021', 'Jan 2022', 'Jul 2022', 'Jan 2023', 'Jul 2023', 'Jan 2024', 'Jun 2024', 'Jul 2024'],
        datasets: [
            {
                label: 'Diesel',
                data: [2.5, 2.5, 2.5, 2.2, 2.5, 2.7, 3.0, 3.5, 3.6, 3.5, 3.4, 3.4, 3.4],
                borderColor: '#6c757d',
                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            },
            {
                label: 'Diesel Euro5',
                data: [2.4, 2.3, 2.3, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.1, 3.3, 3.3],
                borderColor: '#0d47a1',
                backgroundColor: 'rgba(13, 71, 161, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            },
            {
                label: 'RON95',
                data: [2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 3.3, 3.3],
                borderColor: '#4fc3f7',
                backgroundColor: 'rgba(79, 195, 247, 0.3)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            },
            {
                label: 'RON97',
                data: [2.4, 2.5, 2.6, 2.2, 2.4, 2.7, 3.0, 3.5, 3.6, 3.5, 3.4, 3.4, 3.4],
                borderColor: '#5c6bc0',
                backgroundColor: 'rgba(92, 107, 192, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }
        ]
    },
    
    // Regional Price Comparison - Bar chart data
    regionalComparisonData: {
        labels: ['Peninsular Malaysia', 'Sabah/Sarawak', 'Singapore', 'Indonesia', 'Thailand'],
        datasets: [
            {
                label: 'Diesel Price (RM/liter)',
                data: [3.1, 2.2, 8.5, 4.1, 4.0],
                backgroundColor: [
                    'rgba(79, 195, 247, 0.7)',
                    'rgba(79, 195, 247, 0.7)',
                    'rgba(63, 92, 125, 0.7)',
                    'rgba(76, 102, 129, 0.7)',
                    'rgba(76, 102, 129, 0.7)'
                ],
                borderWidth: 0
            }
        ]
    }
};

// Chart configuration options
const chartOptions = {
    // Vehicle types bar chart options
    vehicleTypesOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Number of Registered Vehicles'
                },
                beginAtZero: true,
                max: 350000,
                ticks: {
                    callback: function(value) {
                        if (value >= 1000) {
                            return value / 1000 + 'k';
                        }
                        return value;
                    }
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat().format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        }
    },
    
    // Total registered vehicles line chart options
    totalRegisteredVehiclesOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Number of Vehicles'
                },
                min: 400000,
                max: 620000,
                ticks: {
                    callback: function(value) {
                        return value / 1000 + 'k';
                    }
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    },
    
    // Diesel price chart specific options
    dieselPriceOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Price (RM/liter)'
                },
                min: 1.5,
                grid: {
                    drawBorder: false,
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 12 // Limit number of ticks to avoid overcrowding
                }
            }
        },
        plugins: {
            legend: {
                display: true, // Show legend for API data
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        }
    },
    
    // Regional comparison chart specific options
    regionalComparisonOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Price (RM/liter)'
                },
                min: 0,
                max: 9,
                grid: {
                    drawBorder: false,
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
};

// Store charts for global reference
let charts = {};

// Initialize Diesel Vehicles Tab Charts
function initializeDieselVehiclesCharts() {
    // Vehicle Types Chart
    const vehicleTypesCtx = document.getElementById('vehicleTypesChart')?.getContext('2d');
    if (vehicleTypesCtx) {
        charts.vehicleTypesChart = new Chart(vehicleTypesCtx, {
            type: 'bar',
            data: chartData.vehicleTypesData,
            options: chartOptions.vehicleTypesOptions
        });
    }

    // Total Registered Vehicles Chart
    const totalRegisteredVehiclesCtx = document.getElementById('totalRegisteredVehiclesChart')?.getContext('2d');
    if (totalRegisteredVehiclesCtx) {
        charts.totalRegisteredVehiclesChart = new Chart(totalRegisteredVehiclesCtx, {
            type: 'line',
            data: chartData.totalRegisteredVehiclesData,
            options: chartOptions.totalRegisteredVehiclesOptions
        });
    }
}

// Initialize Diesel Price Tab Charts
async function initializeDieselPriceCharts() {
    try {
        // Initialize with RON95 as default fuel type
        const defaultFuelType = 'ron95';
        const ron95Data = await fetchFuelPrices(defaultFuelType, '2019-01-01', '2025-12-31');
        
        const dieselPriceCtx = document.getElementById('dieselPriceChart')?.getContext('2d');
        if (dieselPriceCtx) {
            if (ron95Data) {
                const transformedData = transformApiDataToChartFormat(ron95Data, 'RON95');
                
                charts.dieselPriceChart = new Chart(dieselPriceCtx, {
                    type: 'line',
                    data: transformedData,
                    options: chartOptions.dieselPriceOptions
                });
                
                console.log('Chart initialized with API data');
            } else {
                // If API fetch failed, use default data
                charts.dieselPriceChart = new Chart(dieselPriceCtx, {
                    type: 'line',
                    data: chartData.dieselPriceData,
                    options: chartOptions.dieselPriceOptions
                });
            }
        }

        // Regional Comparison Chart - this doesn't change with the API data
        const regionalComparisonCtx = document.getElementById('regionalComparisonChart')?.getContext('2d');
        if (regionalComparisonCtx) {
            charts.regionalComparisonChart = new Chart(regionalComparisonCtx, {
                type: 'bar',
                data: chartData.regionalComparisonData,
                options: chartOptions.regionalComparisonOptions
            });
        }
    } catch (error) {
        console.error('Error initializing diesel price charts:', error);
        
        // If there's an error, initialize charts with default data
        const dieselPriceCtx = document.getElementById('dieselPriceChart')?.getContext('2d');
        if (dieselPriceCtx) {
            charts.dieselPriceChart = new Chart(dieselPriceCtx, {
                type: 'line',
                data: chartData.dieselPriceData,
                options: chartOptions.dieselPriceOptions
            });
        }
        
        const regionalComparisonCtx = document.getElementById('regionalComparisonChart')?.getContext('2d');
        if (regionalComparisonCtx) {
            charts.regionalComparisonChart = new Chart(regionalComparisonCtx, {
                type: 'bar',
                data: chartData.regionalComparisonData,
                options: chartOptions.regionalComparisonOptions
            });
        }
    }
}

// Update chart with filtered data
async function updateChartWithFilter(year, fuelType) {
    try {
        if (charts.dieselPriceChart) {
            // Convert fuelType to API parameter format
            let apiType = fuelType.toLowerCase().replace(' ', '_');
            
            // Determine date range based on year
            let startDate, endDate;
            if (year !== 'All Years') {
                startDate = `${year}-01-01`;
                endDate = `${parseInt(year) + 1}-01-01`;
            } else {
                startDate = '2019-01-01';
                endDate = '2025-12-31';
            }
            
            // Fetch data for the selected fuel type and year
            const fuelData = await fetchFuelPrices(apiType, startDate, endDate);
            
            if (fuelData) {
                // Transform the API data to chart format
                const updatedData = transformApiDataToChartFormat(fuelData, fuelType);
                
                // Replace the chart data entirely with the new data
                charts.dieselPriceChart.data = updatedData;
                charts.dieselPriceChart.update();
                
                console.log(`Chart updated with ${fuelType} data for ${year !== 'All Years' ? year : 'all years'}`);
            }
        }
    } catch (error) {
        console.error('Error updating chart with filters:', error);
    }
}

// Filter dropdown options
const filterOptions = {
    years: ['All Years', '2021', '2022', '2023', '2024', '2025'],
    fuelTypes: ['RON95', 'RON97', 'Diesel', 'Diesel Euro5'], // Removed "All Types"
    regions: [
        'All Regions',
        'Rakan Niaga',
        'Terengganu',
        'Johor',
        'Kedah',
        'Kelantan',
        'Perak',
        'Pulau Pinang',
        'W.P. Kuala Lumpur',
        'Pahang',
        'Selangor',
        'Sarawak',
        'W.P. Labuan',
        'Sabah',
        'Perlis',
        'Melaka',
        'Negeri Sembilan',
        'W.P. Putrajaya'
    ]
};

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
            } else if (label.includes('Fuel Type')) {
                options = filterOptions.fuelTypes;
            } else if (label.includes('Region')) {
                options = filterOptions.regions;
            }
            
            // Create the dropdown menu
            const dropdownMenu = document.createElement('div');
            dropdownMenu.classList.add('dropdown-menu');
            
            // Add styles to position the dropdown menu
           // dropdownMenu.style.position = 'absolute';
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
                    applyFilters();
                    
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

// Apply filters to the charts based on dropdown selections
function applyFilters() {
    // Read current filter values from Diesel Price tab
    const dieselPriceTab = document.getElementById('diesel-price-tab');
    console.log('Diesel Price Tab:', dieselPriceTab);
    if (dieselPriceTab) {
        const yearFilter = dieselPriceTab.querySelector('.filter-dropdown:nth-child(1) .dropdown-select span').textContent;
        const fuelTypeFilter = dieselPriceTab.querySelector('.filter-dropdown:nth-child(2) .dropdown-select span').textContent;
        
        console.log('Diesel Price Tab Filters:', { year: yearFilter, fuelType: fuelTypeFilter });
        
        // Update chart with filters
        updateChartWithFilter(yearFilter, fuelTypeFilter);
    }
    
    // Read current filter values from Diesel Vehicles tab
    const dieselVehiclesTab = document.getElementById('diesel-vehicles-tab');
    if (dieselVehiclesTab) {
        const yearFilter = dieselVehiclesTab.querySelector('.filter-dropdown:nth-child(1) .dropdown-select span').textContent;
        const regionFilter = dieselVehiclesTab.querySelector('.filter-dropdown:nth-child(2) .dropdown-select span').textContent;
        
        console.log('Diesel Vehicles Tab Filters:', { year: yearFilter, region: regionFilter });
        
        // Update vehicle charts with filters
        updateVehicleCharts(yearFilter, regionFilter);
    }
}

// User menu dropdown
function setupUserDropdown() {
    const userButton = document.querySelector('.user-btn');
    
    if (userButton) {
        userButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close any existing dropdown first
            const existingMenu = document.querySelector('.language-dropdown-menu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }
            
            // Create dropdown menu for languages
            const dropdownMenu = document.createElement('div');
            dropdownMenu.classList.add('language-dropdown-menu');
            
            // Styling
            dropdownMenu.style.position = 'absolute';
            dropdownMenu.style.top = (this.offsetTop + this.offsetHeight) + 'px';
            dropdownMenu.style.right = '20px';
            dropdownMenu.style.backgroundColor = '#fff';
            dropdownMenu.style.border = '1px solid #dee2e6';
            dropdownMenu.style.borderRadius = '4px';
            dropdownMenu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            dropdownMenu.style.zIndex = '1000';
            
            // Add language options
            const languages = ['English', 'Bahasa Malaysia', 'Chinese', 'Tamil'];
            
            languages.forEach(language => {
                const option = document.createElement('div');
                option.classList.add('language-option');
                option.textContent = language;
                
                // Styling
                option.style.padding = '8px 16px';
                option.style.cursor = 'pointer';
                option.style.fontSize = '0.85rem';
                
                // Hover effect
                option.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#f8f9fa';
                });
                
                option.addEventListener('mouseout', function() {
                    this.style.backgroundColor = 'transparent';
                });
                
                // Click event
                option.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const userBtnText = userButton.querySelector('span');
                    userBtnText.textContent = language;
                    dropdownMenu.remove();
                });
                
                dropdownMenu.appendChild(option);
            });
            
            // Add to document
            document.querySelector('.user-dropdown').appendChild(dropdownMenu);
            
            // Close when clicking outside
            document.addEventListener('click', function closeMenu(e) {
                if (!e.target.closest('.language-dropdown-menu') && !e.target.closest('.user-btn')) {
                    const menu = document.querySelector('.language-dropdown-menu');
                    if (menu) {
                        menu.remove();
                    }
                    document.removeEventListener('click', closeMenu);
                }
            });
        });
    }
}

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
            if (index === 0) {
                tabIndicator.classList.remove('right');
            } else {
                tabIndicator.classList.add('right');
            }
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
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
async function updateVehicleCharts(year, region) {
    try {
        if (charts.vehicleTypesChart && charts.totalRegisteredVehiclesChart) {
            // Convert year and region to API parameter format
            const apiYear = year !== 'All Years' ? year : 'all';
            const apiRegion = region !== 'All Regions' ? region.toLowerCase().replace(' ', '_') : 'all';
            
            // Fetch data for the selected year and region
            const vehicleData = await fetchVehicleData(apiYear, apiRegion);
            
            if (vehicleData) {
                // Transform the API data
                const chartDataToUse = transformVehicleApiData(vehicleData);
                console.log('Transformed Vehicle Data:', chartDataToUse);
                // Update the chart title based on the selected year
                const chartTitle = document.querySelector('.chart-title');
                if (chartTitle) {
                    if (year === 'All Years') {
                        chartTitle.textContent = 'Vehicle Types Distribution (2021-2025)';
                    } else {
                        chartTitle.textContent = `Vehicle Types Distribution (${year})`;
                    }
                }
                
                // Update the vehicle types chart
                charts.vehicleTypesChart.data = chartDataToUse.vehicleTypesData;
                //rescale the chart to fit the new data
                charts.vehicleTypesChart.options.scales.y.max = Math.max(...chartDataToUse.vehicleTypesData.datasets[0].data) + 50000;
                charts.vehicleTypesChart.options.scales.y.min = 0;
                charts.vehicleTypesChart.update();
                
                // Update the total registered vehicles chart
                charts.totalRegisteredVehiclesChart.data = chartDataToUse.totalRegisteredVehiclesData;
                console.log('Total Registered Vehicles Data:', chartDataToUse.totalRegisteredVehiclesData);
                //rescale the chart to fit the new data
                charts.totalRegisteredVehiclesChart.options.scales.y.max = Math.max(...chartDataToUse.totalRegisteredVehiclesData.datasets[0].data) + 50000;
                charts.totalRegisteredVehiclesChart.options.scales.y.min = Math.min(...chartDataToUse.totalRegisteredVehiclesData.datasets[0].data) - 50000;

                charts.totalRegisteredVehiclesChart.update();
                
                console.log(`Vehicle charts updated for year: ${year}, region: ${region}`);
            }
        }
    } catch (error) {
        console.error('Error updating vehicle charts with filters:', error);
    }
}
// Transform vehicle API data to chart format
function transformVehicleApiData(apiData) {
    // For all years consolidated
    if (apiData.fuel_stats_2021_2025 && apiData.diesel_trend_by_year) {
        // Create data for the vehicle types chart
        const vehicleTypesData = {
            labels: Object.keys(apiData.fuel_stats_2021_2025).map(key => 
                key === 'greendiesel' ? 'Green Diesel' : 
                key === 'hybrid_diesel' ? 'Hybrid Diesel' : 
                key === 'hybrid_petrol' ? 'Hybrid Petrol' : 
                key.charAt(0).toUpperCase() + key.slice(1)
            ),
            datasets: [
                {
                    label: 'Number of Registered Vehicles',
                    data: Object.values(apiData.fuel_stats_2021_2025),
                    backgroundColor: [
                        'rgba(79, 195, 247, 0.8)',   // Diesel - light blue
                        'rgba(63, 81, 181, 0.8)',    // Electric - indigo
                        'rgba(46, 125, 50, 0.8)',    // Green Diesel - green
                        'rgba(21, 101, 192, 0.8)',   // Hybrid Diesel - blue
                        'rgba(0, 150, 136, 0.8)',    // Hybrid Petrol - teal
                        'rgba(255, 152, 0, 0.8)'     // Petrol - orange
                    ],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }
            ]
        };
        
        // Create data for the total registered vehicles chart
        const totalRegisteredVehiclesData = {
            labels: Object.keys(apiData.diesel_trend_by_year),
            datasets: [
                {
                    label: 'Total Registered Diesel Vehicles',
                    data: Object.values(apiData.diesel_trend_by_year),
                    borderColor: '#4fc3f7',
                    backgroundColor: 'rgba(79, 195, 247, 0.2)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        };
        
        return {
            vehicleTypesData,
            totalRegisteredVehiclesData
        };
    }
    // For a specific year
    else if (apiData.fuel_stats_year && apiData.diesel_monthly_count) {
        // Create data for the vehicle types chart (for specific year)
        const vehicleTypesData = {
            labels: Object.keys(apiData.fuel_stats_year).map(key => 
                key === 'greendiesel' ? 'Green Diesel' : 
                key === 'hybrid_diesel' ? 'Hybrid Diesel' : 
                key === 'hybrid_petrol' ? 'Hybrid Petrol' : 
                key.charAt(0).toUpperCase() + key.slice(1)
            ),
            datasets: [
                {
                    label: 'Number of Registered Vehicles',
                    data: Object.values(apiData.fuel_stats_year),
                    backgroundColor: [
                        'rgba(79, 195, 247, 0.8)',   // Diesel - light blue
                        'rgba(63, 81, 181, 0.8)',    // Electric - indigo
                        'rgba(46, 125, 50, 0.8)',    // Green Diesel - green
                        'rgba(21, 101, 192, 0.8)',   // Hybrid Diesel - blue
                        'rgba(0, 150, 136, 0.8)',    // Hybrid Petrol - teal
                        'rgba(255, 152, 0, 0.8)'     // Petrol - orange
                    ],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }
            ]
        };
        
        // Create data for the monthly trend
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        const months = Object.keys(apiData.diesel_monthly_count).sort((a, b) => parseInt(a) - parseInt(b));
        const totalRegisteredVehiclesData = {
            labels: months.map(m => monthNames[parseInt(m) - 1]),
            datasets: [
                {
                    label: 'Monthly Diesel Vehicle Registrations',
                    data: months.map(m => apiData.diesel_monthly_count[m]),
                    borderColor: '#4fc3f7',
                    backgroundColor: 'rgba(79, 195, 247, 0.2)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        };
        
        return {
            vehicleTypesData,
            totalRegisteredVehiclesData
        };
    }
    
    // Return dummy data if API format doesn't match
    return {
        vehicleTypesData: chartData.vehicleTypesData,
        totalRegisteredVehiclesData: chartData.totalRegisteredVehiclesData
    };
}
// Fetch vehicle data from API
async function fetchVehicleData(year = 'all', state = 'all') {
    try {
        // Add a loading indication
        const vehicleChartContainer = document.querySelector('#vehicleTypesChart').closest('.chart-container');
        if (vehicleChartContainer) {
            // vehicleChartContainer.classList.add('loading');
            
            // // Create a loading overlay if it doesn't exist
            // if (!vehicleChartContainer.querySelector('.loading-overlay')) {
            //     const loadingOverlay = document.createElement('div');
            //     loadingOverlay.classList.add('loading-overlay');
            //     loadingOverlay.innerHTML = '<div class="spinner"></div><p>Loading data...</p>';
            //     vehicleChartContainer.appendChild(loadingOverlay);
            // }
        }
        
        // Fetch from the API
        const response = await fetch(`http://localhost:8000/api/car-fuel-states/?year=${year}&state=${state}`);
        
        // Remove loading indication
        if (vehicleChartContainer) {
            const loadingOverlay = vehicleChartContainer.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
            vehicleChartContainer.classList.remove('loading');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching vehicle data:`, error);
        
        // // Remove loading indication in case of error
        // const vehicleChartContainer = document.querySelector('#vehicleTypesChart').closest('.chart-container');
        // if (vehicleChartContainer) {
        //     const loadingOverlay = vehicleChartContainer.querySelector('.loading-overlay');
        //     if (loadingOverlay) {
        //         loadingOverlay.remove();
        //     }
        //     vehicleChartContainer.classList.remove('loading');
        // }
        
        return null;
    }
}
async function initializeDieselVehiclesCharts() {
    try {
        // Fetch vehicle data from API
        const vehicleData = await fetchVehicleData('all', 'all');
        
        // Transform the API data or use fallback
        let chartDataToUse;
        if (vehicleData) {
            chartDataToUse = transformVehicleApiData(vehicleData);
        } else {
            chartDataToUse = {
                vehicleTypesData: chartData.vehicleTypesData,
                totalRegisteredVehiclesData: chartData.totalRegisteredVehiclesData
            };
        }
        
        // Update the chart subtitle to reflect API data
        const chartTitle = document.querySelector('.chart-title');
        if (chartTitle && vehicleData && vehicleData.fuel_stats_2021_2025) {
            chartTitle.textContent = 'Vehicle Types Distribution (2021-2025)';
        }
        
        // Vehicle Types Chart
        const vehicleTypesCtx = document.getElementById('vehicleTypesChart')?.getContext('2d');
        if (vehicleTypesCtx) {
            charts.vehicleTypesChart = new Chart(vehicleTypesCtx, {
                type: 'bar',
                data: chartDataToUse.vehicleTypesData,
                options: chartOptions.vehicleTypesOptions
            });
        }

        // Total Registered Vehicles Chart
        const totalRegisteredVehiclesCtx = document.getElementById('totalRegisteredVehiclesChart')?.getContext('2d');
        if (totalRegisteredVehiclesCtx) {
            charts.totalRegisteredVehiclesChart = new Chart(totalRegisteredVehiclesCtx, {
                type: 'line',
                data: chartDataToUse.totalRegisteredVehiclesData,
                options: chartOptions.totalRegisteredVehiclesOptions
            });
            charts.totalRegisteredVehiclesChart.options.scales.y.max = Math.max(...chartDataToUse.totalRegisteredVehiclesData.datasets[0].data) + 50000;
            charts.totalRegisteredVehiclesChart.options.scales.y.min = Math.min(...chartDataToUse.totalRegisteredVehiclesData.datasets[0].data) - 50000;
            charts.totalRegisteredVehiclesChart.update();
        }
    } catch (error) {
        console.error('Error initializing diesel vehicles charts:', error);
        
        // If API fetch fails, initialize with fallback data
        const vehicleTypesCtx = document.getElementById('vehicleTypesChart')?.getContext('2d');
        if (vehicleTypesCtx) {
            charts.vehicleTypesChart = new Chart(vehicleTypesCtx, {
                type: 'bar',
                data: chartData.vehicleTypesData,
                options: chartOptions.vehicleTypesOptions
            });
        }

        const totalRegisteredVehiclesCtx = document.getElementById('totalRegisteredVehiclesChart')?.getContext('2d');
        if (totalRegisteredVehiclesCtx) {
            charts.totalRegisteredVehiclesChart = new Chart(totalRegisteredVehiclesCtx, {
                type: 'line',
                data: chartData.totalRegisteredVehiclesData,
                options: chartOptions.totalRegisteredVehiclesOptions
            });
        }
    }
}
// Chart type toggle functionality
function setupChartTypeToggle() {
    const dieselPriceToggleButtons = document.querySelectorAll('#diesel-price-tab .toggle-btn');
    const dieselVehiclesToggleButtons = document.querySelectorAll('#diesel-vehicles-tab .toggle-btn');
    
    // Set up toggle for diesel price chart
    dieselPriceToggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all toggle buttons in this tab
            dieselPriceToggleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get chart type
            const chartType = this.getAttribute('data-chart');
            
            // Update diesel price chart type
            if (charts.dieselPriceChart) {
                charts.dieselPriceChart.config.type = chartType;
                charts.dieselPriceChart.update();
            }
        });
    });
    
    // Set up toggle for diesel vehicles chart
    dieselVehiclesToggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all toggle buttons in this tab
            dieselVehiclesToggleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get chart type
            const chartType = this.getAttribute('data-chart');
            
            // Update vehicle types chart type (only for bar/line toggle)
            if (charts.vehicleTypesChart) {
                // Save the original data
                const originalData = charts.vehicleTypesChart.data;
                
                if (chartType === 'line') {
                    // For line chart, create aggregate data based on original categories
                    const aggregateData = {
                        labels: originalData.labels,
                        datasets: [{
                            label: 'Number of Registered Vehicles',
                            data: originalData.datasets[0].data,
                            borderColor: '#4fc3f7',
                            backgroundColor: 'rgba(79, 195, 247, 0.2)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.1
                        }]
                    };
                    
                    charts.vehicleTypesChart.config.type = 'line';
                    charts.vehicleTypesChart.data = aggregateData;
                } else {
                    // For bar chart, restore the original data with multiple colors
                    charts.vehicleTypesChart.config.type = 'bar';
                    charts.vehicleTypesChart.data = originalData;
                }
                
                charts.vehicleTypesChart.update();
            }
        });
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set RON95 as default selected fuel type
    const dieselPriceTab = document.getElementById('diesel-price-tab');
    if (dieselPriceTab) {
        const fuelTypeDropdown = dieselPriceTab.querySelector('.filter-dropdown:nth-child(2) .dropdown-select span');
        if (fuelTypeDropdown) {
            fuelTypeDropdown.textContent = 'RON95';
        }
    }
    
    // Initialize all charts
    initializeDieselVehiclesCharts();
    initializeDieselPriceCharts();
    
    // Set up interactive elements
    setupMainTabs();
    setupChartTypeToggle();
    setupDropdowns();
    setupUserDropdown();
});