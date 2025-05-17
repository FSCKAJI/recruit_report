// js/06_form_handler.js
// フォーム送信処理、データバリデーションなど

// --- コードの切れ目 (START 06_form_handler.js) ---

const applicantFormToHandle = document.getElementById('applicantForm'); // 05と重複するが、スコープを分ける

if (applicantFormToHandle) {
    applicantFormToHandle.addEventListener('submit', function(event) {
        event.preventDefault(); // デフォルトのフォーム送信をキャンセル

        const id = document.getElementById('applicantId').value;
        const ageValue = document.getElementById('age').value;
        const costValue = document.getElementById('recruitmentCost').value;

        const applicantData = {
            id: id || generateUniqueId(), // IDがない場合は新規作成
            applyDate: formatDate(document.getElementById('applyDate').value),
            storeName: document.getElementById('storeName').value,
            name: document.getElementById('name').value.trim(),
            gender: document.getElementById('gender').value,
            age: ageValue ? parseInt(ageValue, 10) : null,
            jobType: document.getElementById('jobType').value.trim(),
            employmentType: document.getElementById('employmentType').value,
            applyRoute: document.getElementById('applyRoute').value,
            recruitmentCost: costValue ? parseInt(costValue, 10) : 0,
            interviewDate: formatDate(document.getElementById('interviewDate').value),
            offerDate: formatDate(document.getElementById('offerDate').value),
            status: document.getElementById('status').value,
            hireDate: formatDate(document.getElementById('hireDate').value),
            remarks: document.getElementById('remarks').value.trim()
        };

        // 簡単なバリデーション
        if (!applicantData.applyDate || !applicantData.name || !applicantData.storeName || !applicantData.applyRoute || !applicantData.status) {
            alert('応募日、店舗名、氏名、応募経路、合否は必須項目です。');
            return;
        }
        if (applicantData.age !== null && (isNaN(applicantData.age) || applicantData.age < 0)) {
            alert('年齢は正しい数値を入力してください。');
            return;
        }
        if (isNaN(applicantData.recruitmentCost) || applicantData.recruitmentCost < 0) {
            alert('採用成果報酬は正しい数値を入力してください。');
            return;
        }

        addOrUpdateApplicant(applicantData, currentYear, currentMonth);
        closeApplicantModal();
        renderCurrentMonthData(); // テーブルと統計を再描画
    });
}

// --- コードの切れ目 (END 06_form_handler.js) ---