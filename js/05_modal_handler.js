// js/05_modal_handler.js
// モーダルウィンドウの表示・非表示、フォームの初期化など

// --- コードの切れ目 (START 05_modal_handler.js) ---

const applicantModal = document.getElementById('applicantModal');
const modalTitle = document.getElementById('modalTitle');
const applicantForm = document.getElementById('applicantForm');
const applicantIdInput = document.getElementById('applicantId');
const closeBtn = document.querySelector('.modal .close-btn');
const addNewApplicantBtn = document.getElementById('addNewApplicantBtn');

/**
 * 応募者追加／編集モーダルを開く
 * @param {string|null} idToEdit - 編集する応募者のID（新規の場合はnull）
 * @param {number} yearForModal - モーダルで扱うデータの年
 * @param {number} monthForModal - モーダルで扱うデータの月
 */
function openApplicantModal(idToEdit = null, yearForModal, monthForModal) {
    applicantForm.reset(); // フォームをリセット
    populateDropdownsInForm(); // フォーム内のプルダウンを最新化

    if (idToEdit) {
        modalTitle.textContent = '応募者情報編集';
        const applicants = getApplicantsForMonth(yearForModal, monthForModal);
        const applicant = applicants.find(app => app.id === idToEdit);
        if (applicant) {
            applicantIdInput.value = applicant.id;
            // フォームに既存の値を設定
            document.getElementById('applyDate').value = formatDate(applicant.applyDate);
            document.getElementById('storeName').value = applicant.storeName;
            document.getElementById('name').value = applicant.name;
            document.getElementById('gender').value = applicant.gender || '男性';
            document.getElementById('age').value = applicant.age !== null ? applicant.age : '';
            document.getElementById('jobType').value = applicant.jobType || 'スタイリスト';
            document.getElementById('employmentType').value = applicant.employmentType || '正社員';
            document.getElementById('applyRoute').value = applicant.applyRoute;
            document.getElementById('recruitmentCost').value = applicant.recruitmentCost !== null ? applicant.recruitmentCost : 0;
            document.getElementById('interviewDate').value = formatDate(applicant.interviewDate);
            document.getElementById('offerDate').value = formatDate(applicant.offerDate);
            document.getElementById('status').value = applicant.status;
            document.getElementById('hireDate').value = formatDate(applicant.hireDate);
            document.getElementById('remarks').value = applicant.remarks || '';
        } else {
            console.error("編集対象の応募者が見つかりません:", idToEdit);
            modalTitle.textContent = '新規応募者追加 (エラー)';
            applicantIdInput.value = ''; // IDはクリア
        }
    } else {
        modalTitle.textContent = '新規応募者追加';
        applicantIdInput.value = ''; // 新規なのでIDは空
         // 新規追加時のデフォルト値設定
        document.getElementById('applyDate').value = formatDate(new Date()); // 今日の日付
        document.getElementById('jobType').value = 'スタイリスト';
        document.getElementById('employmentType').value = '正社員';
        document.getElementById('recruitmentCost').value = 0;
        document.getElementById('status').value = '選考中'; // デフォルトステータス
    }
    applicantModal.style.display = 'block';
}

/**
 * モーダル内のプルダウンを populate するラッパー関数
 */
function populateDropdownsInForm() {
    populateSelectWithOptions('storeName', stores, false);
    populateSelectWithOptions('applyRoute', applicationRoutes, false);
    populateSelectWithOptions('status', selectionStatuses, false);
    // 必要に応じて他のプルダウンも
    populateSelectWithOptions('gender', ['男性', '女性', 'その他'], false);
    populateSelectWithOptions('employmentType', defaultEmploymentTypes, false);
}


/**
 * モーダルを閉じる
 */
function closeApplicantModal() {
    applicantModal.style.display = 'none';
}

// イベントリスナー
if (addNewApplicantBtn) {
    addNewApplicantBtn.onclick = () => openApplicantModal(null, currentYear, currentMonth);
}
if (closeBtn) {
    closeBtn.onclick = closeApplicantModal;
}
window.onclick = function(event) {
    if (event.target == applicantModal) {
        closeApplicantModal();
    }
}

// --- コードの切れ目 (END 05_modal_handler.js) ---