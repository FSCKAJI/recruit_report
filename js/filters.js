// フィルターと検索機能

// 月を切り替える
function switchMonth(month) {
    currentMonth = month;
    
    // タブのアクティブ状態を更新
    document.querySelectorAll('.month-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-month') === month);
    });
    
    // 応募者一覧と統計を更新
    renderApplicants();
    updateStats();
}

// フィルターボタンのイベントリスナーを設定
function setupFilterListeners() {
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            renderApplicants();
        });
    });
    
    // 店舗フィルターのイベントリスナーを設定
document.getElementById('storeFilter').addEventListener('change', (e) => {
    currentStoreFilter = e.target.value;
    renderApplicants();
});

// 検索ボックスのイベントリスナーを設定
document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderApplicants();
});
}