// js/07_filter_sort.js
// フィルタリング機能とソート機能

// --- コードの切れ目 (START 07_filter_sort.js) ---

const filterStoreSelect = document.getElementById('filterStore');
const filterStatusSelect = document.getElementById('filterStatus');
const filterRouteSelect = document.getElementById('filterRoute');
const filterJobTypeInput = document.getElementById('filterJobType');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const tableHeaders = document.querySelectorAll('#applicantTable th[data-sort]');

let currentSortColumn = 'applyDate'; // デフォルトのソート列
let currentSortDirection = 'asc'; // デフォルトのソート方向 (昇順)

/**
 * 全てのフィルターを適用する
 * @param {Array} applicants - フィルタリング対象の応募者データ配列
 * @returns {Array} フィルター適用後の応募者データ配列
 */
function applyAllFilters(applicants) {
    if (!applicants) return [];
    let filtered = [...applicants]; // 元の配列を壊さないようにコピー

    const storeFilter = filterStoreSelect.value;
    const statusFilter = filterStatusSelect.value;
    const routeFilter = filterRouteSelect.value;
    const jobTypeFilter = filterJobTypeInput.value.toLowerCase().trim();

    if (storeFilter) {
        filtered = filtered.filter(app => app.storeName === storeFilter);
    }
    if (statusFilter) {
        filtered = filtered.filter(app => app.status === statusFilter);
    }
    if (routeFilter) {
        filtered = filtered.filter(app => app.applyRoute === routeFilter);
    }
    if (jobTypeFilter) {
        filtered = filtered.filter(app => app.jobType && app.jobType.toLowerCase().includes(jobTypeFilter));
    }
    return filtered;
}


/**
 * 応募者データをソートする
 * @param {Array} applicants - ソート対象の応募者データ
 * @param {string} column - ソートする列のキー
 * @param {string} direction - 'asc' または 'desc'
 * @returns {Array} ソート後の応募者データ
 */
function sortApplicants(applicants, column, direction) {
    if(!column) return applicants;

    return [...applicants].sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        // 日付や数値の比較
        if (['applyDate', 'interviewDate', 'offerDate', 'hireDate'].includes(column)) {
            valA = new Date(valA || 0); // nullや空文字を古い日付として扱う
            valB = new Date(valB || 0);
        } else if (['age', 'recruitmentCost'].includes(column)) {
            valA = Number(valA || 0);
            valB = Number(valB || 0);
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) {
            return direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
}


// フィルターボタンのイベントリスナー
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
        rerenderApplicantList(); // フィルタリングして再描画
    });
}

if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
        filterStoreSelect.value = '';
        filterStatusSelect.value = '';
        filterRouteSelect.value = '';
        filterJobTypeInput.value = '';
        rerenderApplicantList(); // フィルターリセットして再描画
    });
}

// テーブルヘッダーのクリックでソート
tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const column = header.dataset.sort;
        if (currentSortColumn === column) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = column;
            currentSortDirection = 'asc';
        }
        // ソートアイコンの更新などUIフィードバックをここに追加可能
        rerenderApplicantList();
    });
});


// --- コードの切れ目 (END 07_filter_sort.js) ---