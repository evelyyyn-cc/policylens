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
    const dieselCheck = document.getElementById('diesel');
    const publicTransportCheck = document.getElementById('publicTransport');

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
        
        // Impact rates (could be adjusted based on real data)
        let transportRate = 0.05; // 5% default
        if (dieselCheck && dieselCheck.checked) {
            transportRate = 0.11; // 11% for diesel vehicles
        }
        if (publicTransportCheck && publicTransportCheck.checked) {
            transportRate = transportRate * 0.7; // Reduced impact for public transport users
        }
        
        const foodRate = 0.02; // 2%
        const housingRate = 0.01; // 1%
        const otherRate = 0.009; // 0.9%
        
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
        document.getElementById('transportPercentage').textContent = `(${transportRate * 100}% increase)`;
        
        document.getElementById('foodImpact').textContent = `+ RM ${formatCurrency(foodImpact)}`;
        document.getElementById('foodPercentage').textContent = `(${foodRate * 100}% increase)`;
        
        document.getElementById('housingImpact').textContent = `+ RM ${formatCurrency(housingImpact)}`;
        document.getElementById('housingPercentage').textContent = `(${housingRate * 100}% increase)`;
        
        document.getElementById('otherImpact').textContent = `+ RM ${formatCurrency(otherImpact)}`;
        document.getElementById('otherPercentage').textContent = `(${otherRate * 100}% increase)`;
        
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