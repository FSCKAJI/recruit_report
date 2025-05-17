// js/charts.js - グラフの表示を担当

// グラフ管理クラス
class ChartsManager {
    constructor() {
        this.applicationsChart = null;
        this.sourceChart = null;
        this.storeChart = null;
        this.costChart = null;
        
        this.initYearSelector();
    }
    
    // 年選択の初期化
    initYearSelector() {
        const yearSelector = document.getElementById('stats-year-selector');
        
        yearSelector.addEventListener('change', () => {
            this.updateAllCharts();
        });
    }
    
    // すべてのグラフを更新
    updateAllCharts() {
        const year = document.getElementById('stats-year-selector').value;
        
        this.updateApplicationsChart(year);
        this.updateSourceChart(year);
        this.updateStoreChart(year);
        this.updateCostChart(year);
    }
    
    // 応募数と採用数のグラフを更新
    updateApplicationsChart(year) {
        const chartContainer = document.getElementById('applications-chart');
        
        // Chart.jsインスタンスがあれば破棄
        if (this.applicationsChart) {
            this.applicationsChart.destroy();
        }
        
        // データの取得
        const yearlyStats = statsManager.getYearlyStats(year);
        
        // 月の表示ラベル
        const labels = [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ];
        
        // グラフの作成
        const ctx = document.createElement('canvas');
        chartContainer.innerHTML = '';
        chartContainer.appendChild(ctx);
        
        this.applicationsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '応募数',
                        data: yearlyStats.applications,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '採用数',
                        data: yearlyStats.hired,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    // 応募経路別採用数のグラフを更新
    updateSourceChart(year) {
        const chartContainer = document.getElementById('source-chart');
        
        // Chart.jsインスタンスがあれば破棄
        if (this.sourceChart) {
            this.sourceChart.destroy();
        }
        
        // データの取得
        const sourceStats = statsManager.getSourceStats(year);
        
        // データが0件の場合
        if (sourceStats.length === 0) {
            chartContainer.innerHTML = '<p class="placeholder-text">データがありません</p>';
            return;
        }
        
        // 上位10件のみ表示
        const topSources = sourceStats.slice(0, 10);
        
        // ラベルとデータの配列を作成
        const labels = topSources.map(item => item.source);
        const data = topSources.map(item => item.count);
        
        // グラフの作成
        const ctx = document.createElement('canvas');
        chartContainer.innerHTML = '';
        chartContainer.appendChild(ctx);
        
        this.sourceChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: labels,
                datasets: [{
                    label: '採用数',
                    data: data,
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    // 店舗別採用数のグラフを更新
    updateStoreChart(year) {
        const chartContainer = document.getElementById('store-chart');
        
        // Chart.jsインスタンスがあれば破棄
        if (this.storeChart) {
            this.storeChart.destroy();
        }
        
        // データの取得
        const storeStats = statsManager.getStoreStats(year);
        
        // データが0件の場合
        if (storeStats.length === 0) {
            chartContainer.innerHTML = '<p class="placeholder-text">データがありません</p>';
            return;
        }
        
        // 上位10件のみ表示
        const topStores = storeStats.slice(0, 10);
        
        // ラベルとデータの配列を作成
        const labels = topStores.map(item => item.store);
        const data = topStores.map(item => item.count);
        
        // グラフの作成
        const ctx = document.createElement('canvas');
        chartContainer.innerHTML = '';
        chartContainer.appendChild(ctx);
        
        this.storeChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: labels,
                datasets: [{
                    label: '採用数',
                    data: data,
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    // 月別採用コストのグラフを更新
    updateCostChart(year) {
        const chartContainer = document.getElementById('cost-chart');
        
        // Chart.jsインスタンスがあれば破棄
        if (this.costChart) {
            this.costChart.destroy();
        }
        
        // データの取得
        const yearlyStats = statsManager.getYearlyStats(year);
        
        // 月の表示ラベル
        const labels = [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ];
        
        // グラフの作成
        const ctx = document.createElement('canvas');
        chartContainer.innerHTML = '';
        chartContainer.appendChild(ctx);
        
        this.costChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '採用コスト',
                        data: yearlyStats.costs,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value.toLocaleString();
                            }
                        }
                    }
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            let label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += '¥' + parseInt(tooltipItem.value).toLocaleString();
                            return label;
                        }
                    }
                }
            }
        });
    }
}

// グローバル変数として宣言（他のスクリプトから参照するため）
let chartsManager;