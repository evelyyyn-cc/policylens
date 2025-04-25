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
            transportRate = calculatePercentage(123.1,122.1); // 0.819001%
            foodRate = calculatePercentage(164.9,161.0); // 2.42236%
            housingRate = calculatePercentage(130.8,130.4); // 0.306748%
            otherRate = calculatePercentage(153.7,151.7); // 1.318392%
            break;
        case "Kedah":
            transportRate = calculatePercentage(116.3,115.5);  // 0.692641%
            foodRate = calculatePercentage(141.8,140.7);       // 0.781805%
            housingRate = calculatePercentage(132.7,132.5);    // 0.150943%
            otherRate = calculatePercentage(148.2,143.6);      // 3.203343%
            break;
        case "Kelantan":
            transportRate = calculatePercentage(117.3,117.2);  // 0.085324%
            foodRate = calculatePercentage(146.5,146.4);       // 0.068306%
            housingRate = calculatePercentage(120.3,120.0);        // 0.25%
            otherRate = calculatePercentage(131.9,130.8);      // 0.840979%
            break;
        case "Melaka":
            transportRate = calculatePercentage(113.0,111.7);  // 1.163832%
            foodRate = calculatePercentage(156.0,152.9);       // 2.027469%
            housingRate = calculatePercentage(132.5,131.4);    // 0.837139%
            otherRate = calculatePercentage(140.1,138.4);      // 1.228324%
            break;
        case "Negeri Sembilan":
            transportRate = calculatePercentage(119.2,118.8);    // 0.3367%
            foodRate = calculatePercentage(153.6,150.0);            // 2.4%
            housingRate = calculatePercentage(127.8,126.0);    // 1.428571%
            otherRate = calculatePercentage(139.6,136.7);      // 2.121434%
            break;
        case "Pahang":
            transportRate = calculatePercentage(118.6,117.4);  // 1.022147%
            foodRate = calculatePercentage(154.4,152.3);       // 1.378858%
            housingRate = calculatePercentage(129.4,129.1);    // 0.232378%
            otherRate = calculatePercentage(140.2,137.9);      // 1.667875%
            break;
        case "Perak":
            transportRate = calculatePercentage(118.6,117.7);  // 0.764656%
            foodRate = calculatePercentage(146.6,144.7);       // 1.313062%
            housingRate = calculatePercentage(121.0,120.3);    // 0.581879%
            otherRate = calculatePercentage(147.9,146.7);      // 0.817996%
            break;
        case "Perlis":
            transportRate = calculatePercentage(114.6,113.6);  // 0.880282%
            foodRate = calculatePercentage(139.0,137.4);       // 1.164483%
            housingRate = calculatePercentage(119.8,119.9);   // -0.083403%
            otherRate = calculatePercentage(148.0,148.7);     // -0.470746%
            break;
        case "Pulau Pinang":
            transportRate = calculatePercentage(120.0,119.8);  // 0.166945%
            foodRate = calculatePercentage(163.4,161.1);       // 1.427685%
            housingRate = calculatePercentage(137.0,136.4);    // 0.439883%
            otherRate = calculatePercentage(157.2,154.6);      // 1.681759%
            break;
        case "Sabah":
            transportRate = calculatePercentage(114.4,114.1);  // 0.262927%
            foodRate = calculatePercentage(138.9,137.3);       // 1.165331%
            housingRate = calculatePercentage(113.6,113.5);    // 0.088106%
            otherRate = calculatePercentage(163.0,157.3);      // 3.623649%
            break;
        case "Sarawak":
            transportRate = calculatePercentage(124.5,123.9);  // 0.484262%
            foodRate = calculatePercentage(149.0,147.8);       // 0.811908%
            housingRate = calculatePercentage(119.2,118.8);      // 0.3367%
            otherRate = calculatePercentage(148.7,145.8);      // 1.989026%
            break;
        case "Selangor":
            transportRate = calculatePercentage(127.2,127.4); // -0.156986%
            foodRate = calculatePercentage(171.0,167.7);         // 1.9678%
            housingRate = calculatePercentage(135.4,134.5);    // 0.669145%
            otherRate = calculatePercentage(164.1,163.1);      // 0.613121%
            break;
        case "Terengganu":
            transportRate = calculatePercentage(118.8,118.3);  // 0.422654%
            foodRate = calculatePercentage(146.9,143.8);       // 2.155772%
            housingRate = calculatePercentage(118.2,117.9);    // 0.254453%
            otherRate = calculatePercentage(136.5,134.3);      // 1.638124%
            break;
        case "W.P. Kuala Lumpur":            // W.P. Kuala Lumpur in dataset
            transportRate = calculatePercentage(124.0,122.5);   // 1.22449%
            foodRate = calculatePercentage(157.2,153.4);       // 2.477184%
            housingRate = calculatePercentage(137.3,136.3);    // 0.733676%
            otherRate = calculatePercentage(154.7,151.4);      // 2.179657%
            break;
        case "W.P. Labuan":                  // W.P. Labuan in dataset
            transportRate = calculatePercentage(115.7,115.6);  // 0.086505%
            foodRate = calculatePercentage(136.8,135.1);       // 1.258327%
            housingRate = calculatePercentage(123.3,122.9);    // 0.325468%
            otherRate = calculatePercentage(147.8,145.8);      // 1.371742%
            break;
        case "W.P. Putrajaya":               // W.P. Putrajaya in dataset
            transportRate = calculatePercentage(135.0,136.0); // -0.735294%
            foodRate = calculatePercentage(176.0,172.5);       // 2.028986%
            housingRate = calculatePercentage(138.1,138.1);             // 0%
            otherRate = calculatePercentage(174.3,178.1);     // -2.133633%
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