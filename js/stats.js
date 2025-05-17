// 統計関連の機能

// 統計を更新
function updateStats() {
    // 現在の月のデータを取得
    const currentMonthData = monthlyData[currentMonth] || [];
    
    // 現在の店舗フィルターに一致するデータ
    const filteredData = currentStoreFilter === 'all' ? 
        currentMonthData : 
        currentMonthData.filter(a => a.storeName === currentStoreFilter);
    
    const totalApplicants = filteredData.length;
    const hiredApplicants = filteredData.filter(a => a.status === '採用');
    const hiredCount = hiredApplicants.length;
    const pendingCount = filteredData.filter(a => a.status === '選考中').length;
    const rejectedCount = filteredData.filter(a => a.status === '不採用').length;
    
    // 採用コスト集計 - 採用フラグが立っている人のみ
    let totalCost = 0;
    const costRegex = /¥([\d,]+)/;
    
    hiredApplicants.forEach(applicant => {
        if (applicant.referralFee) {
            const match = applicant.referralFee.match(costRegex);
            if (match) {
                const costStr = match[1].replace(/,/g, '');
                totalCost += parseInt(costStr, 10);
            }
        }
    });
    
    // 採用単価計算
    const costPerHire = hiredCount > 0 ? totalCost / hiredCount : 0;
    
    // カンマ区切りのフォーマット
    const formattedCost = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        maximumFractionDigits: 0
    }).format(totalCost);
    
    const formattedCostPerHire = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        maximumFractionDigits: 0
    }).format(costPerHire);
    
    document.getElementById('totalApplicants').textContent = totalApplicants;
    document.getElementById('hiredCount').textContent = hiredCount;
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('rejectedCount').textContent = rejectedCount;
    document.getElementById('totalCost').textContent = formattedCost;
    document.getElementById('costPerHire').textContent = formattedCostPerHire;
    
    // 店舗別分析用データも更新
    updateStoreAnalyticsData();
}

// 店舗別データを更新
function updateStoreAnalyticsData() {
    const currentMonthData = monthlyData[currentMonth] || [];
    
    // 店舗別の統計データを作成
    const storeStats = {};
    
    // 全店舗をデフォルト値で初期化
    storesList.forEach(store => {
        storeStats[store.name] = {
            totalApplicants: 0,
            hired: 0,
            rejected: 0,
            pending: 0,
            canceled: 0,
            cost: 0
        };
    });
    
    // データを集計
    currentMonthData.forEach(applicant => {
        const storeName = applicant.storeName;
        if (!storeStats[storeName]) {
            storeStats[storeName] = {
                totalApplicants: 0,
                hired: 0,
                rejected: 0,
                pending: 0,
                canceled: 0,
                cost: 0
            };
        }
        
        // 応募者数を増やす
        storeStats[storeName].totalApplicants++;
        
        // ステータスごとにカウント
        if (applicant.status === '採用') {
            storeStats[storeName].hired++;
            
            // 採用コストを計算
            if (applicant.referralFee) {
                const costRegex = /¥([\d,]+)/;
                const match = applicant.referralFee.match(costRegex);
                if (match) {
                    const costStr = match[1].replace(/,/g, '');
                    storeStats[storeName].cost += parseInt(costStr, 10);
                }
            }
        } else if (applicant.status === '不採用') {
            storeStats[storeName].rejected++;
        } else if (applicant.status === '選考中') {
            storeStats[storeName].pending++;
        } else if (applicant.status === '辞退') {
            storeStats[storeName].canceled++;
        }
    });
    
    // 店舗分析グラフ用のデータを更新
    if (applicantsChart) {
        const chartTab = document.querySelector('.chart-tab.active');
        if (chartTab && chartTab.getAttribute('data-chart') === 'stores') {
            updateStoresChart(storeStats);
        }
    }
}