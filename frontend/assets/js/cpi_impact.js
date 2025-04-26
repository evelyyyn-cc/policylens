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
    
    // Update the impact display
    document.getElementById('transportImpact').textContent = `+ RM ${formatCurrency(transportImpact)}`;
    document.getElementById('transportPercentage').textContent = `(${(transportRate * 100).toFixed(3)}% increase)`;
    
    document.getElementById('foodImpact').textContent = `+ RM ${formatCurrency(foodImpact)}`;
    document.getElementById('foodPercentage').textContent = `(${(foodRate * 100).toFixed(3)}% increase)`;
    
    document.getElementById('housingImpact').textContent = `+ RM ${formatCurrency(housingImpact)}`;
    document.getElementById('housingPercentage').textContent = `(${(housingRate * 100).toFixed(3)}% increase)`;
    
    document.getElementById('otherImpact').textContent = `+ RM ${formatCurrency(otherImpact)}`;
    document.getElementById('otherPercentage').textContent = `(${(otherRate * 100).toFixed(3)}% increase)`;
    
    // Update Monthly comparison
    document.getElementById('monthlyBefore').textContent = `RM ${formatCurrency(totalMonthly)}`;
    document.getElementById('monthlyAfter').textContent = `RM ${formatCurrency(totalMonthly + totalImpact)}`;
    document.getElementById('monthlyDifference').textContent = `+ RM ${formatCurrency(totalImpact)}`;
    document.getElementById('monthlyPercentage').textContent = `(${percentageIncrease.toFixed(1)}% increase from your total expenses)`;
    
    // Update Yearly comparison
    const yearlyBefore = totalMonthly * 12;
    const yearlyAfter = (totalMonthly + totalImpact) * 12;
    const yearlyImpact = totalImpact * 12;
    
    document.getElementById('yearlyBefore').textContent = `RM ${formatCurrency(yearlyBefore)}`;
    document.getElementById('yearlyAfter').textContent = `RM ${formatCurrency(yearlyAfter)}`;
    document.getElementById('yearlyDifference').textContent = `+ RM ${formatCurrency(yearlyImpact)}`;
    document.getElementById('yearlyPercentage').textContent = `(${percentageIncrease.toFixed(1)}% increase from your total yearly expenses)`;
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Set up interactive elements
    setupMainTabs();
    
    // Smooth Transition with left + width
    const activeTab = document.querySelector('.main-tabs .tab-link.active');
    const tabIndicator = document.querySelector('.tab-indicator');
    if (activeTab && tabIndicator) {
        const rect = activeTab.getBoundingClientRect();
        const parentRect = activeTab.parentElement.getBoundingClientRect();
        tabIndicator.style.width = `${rect.width}px`;
        tabIndicator.style.left = `${rect.left - parentRect.left}px`;
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
        otherValue.textContent = `RM ${this.value}`;
    });

    // Calculate button functionality
    calculateBtn.addEventListener('click', calculateImpact);

    // Initialize with default values
    calculateImpact();


    // setupChartTypeToggle();
    // setupDropdowns();
    // setupUserDropdown();
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
    }
};