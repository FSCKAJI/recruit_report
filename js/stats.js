// js/stats.js - 統計データの管理を担当

// 統計データ管理クラス
class StatsManager {
    constructor() {
        this.totalApplicationsEl = document.getElementById('total-applications');
        this.hiredCountEl = document.getElementById('hired-count');
        this.hireRateEl = document.getElementById('hire-rate');
        this.totalCostEl = document.getElementById('total-cost');
        this.costPerHireEl = document.getElementById('cost-per-hire');
    }
    
    // 現在のデータの統計を更新
    updateCurrentStats() {
        const currentData = dataManager.getCurrentMonthData();
        
        // 応募総数
        this.totalApplicationsEl.textContent = currentData.length;
        
        // 採用数と採用率の計算
        let hiredCount = 0;
        let totalCost = 0;
        
        currentData.forEach(app => {
            if (app.result === '採用') {
                hiredCount++;
                
                // 採用コストを加算
                const fee = dataManager.parseFee(app.fee);
                totalCost += fee;
            }
        });
        
        this.hiredCountEl.textContent = hiredCount;
        
        // 採用率（パーセント）
        const hireRate = currentData.length > 0 ? Math.round((hiredCount / currentData.length) * 100) : 0;
        this.hireRateEl.textContent = `${hireRate}%`;
        
        // 採用コスト合計
        this.totalCostEl.textContent = `¥${totalCost.toLocaleString()}`;
        
        // 一人当たりの採用単価
        const costPerHire = hiredCount > 0 ? Math.round(totalCost / hiredCount) : 0;
        this.costPerHireEl.textContent = `¥${costPerHire.toLocaleString()}`;
    }
    
    // 年別の月次統計データを取得
    getYearlyStats(year) {
        return dataManager.getMonthlyStats(year);
    }
    
    // 応募経路別の採用統計を取得
    getSourceStats(year) {
        return dataManager.getSourceStats(year);
    }
    
    // 店舗別の採用統計を取得
    getStoreStats(year) {
        return dataManager.getStoreStats(year);
    }
}

// グローバル変数として宣言（他のスクリプトから参照するため）
let statsManager;