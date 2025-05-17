// 月管理関連の機能

// 月追加モーダルを表示
function showAddMonthModal() {
    document.getElementById('addMonthModal').classList.add('show');
    
    // 現在の年月をデフォルト値に
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('newMonthInput').value = yearMonth;
}

// 月追加モーダルを閉じる
function closeAddMonthModal() {
    document.getElementById('addMonthModal').classList.remove('show');
}

// 新しい月を追加
function addNewMonth() {
    const newMonth = document.getElementById('newMonthInput').value;
    if (!newMonth) {
        alert('年月を選択してください');
        return;
    }
    
    // 既存の月でないか確認
    if (monthlyData[newMonth]) {
        alert('この月のデータは既に存在します');
        return;
    }
    
    // 新しい月のデータを初期化
    monthlyData[newMonth] = [];
    
    // 月タブを追加
    addMonthTab(newMonth);
    
    // 月タブを追加してモーダルを閉じる
    closeAddMonthModal();
    
    // 新しい月に切り替え
    switchMonth(newMonth);
}

// 月タブを追加
function addMonthTab(month) {
    const tabsContainer = document.querySelector('.month-tabs');
    const addButton = document.querySelector('.month-tab.add-month');
    
    // 年月のフォーマット（例：2025-05 → 2025年5月）
    const [year, monthNum] = month.split('-');
    const formattedMonth = `${year}年${parseInt(monthNum)}月`;
    
    // 新しいタブ要素
    const newTab = document.createElement('div');
    newTab.className = 'month-tab';
    newTab.setAttribute('data-month', month);
    newTab.textContent = formattedMonth;
    
    // タブがクリックされたときのイベント
    newTab.addEventListener('click', () => {
        switchMonth(month);
    });
    
    // 「+月を追加」ボタンの前に挿入
    tabsContainer.insertBefore(newTab, addButton);
}