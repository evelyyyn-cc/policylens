// Script for MYPolicyLens - The Diesel Dilemma webpage

function setupMainTabs() {
    const tabLinks = document.querySelectorAll('.chart-tabs .chart-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            tabLinks.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            // document.getElementById(tabId).classList.add('active');

            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }

        });
    });
}

// Initialize the beneficiary donut chart
function initializeBeneficiaryChart() {
    const ctx = document.getElementById('beneficiaryChart').getContext('2d');
    
    // Beneficiary data
    const beneficiaryData = {
      labels: ['Private Vehicle Owners', 'Farmers', 'Livestock Breeders', 'Aquaculture Farmers'],
      datasets: [{
        data: [300000, 68000, 8000, 34000],
        backgroundColor: [
          '#34495e', // Dark blue for Private Vehicle Owners
          '#3498db', // Medium blue for Farmers
          '#90caf9', // Light blue for Livestock Breeders
          '#bbdefb'  // Very light blue for Aquaculture Farmers
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 10
      }]
    };
    
    // Create the donut chart
    const beneficiaryChart = new Chart(ctx, {
      type: 'doughnut',
      data: beneficiaryData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Inter',
                size: 12
              },
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1a3a72',
            bodyColor: '#333',
            borderColor: '#ddd',
            borderWidth: 1,
            titleFont: {
              family: 'Inter',
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              family: 'Inter',
              size: 13
            },
            padding: 12,
            boxPadding: 5,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value.toLocaleString()}`;
              }
            }
          }
        }
      }
    });
    
    return beneficiaryChart;
  }
document.addEventListener('DOMContentLoaded', function() {
    // The Challenge chart description tabs
    setupMainTabs();

    // Language selector functionality
    const languageBtn = document.querySelector('.language-btn');
    if (languageBtn) {
        languageBtn.addEventListener('click', function() {
            // Toggle between languages
            if (languageBtn.textContent.includes('Bahasa Malaysia')) {
                languageBtn.textContent = 'English ▼';
                // Apply language change logic here
            } else {
                languageBtn.textContent = 'Bahasa Malaysia ▼';
                // Apply language change logic here
            }
        });
    }

    // Highlight active navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
        
        // Check if current page matches link href and set as active
        if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        }
    });

    // Make links in source citations open in new tabs
    const sourceLinks = document.querySelectorAll('.source a');
    sourceLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Initialize Chart.js charts
    initializeCharts();
    if (document.getElementById('beneficiaryChart')) {
        const beneficiaryChart = initializeBeneficiaryChart();
        
        // Handle resize for this chart too
        window.addEventListener('resize', function() {
          beneficiaryChart.resize();
        });
      }

      // More Details link functionality
    //   const moreDetailsLink = document.querySelector('.more-link');
    //   if (moreDetailsLink) {
    //     moreDetailsLink.addEventListener('click', function(e) {
    //       e.preventDefault();
    //       // This could show a modal, expand a section, or navigate to a details page
    //       alert('Additional eligibility details would be shown here.');
    //     });
    //   }
});

function initializeCharts() {
    // Chart colors
    const colors = {
        blue: '#1a3a72',
        lightBlue: '#4f84d4',
        gold: '#d4af37',
        orange: '#ff9800',
        gray: '#cccccc'
    };

    // Consumption growth chart (consumption vs vehicle registration)
    const createConsumptionChart = () => {
        const ctx = document.getElementById('consumptionChart').getContext('2d');
        
        // Data for yearly view
        const yearlyData = {
            labels: ['2021', '2022', '2023'],
            datasets: [
                {
                    label: 'Diesel Consumption (Billion Liters)',
                    data: [7.2, 8.4, 10.8],
                    borderColor: colors.blue,
                    backgroundColor: 'rgba(26, 58, 114, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Registered Diesel Vehicles (Growth Index)',
                    data: [(2238/2238*100), (4148/2238*100), (3535/2238*100)],
                    borderColor: colors.gold,
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        };
        
        // Data for cumulative growth
        const cumulativeData = {
            labels: ['2021', '2022', '2023'],
            datasets: [
                {
                    label: 'Cumulative Diesel Consumption Growth (%)',
                    data: [0, 18, 53],
                    borderColor: colors.blue,
                    backgroundColor: 'rgba(26, 58, 114, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Cumulative Vehicle Registration Growth (%)',
                    data: [0, 8, 15],
                    borderColor: colors.gold,
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.3,
                    yAxisID: 'y'
                }
            ]
        };

        // Create chart
        const consumptionChart = new Chart(ctx, {
            type: 'line',
            data: cumulativeData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Growth (%)',
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        },
                        min: 0,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Growth (%)',
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        },
                        min: 0,
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Inter',
                                size: 12
                            },
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: colors.blue,
                        bodyColor: '#333',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        titleFont: {
                            family: 'Inter',
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Inter',
                            size: 13
                        },
                        padding: 12,
                        boxPadding: 5,
                        usePointStyle: true
                    }
                }
            }
        });

        // Chart tab functionality
        const chartTabs = document.querySelectorAll('.chart-tab');
        if (chartTabs.length > 0) {
            chartTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs
                    chartTabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Update chart based on selected view
                    if (this.getAttribute('data-view') === 'yearly') {
                        consumptionChart.data = yearlyData;
                        consumptionChart.options.scales.y.title.text = 'Billion Liters';
                        consumptionChart.options.scales.y1.title.text = 'Growth Index';
                        consumptionChart.options.scales.y.min = 7;
                        consumptionChart.options.scales.y1.min = 100;
                    } else if (this.getAttribute('data-view') === 'cumulative') {
                        consumptionChart.data = cumulativeData;
                        consumptionChart.options.scales.y.title.text = 'Growth (%)';
                        consumptionChart.options.scales.y1.title.text = 'Growth (%)';
                        consumptionChart.options.scales.y.min = 0;
                        consumptionChart.options.scales.y1.min = 0;
                    }
                    
                    consumptionChart.update();
                });
            });
        }

        return consumptionChart;
    };

    // Regional price comparison chart
    const createPriceComparisonChart = () => {
        const ctx = document.getElementById('priceComparisonChart').getContext('2d');
        
        const regionalPriceData = {
            labels: ['Malaysia (Pre-Reform)', 'Malaysia (Post-Reform)', 'Thailand', 'Indonesia', 'Singapore'],
            datasets: [{
                label: 'Diesel Price (RM per liter)',
                data: [2.15, 3.35, 4.24, 4.43, 8.79],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.7)',  // Green for Malaysia pre-reform
                    'rgba(79, 132, 212, 0.7)', // Light blue for Malaysia post-reform
                    'rgba(156, 39, 176, 0.7)', // Purple for Thailand
                    'rgba(63, 81, 181, 0.7)',  // Indigo for Indonesia
                    'rgba(103, 58, 183, 0.7)'  // Deep purple for Singapore
                ],
                borderColor: [
                    'rgb(76, 175, 80)',
                    'rgb(79, 132, 212)',
                    'rgb(156, 39, 176)',
                    'rgb(63, 81, 181)',
                    'rgb(103, 58, 183)'
                ],
                borderWidth: 1
            }]
        };
        
        const priceComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: regionalPriceData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'RM per liter',
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
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
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: colors.blue,
                        bodyColor: '#333',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        titleFont: {
                            family: 'Inter',
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Inter',
                            size: 13
                        },
                        padding: 12,
                        boxPadding: 5
                    }
                }
            }
        });

        return priceComparisonChart;
    };

    // Initialize both charts
    const consumptionChart = createConsumptionChart();
    const priceComparisonChart = createPriceComparisonChart();

    // Handle responsive chart resize
    window.addEventListener('resize', function() {
        consumptionChart.resize();
        priceComparisonChart.resize();
    });
}