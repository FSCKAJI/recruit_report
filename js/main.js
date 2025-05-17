// js/main.js - アプリケーションの初期化と起動を担当

// DOMContentLoadedイベントでアプリケーションを初期化
document.addEventListener('DOMContentLoaded', function() {
    // 各マネージャーのインスタンスを初期化
    uiManager = new UIManager();
    formManager = new FormManager();
    tableManager = new TableManager();
    statsManager = new StatsManager();
    chartsManager = new ChartsManager();
    archiveManager = new ArchiveManager();
    
    // アプリケーションの初期表示
    initializeApplication();
});

// アプリケーションの初期化
function initializeApplication() {
    // 現在月のテーブルを更新
    tableManager.refreshTable();
    
    // 統計情報を更新
    statsManager.updateCurrentStats();
    
    // 追加のイベントリスナー設定
    setupAdditionalEventListeners();
}

// 追加のイベントリスナー設定
function setupAdditionalEventListeners() {
    // 店舗管理ボタンの追加（カスタムボタン）
    const addStoreManageBtn = document.createElement('button');
    addStoreManageBtn.className = 'action-btn';
    addStoreManageBtn.textContent = '店舗管理';
    addStoreManageBtn.addEventListener('click', () => {
        uiManager.refreshStoreList();
        uiManager.openModal('store-modal');
    });
    
    // 応募経路管理ボタンの追加（カスタムボタン）
    const addSourceManageBtn = document.createElement('button');
    addSourceManageBtn.className = 'action-btn';
    addSourceManageBtn.textContent = '応募経路管理';
    addSourceManageBtn.addEventListener('click', () => {
        uiManager.refreshSourceList();
        uiManager.openModal('source-modal');
    });
    
    // ボタンの追加位置を取得
    const headerActions = document.querySelector('#current .actions');
    if (headerActions) {
        headerActions.appendChild(addStoreManageBtn);
        headerActions.appendChild(addSourceManageBtn);
    }
    
    // 統計タブでのイベント処理
    const statsYearSelector = document.getElementById('stats-year-selector');
    if (statsYearSelector) {
        // 初期表示時にグラフを更新
        statsYearSelector.addEventListener('change', () => {
            chartsManager.updateAllCharts();
        });
    }
}

// ブラウザのセッションストレージやローカルストレージがクリアされた場合や
// 初めての訪問時の初期データロードを保証するための処理
window.addEventListener('storage', function(event) {
    if (event.key === 'beautyRecruitCurrentData' || 
        event.key === 'beautyRecruitArchiveData' || 
        event.key === 'beautyRecruitStores' || 
        event.key === 'beautyRecruitSources') {
        
        // ストレージが変更された場合、ページをリロード
        location.reload();
    }
});