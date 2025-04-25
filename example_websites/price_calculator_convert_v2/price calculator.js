
/*
 * Price Calculator JS for Diesel Subsidy Reform Impact Calculator
 * 
 * This script handles the functionality of Price Impact Calculator.
 * It calculates how policy changes affect personal finances based on user inputs
 * for transportation, groceries, utilities, and restaurants & accommodation expenses.
 * The calculator shows monthly and yearly financial impacts with percentage increases.
 * 
 * Last updated: April 18, 2025
 * 
 * Author: Chen Wanning
 */

document.addEventListener('DOMContentLoaded', function() {
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

    // Format number as currency
    function formatCurrency(number) {
        return new Intl.NumberFormat('en-MY', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    // Calculate the impact
    function calculateImpact() {
        // Get values from sliders
        const transport = parseFloat(transportSlider.value);
        const food = parseFloat(foodSlider.value);
        const housing = parseFloat(housingSlider.value);
        const other = parseFloat(otherSlider.value);
        const location = locationSelect.value;
        
        // Initialize impact rates with default values
        let transportRate, foodRate, housingRate, otherRate;
        
        // Set rates based on location using data from the provided dataset
        switch(location) {
            case "Johor":
                transportRate = 0.00819001;  // 0.819001%
                foodRate = 0.0242236;        // 2.42236%
                housingRate = 0.00306748;    // 0.306748%
                otherRate = 0.01318392;      // 1.318392%
                break;
            case "Kedah":
                transportRate = 0.00692641;  // 0.692641%
                foodRate = 0.00781805;       // 0.781805%
                housingRate = 0.00150943;    // 0.150943%
                otherRate = 0.03203343;      // 3.203343%
                break;
            case "Kelantan":
                transportRate = 0.00085324;  // 0.085324%
                foodRate = 0.00068306;       // 0.068306%
                housingRate = 0.0025;        // 0.25%
                otherRate = 0.00840979;      // 0.840979%
                break;
            case "Melaka":
                transportRate = 0.01163832;  // 1.163832%
                foodRate = 0.02027469;       // 2.027469%
                housingRate = 0.00837139;    // 0.837139%
                otherRate = 0.01228324;      // 1.228324%
                break;
            case "Negeri Sembilan":
                transportRate = 0.003367;    // 0.3367%
                foodRate = 0.024;            // 2.4%
                housingRate = 0.01428571;    // 1.428571%
                otherRate = 0.02121434;      // 2.121434%
                break;
            case "Pahang":
                transportRate = 0.01022147;  // 1.022147%
                foodRate = 0.01378858;       // 1.378858%
                housingRate = 0.00232378;    // 0.232378%
                otherRate = 0.01667875;      // 1.667875%
                break;
            case "Perak":
                transportRate = 0.00764656;  // 0.764656%
                foodRate = 0.01313062;       // 1.313062%
                housingRate = 0.00581879;    // 0.581879%
                otherRate = 0.00817996;      // 0.817996%
                break;
            case "Perlis":
                transportRate = 0.00880282;  // 0.880282%
                foodRate = 0.01164483;       // 1.164483%
                housingRate = -0.00083403;   // -0.083403%
                otherRate = -0.00470746;     // -0.470746%
                break;
            case "Pulau Pinang":
                transportRate = 0.00166945;  // 0.166945%
                foodRate = 0.01427685;       // 1.427685%
                housingRate = 0.00439883;    // 0.439883%
                otherRate = 0.01681759;      // 1.681759%
                break;
            case "Sabah":
                transportRate = 0.00262927;  // 0.262927%
                foodRate = 0.01165331;       // 1.165331%
                housingRate = 0.00088106;    // 0.088106%
                otherRate = 0.03623649;      // 3.623649%
                break;
            case "Sarawak":
                transportRate = 0.00484262;  // 0.484262%
                foodRate = 0.00811908;       // 0.811908%
                housingRate = 0.003367;      // 0.3367%
                otherRate = 0.01989026;      // 1.989026%
                break;
            case "Selangor":
                transportRate = -0.00156986; // -0.156986%
                foodRate = 0.019678;         // 1.9678%
                housingRate = 0.00669145;    // 0.669145%
                otherRate = 0.00613121;      // 0.613121%
                break;
            case "Terengganu":
                transportRate = 0.00422654;  // 0.422654%
                foodRate = 0.02155772;       // 2.155772%
                housingRate = 0.00254453;    // 0.254453%
                otherRate = 0.01638124;      // 1.638124%
                break;
            case "Kuala Lumpur":            // W.P. Kuala Lumpur in dataset
                transportRate = 0.0122449;   // 1.22449%
                foodRate = 0.02477184;       // 2.477184%
                housingRate = 0.00733676;    // 0.733676%
                otherRate = 0.02179657;      // 2.179657%
                break;
            case "Labuan":                  // W.P. Labuan in dataset
                transportRate = 0.00086505;  // 0.086505%
                foodRate = 0.01258327;       // 1.258327%
                housingRate = 0.00325468;    // 0.325468%
                otherRate = 0.01371742;      // 1.371742%
                break;
            case "Putrajaya":               // W.P. Putrajaya in dataset
                transportRate = -0.00735294; // -0.735294%
                foodRate = 0.02028986;       // 2.028986%
                housingRate = 0;             // 0%
                otherRate = -0.02133633;     // -2.133633%
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
    
    // Initialize with default values
    calculateImpact();
});