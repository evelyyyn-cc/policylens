document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initializeTabs();
    
    // Initialize charts
    initializeOverallTrendChart();
    initializeSectorImpactChart();
    initializeSectorSensitivityChart();
    initializeExportDomesticChart();
    
    // Initialize map
    initializeManufacturingMap();
});

/**
 * Tab navigation functionality
 */
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.querySelector('.tab-indicator');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabLinks.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Move tab indicator
            const linkPosition = this.getBoundingClientRect();
            const navPosition = document.querySelector('.main-tabs').getBoundingClientRect();
            
            tabIndicator.style.width = `${linkPosition.width}px`;
            tabIndicator.style.left = `${linkPosition.left - navPosition.left}px`;
        });
    });
    
    // Initialize tab indicator position for the active tab
    if (tabLinks.length > 0) {
        const activeTab = document.querySelector('.tab-link.active') || tabLinks[0];
        const activePosition = activeTab.getBoundingClientRect();
        const navPosition = document.querySelector('.main-tabs').getBoundingClientRect();
        
        tabIndicator.style.width = `${activePosition.width}px`;
        tabIndicator.style.left = `${activePosition.left - navPosition.left}px`;
    }
}

/**
 * Overall manufacturing trend chart
 */
function initializeOverallTrendChart() {
    const ctx = document.getElementById('overallTrendChart');
    if (!ctx) return;
    
    const chartCtx = ctx.getContext('2d');
    
    // Manufacturing data (sample data - would be replaced with real data)
    const labels = ['Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 
                    'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 
                    ];
    
    const manufactIndex = [143.064, 134.084, 144.632, 132.718, 141.588, 150.207, 147.191, 153.006, 151.303, 149.475, 150.995, 
        148.7];
    
    const seasonalIndex = [142.089, 142.138, 142.873, 142.747, 148.36, 146.734, 150.624, 149.3, 145.593, 144.84, 145.804, 
        145.874];

    // Policy implementation dates for annotations
    const chart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Manufacturing Index',
                    data: manufactIndex,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 5
                },
                {
                    label: 'Seasonally Adjusted Index',
                    data: seasonalIndex,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 5
                },
                {
                    label: 'Policy Implementation',
                    data: Array(labels.length).fill(null),  
                    borderColor: 'rgba(255, 99, 132, 0.7)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'line',
                        generateLabels: function(chart) {
                            // get default legend
                            const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            
                            // set label for policy implementation
                            original.forEach(label => {
                                if (label.text === 'Policy Implementation') {
                                    label.lineDash = [5, 5];
                                    label.lineWidth = 2;
                                }
                            });
                            
                            return original;
                        } 
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    filter: function(tooltipItem) {
                        return tooltipItem.datasetIndex !== 2;
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Index (2015=100)'
                    },
                    suggestedMin: 100
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });
    
    // Add policy implementation line 
    chart.canvas.onclick = null; // Prevent any conflicts with event handlers
    
    // Draw policy implementation line directly
    chart.options.animation.onComplete = function() {
        const xAxis = chart.scales.x;
        const yAxis = chart.scales.y;
        const ctx = chart.ctx;
        
        // Get June position (index 5)
        const xPos = xAxis.getPixelForValue(5);
        
        // Draw vertical line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xPos, yAxis.top);
        ctx.lineTo(xPos, yAxis.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 99, 132, 0.7)';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.restore();
    };
}


/**
 * Impact on Fuel-Sensitive Manufacturing Sectors
 */
function initializeSectorImpactChart() {
    const ctx = document.getElementById('sectorImpactChart');
    if (!ctx) return;
    
    // set height
    ctx.height = 1000;
    
    const chartCtx = ctx.getContext('2d');
    
    // sector datas
    const sectorLabels = [
        'Computer, Electronic, and Optical Products',
        'Machinery Repair and Installation',
        'Fabricated Metal Products',
        'Chemicals and Chemical Products',
        'Wearing Apparel',
        'Rubber and Plastics Products',
        'Food Products',
        'Paper and Paper Products',
        'Coke and Refined Petroleum Products',
        'Other Transport Equipment'
    ];
    
    const sectorData = [8.4, 7.9, 6.4, 5.7, 5.1, 4.7, 2.3, 1.2, -0.8, -2.0];
    
    // define three levels
    const impactCategories = sectorData.map(value => {
        if (value > 6.0) return 'high';
        if (value >= 2.0 && value <= 6.0) return 'medium';
        return 'low';
    });
    
    // define level with colors
    const getBackgroundColor = (category) => {
        switch(category) {
            case 'high': return 'rgb(96, 189, 246)';   
            case 'medium': return 'rgb(96, 189, 246)'; 
            case 'low': return 'rgb(96, 189, 246)';    
        }
    };
    
    const backgroundColors = impactCategories.map(getBackgroundColor);
    const borderColors = impactCategories.map(category => getBackgroundColor(category).replace('0.7', '1'));
    
    // create chart
    const sectorImpactChart = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: sectorLabels,
            datasets: [
                {
                    label: 'Division',
                    data: sectorData,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.8 
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            height: 800, 
            layout: {
                padding: {
                    left: 0,
                    right: 15,
                    top: 15,
                    bottom: 15
                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'top',
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 6,
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function(context) {
                            let label = '';
                            
                            // display rate
                            label += context.raw + '% YoY growth';
                            
                            // display labels
                            const impactLevel = impactCategories[context.dataIndex];
                            if (impactLevel === 'high') {
                                label += ' (High Impact)';
                            } else if (impactLevel === 'medium') {
                                label += ' (Medium Impact)';
                            } else if (impactLevel === 'low') {
                                label += ' (Low Impact)';
                            }
                            
                            return label;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Impact on Fuel-Sensitive Manufacturing Sectors',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 20
                    }
                },
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Year-on-Year Growth Rate (%)',
                        font: {
                            size: 13,
                            weight: 'bold'
                        },
                        padding: {
                            bottom: 10
                        }
                    },
                    border: {
                        dash: [10, 10]
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        padding: 8
                    },
                    suggestedMin: -3,  
                    suggestedMax: 10   
                },

            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },

        }
    });
    
}

function initializeSectorSensitivityChart() {
    const ctx = document.getElementById('sectorSensitivityChart');
    if (!ctx) return;
    
    // set height
    ctx.height = 1000;
    
    const chartCtx = ctx.getContext('2d');
    
    // sector datas
    const sectorLabels = [
        'Non-metallic Mineral Products',
        'Wearing Apparel',
        'Paper and Paper Products',
        'Fabricated Metal Products(excl. Machinery)',
        'Machinery Repair and Installation',
        'Chemicals and Chemical Products',
        'Other Transport Equipment',
        'Coke and Refined Petroleum Products',
        'Rubber and Plastics Products',
        'Computer, Electronic, and Optical Products'
    ];
    
    const sectorData = [147.90, 138.82, 91.56, 84.04, 64.52, 58.06, 54.81, 53.52, 21.87, 15.09];
    
    // define three levels
    const senCategories = sectorData.map(value => {
        if (value > 6.0) return 'high';
        if (value >= 2.0 && value <= 6.0) return 'medium';
        return 'low';
    });
    
    // define level with colors
    const getBackgroundColor = (category) => {
        switch(category) {
            case 'high': return 'rgb(233, 157, 6)';   
            case 'medium': return 'rgb(233, 157, 6)'; 
            case 'low': return 'rgba(233, 157, 6)';    
        }
    };
    
    const backgroundColors = senCategories.map(getBackgroundColor);
    const borderColors = senCategories.map(category => getBackgroundColor(category).replace('0.7', '1'));
    
    // create chart
    const sectorSensitivityChart = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: sectorLabels,
            datasets: [
                {
                    label: 'Division',
                    data: sectorData,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.8 
                }
            ]
        },
        options: {
            indexAxis: 'y',  // This makes the chart horizontal
            responsive: true,
            maintainAspectRatio: false,
            height: 800, 
            layout: {
                padding: {
                    left: 0,
                    right: 15,
                    top: 15,
                    bottom: 15
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 6,
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function(context) {
                            let label = '';
                            
                            // display rate
                            label += context.raw;
                            
                            return label;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Division Sensitivity Analysis',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 20
                    }
                },
            },
            scales: {
                x: {  // This was y-axis before
                    title: {
                        display: true,
                        text: 'FuelSensitivity Score',
                        font: {
                            size: 13,
                            weight: 'bold'
                        },
                        padding: {
                            bottom: 10
                        }
                    },
                    border: {
                        dash: [10, 10]
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        padding: 8
                    },
                    suggestedMin: 0,  
                    suggestedMax: 200   
                },
                y: {  // New configuration for y-axis (labels)
                    ticks: {
                        font: {
                            size: 12
                        },
                        padding: 8
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
        }
    });

}

/**
 * Regional manufacturing map initialization
 */
function initializeManufacturingMap() {
    const mapContainer = document.getElementById('malaysiaManufacturingMap');
    if (!mapContainer) return;
    
    // Initialize map centered on Malaysia
    const map = L.map('malaysiaManufacturingMap').setView([4.2105, 108.9758], 5);
    
    // Add base map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Sample GeoJSON data for Malaysian states (simplified for this example)
    const statesData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Selangor",
                    "impact": -1.2,
                    "foodImpact": -0.9,
                    "chemicalsImpact": -1.5,
                    "rubberImpact": -1.3,
                    "metalsImpact": -1.8
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[101.30, 2.70], [102.00, 2.70], [102.00, 3.30], [101.30, 3.30], [101.30, 2.70]]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Penang",
                    "impact": -1.5,
                    "foodImpact": -1.1,
                    "chemicalsImpact": -1.7,
                    "rubberImpact": -1.5,
                    "metalsImpact": -2.0
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[100.15, 5.20], [100.55, 5.20], [100.55, 5.50], [100.15, 5.50], [100.15, 5.20]]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Johor",
                    "impact": -1.3,
                    "foodImpact": -1.0,
                    "chemicalsImpact": -1.6,
                    "rubberImpact": -1.4,
                    "metalsImpact": -1.9
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[102.40, 1.30], [104.20, 1.30], [104.20, 2.50], [102.40, 2.50], [102.40, 1.30]]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Sabah",
                    "impact": -1.8,
                    "foodImpact": -1.5,
                    "chemicalsImpact": -2.2,
                    "rubberImpact": -2.0,
                    "metalsImpact": -2.5
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[115.50, 4.00], [119.30, 4.00], [119.30, 7.30], [115.50, 7.30], [115.50, 4.00]]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Sarawak",
                    "impact": -1.7,
                    "foodImpact": -1.4,
                    "chemicalsImpact": -2.1,
                    "rubberImpact": -1.9,
                    "metalsImpact": -2.4
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[109.50, 0.80], [115.40, 0.80], [115.40, 5.00], [109.50, 5.00], [109.50, 0.80]]]
                }
            }
        ]
    };
    
    // Color function based on impact value
    function getColor(impact) {
        return impact <= -2.0 ? '#d73027' :
               impact <= -1.6 ? '#fc8d59' :
               impact <= -1.2 ? '#fee08b' :
               impact <= -0.8 ? '#d9ef8b' :
                              '#91cf60';
    }
    
    // State style function
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.impact),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    
    // Highlight state on mouseover
    function highlightFeature(e) {
        const layer = e.target;
        
        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.8
        });
        
        layer.bringToFront();
    }
    
    // Reset state highlight on mouseout
    function resetHighlight(e) {
        geojsonLayer.resetStyle(e.target);
    }
    
    // Show region details on click
    function showRegionDetails(e) {
        const properties = e.target.feature.properties;
        
        // Update region name
        document.getElementById('selectedRegionName').textContent = properties.name;
        
        // Update overall impact
        const overallImpactElement = document.getElementById('overallManufacturingImpactValue');
        overallImpactElement.textContent = properties.impact + '%';
        
        // Set impact level class
        overallImpactElement.className = 'summary-value';
        if (properties.impact <= -2.0) {
            overallImpactElement.classList.add('impact-very-high');
        } else if (properties.impact <= -1.5) {
            overallImpactElement.classList.add('impact-high');
        } else if (properties.impact <= -1.0) {
            overallImpactElement.classList.add('impact-medium');
        } else {
            overallImpactElement.classList.add('impact-low');
        }
        
        // Update sector-specific impacts
        updateSectorBar('foodManufacturingImpactValue', 'foodManufacturingImpactBar', properties.foodImpact);
        updateSectorBar('chemicalsManufacturingImpactValue', 'chemicalsManufacturingImpactBar', properties.chemicalsImpact);
        updateSectorBar('rubberManufacturingImpactValue', 'rubberManufacturingImpactBar', properties.rubberImpact);
        updateSectorBar('metalsManufacturingImpactValue', 'metalsManufacturingImpactBar', properties.metalsImpact);
    }
    
    // Update sector impact bar
    function updateSectorBar(valueId, barId, impact) {
        // Update text value
        document.getElementById(valueId).textContent = impact + '%';
        
        // Update bar width and color
        const bar = document.getElementById(barId);
        const absImpact = Math.abs(impact);
        // Scale to percentage (assuming max impact is -3.0%)
        const barWidth = (absImpact / 3.0) * 100;
        bar.style.width = barWidth + '%';
        
        // Set bar color based on impact
        if (impact <= -2.0) {
            bar.style.backgroundColor = '#d73027';
        } else if (impact <= -1.5) {
            bar.style.backgroundColor = '#fc8d59';
        } else if (impact <= -1.0) {
            bar.style.backgroundColor = '#fee08b';
        } else {
            bar.style.backgroundColor = '#91cf60';
        }
    }
    
    // Attach events to GeoJSON features
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: showRegionDetails
        });
    }
    
    // Create and add GeoJSON layer
    const geojsonLayer = L.geoJSON(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    
    // Sector selection functionality
    const sectorSelect = document.getElementById('manufacturingSectorSelect');
    if (sectorSelect) {
        sectorSelect.addEventListener('change', function(e) {
            const selectedSector = e.target.value;
            
            // Update map colors based on selected sector impact
            geojsonLayer.setStyle(function(feature) {
                let impactValue;
                
                switch(selectedSector) {
                    case 'food':
                        impactValue = feature.properties.foodImpact;
                        break;
                    case 'chemicals':
                        impactValue = feature.properties.chemicalsImpact;
                        break;
                    case 'rubber':
                        impactValue = feature.properties.rubberImpact;
                        break;
                    case 'metals':
                        impactValue = feature.properties.metalsImpact;
                        break;
                    case 'overall':
                    default:
                        impactValue = feature.properties.impact;
                }
                
                return {
                    fillColor: getColor(impactValue),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            });
        });
    }
}
