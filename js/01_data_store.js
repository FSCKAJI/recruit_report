// js/01_data_store.js
// 応募者データの管理、ローカルストレージへの保存・読み込み

// --- コードの切れ目 (START 01_data_store.js) ---

let currentYear = 2025;
let currentMonth = 5; // 1月はじまり (0-11) ではなく、1-12 で管理し、表示やDateオブジェクトで調整

// 全期間の応募者データを月別に格納するオブジェクト
// キーは "YYYY-MM" 形式
// 値は応募者オブジェクトの配列
let allApplicantsData = {};

/**
 * ローカルストレージから全応募者データを読み込む
 */
function loadAllApplicantsFromLocalStorage() {
    const storedData = localStorage.getItem('allApplicantsData');
    if (storedData) {
        allApplicantsData = JSON.parse(storedData);
        // 日付文字列をDateオブジェクトに変換するなどの処理が必要な場合がある
        // 今回は文字列のまま扱うが、ソートや比較で問題が出たら要修正
    } else {
        // 初回起動時などのサンプルデータ（前回の会話で提供されたデータに基づく）
        allApplicantsData[`${currentYear}-0${currentMonth}`] = [ // キーを YYYY-MM 形式に
            { id: 'app001', applyDate: '2025-05-01', storeName: '北島（ＯＰＥＮ後\n徳島へ）', name: '山下 那奈', gender: '女性', age: 28, jobType: 'スタイリスト', employmentType: '正社員', applyRoute: '紹介', recruitmentCost: 0, interviewDate: '2025-05-03', offerDate: '', status: '採用', hireDate: '2025-06-01', remarks: '' },
            { id: 'app002', applyDate: '2025-05-01', storeName: 'カットオン長田', name: '阿慶田 真希', gender: '女性', age: 54, jobType: 'スタイリスト', employmentType: '正社員', applyRoute: 'リジョブ', recruitmentCost: 264000, interviewDate: '2025-05-19', offerDate: '', status: '辞退', hireDate: '', remarks: '5/19現地' },
            { id: 'app003', applyDate: '2025-05-01', storeName: '宇多津', name: '小川 眞由美', gender: '女性', age: 61, jobType: 'スタイリスト', employmentType: 'パート・アルバイト', applyRoute: 'バイトルPRO', recruitmentCost: 150000, interviewDate: '2025-05-12', offerDate: '', status: '不採用', hireDate: '', remarks: 'ブランクが長すぎるため・採用費がかかるため不採用, 5/12 14:00' },
            { id: 'app004', applyDate: '2025-05-01', storeName: '東原', name: '山本 鈴奈', gender: '女性', age: null, jobType: 'スタイリスト', employmentType: 'パート・アルバイト', applyRoute: 'ジョブメドレー', recruitmentCost: 220000, interviewDate: '2025-05-05', offerDate: '', status: '採用', hireDate: '2025-05-08', remarks: '' },
            { id: 'app005', applyDate: '2025-05-08', storeName: '富久', name: '中本　彩香', gender: '女性', age: 45, jobType: 'スタイリスト', employmentType: 'パート・アルバイト', applyRoute: '自社 （ジェイシティ）', recruitmentCost: 0, interviewDate: '2025-05-12', offerDate: '', status: '採用', hireDate: '2025-07-01', remarks: '' },
            { id: 'app006', applyDate: '2025-05-02', storeName: '国分', name: '吉田 理恵子', gender: '女性', age: 58, jobType: 'スタイリスト', employmentType: 'パート・アルバイト', applyRoute: 'ビューティーミライ', recruitmentCost: 275000, interviewDate: '2025-05-09', offerDate: '', status: '辞退', hireDate: '', remarks: '' },
            { id: 'app007', applyDate: '2025-05-03', storeName: '西阿知', name: '岡本 祐八', gender: '男性', age: 45, jobType: 'スタイリスト', employmentType: '正社員', applyRoute: 'リジョブ', recruitmentCost: 231000, interviewDate: '2025-05-06', offerDate: '', status: '辞退', hireDate: '', remarks: '' },
            { id: 'app008', applyDate: '2025-05-06', storeName: 'LALA', name: '小林直美', gender: '女性', age: 56, jobType: 'スタイリスト', employmentType: 'パート・アルバイト', applyRoute: 'ジョブメドレー', recruitmentCost: 220000, interviewDate: '2025-05-08', offerDate: '', status: '不採用', hireDate: '', remarks: '' },
            { id: 'app009', applyDate: '2025-05-08', storeName: '神戸北', name: '西田　紗由理', gender: '女性', age: 44, jobType: 'スタイリスト', employmentType: '', applyRoute: 'リジョブ', recruitmentCost: 231000, interviewDate: '2025-05-10', offerDate: '', status: '辞退', hireDate: '', remarks: '' },
            { id: 'app010', applyDate: '2025-05-12', storeName: '今治', name: '矢野　元美', gender: '女性', age: 57, jobType: 'スタイリスト', employmentType: '正社員', applyRoute: '自社 （ジェイシティ）', recruitmentCost: 0, interviewDate: '2025-05-15', offerDate: '', status: '採用', hireDate: '2025-05-20', remarks: '' },
            { id: 'app011', applyDate: '2025-05-14', storeName: '寝屋川', name: '上門　明子', gender: '女性', age: 54, jobType: '', employmentType: 'パート・アルバイト', applyRoute: 'ジョブメドレー', recruitmentCost: 220000, interviewDate: '2025-05-15', offerDate: '', status: '不採用', hireDate: '', remarks: '' },
            { id: 'app012', applyDate: '2025-05-16', storeName: '二条', name: '長田　容子', gender: '女性', age: 49, jobType: 'スタイリスト', employmentType: '正社員', applyRoute: 'バイトルPRO', recruitmentCost: 220000, interviewDate: '2025-05-22', offerDate: '', status: '選考中', hireDate: '', remarks: '' }
        ];
        // 新規ユーザー向けに、空のデータ構造で初期化する方が良い場合もある
        // allApplicantsData = {};
    }
}


/**
 * 全応募者データをローカルストレージに保存する
 */
function saveAllApplicantsToLocalStorage() {
    localStorage.setItem('allApplicantsData', JSON.stringify(allApplicantsData));
}

/**
 * 指定された年月の応募者リストを取得する
 * @param {number} year - 年
 * @param {number} month - 月 (1-12)
 * @returns {Array} 応募者オブジェクトの配列
 */
function getApplicantsForMonth(year, month) {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    return allApplicantsData[monthKey] || [];
}

/**
 * 応募者を追加または更新する
 * @param {Object} applicantData - 追加または更新する応募者データ
 * @param {number} targetYear - 対象年
 * @param {number} targetMonth - 対象月 (1-12)
 */
function addOrUpdateApplicant(applicantData, targetYear, targetMonth) {
    const monthKey = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;
    if (!allApplicantsData[monthKey]) {
        allApplicantsData[monthKey] = [];
    }

    const applicantsForTargetMonth = allApplicantsData[monthKey];
    const existingApplicantIndex = applicantsForTargetMonth.findIndex(app => app.id === applicantData.id);

    if (existingApplicantIndex > -1) {
        // 更新
        applicantsForTargetMonth[existingApplicantIndex] = applicantData;
    } else {
        // 新規追加
        applicantsForTargetMonth.push(applicantData);
    }
    saveAllApplicantsToLocalStorage();
}

/**
 * 応募者を削除する
 * @param {string} applicantId - 削除する応募者のID
 * @param {number} targetYear - 対象年
 * @param {number} targetMonth - 対象月 (1-12)
 */
function deleteApplicant(applicantId, targetYear, targetMonth) {
    const monthKey = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;
    if (allApplicantsData[monthKey]) {
        allApplicantsData[monthKey] = allApplicantsData[monthKey].filter(app => app.id !== applicantId);
        if (allApplicantsData[monthKey].length === 0) {
            delete allApplicantsData[monthKey]; // データが空になった月はキーごと削除しても良い
        }
        saveAllApplicantsToLocalStorage();
    }
}

/**
 * 利用可能な月（データが存在する月）のリストを取得
 * @returns {Array} "YYYY-MM" 形式の文字列の配列
 */
function getAvailableMonths() {
    return Object.keys(allApplicantsData).sort().reverse(); // 新しい順で
}


// --- コードの切れ目 (END 01_data_store.js) ---