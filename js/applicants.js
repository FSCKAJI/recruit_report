// 応募者表示と操作関連の機能

// 応募者一覧を表示
function renderApplicants() {
    const tableBody = document.getElementById('applicantsTableBody');
    tableBody.innerHTML = '';
    
    // 現在の月のデータを取得
    const currentMonthData = monthlyData[currentMonth] || [];
    
    // フィルタリングと検索
    const filteredData = currentMonthData.filter(applicant => {
        // ステータスフィルター
        const statusMatch = currentFilter === 'all' || applicant.status === currentFilter;
        
        // 店舗フィルター
        const storeMatch = currentStoreFilter === 'all' || applicant.storeName === currentStoreFilter;
        
        // 検索フィルター
        const searchMatch = !currentSearch || 
            applicant.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
            applicant.storeName.toLowerCase().includes(currentSearch.toLowerCase()) ||
            (applicant.jobTitle && applicant.jobTitle.toLowerCase().includes(currentSearch.toLowerCase())) ||
            (applicant.employmentType && applicant.employmentType.toLowerCase().includes(currentSearch.toLowerCase()));
        
        return statusMatch && storeMatch && searchMatch;
    });
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="12">
                    <div class="empty-state">
                        <div class="empty-state-icon">🔍</div>
                        <div class="empty-state-text">該当する応募者が見つかりません</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // データをソート
    const sortedData = [...filteredData].sort((a, b) => {
        const dateA = new Date(a.applicationDate);
        const dateB = new Date(b.applicationDate);
        
        if (currentSort === 'asc') {
            return dateA - dateB; // 古い順（昇順）
        } else {
            return dateB - dateA; // 新しい順（降順）
        }
    });
    
    // 表に応募者を表示
    sortedData.forEach(applicant => {
        const row = document.createElement('tr');
        
        // 応募日
        const appDate = new Date(applicant.applicationDate);
        const formattedAppDate = `${appDate.getMonth() + 1}/${appDate.getDate()}`;
        
        // 面接日
        let formattedInterviewDate = '';
        if (applicant.interviewDate) {
            const interviewDate = new Date(applicant.interviewDate);
            formattedInterviewDate = `${interviewDate.getMonth() + 1}/${interviewDate.getDate()}`;
        }
        
        // 入社日
        let formattedStartDate = '';
        if (applicant.startDate) {
            const startDate = new Date(applicant.startDate);
            formattedStartDate = `${startDate.getMonth() + 1}/${startDate.getDate()}`;
        }
        
        // 応募経路バッジクラス
        const sourceBadgeClass = sourceBadgeClasses[applicant.applicationSource] || '';
        
        // ステータスバッジクラス
        const statusBadgeClass = statusBadgeClasses[applicant.status] || '';
        
        row.innerHTML = `
            <td>${formattedAppDate}</td>
            <td>${applicant.storeName}</td>
            <td>${applicant.name}</td>
            <td>${applicant.age ? applicant.age : '-'}/${applicant.gender}</td>
            <td>${applicant.jobTitle || '-'}</td>
            <td>${applicant.employmentType || '-'}</td>
            <td><span class="source-badge ${sourceBadgeClass}">${applicant.applicationSource}</span></td>
            <td><span class="cost-badge">${applicant.referralFee}</span></td>
            <td>${formattedInterviewDate}</td>
            <td><span class="status-badge ${statusBadgeClass}">${applicant.status}</span></td>
            <td>${formattedStartDate}</td>
            <td>
                <button class="action-btn edit" onclick="editApplicant(${applicant.id})">編集</button>
                <button class="action-btn delete" onclick="deleteApplicant(${applicant.id})">削除</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    updateStats();
}

// 応募者を削除
function deleteApplicant(id) {
    if (!confirm('本当にこの応募者を削除しますか？')) return;
    
    const index = monthlyData[currentMonth].findIndex(a => a.id === id);
    if (index !== -1) {
        monthlyData[currentMonth].splice(index, 1);
        renderApplicants();
        updateStats();
        
        // 成功メッセージ
        const notification = document.createElement('div');
        notification.textContent = '応募者を削除しました';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// 並べ替え機能
function sortApplicants(order) {
    currentSort = order;
    
    // ボタンのアクティブ状態を更新
    document.getElementById('sortAsc').classList.toggle('active', order === 'asc');
    document.getElementById('sortDesc').classList.toggle('active', order === 'desc');
    
    renderApplicants();
}

// 次のIDを取得
function getNextId() {
    let maxId = 0;
    
    // すべての月のデータを検索
    Object.values(monthlyData).forEach(monthData => {
        monthData.forEach(applicant => {
            if (applicant.id > maxId) {
                maxId = applicant.id;
            }
        });
    });
    
    return maxId + 1;
}