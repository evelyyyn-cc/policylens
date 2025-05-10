// Diesel Policy Page Module
export function initializeDieselPolicyPage() {
  // Initialize main tabs for diesel policy page
  setupMainTabs();

  // Make links in source citations open in new tabs
  setupSourceLinks();

  // Initialize Chart.js charts
  initializeCharts();

  // Initialize beneficiary chart if it exists
  if (document.getElementById('beneficiaryChart')) {
    const beneficiaryChart = initializeBeneficiaryChart();
    
    // Handle resize for this chart
    window.addEventListener('resize', function() {
      beneficiaryChart.resize();
    });
  }
}

// Set up main tabs for the diesel policy page
function setupMainTabs() {
  // Setup for main horizontal tabs
  const mainTabLinks = document.querySelectorAll('.main-tabs .tab-link');
  const mainTabContents = document.querySelectorAll('.tab-content');
  const mainTabIndicator = document.querySelector('.main-tabs .tab-indicator');
  
  // Initialize indicator position for active tab
  if (mainTabLinks.length > 0 && mainTabIndicator) {
    const activeTab = document.querySelector('.main-tabs .tab-link.active');
    if (activeTab) {
      setTimeout(() => {
        const rect = activeTab.getBoundingClientRect();
        const parentRect = activeTab.parentElement.getBoundingClientRect();
        mainTabIndicator.style.width = `${rect.width}px`;
        mainTabIndicator.style.left = `${rect.left - parentRect.left}px`;
      }, 50);
    }
  }
  
  // Add click handlers for main tabs
  mainTabLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      mainTabLinks.forEach(tab => tab.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Move the indicator
      if (mainTabIndicator) {
        const rect = this.getBoundingClientRect();
        const parentRect = this.parentElement.getBoundingClientRect();
        mainTabIndicator.style.width = `${rect.width}px`;
        mainTabIndicator.style.left = `${rect.left - parentRect.left}px`;
      }
      
      // Hide all tab contents
      mainTabContents.forEach(content => content.classList.remove('active'));
      
      // Show the selected tab content
      const tabId = this.getAttribute('data-tab');
      const targetTab = document.getElementById(tabId);
      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });

  // Setup for chart tabs inside "The Challenge" section
  const chartTabLinks = document.querySelectorAll('.chart-tabs .chart-tab');
  const chartTabContents = document.querySelectorAll('#cumulative, #yearly');
  
  chartTabLinks.forEach((link) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      chartTabLinks.forEach(tab => tab.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Hide all tab contents
      chartTabContents.forEach(content => content.classList.remove('active'));
      
      // Show the selected tab content
      const tabId = this.getAttribute('data-tab');
      const targetTab = document.getElementById(tabId);
      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });
}

// Set all source links to open in new tabs
function setupSourceLinks() {
  const sourceLinks = document.querySelectorAll('.source a');
  sourceLinks.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
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
    const ctx = document.getElementById('consumptionChart');
    if (!ctx) return null; // Exit if chart canvas not found
    
    const ctxContext = ctx.getContext('2d');
    
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

    // Chart configuration
    const chartOptions = {
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
    };

    // Create chart
    const consumptionChart = new Chart(ctxContext, {
      type: 'line',
      data: cumulativeData,
      options: chartOptions
    });

    // Chart tab functionality
    const chartTabs = document.querySelectorAll('.chart-tab');
    if (chartTabs.length > 0) {
      chartTabs.forEach(tab => {
        tab.addEventListener('click', function() {
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
    const ctx = document.getElementById('priceComparisonChart');
    if (!ctx) return null; // Exit if chart canvas not found
    
    const ctxContext = ctx.getContext('2d');
    
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
    
    const priceComparisonChart = new Chart(ctxContext, {
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
  const charts = {
    consumptionChart: createConsumptionChart(),
    priceComparisonChart: createPriceComparisonChart()
  };

  // Handle responsive chart resize
  window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
      if (chart) chart.resize();
    });
  });
  
  return charts;
}