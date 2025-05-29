// script.js - 応募者管理 BIツール メインスクリプト

// ★★★ 必ずGASのウェブアプリURLに書き換えてください ★★★
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzvShHSzKSgk9671w1JaHN4Zmu-6TxK9bBBFBb-Da3bHB2-J46ZfuKSK-mOvSnaNOXCyQ/exec'; 

// --- グローバル変数 ---
let allDataCache = {}; // 年ごとの初期データ（{applicants: [], masters: {}, availableYears: []}）と、
                       // 前年・前前年の応募者データ（例: allDataCache['2024_applicants'] = [...]）をキャッシュ
let masterDataGlobal = {}; // 最新のマスターデータを保持
let currentChartInstances = {}; // Chart.jsのインスタンスを保持
let currentSelectedYear = '';    // 現在選択中の年
let currentSelectedMonth = 'all'; // 現在選択中の月 ('all' または 1-12 の数値文字列)

// DATA_HEADERS をJS側でも定義 (GASから返ってくる応募者データのキーと一致させる)
const DATA_HEADERS = [
  '応募日', '店舗名', '氏名', '性別', '年齢', '職種', '雇用形態',
  '応募経路', '報酬', '面接日', '内定日', '合否', '入社日',
  '面接担当者', '備考', '入社理由', '前職の退職理由', 'ID',
  '住所', 'エリア' // GASで付加される項目
];

// --- DOM要素 ---
const yearSelector = document.getElementById('yearSelector');
const monthSelector = document.getElementById('monthSelector');
const refreshBtn = document.getElementById('refreshBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const currentYearDisplay = document.getElementById('currentYearDisplay');
const statsGrid = document.getElementById('statsGrid');
const applicantTable = document.getElementById('applicantTable');
const applicantTableHeaderEl = applicantTable.getElementsByTagName('thead')[0];
const applicantTableBodyEl = applicantTable.getElementsByTagName('tbody')[0];
const comparisonTableBody = document.getElementById('comparisonTable').getElementsByTagName('tbody')[0];
const filterStoreEl = document.getElementById('filterStore');
const filterStatusEl = document.getElementById('filterStatus');
const filterNameEl = document.getElementById('filterName');
const lastUpdatedEl = document.getElementById('lastUpdated');
const tableRowCountEl = document.getElementById('tableRowCount');

// --- 関数 ---

/** ローディング表示 */
function showLoading(text = "データを読み込み中...") {
    if (loadingOverlay) {
        loadingOverlay.querySelector('p').textContent = text;
        loadingOverlay.style.display = 'flex';
    }
}

/** ローディング非表示 */
function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/** GASからデータをフェッチ */
async function fetchDataFromGAS(year, forceRefresh = false) {
    showLoading(` ${year} 年のデータを取得中...`);

    const prevYearStr = (parseInt(year) - 1).toString();
    const prevPrevYearStr = (parseInt(year) - 2).toString();

    // キャッシュ確認
    if (allDataCache[year] && allDataCache[prevYearStr + '_applicants'] && allDataCache[prevPrevYearStr + '_applicants'] && !forceRefresh) {
        console.log(`Loading data for ${year} and comparison years from cache.`);
        hideLoading();
        updateTimestamp();
        return allDataCache[year];
    }

    try {
        const currentYearUrl = `${GAS_WEB_APP_URL}?action=getInitialData&year=${year}`;
        const currentYearResponse = await fetch(currentYearUrl);
        if (!currentYearResponse.ok) throw new Error(`HTTP Error (Current Year ${year}): ${currentYearResponse.status} ${currentYearResponse.statusText}`);
        const currentYearData = await currentYearResponse.json();
        if (currentYearData.error) throw new Error(`GAS Error (Current Year ${year}): ${currentYearData.error}`);
        
        allDataCache[year] = currentYearData;
        if (currentYearData.masters) masterDataGlobal = currentYearData.masters;

        const fetchYearData = async (targetYear, cacheKey) => {
            if (!allDataCache[cacheKey] || forceRefresh) {
                const url = `${GAS_WEB_APP_URL}?action=getApplicants&year=${targetYear}`;
                const response = await fetch(url);
                allDataCache[cacheKey] = response.ok ? await response.json() : { error: `Failed to load ${targetYear} data (${response.status})` };
            }
        };

        await Promise.all([
            fetchYearData(prevYearStr, prevYearStr + '_applicants'),
            fetchYearData(prevPrevYearStr, prevPrevYearStr + '_applicants')
        ]);
        
        console.log(`Data successfully fetched and cached for ${year} and comparison years.`, allDataCache);
        return currentYearData;

    } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("データの読み込みに失敗しました。\n" + error.message + "\nGASのURL、デプロイ設定（最新バージョンか、アクセス権限は「全員」か）、スクリプトのエラーログを確認してください。");
        return null;
    } finally {
        hideLoading();
        updateTimestamp();
    }
}

/** 年セレクタを更新 */
function populateYearSelector(years, selectedYear) {
    const currentVal = yearSelector.value;
    yearSelector.innerHTML = '';
    if (years && years.length > 0) {
        years.forEach(y => {
            const option = document.createElement('option'); option.value = y; option.textContent = y;
            yearSelector.appendChild(option);
        });
        yearSelector.value = (currentVal && years.includes(currentVal)) ? currentVal : (selectedYear || years[0]);
    } else {
        const option = document.createElement('option'); option.textContent = "年データなし";
        yearSelector.appendChild(option);
    }
}

/** 月セレクタを生成 */
function populateMonthSelector() {
    const currentVal = monthSelector.value;
    while (monthSelector.options.length > 1) monthSelector.remove(1);
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option'); option.value = i.toString(); option.textContent = `${i}月`;
        monthSelector.appendChild(option);
    }
    monthSelector.value = currentVal || 'all';
}

/** フィルター用プルダウンを更新 */
function populateFilterDropdowns() {
    const populate = (selectEl, masterKey, itemKey = null) => {
        if (!selectEl) return;
        const currentValue = selectEl.value;
        while (selectEl.options.length > 1) selectEl.remove(1);
        const dataList = masterDataGlobal[masterKey];
        if (dataList && dataList.length > 0) {
            dataList.forEach(item => {
                const option = document.createElement('option');
                const value = itemKey ? item[itemKey] : item;
                option.value = value; option.textContent = value;
                selectEl.appendChild(option);
            });
        }
        selectEl.value = currentValue;
    };
    populate(filterStoreEl, 'stores', 'name');
    populate(filterStatusEl, 'statuses');
}

/** データを表示するメイン関数 */
async function displayData(year, month = 'all', forceRefresh = false) {
    currentSelectedYear = year;
    currentSelectedMonth = month;
    
    const yearDisplaySuffix = month === 'all' ? "年 通年" : `年 ${month}月`;
    if(currentYearDisplay) currentYearDisplay.textContent = `${year}${yearDisplaySuffix}`;

    const fetchedInitialData = await fetchDataFromGAS(year, forceRefresh);

    if (!fetchedInitialData || !fetchedInitialData.applicants || (fetchedInitialData.applicants.error) || (Array.isArray(fetchedInitialData.applicants) && fetchedInitialData.applicants.length > 0 && fetchedInitialData.applicants[0]?.error) ) {
        clearDisplay(`${year}${yearDisplaySuffix}`, fetchedInitialData?.applicants?.error || fetchedInitialData?.error || "データがありません");
        if (fetchedInitialData && fetchedInitialData.availableYears) {
             populateYearSelector(fetchedInitialData.availableYears, year);
        }
        populateMonthSelector();
        return;
    }
    
    const allApplicantsForCurrentYear = Array.isArray(fetchedInitialData.applicants) ? fetchedInitialData.applicants : [];
    
    let filteredApplicantsForDisplay;
    if (month === 'all') {
        filteredApplicantsForDisplay = allApplicantsForCurrentYear;
    } else {
        const selectedMonthNumber = parseInt(month);
        filteredApplicantsForDisplay = allApplicantsForCurrentYear.filter(a => {
            if (!a['応募日']) return false;
            const applyDate = new Date(a['応募日']);
            return !isNaN(applyDate.getTime()) && (applyDate.getMonth() + 1) === selectedMonthNumber;
        });
    }
    
    const prevYearStr = (parseInt(year) - 1).toString();
    const prevYearRawData = allDataCache[prevYearStr + '_applicants'];
    const prevYearFullApplicantsArray = prevYearRawData && Array.isArray(prevYearRawData) && !prevYearRawData.error ? prevYearRawData : [];
    const prevYearFilteredApplicants = month === 'all' ? prevYearFullApplicantsArray : prevYearFullApplicantsArray.filter(a => {
        if (!a['応募日']) return false;
        const applyDate = new Date(a['応募日']);
        return !isNaN(applyDate.getTime()) && (applyDate.getMonth() + 1) === parseInt(month);
    });

    const prevPrevYearStr = (parseInt(year) - 2).toString();
    const prevPrevYearRawData = allDataCache[prevPrevYearStr + '_applicants'];
    const prevPrevYearFullApplicantsArray = prevPrevYearRawData && Array.isArray(prevPrevYearRawData) && !prevPrevYearRawData.error ? prevPrevYearRawData : [];

    populateYearSelector(fetchedInitialData.availableYears, year);
    populateMonthSelector();
    populateFilterDropdowns();

    updateSummaryCards(filteredApplicantsForDisplay, prevYearFilteredApplicants);
    renderMonthlyChart(filteredApplicantsForDisplay, month);
    renderRouteChart(filteredApplicantsForDisplay);
    renderAreaChart(filteredApplicantsForDisplay);
    renderYearlyComparisonChart(allApplicantsForCurrentYear, prevYearFullApplicantsArray, prevPrevYearFullApplicantsArray, year);
    renderApplicantTable(filteredApplicantsForDisplay);
    renderComparisonTable(filteredApplicantsForDisplay, prevYearFilteredApplicants, month);
    applyTableFilters();
}

/** サマリーカード更新 */
function updateSummaryCards(applicants, prevPeriodApplicants) {
    const total = applicants.length;
    const hired = applicants.filter(a => a['合否'] === '採用').length;
    const rate = total > 0 ? ((hired / total) * 100).toFixed(1) : 0;
    const prevTotal = prevPeriodApplicants.length;
    const compareText = currentSelectedMonth === 'all' ? '前年応募者数比' : '前年同月応募者数比';
    const compareRate = prevTotal > 0 ? (((total - prevTotal) / prevTotal) * 100).toFixed(1) : (total > 0 ? '---' : '0');

    statsGrid.innerHTML = `
        <div class="stat-card"><div class="stat-value">${total}</div><div class="stat-label">総応募者数</div></div>
        <div class="stat-card"><div class="stat-value">${hired}</div><div class="stat-label">採用者数</div></div>
        <div class="stat-card"><div class="stat-value">${rate}%</div><div class="stat-label">採用率</div></div>
        <div class="stat-card"><div class="stat-value" style="color: ${compareRate === '---' ? 'grey' : (parseFloat(compareRate) >= 0 ? 'green' : 'red')}">${compareRate}${compareRate !== '---' ? '%' : ''}</div><div class="stat-label">${compareText}</div></div>
    `;
}

/** 応募者テーブルを表示 */
function renderApplicantTable(applicants) {
    applicantTableHeaderEl.innerHTML = ''; applicantTableBodyEl.innerHTML = '';
    const displayHeaders = DATA_HEADERS.filter(h => h !== '住所' && h !== 'エリア');
    if (!applicants || applicants.length === 0) {
        applicantTableBodyEl.innerHTML = `<tr><td colspan="${displayHeaders.length || 1}">データがありません</td></tr>`;
        tableRowCountEl.textContent = '0'; return;
    }
    const headerRow = applicantTableHeaderEl.insertRow();
    displayHeaders.forEach(headerText => { const th = document.createElement('th'); th.textContent = headerText; headerRow.appendChild(th); });
    applicants.forEach(a => {
        const row = applicantTableBodyEl.insertRow();
        displayHeaders.forEach(header => {
            const cell = row.insertCell(); const value = a[header];
            if (['応募日', '面接日', '内定日', '入社日'].includes(header) && value) {
                try { const date = new Date(value); cell.textContent = !isNaN(date.getTime()) ? date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }) : value; } catch(e) { cell.textContent = value; }
            } else { cell.textContent = value != null ? value : ''; }
        });
    });
    tableRowCountEl.textContent = applicants.length;
}

/** 前年(同月)対比表を表示 */
function renderComparisonTable(currentApplicants, prevPeriodApplicants, selectedMonth) {
    comparisonTableBody.innerHTML = '';
    const comparisonTitleEl = document.querySelector('.comparison-section h2');
    if(comparisonTitleEl) comparisonTitleEl.textContent = selectedMonth === 'all' ? '前年対比表 (応募者数)' : `前年同月(${selectedMonth}月)対比表 (応募者数)`;

    if (selectedMonth === 'all') {
        for (let i = 1; i <= 12; i++) {
            const currentMCount = currentApplicants.filter(a => a['応募日'] && new Date(a['応募日']).getMonth() + 1 === i).length;
            const prevMCount = prevPeriodApplicants.filter(a => a['応募日'] && new Date(a['応募日']).getMonth() + 1 === i).length;
            const diff = currentMCount - prevMCount; const rate = prevMCount > 0 ? ((diff / prevMCount) * 100).toFixed(1) + '%' : (currentMCount > 0 ? '---' : '0%');
            const row = comparisonTableBody.insertRow();
            row.insertCell().textContent = `${i}月`; row.insertCell().textContent = currentMCount;
            row.insertCell().textContent = prevMCount; row.insertCell().textContent = diff;
            row.insertCell().textContent = rate; row.cells[3].style.color = diff > 0 ? 'green' : (diff < 0 ? 'red' : 'black');
        }
    } else {
        const monthNum = parseInt(selectedMonth);
        const currentMTotal = currentApplicants.length; const prevMTotal = prevPeriodApplicants.length;
        const diff = currentMTotal - prevMTotal; const rate = prevMTotal > 0 ? ((diff / prevMTotal) * 100).toFixed(1) + '%' : (currentMTotal > 0 ? '---' : '0%');
        const row = comparisonTableBody.insertRow();
        row.insertCell().textContent = `${monthNum}月`; row.insertCell().textContent = currentMTotal;
        row.insertCell().textContent = prevMTotal; row.insertCell().textContent = diff;
        row.insertCell().textContent = rate; row.cells[3].style.color = diff > 0 ? 'green' : (diff < 0 ? 'red' : 'black');
    }
}

/** テーブルフィルターを適用 */
function applyTableFilters() {
    const storeFilter = filterStoreEl.value; const statusFilter = filterStatusEl.value; const nameFilter = filterNameEl.value.toLowerCase();
    const rows = applicantTableBodyEl.getElementsByTagName('tr');
    if (rows.length === 0 || (rows.length === 1 && rows[0].cells[0].textContent.includes('データがありません'))) { tableRowCountEl.textContent = '0'; return; }
    const headers = applicantTableHeaderEl.rows.length > 0 ? Array.from(applicantTableHeaderEl.rows[0].cells).map(th => th.textContent) : [];
    if (headers.length === 0) return;
    const storeIndex = headers.indexOf('店舗名'); const statusIndex = headers.indexOf('合否'); const nameIndex = headers.indexOf('氏名');
    let visibleCount = 0;
    for (const row of rows) {
        let show = true; const cells = row.cells;
        if (storeFilter && storeIndex > -1 && cells[storeIndex] && cells[storeIndex].textContent !== storeFilter) show = false;
        if (statusFilter && statusIndex > -1 && cells[statusIndex] && cells[statusIndex].textContent !== statusFilter) show = false;
        if (nameFilter && nameIndex > -1 && cells[nameIndex] && !cells[nameIndex].textContent.toLowerCase().includes(nameFilter)) show = false;
        row.style.display = show ? '' : 'none'; if (show) visibleCount++;
    }
    tableRowCountEl.textContent = visibleCount;
}

/** チャート描画/更新用のヘルパー関数 */
function updateChart(canvasId, type, data, options) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) { console.warn(`Canvas with id ${canvasId} not found.`); return; }
    if (currentChartInstances[canvasId]) currentChartInstances[canvasId].destroy();
    currentChartInstances[canvasId] = new Chart(ctx, { type, data, options });
}

/** 月別チャート */
function renderMonthlyChart(applicants, selectedMonth) {
    let chartData, chartLabels, chartType = 'bar';
    const chartOptions = { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, responsive: true, maintainAspectRatio: false, plugins: { legend: { display: selectedMonth === 'all' } } };
    if (selectedMonth === 'all') {
        const monthlyData = {}; for (let i = 1; i <= 12; i++) monthlyData[i] = { total: 0, hired: 0 };
        applicants.forEach(a => { if (!a['応募日']) return; const date = new Date(a['応募日']); if(isNaN(date.getTime())) return; const month = date.getMonth() + 1; if (monthlyData[month]) { monthlyData[month].total++; if (a['合否'] === '採用') monthlyData[month].hired++; } });
        chartLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
        const totalCounts = Object.values(monthlyData).map(d => d.total); const hiredCounts = Object.values(monthlyData).map(d => d.hired);
        chartData = { labels: chartLabels, datasets: [{ label: '応募者数', data: totalCounts, backgroundColor: 'rgba(54, 162, 235, 0.7)'}, { label: '採用者数', data: hiredCounts, backgroundColor: 'rgba(75, 192, 192, 0.7)' }]};
    } else {
        const total = applicants.length; const hired = applicants.filter(a => a['合否'] === '採用').length;
        chartLabels = [`${selectedMonth}月 応募者数`, `${selectedMonth}月 採用者数`];
        chartData = { labels: chartLabels, datasets: [{ label: `${selectedMonth}月実績`, data: [total, hired], backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)'] }]};
    }
    updateChart('monthlyChart', chartType, chartData, chartOptions);
}

/** 応募経路チャート描画 */
function renderRouteChart(applicants) {
    updatePieChart(applicants, '応募経路', 'routeChart', '応募経路別');
}

/** エリアチャート描画 */
function renderAreaChart(applicants) {
    updatePieChart(applicants, 'エリア', 'areaChart', 'エリア別');
}

/** 円グラフ (応募経路/エリア) */
function updatePieChart(applicants, key, canvasId, title) {
    const counts = applicants.reduce((acc, a) => { const value = a[key] || '不明'; acc[value] = (acc[value] || 0) + 1; return acc; }, {});
    const labels = Object.keys(counts); const dataValues = Object.values(counts);
    const backgroundColors = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#8A2BE2','#7FFF00','#DC143C','#00FFFF','#00008B','#BDB76B','#FF8C00','#E9967A','#9400D3','#FF1493','#00BFFF','#696969','#FFD700','#ADFF2F'].slice(0, labels.length);
    const data = { labels: labels, datasets: [{ label: title, data: dataValues, backgroundColor: backgroundColors, hoverOffset: 4 }] };
    updateChart(canvasId, 'doughnut', data, { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' }}});
}

/** 応募数・採用数の前年/前前年比較棒グラフを描画 */
function renderYearlyComparisonChart(currentYearApplicants, prevYearApplicants, prevPrevYearApplicants, currentSelectedYear) {
    const prevYearStr = (parseInt(currentSelectedYear) - 1).toString();
    const prevPrevYearStr = (parseInt(currentSelectedYear) - 2).toString();
    const calculateCounts = (appsArray) => {
        if (!appsArray || !Array.isArray(appsArray) || (appsArray.length > 0 && appsArray[0]?.error)) return { total: 0, hired: 0 };
        const total = appsArray.length; const hired = appsArray.filter(a => a['合否'] === '採用').length;
        return { total, hired };
    };
    const countsCurrent = calculateCounts(currentYearApplicants);
    const countsPrev = calculateCounts(prevYearApplicants);
    const countsPrevPrev = calculateCounts(prevPrevYearApplicants);
    const data = {
        labels: [`${prevPrevYearStr}年`, `${prevYearStr}年`, `${currentSelectedYear}年`],
        datasets: [
            { label: '総応募者数', data: [countsPrevPrev.total, countsPrev.total, countsCurrent.total], backgroundColor: 'rgba(54, 162, 235, 0.7)', borderColor: 'rgb(54, 162, 235)', borderWidth: 1 },
            { label: '採用者数', data: [countsPrevPrev.hired, countsPrev.hired, countsCurrent.hired], backgroundColor: 'rgba(75, 192, 192, 0.7)', borderColor: 'rgb(75, 192, 192)', borderWidth: 1 }
        ]
    };
    const options = { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } };
    updateChart('comparisonYearlyChart', 'bar', data, options);
}

/** タイムスタンプ更新 */
function updateTimestamp() {
    if(lastUpdatedEl) lastUpdatedEl.textContent = new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'});
}

/** 表示クリア */
function clearDisplay(yearAndMonth, message) {
    if(currentYearDisplay) currentYearDisplay.textContent = yearAndMonth;
    if(statsGrid) statsGrid.innerHTML = `<p>${message}</p>`;
    if(applicantTableBodyEl) applicantTableBodyEl.innerHTML = `<tr><td colspan="${DATA_HEADERS.filter(h => h !== '住所' && h !== 'エリア').length || 1}">${message}</td></tr>`;
    if(comparisonTableBody) comparisonTableBody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
    Object.values(currentChartInstances).forEach(chart => { if(chart && typeof chart.destroy === 'function') chart.destroy(); });
    currentChartInstances = {};
    if(tableRowCountEl) tableRowCountEl.textContent = '0';
}

// --- イベントリスナー ---
if(yearSelector) yearSelector.addEventListener('change', (e) => {
    currentSelectedYear = e.target.value;
    displayData(currentSelectedYear, monthSelector.value);
});
if(monthSelector) monthSelector.addEventListener('change', (e) => {
    currentSelectedMonth = e.target.value;
    displayData(yearSelector.value, currentSelectedMonth);
});
if(refreshBtn) refreshBtn.addEventListener('click', () => {
    displayData(yearSelector.value, monthSelector.value, true);
});
if(filterStoreEl && filterStatusEl && filterNameEl) { // 全てのフィルター要素が存在するか確認
    [filterStoreEl, filterStatusEl].forEach(el => el.addEventListener('change', applyTableFilters));
    filterNameEl.addEventListener('input', applyTableFilters);
}

// --- 初期化 ---
async function initializeApp() {
    showLoading("初期データを取得中...");
    try {
        const initialResponse = await fetch(`${GAS_WEB_APP_URL}?action=getAvailableYears`);
        if (!initialResponse.ok) throw new Error("利用可能な年の取得に失敗しました。");
        const yearsDataResponse = await initialResponse.json();
        
        let yearsToDisplay = [];
        if (yearsDataResponse && !yearsDataResponse.error && Array.isArray(yearsDataResponse) && yearsDataResponse.length > 0) {
            yearsToDisplay = yearsDataResponse;
        } else {
            const currentSystemYear = new Date().getFullYear().toString();
            yearsToDisplay = [currentSystemYear];
        }
        
        populateYearSelector(yearsToDisplay, yearsToDisplay[0]);
        populateMonthSelector();
        
        currentSelectedYear = yearSelector.value || yearsToDisplay[0];
        currentSelectedMonth = monthSelector.value || 'all';
        await displayData(currentSelectedYear, currentSelectedMonth); 

    } catch (e) {
        console.error("Initialization failed:", e);
        alert("初期化に失敗しました。\n" + e.message + "\nGASの設定やURL、またはインターネット接続を確認してください。");
        hideLoading();
    }
}

// DOMContentLoaded イベントで初期化を実行
document.addEventListener('DOMContentLoaded', initializeApp);