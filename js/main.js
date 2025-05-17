// js/main.js - アプリケーションの初期化と起動を担当

// DOMContentLoadedイベントでアプリケーションを初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('アプリケーション初期化開始');

    // 各マネージャーのインスタンスを初期化
    // 初期化順序を重要視
    statsManager = new StatsManager();
    tableManager = new TableManager();
    formManager = new FormManager();
    archiveManager = new ArchiveManager();
    chartsManager = new ChartsManager();
    uiManager = new UIManager();
    
    // アプリケーションの初期表示
    initializeApplication();
    
    console.log('アプリケーション初期化完了');
});

// アプリケーションの初期化
function initializeApplication() {
    console.log('テーブルと統計の初期化');
    
    // 現在月のテーブルを更新
    tableManager.refreshTable();
    
    // 統計情報を更新
    statsManager.updateCurrentStats();
    
    // グラフを初期化
    setTimeout(() => {
        try {
            console.log('グラフの初期化');
            chartsManager.updateAllCharts();
        } catch (e) {
            console.error('グラフ初期化エラー:', e);
        }
    }, 500);
    
    // 追加のイベントリスナー設定
    setupAdditionalEventListeners();
}

// 追加のイベントリスナー設定
function setupAdditionalEventListeners() {
    console.log('追加イベントリスナーの設定');
    
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
    
    // タブ切り替え時のイベント処理を追加
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log('タブ切り替え:', tabId);
            
            if (tabId === 'statistics') {
                setTimeout(() => {
                    try {
                        chartsManager.updateAllCharts();
                    } catch (e) {
                        console.error('グラフ更新エラー:', e);
                    }
                }, 100);
            }
        });
    });
}

// デバッグ用データ確認
function checkDataAvailability() {
    console.log('データ確認');
    console.log('現在のデータ:', dataManager.getCurrentMonthData());
    console.log('全データ:', dataManager.currentData);
}

// 初期データをリセットする機能
window.resetToInitialData = function() {
    localStorage.removeItem('beautyRecruitCurrentData');
    localStorage.removeItem('beautyRecruitArchiveData');
    localStorage.removeItem('beautyRecruitStores');
    localStorage.removeItem('beautyRecruitSources');
    
    alert('データをリセットしました。ページを再読み込みします。');
    location.reload();
};

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
