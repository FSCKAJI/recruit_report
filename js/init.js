// 初期化処理

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    // 店舗選択リストを更新
    updateStoreSelectors();
    
    // 月タブのイベントリスナーを設定
    document.querySelectorAll('.month-tab:not(.add-month)').forEach(tab => {
        tab.addEventListener('click', () => {
            const month = tab.getAttribute('data-month');
            switchMonth(month);
        });
    });
    
    // グラフタブのイベントリスナーを設定
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const chartType = tab.getAttribute('data-chart');
            updateChart(chartType);
        });
    });
    
    // フィルターイベントリスナーを設定
    setupFilterListeners();
    
    // 応募者一覧を表示
    renderApplicants();
    
    // 統計を更新
    updateStats();
    
    // グラフを初期化
    initCharts();
});