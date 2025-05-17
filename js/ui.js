// js/ui.js - ユーザーインターフェースの操作を担当

// UIの初期化と操作を管理するクラス
class UIManager {
    constructor() {
        this.initTabsNavigation();
        this.initModals();
        this.initEventListeners();
    }
    
    // タブの切り替え機能を初期化
    initTabsNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // すべてのタブボタンから active クラスを削除
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // すべてのタブコンテンツから active クラスを削除
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // クリックされたタブボタンと対応するコンテンツに active クラスを追加
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                
                // タブに応じた特定の初期化処理
                if (tabId === 'current') {
                    tableManager.refreshTable();
                    statsManager.updateCurrentStats();
                } else if (tabId === 'archive') {
                    archiveManager.initArchiveSelector();
                } else if (tabId === 'statistics') {
                    chartsManager.updateAllCharts();
                }
            });
        });
    }
    
    // モーダルの初期化
    initModals() {
        // すべてのモーダルに対してクローズボタンのイベントを設定
        document.querySelectorAll('.close-modal, .cancel-btn').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                this.closeModal(modal);
            });
        });
        
        // モーダル外のクリックでモーダルを閉じる
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', event => {
                if (event.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // キャンセルボタンのイベント
        document.getElementById('cancel-application').addEventListener('click', () => {
            this.closeModal(document.getElementById('application-modal'));
        });
    }
    
    // 各種イベントリスナーの初期化
    initEventListeners() {
        // 新規応募追加ボタン
        document.getElementById('add-application-btn').addEventListener('click', () => {
            formManager.resetForm();
            formManager.setModalTitle('新規応募登録');
            this.openModal('application-modal');
        });
        
        // 新規月データ追加ボタン
        document.getElementById('add-archive-month-btn').addEventListener('click', () => {
            this.openModal('month-modal');
        });
        
        // 新規月データフォームの送信
        document.getElementById('month-form').addEventListener('submit', e => {
            e.preventDefault();
            const yearMonth = document.getElementById('new-month').value;
            
            if (yearMonth) {
                const success = dataManager.createNewMonth(yearMonth);
                
                if (success) {
                    archiveManager.initArchiveSelector();
                    archiveManager.selectMonth(yearMonth);
                    this.closeModal(document.getElementById('month-modal'));
                    this.showNotification('新しい月のデータを作成しました');
                } else {
                    this.showNotification('この月のデータは既に存在します', 'error');
                }
            }
        });
        
        // 店舗管理リストのイベント
        document.addEventListener('click', e => {
            // 店舗追加フォームの送信
            if (e.target.closest('#add-store-form')) {
                const form = e.target.closest('#add-store-form');
                form.onsubmit = e => {
                    e.preventDefault();
                    const name = document.getElementById('new-store-name').value.trim();
                    const address = document.getElementById('new-store-address').value.trim();
                    
                    if (name) {
                        const success = storeManager.addStore(name, address);
                        if (success) {
                            this.refreshStoreList();
                            form.reset();
                            this.showNotification('店舗を追加しました');
                        } else {
                            this.showNotification('同じ名前の店舗が既に存在します', 'error');
                        }
                    }
                };
            }
            
            // 応募経路追加フォームの送信
            if (e.target.closest('#add-source-form')) {
                const form = e.target.closest('#add-source-form');
                form.onsubmit = e => {
                    e.preventDefault();
                    const name = document.getElementById('new-source-name').value.trim();
                    
                    if (name) {
                        const success = sourceManager.addSource(name);
                        if (success) {
                            this.refreshSourceList();
                            form.reset();
                            this.showNotification('応募経路を追加しました');
                        } else {
                            this.showNotification('同じ名前の応募経路が既に存在します', 'error');
                        }
                    }
                };
            }
        });
        
        // データ出力ボタン
        document.getElementById('export-current-btn').addEventListener('click', () => {
            this.exportCurrentData();
        });
    }
    
    // 店舗リストを更新する
    refreshStoreList() {
        const storeListContainer = document.getElementById('store-list');
        if (!storeListContainer) return;
        
        const stores = storeManager.getAllStores();
        let html = '';
        
        stores.forEach(store => {
            html += `
                <div class="store-item">
                    <div class="store-details">
                        <div class="store-name">${store.name}</div>
                        <div class="store-address">${store.address || '住所未設定'}</div>
                    </div>
                    <div class="store-actions">
                        <button class="table-action-btn edit-btn edit-store-btn" data-name="${store.name}">編集</button>
                        <button class="table-action-btn delete-btn delete-store-btn" data-name="${store.name}">削除</button>
                    </div>
                </div>
            `;
        });
        
        storeListContainer.innerHTML = html;
        
        // 編集と削除ボタンにイベントリスナーを設定
        document.querySelectorAll('.edit-store-btn').forEach(button => {
            button.addEventListener('click', () => {
                const storeName = button.getAttribute('data-name');
                const store = stores.find(s => s.name === storeName);
                if (store) {
                    // 編集用のインライン入力を表示
                    // （実装の簡略化のため省略）
                }
            });
        });
        
        document.querySelectorAll('.delete-store-btn').forEach(button => {
            button.addEventListener('click', () => {
                const storeName = button.getAttribute('data-name');
                if (confirm(`店舗「${storeName}」を削除してもよろしいですか？`)) {
                    storeManager.deleteStore(storeName);
                    this.refreshStoreList();
                    this.showNotification('店舗を削除しました');
                }
            });
        });
        
        // 応募フォームの店舗セレクトボックスも更新
        formManager.updateStoreSelect();
    }
    
    // 応募経路リストを更新する
    refreshSourceList() {
        const sourceListContainer = document.getElementById('source-list');
        if (!sourceListContainer) return;
        
        const sources = sourceManager.getAllSources();
        let html = '';
        
        sources.forEach(source => {
            html += `
                <div class="source-item">
                    <div class="source-name">${source}</div>
                    <div class="source-actions">
                        <button class="table-action-btn edit-btn edit-source-btn" data-name="${source}">編集</button>
                        <button class="table-action-btn delete-btn delete-source-btn" data-name="${source}">削除</button>
                    </div>
                </div>
            `;
        });
        
        sourceListContainer.innerHTML = html;
        
        // 編集と削除ボタンにイベントリスナーを設定
        document.querySelectorAll('.edit-source-btn').forEach(button => {
            button.addEventListener('click', () => {
                const sourceName = button.getAttribute('data-name');
                // 編集用のインライン入力を表示
                // （実装の簡略化のため省略）
            });
        });
        
        document.querySelectorAll('.delete-source-btn').forEach(button => {
            button.addEventListener('click', () => {
                const sourceName = button.getAttribute('data-name');
                if (confirm(`応募経路「${sourceName}」を削除してもよろしいですか？`)) {
                    sourceManager.deleteSource(sourceName);
                    this.refreshSourceList();
                    this.showNotification('応募経路を削除しました');
                }
            });
        });
        
        // 応募フォームの応募経路セレクトボックスも更新
        formManager.updateSourceSelect();
    }
    
    // モーダルを開く
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // スクロールを防止
        }
    }
    
    // モーダルを閉じる
    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // スクロールを元に戻す
        }
    }
    
    // 通知メッセージを表示
    showNotification(message, type = 'success') {
        // 既存の通知を削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 新しい通知を作成
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // スタイルを設定
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s forwards';
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4caf50';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
        }
        
        // アニメーションのキーフレームを定義
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);
        
        // 通知を表示
        document.body.appendChild(notification);
        
        // 3秒後に削除
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }
    
    // 現在のデータをCSV形式で出力
    exportCurrentData() {
        const currentData = dataManager.getCurrentMonthData();
        
        if (currentData.length === 0) {
            this.showNotification('出力するデータがありません', 'error');
            return;
        }
        
        // CSVヘッダー
        const headers = [
            '応募日', '店舗名', '氏名', '性別', '年齢', '職種', 
            '雇用形態', '応募経路', '採用成果報酬', '面接日', 
            '内定日', '合否', '入社日', '備考'
        ];
        
        // CSVデータの作成
        let csvContent = headers.join(',') + '\n';
        
        currentData.forEach(item => {
            const row = [
                item.applyDate,
                `"${item.store}"`,
                `"${item.name}"`,
                item.gender,
                item.age,
                `"${item.position}"`,
                `"${item.employmentType}"`,
                `"${item.source}"`,
                `"${item.fee}"`,
                item.interviewDate,
                item.offerDate,
                `"${item.result}"`,
                item.startDate,
                `"${item.notes.replace(/"/g, '""')}"`
            ];
            
            csvContent += row.join(',') + '\n';
        });
        
        // CSVファイルのダウンロード
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        const currentYearMonth = dataManager.getCurrentYearMonth();
        const fileName = `美容師採用管理_${currentYearMonth}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('データをCSVファイルに出力しました');
    }
}

// グローバル変数として宣言（他のスクリプトから参照するため）
let uiManager;