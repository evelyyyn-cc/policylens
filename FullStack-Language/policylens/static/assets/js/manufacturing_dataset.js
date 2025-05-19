// Original function from manufacturing_dataset.js
function setupMainTabs() {
    const tabLinks = document.querySelectorAll('.main-tabs .tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.querySelector('.main-tabs .tab-indicator');
    
    tabLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            tabLinks.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            if (tabIndicator) {
                const rect = this.getBoundingClientRect();
                const parentRect = this.parentElement.getBoundingClientRect();
                tabIndicator.style.width = `${rect.width}px`;
                tabIndicator.style.left = `${rect.left - parentRect.left}px`;
            }
            
            tabContents.forEach(content => content.classList.remove('active'));
            
            const tabId = this.getAttribute('data-tab');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            setTimeout(() => {
                if (ipiChart && typeof ipiChart.resize === 'function') {
                    ipiChart.resize();
                }
                if (divisionsChart && typeof divisionsChart.resize === 'function') {
                    divisionsChart.resize();
                }
            }, 100);
        });
    });

    if (tabIndicator) {
        const activeTabLink = document.querySelector('.main-tabs .tab-link.active');
        if (activeTabLink) {
             setTimeout(() => {
                const rect = activeTabLink.getBoundingClientRect();
                const parentRect = activeTabLink.parentElement.getBoundingClientRect();
                tabIndicator.style.width = `${rect.width}px`;
                tabIndicator.style.left = `${rect.left - parentRect.left}px`;
                if (tabIndicator.style.opacity !== undefined) {
                    tabIndicator.style.opacity = '1'; 
                }
             }, 50);
        }
    }
}

// Initialize Variables
let ipiChart = null;
let divisionsChart = null;

let timePeriodSelect, seriesTypeSelect;
let divisionMonthSelect, divisionYearSelect, seriesTypeDivisionSelect, displayOptionsSelect;
let tableMonthSelect, tableYearSelect;

// --- IPI Chart Functions ---
async function fetchIPIData() {
    try {
        const timePeriod = timePeriodSelect.value;
        const seriesType = seriesTypeSelect.value;
        console.log(`Workspaceing IPI data with year=${timePeriod}, series_type=${seriesType}`);
        // const apiUrl = `http://localhost:8000/api/ipi1ddata/?year=${timePeriod}&series_type=${seriesType}`;
        const apiUrl = `https://mypolicylens.xyz/api/ipi1ddata/?year=${timePeriod}&series_type=${seriesType}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
        const data = await response.json();
        const processedData = processIPIData(data, seriesType);
        updateIPIChartWithData(processedData, seriesType);
    } catch (error) {
        console.error('Error fetching IPI data:', error);
        const timePeriod = timePeriodSelect ? timePeriodSelect.value : 'all';
        const seriesType = seriesTypeSelect ? seriesTypeSelect.value : 'abs';
        const dummyData = generateDummyIPIData(timePeriod, seriesType);
        updateIPIChartWithData(dummyData, seriesType);
    }
}

function processIPIData(apiData, seriesType) {
    const timePeriod = timePeriodSelect.value;
    let labels = [];
    let rawData = [];
    let adjustedData = [];

    if (timePeriod === 'all') {
        const quarterlyData = {};
        apiData.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            const key = `Q${quarter} ${year}`;
            if (!quarterlyData[key]) {
                quarterlyData[key] = { count: 0, indexSum: 0, indexSaSum: 0 };
            }
            quarterlyData[key].count += 1;
            quarterlyData[key].indexSum += item.index;
            quarterlyData[key].indexSaSum += item.index_sa || 0;
        });
        const sortedKeys = Object.keys(quarterlyData).sort((a, b) => {
            const [qA, yA] = a.split(' ');
            const [qB, yB] = b.split(' ');
            if (parseInt(yA) !== parseInt(yB)) return parseInt(yA) - parseInt(yB);
            return parseInt(qA.substring(1)) - parseInt(qB.substring(1));
        });
        labels = sortedKeys;
        rawData = sortedKeys.map(key => quarterlyData[key].indexSum / quarterlyData[key].count);
        adjustedData = sortedKeys.map(key => quarterlyData[key].indexSaSum / quarterlyData[key].count);
    } else {
        labels = apiData.map(item => {
            const date = new Date(item.date);
            return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        });
        rawData = apiData.map(item => item.index);
        adjustedData = apiData.map(item => item.index_sa);
    }
    return { labels, rawData, adjustedData: seriesType === 'growth_yoy' ? [] : adjustedData };
}

function updateIPIChartWithData(data, seriesType) {
    if (!ipiChart) return;
    ipiChart.data.labels = data.labels;
    let yAxisLabel = 'Index (2015=100)';

    if (seriesType === 'abs') {
        ipiChart.data.datasets[0].label = 'Manufacturing Index';
        ipiChart.data.datasets[0].data = data.rawData;
        ipiChart.data.datasets[0].borderColor = '#3498db'; // Ensure color is set
        ipiChart.data.datasets[0].backgroundColor = 'rgba(52, 152, 219, 0.1)';


        ipiChart.data.datasets[1].label = 'Manufacturing Index (Seasonally Adjusted)';
        ipiChart.data.datasets[1].data = data.adjustedData;
        ipiChart.data.datasets[1].borderColor = '#2ecc71'; // Ensure color is set
        ipiChart.data.datasets[1].backgroundColor = 'rgba(46, 204, 113, 0.1)';
        ipiChart.data.datasets[1].hidden = false;
    } else if (seriesType === 'growth_yoy') {
        yAxisLabel = 'Year-on-Year Growth (%)';
        ipiChart.data.datasets[0].label = 'Manufacturing Index (YoY Growth %)';
        ipiChart.data.datasets[0].data = data.rawData;
        ipiChart.data.datasets[0].borderColor = '#3498db'; // Ensure color is set
        ipiChart.data.datasets[0].backgroundColor = 'rgba(52, 152, 219, 0.1)';

        ipiChart.data.datasets[1].data = [];
        ipiChart.data.datasets[1].hidden = true;
    } else if (seriesType === 'growth_mom') {
        yAxisLabel = 'Month-on-Month Growth (%)';
        ipiChart.data.datasets[0].label = 'Manufacturing Index (MoM Growth %)';
        ipiChart.data.datasets[0].data = data.rawData;
        ipiChart.data.datasets[0].borderColor = '#3498db'; // Ensure color is set
        ipiChart.data.datasets[0].backgroundColor = 'rgba(52, 152, 219, 0.1)';

        ipiChart.data.datasets[1].label = 'Manufacturing Index (Seasonally Adjusted MoM Growth %)';
        ipiChart.data.datasets[1].data = data.adjustedData;
        ipiChart.data.datasets[1].borderColor = '#2ecc71'; // Ensure color is set
        ipiChart.data.datasets[1].backgroundColor = 'rgba(46, 204, 113, 0.1)';
        ipiChart.data.datasets[1].hidden = false;
    }

    ipiChart.options.scales.y.title.text = yAxisLabel;
    
    // IPI Chart Scale Update
    if (seriesType === 'abs') {
        const allValues = [...(data.rawData || []), ...(data.adjustedData || [])].filter(val => val !== null && !isNaN(val));
        if (allValues.length > 0) {
            const maxValue = Math.max(...allValues);
            const minValue = Math.min(...allValues);
            const padding = (maxValue - minValue) * 0.1;
            ipiChart.options.scales.y.suggestedMin = Math.max(0, minValue - padding);
            ipiChart.options.scales.y.suggestedMax = maxValue + padding;
        } else {
            ipiChart.options.scales.y.suggestedMin = 0; // Default if no data
            ipiChart.options.scales.y.suggestedMax = 100; // Default if no data
        }
    } else { // For growth percentages
        const allValues = [...(data.rawData || []), ...(data.adjustedData || [])].filter(val => val !== null && !isNaN(val));
        if (allValues.length > 0) {
            const maxValue = Math.max(...allValues);
            const minValue = Math.min(...allValues);
            const padding = Math.max(1, (maxValue - minValue) * 0.1); // Use 1 instead of 2 for a bit tighter fit
            ipiChart.options.scales.y.suggestedMin = minValue - padding;
            ipiChart.options.scales.y.suggestedMax = maxValue + padding;
        } else {
            ipiChart.options.scales.y.suggestedMin = -10; // Default for growth
            ipiChart.options.scales.y.suggestedMax = 10;  // Default for growth
        }
    }

    const timePeriod = timePeriodSelect.value;
    let titleText = 'Manufacturing Industrial Production Index (IPI)';
    if (timePeriod === 'all') titleText += ' - All Years (Quarterly Data)';
    else titleText += ` - ${timePeriod}`;
    if (seriesType === 'growth_yoy') titleText += ' (Year-on-Year Growth)';
    else if (seriesType === 'growth_mom') titleText += ' (Month-on-Month Growth)';
    
    const chartTitleDiv = document.querySelector('#manu-line-tab .chart-title');
    if (chartTitleDiv) chartTitleDiv.textContent = titleText;
    else if (ipiChart.options.plugins.title) ipiChart.options.plugins.title.text = titleText;

    ipiChart.update();
}

function generateDummyIPIData(timePeriod, seriesType) {
    let labels = [];
    let rawData = [];
    let adjustedData = [];
    let baseValue = 124;
    let adjustedBaseValue = 124.5;

    if (timePeriod === 'all') {
        for (let year = 2015; year <= 2025; year++) {
            for (let quarter = 1; quarter <= 4; quarter++) {
                if (year === 2025 && quarter > 1) break; 
                labels.push(`Q${quarter} ${year}`);
                baseValue += Math.random() * 1.2 - 0.2;
                adjustedBaseValue += Math.random() * 1.2 - 0.1;
                rawData.push(baseValue);
                adjustedData.push(adjustedBaseValue);
            }
        }
    } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const yearValue = parseInt(timePeriod); // Ensure year is an int for comparison
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        let monthLimit = 12;
        if (yearValue === currentYear) {
            monthLimit = currentMonth + 1; 
        }
        // Special handling for future years in dummy data like 2025
        if (yearValue === 2025) monthLimit = 2; // As per original logic for Feb 2025

        for (let month = 0; month < monthLimit; month++) {
            labels.push(`${months[month]} ${yearValue}`);
            baseValue += (Math.random() * 0.8 - 0.2);
            adjustedBaseValue += (Math.random() * 0.8 - 0.15);
            rawData.push(baseValue);
            adjustedData.push(adjustedBaseValue);
        }
    }
    return { labels, rawData, adjustedData };
}

function updateIPIChart() {
    fetchIPIData();
}

// --- Divisions Chart Functions ---
async function fetchDivisionsData() {
    try {
        let month = divisionMonthSelect.value;
        let year = divisionYearSelect.value;
        if (year === '2025' && parseInt(month) > 2) {
            month = '2';
            divisionMonthSelect.value = '2';
        }
        const seriesType = seriesTypeDivisionSelect.value;
        const displayOption = displayOptionsSelect.value;
        console.log(`Workspaceing divisions data with year=${year}, month=${month}, series_type=${seriesType}, display=${displayOption}`);
        // let apiUrl = `http://127.0.0.1:8000/api/ipi2ddata/?year=${year}&month=${month}&series_type=${seriesType}`;
        let apiUrl = `https://mypolicylens.xyz/api/ipi2ddata/?year=${year}&month=${month}&series_type=${seriesType}`;
        if (seriesType === 'abs') apiUrl += `&display=${displayOption}`;
        else apiUrl += `&display=all`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API call failed: ${response.status}`);
        const data = await response.json();
        if (!data || data.length === 0) throw new Error('No data received from API');
        
        const processedData = processDivisionsData(data, displayOption, seriesType); // Pass seriesType
        updateDivisionsChartWithData(processedData, seriesType, displayOption);
    } catch (error) {
        console.error('Error fetching divisions data:', error);
        // Fallback or error display logic can be added here
    }
}

function processDivisionsData(apiData, displayOption, seriesType) {
    // The value to be used for sorting and display depends on seriesType
    // The API for ipi2ddata returns 'index' for 'abs', 'yoy_change' for 'growth_yoy', etc.
    // Ensure the correct field is used. Assuming the API correctly returns
    // The relevant value directly in a field like 'value' or that the 'index' field
    // Gets populated with the correct series type data by the backend.
    // Example assume the API returns 'index' which contains the correct value based on series_type query.
    
    let processedData = apiData.map(item => ({
        division: displayOption === 'all' ? `D${item.division}` : `Division ${item.division}`,
        // The 'value' should reflect the seriesType.
        // If API directly gives 'index' as the value for the chosen series_type:
        value: parseFloat(item.index), // Ensure it's a number
        fullName: item.desc_en,
        divisionCode: item.division
    }));

    // Sort by the 'value' (which should be appropriate for the seriesType)
    processedData.sort((a, b) => b.value - a.value);

    if (displayOption === 'top' && processedData.length > 10) {
        processedData = processedData.slice(0, 10);
    }
    return {
        divisions: processedData.map(item => item.division),
        values: processedData.map(item => item.value),
        fullNames: processedData.map(item => item.fullName)
    };
}


function updateDivisionsChartWithData(data, seriesType, displayOption) {
    if (!divisionsChart) return;
    divisionsChart.data.labels = data.divisions;
    divisionsChart.data.datasets[0].data = data.values;

    // Divisions Chart Bar Colors
    if (seriesType === 'growth_yoy' || seriesType === 'growth_mom') {
        const colors = data.values.map(value => 
            value >= 0 ? 'rgba(46, 204, 113, 0.7)' : 'rgba(231, 76, 60, 0.7)' // Green/Red
        );
        const borderColors = data.values.map(value => 
            value >= 0 ? 'rgba(46, 204, 113, 1)' : 'rgba(231, 76, 60, 1)'
        );
        divisionsChart.data.datasets[0].backgroundColor = colors;
        divisionsChart.data.datasets[0].borderColor = borderColors;
    } else { // 'abs'
        const blueBackground = data.values.map(() => 'rgba(52, 152, 219, 0.7)'); // Blue for all bars
        const blueBorder = data.values.map(() => 'rgba(52, 152, 219, 1)');
        divisionsChart.data.datasets[0].backgroundColor = blueBackground;
        divisionsChart.data.datasets[0].borderColor = blueBorder;
    }
    
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = parseInt(divisionMonthSelect.value);
    const year = divisionYearSelect.value;
    let displayText = displayOption === 'top' ? 'Top 10' : 'All';
    let titleText = `${displayText} Manufacturing Divisions (${monthNames[month]} ${year})`;
    let yAxisLabel = 'Index Value (2015=100)';
    let datasetLabel = 'Index Value (2015=100)';

    if (seriesType === 'growth_yoy') {
        titleText = `${displayText} Manufacturing Divisions - YoY Growth (${monthNames[month]} ${year})`;
        yAxisLabel = 'Year-on-Year Growth (%)';
        datasetLabel = 'YoY Growth (%)';
    } else if (seriesType === 'growth_mom') {
        titleText = `${displayText} Manufacturing Divisions - MoM Growth (${monthNames[month]} ${year})`;
        yAxisLabel = 'Month-on-Month Growth (%)';
        datasetLabel = 'MoM Growth (%)';
    }
    
    const chartTitleDiv = document.querySelector('#manu-bar-tab .chart-title');
    if (chartTitleDiv) chartTitleDiv.textContent = titleText;
    else if (divisionsChart.options.plugins.title) divisionsChart.options.plugins.title.text = titleText;

    divisionsChart.options.scales.y.title.text = yAxisLabel;
    divisionsChart.data.datasets[0].label = datasetLabel;
    
    if (seriesType === 'growth_yoy' || seriesType === 'growth_mom') {
        if (data.values && data.values.length > 0) {
            const allValues = data.values.filter(val => val !== null && !isNaN(val));
             if (allValues.length > 0) {
                const maxValue = Math.max(...allValues);
                const minValue = Math.min(...allValues);
                const padding = Math.max(1, (maxValue - minValue) * 0.1);
                divisionsChart.options.scales.y.min = minValue - padding;
                divisionsChart.options.scales.y.max = maxValue + padding;
            } else { // Default for growth if no data
                divisionsChart.options.scales.y.min = -10;
                divisionsChart.options.scales.y.max = 10;
            }
        } else { // Default for growth if no data.values
            divisionsChart.options.scales.y.min = -10;
            divisionsChart.options.scales.y.max = 10;
        }
        divisionsChart.options.scales.y.suggestedMin = undefined;
        divisionsChart.options.scales.y.suggestedMax = undefined;
    } else { // 'abs'
        // For absolute values, let Chart.js determine the scale or use a fixed range if preferred
        divisionsChart.options.scales.y.min = 100; 
        divisionsChart.options.scales.y.max = 200;
        divisionsChart.options.scales.y.suggestedMin = undefined; // Ensure these are not interfering
        divisionsChart.options.scales.y.suggestedMax = undefined;

        // If  want it to be more dynamic for 'abs':
        // const allAbsValues = data.values.filter(val => val !== null && !isNaN(val));
        // if (allAbsValues.length > 0) {
        //     const maxAbsValue = Math.max(...allAbsValues);
        //     const minAbsValue = Math.min(...allAbsValues);
        //     const padding = (maxAbsValue - minAbsValue) * 0.1;
        //     divisionsChart.options.scales.y.min = Math.max(0, minAbsValue - padding); // Or a fixed like 50
        //     divisionsChart.options.scales.y.max = maxAbsValue + padding;
        // } else {
        //     divisionsChart.options.scales.y.min = 0;
        //     divisionsChart.options.scales.y.max = 100;
        // }
    }

    divisionsChart.options.plugins.tooltip.callbacks.title = function(context) {
        if (!context || context.length === 0 || !data.fullNames || !data.divisions) return '';
        const index = context[0].dataIndex;
        if (index >= data.fullNames.length) return '';
        return `Division ${data.divisions[index].replace(/^D(ivision )?/, '')}: ${data.fullNames[index]}`;
    };
     divisionsChart.options.plugins.tooltip.callbacks.label = function(context) {
        const value = context.raw;
        if (seriesType === 'growth_yoy') return `YoY Growth: ${value.toFixed(2)}%`;
        if (seriesType === 'growth_mom') return `MoM Growth: ${value.toFixed(2)}%`;
        return `Index Value: ${value.toFixed(1)}`;
    };

    divisionsChart.update();
}

function updateMonthOptions() {
    if (!divisionYearSelect || !divisionMonthSelect) return;
    const selectedYear = divisionYearSelect.value;
    const currentMonthValue = divisionMonthSelect.value ? parseInt(divisionMonthSelect.value) : new Date().getMonth() + 1; // Default to current month if nothing selected

    divisionMonthSelect.innerHTML = ''; 
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let maxMonth = (selectedYear === '2025') ? 2 : 12; // Data only up to Feb 2025

    let monthToSelect = currentMonthValue;
    if (currentMonthValue > maxMonth) { // If current selection is invalid for the year (e.g. March 2025)
        monthToSelect = maxMonth; // Select the last available month (e.g. Feb 2025)
    }


    for (let i = 1; i <= maxMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = monthNames[i-1];
        if (i === monthToSelect) {
            option.selected = true;
        }
        divisionMonthSelect.appendChild(option);
    }
     // If after repopulating, the value is not what we intended (e.g. no option was selected)
    // and the intended month is valid, explicitly set it.
    if (divisionMonthSelect.value != monthToSelect && monthToSelect <=maxMonth) {
        divisionMonthSelect.value = monthToSelect;
    }
}

function updateDivisionsChart() {
    fetchDivisionsData();
}

// --- Data Table Functions ---
async function fetchTableData() {
    try {
        const month = tableMonthSelect.value;
        const year = tableYearSelect.value;
        console.log(`Workspaceing table data with year=${year}, month=${month}`);
        // const apiUrl = `http://127.0.0.1:8000/api/manufacturing_data/?year=${year}&month=${month}`;
        const apiUrl = `https://mypolicylens.xyz/api/manufacturing_data/?year=${year}&month=${month}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API call failed: ${response.status}`);
        const data = await response.json();
        const processedData = processTableData(data);
        updateTableWithData(processedData);
    } catch (error) {
        console.error('Error fetching table data:', error);
        const dummyData = generateDummyTableData(); 
        updateTableWithData(dummyData);
    }
}

function processTableData(apiData) {
    return apiData.map(item => ({
        divisionCode: item.division.toString(),
        division: item.desc_en,
        indexValue: parseFloat(item.abs).toFixed(1),
        yoyChange: `${parseFloat(item.yoy_change) >= 0 ? '+' : ''}${parseFloat(item.yoy_change).toFixed(2)}%`,
        momChange: `${parseFloat(item.mom_change) >= 0 ? '+' : ''}${parseFloat(item.mom_change).toFixed(2)}%`
    }));
}

function updateTableWithData(data) {
    const tableBody = document.getElementById('divisionsTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = item.divisionCode;
        row.insertCell().textContent = item.division;
        const indexCell = row.insertCell();
        indexCell.textContent = item.indexValue;
        indexCell.style.textAlign = 'right';
        const yoyCell = row.insertCell();
        yoyCell.textContent = item.yoyChange;
        yoyCell.style.textAlign = 'right';
        yoyCell.classList.toggle('positive-change', item.yoyChange.includes('+'));
        yoyCell.classList.toggle('negative-change', !item.yoyChange.includes('+') && item.yoyChange.includes('-')); // More specific for negative
        const momCell = row.insertCell();
        momCell.textContent = item.momChange;
        momCell.style.textAlign = 'right';
        momCell.classList.toggle('positive-change', item.momChange.includes('+'));
        momCell.classList.toggle('negative-change', !item.momChange.includes('+') && item.momChange.includes('-')); // More specific for negative
    });
}
function generateDummyTableData() {
    return [
        { divisionCode: '26', division: 'Manufacture of computer, electronic and optical products', indexValue: '175.3', yoyChange: '+7.2%', momChange: '+1.5%' },
        { divisionCode: '20', division: 'Manufacture of chemicals and chemical products', indexValue: '152.8', yoyChange: '+5.3%', momChange: '-0.7%' },
        { divisionCode: '22', division: 'Manufacture of rubber and plastics products', indexValue: '148.5', yoyChange: '+4.8%', momChange: '+0.9%' },
        { divisionCode: '27', division: 'Manufacture of electrical equipment', indexValue: '144.2', yoyChange: '+4.5%', momChange: '+0.6%' },
    ];
}


function updateTableMonthOptions() {
    if (!tableYearSelect || !tableMonthSelect) return;
    const selectedYear = tableYearSelect.value;
    const currentMonthValue = tableMonthSelect.value ? parseInt(tableMonthSelect.value) : new Date().getMonth() + 1;

    tableMonthSelect.innerHTML = ''; 

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let maxMonth = (selectedYear === '2025') ? 2 : 12;

    let monthToSelect = currentMonthValue;
    if (currentMonthValue > maxMonth) {
        monthToSelect = maxMonth;
    }

    for (let i = 1; i <= maxMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = monthNames[i-1];
        if (i === monthToSelect) {
            option.selected = true;
        }
        tableMonthSelect.appendChild(option);
    }
    if (tableMonthSelect.value != monthToSelect && monthToSelect <= maxMonth) {
        tableMonthSelect.value = monthToSelect;
    }
}

function initDataTable() {
    if (tableMonthSelect && tableYearSelect) { // Ensure elements are present
       fetchTableData();
    }
}

// --- Chart Initialization ---
function initCharts() {
    const ipiCtx = document.getElementById('ipiChart')?.getContext('2d');
    if (ipiCtx) {
        ipiChart = new Chart(ipiCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Manufacturing Index', data: [], borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 2, tension: 0.2, fill: true
                    },
                    {
                        label: 'Manufacturing Index (Seasonally Adjusted)', data: [], borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 2, borderDash: [5, 5], tension: 0.2, fill: false
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { title: { display: false }, tooltip: { mode: 'index', intersect: false }, legend: { position: 'top'}},
                scales: { x: { title: { display: true, text: 'Date' }}, 
                          y: { title: { display: true, text: 'Index (2015=100)' }} // suggestedMin/Max will be set dynamically
                        }
            }
        });
    }

    const divisionsCtx = document.getElementById('divisionsChart')?.getContext('2d');
    if (divisionsCtx) {
        divisionsChart = new Chart(divisionsCtx, {
            type: 'bar',
            data: { labels: [], datasets: [{ label: 'Index Value (2015=100)', data: [], backgroundColor: 'rgba(52, 152, 219, 0.7)', borderColor: 'rgba(52, 152, 219, 1)', borderWidth: 1 }] },
            options: {
                responsive: true, maintainAspectRatio: false, indexAxis: 'x',
                plugins: { title: { display: false }, legend: { display: true, position: 'top' }, 
                    tooltip: { callbacks: { title: () => '', label: context => `Value: ${context.raw.toFixed(1)}` }}
                },
                scales: {
                    // min/max and suggestedMin/Max will be set dynamically
                    y: { title: { display: true, text: 'Index Value (2015=100)'}, grid: {display: true} }, 
                    x: { title: { display: false, text:'Manufacturing Division' }, grid: { display: false }, ticks: { maxRotation: 45, minRotation: 45, autoSkip: false } } // Added autoSkip: false
                }
            }
        });
    }
    // Initial data fetch will be triggered by event listener setup or direct calls after this.
}


document.addEventListener('DOMContentLoaded', function() {
    timePeriodSelect = document.getElementById('time-period');
    seriesTypeSelect = document.getElementById('series-type');
    divisionMonthSelect = document.getElementById('division-month');
    divisionYearSelect = document.getElementById('division-year');
    seriesTypeDivisionSelect = document.getElementById('series-type-division');
    displayOptionsSelect = document.getElementById('display-options');
    tableMonthSelect = document.getElementById('table-month');
    tableYearSelect = document.getElementById('table-year');

    setupMainTabs(); 
    initCharts(); // Initialize chart structures
    
    if (timePeriodSelect && seriesTypeSelect) {
        timePeriodSelect.addEventListener('change', updateIPIChart);
        seriesTypeSelect.addEventListener('change', updateIPIChart);
        fetchIPIData(); // Initial fetch for IPI chart
    }
    
    if (divisionMonthSelect && divisionYearSelect && seriesTypeDivisionSelect && displayOptionsSelect) {
        divisionMonthSelect.addEventListener('change', updateDivisionsChart);
        divisionYearSelect.addEventListener('change', () => {
            updateMonthOptions(); 
            updateDivisionsChart(); 
        });
        seriesTypeDivisionSelect.addEventListener('change', updateDivisionsChart);
        displayOptionsSelect.addEventListener('change', updateDivisionsChart);
        updateMonthOptions(); 
        fetchDivisionsData(); // Initial fetch for Divisions chart
    }

    if (tableMonthSelect && tableYearSelect) {
        tableMonthSelect.addEventListener('change', fetchTableData);
        tableYearSelect.addEventListener('change', () => {
            updateTableMonthOptions(); 
            fetchTableData(); 
        });
        updateTableMonthOptions(); 
        initDataTable(); // Initial fetch for the table data
    }
});