// js/09_monthly_dashboard.js
// 月別ダッシュボードの制御、過去データの表示・入力

// --- コードの切れ目 (START 09_monthly_dashboard.js) ---

const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const currentMonthDisplay = document.getElementById('currentMonthDisplay');
const monthSelector = document.getElementById('monthSelector');
const showCurrentMonthDataBtn = document.getElementById('showCurrentMonthDataBtn');


/**
 * 表示月を更新し、データを再描画する
 */
function updateDisplayedMonth() {
    currentMonthDisplay.textContent = `${currentYear}年${currentMonth}月`;
    renderCurrentMonthData();
    updateMonthSelector();
}

/**
 * 過去月選択プルダウンを更新する
 */
function updateMonthSelector() {
    monthSelector.innerHTML = ''; // クリア
    const available = getAvailableMonths(); // "YYYY-MM" の配列 (新しい順)

    if (available.length === 0) {
        const opt = document.createElement('option');
        opt.value = "";
        opt.textContent = "データなし";
        monthSelector.appendChild(opt);
        return;
    }

    available.forEach(monthKey => {
        const { year: y, month: m } = parseMonthKey(monthKey);
        const opt = document.createElement('option');
        opt.value = monthKey;
        opt.textContent = `${y}年${m}月`;
        if (y === currentYear && m === currentMonth) {
            opt.selected = true;
        }
        monthSelector.appendChild(opt);
    });
}


// イベントリスナー
if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
        }
        updateDisplayedMonth();
    });
}

if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
        // 未来の月のデータ入力も許容する
        updateDisplayedMonth();
    });
}

if (monthSelector) {
    monthSelector.addEventListener('change', (event) => {
        const selectedMonthKey = event.target.value;
        if (selectedMonthKey) {
            const parsed = parseMonthKey(selectedMonthKey);
            if (parsed) {
                currentYear = parsed.year;
                currentMonth = parsed.month;
                updateDisplayedMonth();
            }
        }
    });
}

if (showCurrentMonthDataBtn) {
    showCurrentMonthDataBtn.addEventListener('click', () => {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth() + 1; // getMonthは0始まりなので+1
        updateDisplayedMonth();
    });
}


/**
 * 過去データの入力について：
 * このシステムでは、表示している月に対して新規応募者を追加することで、
 * その月のデータとして保存されます。「前の月へ」「次の月へ」ボタンや
 * 過去月セレクタで対象の月を表示してから、「新規応募者追加」ボタンで
 * データを入力してください。
 *
 * 6月になったら新規でダッシュボードを作成...という要件は、
 * 「次の月へ」ボタンで6月に移動し、その状態でデータを入力・表示することで実現されます。
 * 5月のデータは `allApplicantsData` オブジェクト内に `2025-05` のキーで保持され続けます。
 */

// --- コードの切れ目 (END 09_monthly_dashboard.js) ---