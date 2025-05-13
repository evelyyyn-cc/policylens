document.addEventListener('DOMContentLoaded', function() {
    // 初始化标签导航系统
    initializeTabs();
    
    // 只初始化第一个标签页的图表
    initializeOverallTrendChart();
});

/**
 * Tab navigation functionality
 */
function initializeTabs() {
    // 获取所有标签和内容区域
    const tabLinks = document.querySelectorAll('.main-tabs .tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.querySelector('.tab-indicator');
    
    // 首先强制设置所有内容区域为隐藏
    tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
        content.style.visibility = 'hidden';
        content.style.opacity = '0';
    });
    
    // 页面加载时设置默认状态：第一个标签激活，其余隐藏
    tabLinks.forEach((link, index) => {
        const isActive = index === 0;
        link.classList.toggle('active', isActive);
        
        // 获取标签对应的内容区域
        const targetId = link.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);
        
        if (targetContent) {
            if (isActive) {
                // 激活第一个标签内容
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
                targetContent.style.visibility = 'visible';
                targetContent.style.opacity = '1';
                
                // 确保内容区域中的图表容器可见
                const chartContainers = targetContent.querySelectorAll('.chart-container');
                if (chartContainers.length > 0) {
                    chartContainers.forEach(container => {
                        container.style.display = 'block';
                        container.style.visibility = 'visible';
                        container.style.opacity = '1';
                    });
                }
            } else {
                // 非激活标签内容
                targetContent.classList.remove('active');
                targetContent.style.display = 'none';
            }
        }
    });
    
    // 设置初始指示器位置
    if (tabIndicator && tabLinks.length > 0) {
        updateIndicator(tabIndicator, tabLinks[0]);
    }
    
    // 为每个标签添加点击事件
    tabLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取当前点击标签对应的内容ID
            const targetId = this.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            
            if (!targetContent) {
                return;
            }
            
            // 更新标签状态：当前标签激活，其余非激活
            tabLinks.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            // 首先确保所有内容区域都隐藏
            tabContents.forEach(content => {
                if (content.id !== targetId) {
                    content.classList.remove('active');
                    content.style.display = 'none';
                    content.style.visibility = 'hidden';
                    content.style.opacity = '0';
                }
            });
            
            // 激活点击的标签对应的内容区域 - 采用直接设置样式的方式
            targetContent.style.display = 'block';
            targetContent.style.visibility = 'visible';
            targetContent.style.opacity = '1';
            targetContent.classList.add('active');
            
            // 确保内容区域中的图表容器可见
            const chartContainers = targetContent.querySelectorAll('.chart-container');
            if (chartContainers.length > 0) {
                chartContainers.forEach(container => {
                    container.style.display = 'block';
                    container.style.visibility = 'visible';
                    container.style.opacity = '1';
                });
            }
            
            // 强制重新计算布局
            targetContent.getBoundingClientRect();
            
            // 更新指示器位置
            if (tabIndicator) {
                updateIndicator(tabIndicator, this);
            }
            
            // 根据标签ID加载对应的图表，使用较大的延迟确保DOM已完全更新
            setTimeout(() => {
                if (targetId === 'overview') {
                    initializeOverallTrendChart();
                } 
                else if (targetId === 'sectors') {
                    initializeSectorImpactChart();
                    // 稍微延迟加载第二个图表，避免渲染冲突
                    setTimeout(() => {
                        initializeSectorSensitivityChart();
                    }, 300);
                } 
                else if (targetId === 'comparison') {
                    initializeExportDomesticChart();
                }
            }, 100);
        });
    });
    
    // 更新指示器位置的辅助函数
    function updateIndicator(indicator, activeTab) {
        const rect = activeTab.getBoundingClientRect();
        const parentRect = activeTab.parentElement.getBoundingClientRect();
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${rect.left - parentRect.left}px`;
    }
}


/**
 * Overall manufacturing trend chart
 */
function initializeOverallTrendChart() {
    const ctx = document.getElementById('overallTrendChart');
    if (!ctx) return;
    
    // 清除可能存在的旧图表实例
    if (window.overallTrendChart && typeof window.overallTrendChart.destroy === 'function') {
        window.overallTrendChart.destroy();
    }
    
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
    
    // 保存图表实例以便后续销毁
    window.overallTrendChart = chart;
    
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
    // 给DOM时间渲染和计算尺寸
    setTimeout(() => {
        const ctx = document.getElementById('sectorImpactChart');
        if (!ctx) return;
        
        try {
            // 首先确保sectors标签内容区域可见，这是关键
            const sectorsTab = document.getElementById('sectors');
            if (sectorsTab) {
                // 确保这个标签内容区域是可见的
                if (window.getComputedStyle(sectorsTab).display === 'none') {
                    sectorsTab.style.display = 'block';
                    sectorsTab.style.visibility = 'visible';
                    sectorsTab.style.opacity = '1';
                    // 强制重新计算布局
                    sectorsTab.getBoundingClientRect();
                }
            }
            
            // 清除可能存在的旧图表实例
            if (window.sectorImpactChart && typeof window.sectorImpactChart.destroy === 'function') {
                window.sectorImpactChart.destroy();
            }
            
            // 确保图表容器可见并有明确尺寸
            const container = ctx.closest('.chart-container');
            if (container) {
                // 先强制显示容器
                container.style.display = 'block';
                container.style.visibility = 'visible';
                container.style.opacity = '1';
                
                // 设置明确高度和宽度
                container.style.height = '400px';
                container.style.width = '100%';
                
                // 强制浏览器计算布局
                const rect = container.getBoundingClientRect();
            }
            
            // 重置和设置Canvas元素尺寸
            ctx.width = container ? container.offsetWidth : window.innerWidth;
            ctx.height = container ? container.offsetHeight : 400;
            ctx.style.width = '100%';
            ctx.style.height = '100%';
            
            // 获取2D上下文
            const chartCtx = ctx.getContext('2d');
            if (!chartCtx) return;
            
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
            const chart = new Chart(chartCtx, {
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
                    height: ctx.height,
                    width: ctx.width,
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
            
            // 保存图表实例以便后续销毁
            window.sectorImpactChart = chart;
            
            // 确保图表可见
            chart.resize();
        } catch (error) {
            // Silent error handling
        }
    }, 100);
}

function initializeSectorSensitivityChart() {
    // 给DOM时间渲染和计算尺寸
    setTimeout(() => {
        const ctx = document.getElementById('sectorSensitivityChart');
        if (!ctx) return;
        
        try {
            // 首先确保sectors标签内容区域可见，这是关键
            const sectorsTab = document.getElementById('sectors');
            if (sectorsTab) {
                // 确保这个标签内容区域是可见的
                if (window.getComputedStyle(sectorsTab).display === 'none') {
                    sectorsTab.style.display = 'block';
                    sectorsTab.style.visibility = 'visible';
                    sectorsTab.style.opacity = '1';
                    // 强制重新计算布局
                    sectorsTab.getBoundingClientRect();
                }
            }
            
            // 清除可能存在的旧图表实例
            if (window.sectorSensitivityChart && typeof window.sectorSensitivityChart.destroy === 'function') {
                window.sectorSensitivityChart.destroy();
            }
            
            // 确保图表容器可见并有明确尺寸
            const container = ctx.closest('.chart-container');
            if (container) {
                // 先强制显示容器
                container.style.display = 'block';
                container.style.visibility = 'visible';
                container.style.opacity = '1';
                
                // 设置明确高度和宽度 - 这个图表需要更高
                container.style.height = '500px';
                container.style.width = '100%';
                
                // 强制浏览器计算布局
                const rect = container.getBoundingClientRect();
            }
            
            // 重置和设置Canvas元素尺寸
            ctx.width = container ? container.offsetWidth : window.innerWidth;
            ctx.height = container ? container.offsetHeight : 500;
            ctx.style.width = '100%';
            ctx.style.height = '100%';
            
            // 获取2D上下文
            const chartCtx = ctx.getContext('2d');
            if (!chartCtx) return;
            
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
                if (value > 100) return 'high';
                if (value >= 50 && value <= 100) return 'medium';
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
            const chart = new Chart(chartCtx, {
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
                    height: ctx.height,
                    width: ctx.width,
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
            
            // 保存图表实例以便后续销毁
            window.sectorSensitivityChart = chart;
            
            // 确保图表可见
            chart.resize();
        } catch (error) {
            // Silent error handling
        }
    }, 300);
}

/**
 * Diesel Price Impact Analysis
 */
function initializeExportDomesticChart() {
    const ctx = document.getElementById('exportDomesticChart');
    if (!ctx) return;
    
    // 清除可能存在的旧图表实例
    if (window.exportDomesticChart && typeof window.exportDomesticChart.destroy === 'function') {
        window.exportDomesticChart.destroy();
    }
    
    const chartCtx = ctx.getContext('2d');
    
    // 尝试从API获取数据，如果失败则使用模拟数据
    fetch('/api/diesel-impact-chart/')
        .then(response => response.json())
        .then(data => {
            createExportDomesticChart(chartCtx, data);
        })
        .catch(error => {
            // 使用模拟数据作为备选
            const mockData = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                manufacturing_growth: [2.5, 1.8, 3.2, 0.9, -1.2, -2.5, -1.8, 0.3, 1.2, 2.3, 2.8, 3.1],
                diesel_prices: [2.15, 2.15, 2.15, 2.15, 2.15, 3.35, 3.35, 3.35, 3.35, 3.35, 3.35, 3.35]
            };
            createExportDomesticChart(chartCtx, mockData);
        });
}

// 创建柴油价格影响分析图表
function createExportDomesticChart(chartCtx, data) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Manufacturing Growth (YoY %)',
                data: data.manufacturing_growth,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.3,
                pointRadius: 3,
                pointHoverRadius: 10,
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
            xMin: 5, // June 2024
            xMax: 5,
            borderColor: 'rgba(255, 99, 132, 0.7)',
            borderWidth: 2,
            label: {
                enabled: true,
                content: 'First Subsidy Change',
                position: 'top'
            }
        }
    };
    
    const chart = new Chart(chartCtx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20,
                    right: 30,
                    bottom: 20,
                    left: 20
                }
            },
            onResize: function(chart, size) {
                // 当容器尺寸变化时自动调整图表尺寸
                chart.resize();
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const datasetLabel = context.dataset.label;
                            const value = context.raw;
                            if (datasetLabel === 'Manufacturing Growth (YoY %)') {
                                return datasetLabel + ': ' + value + '%';
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
                        text: 'Growth Rate (%)'
                    },
                    suggestedMin: -2,
                    suggestedMax: 5,
                    padding: 10,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Diesel Price (RM/L)'
                    },
                    suggestedMin: 1,
                    suggestedMax: 5,
                    padding: 10,
                    grid: {
                        drawOnChartArea: false
                    }
                },
                x: {
                    title: {
                        display: true,
                    },
                    padding: 10
                }
            }
        }
    });
    
    // 保存图表实例以便后续销毁
    window.exportDomesticChart = chart;
}