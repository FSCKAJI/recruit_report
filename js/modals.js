// モーダル関連の機能

// 応募者追加モーダルを表示
function showAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = '応募者を追加';
    
    // 今日の日付をデフォルトで設定
    const today = new Date().toISOString().substr(0, 10);
    
    // 一般的なデフォルト値を設定して入力を簡略化
    document.getElementById('applicationDate').value = today;
    document.getElementById('storeName').value = '';
    document.getElementById('applicantName').value = '';
    document.getElementById('gender').value = '女性';
    document.getElementById('age').value = '';
    document.getElementById('jobTitle').value = 'スタイリスト';
    document.getElementById('employmentType').value = 'パート・アルバイト';
    document.getElementById('applicationSource').value = 'リジョブ';
    document.getElementById('referralFee').value = '¥220,000';
    
    // 面接日は7日後をデフォルト設定
    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + 7);
    document.getElementById('interviewDate').value = interviewDate.toISOString().substr(0, 10);
    
    document.getElementById('status').value = '選考中';
    document.getElementById('startDate').value = '';
    document.getElementById('notes').value = '';
    
    // クイック入力ボタンを追加
    const quickButtons = document.getElementById('quickInputButtons');
    quickButtons.style.display = 'flex';
    
    // モーダルを表示
    document.getElementById('applicantModal').classList.add('show');
}

// 応募者編集モーダルを表示
function editApplicant(id) {
    currentEditId = id;
    document.getElementById('modalTitle').textContent = '応募者を編集';
    
    // 応募者データを取得
    const applicant = monthlyData[currentMonth].find(a => a.id === id);
    if (!applicant) return;
    
    // フォームに値を設定
    document.getElementById('applicationDate').value = applicant.applicationDate;
    document.getElementById('storeName').value = applicant.storeName;
    document.getElementById('applicantName').value = applicant.name;
    document.getElementById('gender').value = applicant.gender;
    document.getElementById('age').value = applicant.age || '';
    document.getElementById('jobTitle').value = applicant.jobTitle || '';
    document.getElementById('employmentType').value = applicant.employmentType || '';
    document.getElementById('applicationSource').value = applicant.applicationSource;
    document.getElementById('referralFee').value = applicant.referralFee;
    document.getElementById('interviewDate').value = applicant.interviewDate || '';
    document.getElementById('status').value = applicant.status;
    document.getElementById('startDate').value = applicant.startDate || '';
    document.getElementById('notes').value = applicant.notes || '';
    
    // クイック入力ボタンを非表示
    const quickButtons = document.getElementById('quickInputButtons');
    quickButtons.style.display = 'none';
    
    // モーダルを表示
    document.getElementById('applicantModal').classList.add('show');
}

// モーダルを閉じる
function closeModal() {
    document.getElementById('applicantModal').classList.remove('show');
}

// 応募者を保存（追加または更新）
function saveApplicant() {
    const applicationDate = document.getElementById('applicationDate').value;
    const storeName = document.getElementById('storeName').value;
    const name = document.getElementById('applicantName').value;
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value ? parseInt(document.getElementById('age').value) : null;
    const jobTitle = document.getElementById('jobTitle').value;
    const employmentType = document.getElementById('employmentType').value;
    const applicationSource = document.getElementById('applicationSource').value;
    const referralFee = document.getElementById('referralFee').value;
    const interviewDate = document.getElementById('interviewDate').value;
    const status = document.getElementById('status').value;
    const startDate = document.getElementById('startDate').value;
    const notes = document.getElementById('notes').value;
    
    // 必須フィールドの検証
    if (!applicationDate || !storeName || !name) {
        alert('応募日、店舗名、氏名は必須です');
        return;
    }
    
    // 応募日から月を判断
    const appDateObj = new Date(applicationDate);
    const appMonth = `${appDateObj.getFullYear()}-${String(appDateObj.getMonth() + 1).padStart(2, '0')}`;
    
    // その月のデータがなければ作成
    if (!monthlyData[appMonth]) {
        monthlyData[appMonth] = [];
        
        // 月タブを追加
        addMonthTab(appMonth);
    }
    
    if (currentEditId === null) {
        // 新規追加
        const newId = getNextId();
        
        const newApplicant = {
            id: newId,
            applicationDate,
            storeName,
            name,
            gender,
            age,
            jobTitle,
            employmentType,
            applicationSource,
            referralFee,
            interviewDate,
            status,
            startDate,
            notes
        };
        
        // 適切な月のデータに追加
        monthlyData[appMonth].push(newApplicant);
        
    } else {
        // 更新
        const index = monthlyData[currentMonth].findIndex(a => a.id === currentEditId);
        if (index !== -1) {
            monthlyData[currentMonth][index] = {
                ...monthlyData[currentMonth][index],
                applicationDate,
                storeName,
                name,
                gender,
                age,
                jobTitle,
                employmentType,
                applicationSource,
                referralFee,
                interviewDate,
                status,
                startDate,
                notes
            };
        }
    }
    
    // モーダルを閉じて表を再描画
    closeModal();
    renderApplicants();
    updateStats();
    
    // 成功メッセージ
    const notification = document.createElement('div');
    notification.textContent = currentEditId === null ? '応募者を追加しました' : '応募者情報を更新しました';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}