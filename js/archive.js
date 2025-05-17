// js/archive.js - 過去データの管理を担当

// アーカイブ管理クラス
class ArchiveManager {
    constructor() {
        this.archiveSelector = document.getElementById('archive-month-selector');
        this.archiveContent = document.getElementById('archive-content');
        
        this.initArchiveSelector();
    }
    
    // アーカイブ月選択の初期化
    initArchiveSelector() {
        // セレクターをクリア（最初のオプションは残す）
        while (this.archiveSelector.options.length > 1) {
            this.archiveSelector.remove(1);
        }
        
        // 月のリストを取得
        const months = dataManager.getAllMonths();
        
        // セレクターにオプションを追加
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            
            // YYYY-MM形式を表示用に変換
            const [year, monthNum] = month.split('-');
            option.textContent = `${year}年${monthNum}月`;
            
            this.archiveSelector.appendChild(option);
        });
        
        // 選択イベントの設定
        this.archiveSelector.addEventListener('change', () => {
            const selectedMonth = this.archiveSelector.value;
            if (selectedMonth) {
                this.selectMonth(selectedMonth);
            } else {
                this.archiveContent.innerHTML = '<p class="placeholder-text">月を選択してデータを表示</p>';
            }
        });
    }
    
    // 特定の月を選択
    selectMonth(yearMonth) {
        if (!yearMonth) return;
        
        // セレクトボックスの値を更新
        this.archiveSelector.value = yearMonth;
        
        // テーブルを更新
        tableManager.refreshArchiveTable(yearMonth);
    }
    
    // 現在の月をアーカイブに移動
    archiveCurrentMonth() {
        const currentYearMonth = dataManager.getCurrentYearMonth();
        const success = dataManager.archiveMonth(currentYearMonth);
        
        if (success) {
            this.initArchiveSelector();
            return true;
        }
        
        return false;
    }
}

// グローバル変数として宣言（他のスクリプトから参照するため）
let archiveManager;