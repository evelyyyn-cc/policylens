document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initializeTabs();
    
    // Initialize charts
    initializeOverallTrendChart();
    initializeSectorImpactChart();
    initializeSectorSensitivityChart();
    initializeExportDomesticChart();
    
    // Initialize map
    // initializeManufacturingMap();
});

/**
 * Tab navigation functionality
 */
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.main-tabs .tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.querySelector('.tab-indicator');
    
    // First, ensure all tabs except the first one are hidden initially
    tabContents.forEach((content, index) => {
        if (index === 0) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
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
            if (tabIndicator) {
                tabIndicator.style.width = `${rect.width}px`;
                tabIndicator.style.left = `${rect.left - parentRect.left}px`;
            }
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            const targetTab = document.getElementById(tabId);
            
            console.log("Attempting to show tab:", tabId);
            console.log("Target tab element:", targetTab);
            
            if (targetTab) {
                targetTab.classList.add('active');
                console.log("Tab activated:", tabId);
                
                // Refresh charts if needed to fix rendering issues
                setTimeout(() => {
                    if (window.charts) {
                        Object.values(window.charts).forEach(chart => {
                            if (chart && typeof chart.resize === 'function') {
                                chart.resize();
                            }
                        });
                    }
                }, 100);
            } else {
                console.error("Tab content not found for:", tabId);
            }
        });
    });
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
                        font: {
                            size: 14,
                        },
                        padding: 15,
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
 * Diesel Price Impact Analysis
 */
function initializeExportDomesticChart() {
    const ctx = document.getElementById('exportDomesticChart');
    if (!ctx) return;
    
    const chartCtx = ctx.getContext('2d');
    
    // 从API获取数据
    fetch('/api/diesel-impact-chart/')
        .then(response => response.json())
        .then(data => {
            const chartData = {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Manufacturing Index',
                        data: data.manufacturing_growth,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: false,
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        borderWidth: 2,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Diesel Price (RM/L)',
                        data: data.diesel_prices,
                        borderColor: 'rgb(249, 115, 22)',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        fill: false,
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        borderWidth: 2,
                        yAxisID: 'y1'
                    }
                ]
            };
            
            // Policy implementation annotations
            const annotations = {
                line1: {
                    type: 'line',
                    xMin: 3, // June 2024
                    xMax: 3,
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
                    xMin: 10, // January 2025
                    xMax: 10,
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
                data: chartData,
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
                                    const datasetLabel = context.dataset.label;
                                    const value = context.raw;
                                    if (datasetLabel === 'Manufacturing Index') {
                                        return datasetLabel + ': ' + value;
                                    } else {
                                        return datasetLabel + ': RM ' + value;
                                    }
                                }
                            }
                        },
                        annotation: {
                            annotations: annotations
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Manufacturing Index（2015=100）'
                            },
                            min: 130,
                            max: 160,
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Diesel Price (RM/L)'
                            },
                            min: 0,
                            max: 10,
                            grid: {
                                drawOnChartArea: false
                            }
                        },
                        x: {
                            title: {
                                display: true,
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching diesel impact data:', error);
        });
}