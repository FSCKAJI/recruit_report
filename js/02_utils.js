// js/02_utils.js
// 汎用ユーティリティ関数

// --- コードの切れ目 (START 02_utils.js) ---

/**
 * ユニークなIDを生成する (簡易版)
 * @returns {string}
 */
function generateUniqueId() {
    return 'app' + Date.now().toString() + Math.random().toString(36).substring(2, 7);
}

/**
 * 日付文字列をYYYY-MM-DD 形式にフォーマットする
 * @param {Date | string} dateInput - Dateオブジェクトまたは日付文字列
 * @returns {string} YYYY-MM-DD 形式の文字列、無効な場合は空文字
 */
function formatDate(dateInput) {
    if (!dateInput) return '';
    try {
        const date = new Date(dateInput);
        // getTimezoneOffsetを考慮してローカル日付にする
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - userTimezoneOffset);
        return localDate.toISOString().split('T')[0];
    } catch (e) {
        console.error("Invalid date for formatting:", dateInput, e);
        return '';
    }
}


/**
 * 数値を円通貨形式にフォーマットする
 * @param {number} number - フォーマットする数値
 * @returns {string} "¥X,XXX" 形式の文字列
 */
function formatCurrency(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return '¥0';
    }
    return `¥${number.toLocaleString()}`;
}

/**
 * HTML特殊文字をエスケープする
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープされた文字列
 */
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function (match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

/**
 * YYYY-MM 形式の月キーから年と月を取得
 * @param {string} monthKey - "YYYY-MM"
 * @returns {{year: number, month: number} | null}
 */
function parseMonthKey(monthKey) { // <--- ここを修正しました
    if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) return null;
    const [year, month] = monthKey.split('-').map(Number);
    return { year, month };
}


// --- コードの切れ目 (END 02_utils.js) ---