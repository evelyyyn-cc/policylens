document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initializeTabs();
    
    // Initialize charts
    initializeOverallTrendChart();
    initializeSectorImpactChart();
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
    const labels = ['Jan 23', 'Feb 23', 'Mar 23', 'Apr 23', 'May 23', 'Jun 23', 
                    'Jul 23', 'Aug 23', 'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23', 
                    'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 
                    'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 
                    'Jan 25', 'Feb 25'];
    
    const manufactIndex = [110, 112, 111, 113, 114, 112, 110, 109, 111, 112, 113, 
                          114, 112, 110, 111, 113, 115, 116, 117, 118, 119, 120, 
                          121, 122, 123, 124];
    
    const seasonalIndex = [112, 113, 112, 114, 114, 113, 111, 110, 112, 113, 114, 
                          115, 114, 111, 112, 114, 116, 117, 118, 119, 119, 121, 
                          122, 123, 124, 125];

    // Policy implementation dates for annotations
    const annotations = {
        line1: {
            type: 'line',
            xMin: 5, // June 2023
            xMax: 5,
            borderColor: 'rgba(255, 99, 132, 0.7)',
            borderWidth: 2,
            label: {
                enabled: true,
                content: 'First Subsidy Change',
                position: 'top'
            }
        },
        line2: {
            type: 'line',
            xMin: 12, // January 2024
            xMax: 12,
            borderColor: 'rgba(255, 99, 132, 0.7)',
            borderWidth: 2,
            label: {
                enabled: true,
                content: 'Targeted Implementation',
                position: 'top'
            }
        }
    };
    
    new Chart(chartCtx, {
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
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                annotation: {
                    annotations: annotations
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
}

/**
 * Sector impact chart with filter functionality
 */
function initializeSectorImpactChart() {
    const ctx = document.getElementById('sectorImpactChart');
    if (!ctx) return;
    
    const chartCtx = ctx.getContext('2d');
    
    // Sector data by period
    const data = {
        labels: ['Food Products', 'Chemicals', 'Rubber & Plastics', 'Basic Metals', 'Motor Vehicles', 'Other Transport'],
        datasets: [
            {
                label: 'Initial Policy Period (Jun-Aug 2023)',
                data: [-1.2, -1.8, -1.5, -2.1, -0.9, -1.1],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            },
            {
                label: 'Adaptation Period (Sep-Dec 2023)',
                data: [-0.8, -1.4, -1.0, -1.6, -0.5, -0.7],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1
            },
            {
                label: 'Targeted Implementation (Jan-Mar 2024)',
                data: [-0.6, -1.1, -0.8, -1.3, -0.4, -0.5],
                backgroundColor: 'rgba(249, 115, 22, 0.7)',
                borderColor: 'rgb(249, 115, 22)',
                borderWidth: 1
            }
        ]
    };
    
    const sectorImpactChart = new Chart(chartCtx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '% MoM change';
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Month-on-Month Change (%)'
                    },
                    suggestedMin: -2.5,
                    suggestedMax: 0
                },
                x: {
                    title: {
                        display: true,
                        text: 'Manufacturing Sector'
                    }
                }
            }
        }
    });
    
    // Period filter functionality
    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', function(e) {
            const selectedPeriod = e.target.value;
            let visibleDatasets;
            
            if (selectedPeriod === 'All Periods') {
                visibleDatasets = [0, 1, 2]; // Show all datasets
            } else if (selectedPeriod === 'Initial Policy (Jun-Aug 2023)') {
                visibleDatasets = [0]; // Show only first dataset
            } else if (selectedPeriod === 'Targeted Implementation (Jan-Mar 2024)') {
                visibleDatasets = [2]; // Show only third dataset
            }
            
            sectorImpactChart.data.datasets.forEach((dataset, index) => {
                dataset.hidden = !visibleDatasets.includes(index);
            });
            
            sectorImpactChart.update();
        });
    }
}

/**
 * Export vs Domestic comparison chart
 */
function initializeExportDomesticChart() {
    const ctx = document.getElementById('exportDomesticChart');
    if (!ctx) return;
    
    const chartCtx = ctx.getContext('2d');
    
    // Monthly growth data for export vs domestic sectors
    const data = {
        labels: ['May 23', 'Jun 23', 'Jul 23', 'Aug 23', 'Sep 23', 'Oct 23', 'Nov 23', 
                'Dec 23', 'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24'],
        datasets: [
            {
                label: 'Export-Oriented Manufacturing',
                data: [0.5, -0.8, -1.7, -1.4, -0.5, 0.2, 0.8, 1.2, -0.7, -1.5, -0.9, 0.4, 0.9],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.3,
                pointRadius: 3,
                pointHoverRadius: 6,
                borderWidth: 2
            },
            {
                label: 'Domestic-Oriented Manufacturing',
                data: [0.3, -0.5, -0.9, -0.7, -0.4, -0.1, 0.2, 0.4, -0.4, -0.8, -0.6, 0.1, 0.3],
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                fill: false,
                tension: 0.3,
                pointRadius: 3,
                pointHoverRadius: 6,
                borderWidth: 2
            }
        ]
    };
    
    // Policy implementation annotations
    const annotations = {
        line1: {
            type: 'line',
            xMin: 1, // June 2023
            xMax: 1,
            borderColor: 'rgba(255, 99, 132, 0.7)',
            borderWidth: 2,
            label: {
                enabled: true,
                content: 'First Subsidy Change',
                position: 'top'
            }
        },
        line2: {
            type: 'line',
            xMin: 8, // January 2024
            xMax: 8,
            borderColor: 'rgba(255, 99, 132, 0.7)',
            borderWidth: 2,
            label: {
                enabled: true,
                content: 'Targeted Implementation',
                position: 'top'
            }
        }
    };
    
    new Chart(chartCtx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '% MoM change';
                        }
                    }
                },
                annotation: {
                    annotations: annotations
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Month-on-Month Change (%)'
                    }
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
