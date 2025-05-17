// js/table.js - テーブルの表示と操作を担当

// テーブル管理クラス
class TableManager {
    constructor() {
        this.table = document.getElementById('applications-table');
        this.tbody = this.table.querySelector('tbody');
    }
    
    // テーブルのデータを更新
    refreshTable() {
        const currentData = dataManager.getCurrentMonthData();
        
        // データを日付の新しい順にソート
        currentData.sort((a, b) => {
            return new Date(b.applyDate) - new Date(a.applyDate);
        });
        
        // テーブルをクリア
        this.tbody.innerHTML = '';
        
        // データがない場合
        if (currentData.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 15;
            emptyCell.textContent = 'データがありません';
            emptyCell.style.textAlign = 'center';
            emptyCell.style.padding = '30px';
            emptyRow.appendChild(emptyCell);
            this.tbody.appendChild(emptyRow);
            return;
        }
        
        // 行を追加
        currentData.forEach(app => {
            const row = document.createElement('tr');
            
            // 応募日（YYYY-MM-DD形式を日本語形式に変換）
            const applyDateCell = document.createElement('td');
            if (app.applyDate) {
                const date = new Date(app.applyDate);
                applyDateCell.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
            } else {
                applyDateCell.textContent = '';
            }
            row.appendChild(applyDateCell);
            
            // 店舗名
            const storeCell = document.createElement('td');
            storeCell.textContent = app.store;
            row.appendChild(storeCell);
            
            // 氏名
            const nameCell = document.createElement('td');
            nameCell.textContent = app.name;
            row.appendChild(nameCell);
            
            // 性別
            const genderCell = document.createElement('td');
            genderCell.textContent = app.gender;
            row.appendChild(genderCell);
            
            // 年齢
            const ageCell = document.createElement('td');
            ageCell.textContent = app.age;
            row.appendChild(ageCell);
            
            // 職種
            const positionCell = document.createElement('td');
            positionCell.textContent = app.position;
            row.appendChild(positionCell);
            
            // 雇用形態
            const employmentTypeCell = document.createElement('td');
            employmentTypeCell.textContent = app.employmentType;
            row.appendChild(employmentTypeCell);
            
            // 応募経路
            const sourceCell = document.createElement('td');
            sourceCell.textContent = app.source;
            row.appendChild(sourceCell);
            
            // 採用成果報酬
            const feeCell = document.createElement('td');
            feeCell.textContent = app.fee;
            row.appendChild(feeCell);
            
            // 面接日
            const interviewDateCell = document.createElement('td');
            if (app.interviewDate) {
                const date = new Date(app.interviewDate);
                interviewDateCell.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
            } else {
                interviewDateCell.textContent = '';
            }
            row.appendChild(interviewDateCell);
            
            // 内定日
            const offerDateCell = document.createElement('td');
            if (app.offerDate) {
                const date = new Date(app.offerDate);
                offerDateCell.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
            } else {
                offerDateCell.textContent = '';
            }
            row.appendChild(offerDateCell);
            
            // 合否
            const resultCell = document.createElement('td');
            resultCell.textContent = app.result;
            
            // 結果に応じたカラー適用
            if (app.result === '採用') {
                resultCell.style.color = '#4caf50';
                resultCell.style.fontWeight = 'bold';
            } else if (app.result === '不採用') {
                resultCell.style.color = '#f44336';
            } else if (app.result === '辞退') {
                resultCell.style.color = '#ff9800';
            } else if (app.result === '選考中') {
                resultCell.style.color = '#2196f3';
            }
            
            row.appendChild(resultCell);
            
            // 入社日
            const startDateCell = document.createElement('td');
            if (app.startDate) {
                const date = new Date(app.startDate);
                startDateCell.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
            } else {
                startDateCell.textContent = '';
            }
            row.appendChild(startDateCell);
            
            // 備考
            const notesCell = document.createElement('td');
            notesCell.textContent = app.notes;
            row.appendChild(notesCell);
            
            // 操作ボタン
            const actionsCell = document.createElement('td');
            
            // 編集ボタン
            const editButton = document.createElement('button');
            editButton.className = 'table-action-btn edit-btn';
            editButton.textContent = '編集';
            editButton.onclick = () => this.editApplication(app.id);
            actionsCell.appendChild(editButton);
            
            // 削除ボタン
            const deleteButton = document.createElement('button');
            deleteButton.className = 'table-action-btn delete-btn';
            deleteButton.textContent = '削除';
            deleteButton.onclick = () => this.deleteApplication(app.id, app.name);
            actionsCell.appendChild(deleteButton);
            
            row.appendChild(actionsCell);
            
            this.tbody.appendChild(row);
        });
    }
    
    // アーカイブデータのテーブルを更新
    refreshArchiveTable(yearMonth) {
        const archiveData = dataManager.getMonthData(yearMonth);
        const archiveContent = document.getElementById('archive-content');
        
        // データがない場合
        if (archiveData.length === 0) {
            archiveContent.innerHTML = '<p class="placeholder-text">この月のデータはありません</p>';
            return;
        }
        
        // データを日付の新しい順にソート
        archiveData.sort((a, b) => {
            return new Date(b.applyDate) - new Date(a.applyDate);
        });
        
        // 統計情報を作成
        const stats = this.calculateStats(archiveData);
        
        // テーブルとして表示
        let html = `
            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-value">${archiveData.length}</div>
                    <div class="stat-label">応募総数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.hiredCount}</div>
                    <div class="stat-label">採用数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.hireRate}%</div>
                    <div class="stat-label">採用率</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">¥${stats.totalCost.toLocaleString()}</div>
                    <div class="stat-label">採用コスト合計</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">¥${stats.costPerHire.toLocaleString()}</div>
                    <div class="stat-label">採用単価</div>
                </div>
            </div>
            
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>応募日</th>
                            <th>店舗名</th>
                            <th>氏名</th>
                            <th>性別</th>
                            <th>年齢</th>
                            <th>職種</th>
                            <th>雇用形態</th>
                            <th>応募経路</th>
                            <th>採用成果報酬</th>
                            <th>面接日</th>
                            <th>内定日</th>
                            <th>合否</th>
                            <th>入社日</th>
                            <th>備考</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // 行を追加
        archiveData.forEach(app => {
            // 日付のフォーマット
            let applyDateStr = '';
            let interviewDateStr = '';
            let offerDateStr = '';
            let startDateStr = '';
            
            if (app.applyDate) {
                const date = new Date(app.applyDate);
                applyDateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            }
            
            if (app.interviewDate) {
                const date = new Date(app.interviewDate);
                interviewDateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            }
            
            if (app.offerDate) {
                const date = new Date(app.offerDate);
                offerDateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            }
            
            if (app.startDate) {
                const date = new Date(app.startDate);
                startDateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            }
            
            // 結果に応じたスタイル
            let resultStyle = '';
            if (app.result === '採用') {
                resultStyle = 'color: #4caf50; font-weight: bold;';
            } else if (app.result === '不採用') {
                resultStyle = 'color: #f44336;';
            } else if (app.result === '辞退') {
                resultStyle = 'color: #ff9800;';
            } else if (app.result === '選考中') {
                resultStyle = 'color: #2196f3;';
            }
            
            html += `
                <tr>
                    <td>${applyDateStr}</td>
                    <td>${app.store}</td>
                    <td>${app.name}</td>
                    <td>${app.gender}</td>
                    <td>${app.age}</td>
                    <td>${app.position}</td>
                    <td>${app.employmentType}</td>
                    <td>${app.source}</td>
                    <td>${app.fee}</td>
                    <td>${interviewDateStr}</td>
                    <td>${offerDateStr}</td>
                    <td style="${resultStyle}">${app.result}</td>
                    <td>${startDateStr}</td>
                    <td>${app.notes}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        archiveContent.innerHTML = html;
    }
    
    // 統計を計算
    calculateStats(data) {
        const result = {
            hiredCount: 0,
            hireRate: 0,
            totalCost: 0,
            costPerHire: 0
        };
        
        // 採用数をカウント
        data.forEach(app => {
            if (app.result === '採用') {
                result.hiredCount++;
                
                // 採用コストを加算
                const fee = dataManager.parseFee(app.fee);
                result.totalCost += fee;
            }
        });
        
        // 採用率を計算
        if (data.length > 0) {
            result.hireRate = Math.round((result.hiredCount / data.length) * 100);
        }
        
        // 採用単価を計算
        if (result.hiredCount > 0) {
            result.costPerHire = Math.round(result.totalCost / result.hiredCount);
        }
        
        return result;
    }
    
    // 応募データの編集
    editApplication(id) {
        const currentData = dataManager.getCurrentMonthData();
        const app = currentData.find(a => a.id === id);
        
        if (app) {
            formManager.resetForm();
            formManager.setFormData(app);
            formManager.setModalTitle('応募データの編集');
            uiManager.openModal('application-modal');
        } else {
            uiManager.showNotification('データが見つかりません', 'error');
        }
    }
    
    // 応募データの削除
    deleteApplication(id, name) {
        if (confirm(`「${name}」さんの応募データを削除してもよろしいですか？`)) {
            const success = dataManager.deleteApplication(id);
            
            if (success) {
                this.refreshTable();
                statsManager.updateCurrentStats();
                uiManager.showNotification('応募データを削除しました');
            } else {
                uiManager.showNotification('削除に失敗しました', 'error');
            }
        }
    }
}

// グローバル変数として宣言（他のスクリプトから参照するため）
let tableManager;