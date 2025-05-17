// js/04_ui_render.js
// UIの描画関連（テーブル、プルダウン、統計情報など）

// --- コードの切れ目 (START 04_ui_render.js) ---

const applicantTableBody = document.getElementById('applicantTable').getElementsByTagName('tbody')[0];
const totalApplicantsDisplay = document.getElementById('totalApplicants');
const hiredApplicantsDisplay = document.getElementById('hiredApplicants');
const totalRecruitmentCostDisplay = document.getElementById('totalRecruitmentCost');
const costPerHireDisplay = document.getElementById('costPerHire');

/**
 * 応募者テーブルを描画する
 * @param {Array} applicantsToRender - 表示する応募者データの配列
 */
function renderApplicantTable(applicantsToRender) {
    applicantTableBody.innerHTML = ''; //既存の行をクリア

    if (!applicantsToRender || applicantsToRender.length === 0) {
        const row = applicantTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 15; // テーブルの列数に合わせて調整
        cell.textContent = '表示する応募データがありません。';
        cell.style.textAlign = 'center';
        return;
    }

    // 応募日でソート (若い順 = 昇順)
    const sortedApplicants = applicantsToRender.sort((a, b) => new Date(a.applyDate) - new Date(b.applyDate));

    sortedApplicants.forEach(applicant => {
        const row = applicantTableBody.insertRow();
        row.dataset.id = applicant.id; // 行にIDを付与

        // セルにデータを挿入 (表示順に合わせて)
        addTableCell(row, formatDate(applicant.applyDate), 'applyDate', applicant.id);
        addTableCell(row, applicant.storeName, 'storeName', applicant.id, true, stores); // プルダウン用
        addTableCell(row, applicant.name, 'name', applicant.id);
        addTableCell(row, applicant.gender, 'gender', applicant.id, true, ['男性', '女性', 'その他']);
        addTableCell(row, applicant.age !== null ? applicant.age : '', 'age', applicant.id);
        addTableCell(row, applicant.jobType, 'jobType', applicant.id);
        addTableCell(row, applicant.employmentType, 'employmentType', applicant.id, true, defaultEmploymentTypes);
        addTableCell(row, applicant.applyRoute, 'applyRoute', applicant.id, true, applicationRoutes);
        addTableCell(row, formatCurrency(applicant.recruitmentCost), 'recruitmentCost', applicant.id);
        addTableCell(row, formatDate(applicant.interviewDate), 'interviewDate', applicant.id);
        addTableCell(row, formatDate(applicant.offerDate), 'offerDate', applicant.id);
        addTableCell(row, applicant.status, 'status', applicant.id, true, selectionStatuses);
        addTableCell(row, formatDate(applicant.hireDate), 'hireDate', applicant.id);
        addTableCell(row, applicant.remarks, 'remarks', applicant.id);

        // アクションボタンセル
        const actionCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.textContent = '編集';
        editButton.onclick = () => openApplicantModal(applicant.id, currentYear, currentMonth); // 編集モードでモーダルを開く
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = '削除';
        deleteButton.onclick = () => {
            if (confirm(`「${applicant.name}」さんのデータを削除しますか？`)) {
                deleteApplicant(applicant.id, currentYear, currentMonth);
                renderCurrentMonthData(); // 再描画
            }
        };
        actionCell.appendChild(deleteButton);
    });
}

/**
 * テーブルセルを追加し、編集可能にするための準備
 * @param {HTMLTableRowElement} row - 対象の行
 * @param {string | number} textContent - セルの内容
 * @param {string} fieldName - 対応するデータフィールド名
 * @param {string} applicantId - 応募者ID
 * @param {boolean} isSelect - プルダウンにするか
 * @param {Array} options - プルダウンの選択肢 (isSelectがtrueの場合)
 */
function addTableCell(row, textContent, fieldName, applicantId, isSelect = false, options = []) {
    const cell = row.insertCell();
    cell.textContent = escapeHTML(String(textContent === null || textContent === undefined ? '' : textContent));
    cell.classList.add('editable-cell');
    cell.dataset.field = fieldName;
    cell.dataset.id = applicantId;

    // 直接編集のイベントリスナー (簡易版 - クリックでプロンプト)
    // より高度なインライン編集は05_modal_handler.jsでinput置換などを検討
    cell.addEventListener('dblclick', (e) => {
        const targetCell = e.target;
        const currentId = targetCell.dataset.id;
        const field = targetCell.dataset.field;
        const applicants = getApplicantsForMonth(currentYear, currentMonth);
        const targetApplicant = applicants.find(a => a.id === currentId);

        if (!targetApplicant) return;

        let newValue;
        if (isSelect) {
            // 簡易的にプロンプトで選択肢を提示
            const optionsString = options.map((opt, i) => `${i + 1}: ${opt}`).join('\n');
            const choiceIndex = prompt(`「${field}」の新しい値を選択してください:\n${optionsString}\n現在の値: ${targetApplicant[field]}`, '');
            if (choiceIndex !== null && options[parseInt(choiceIndex) - 1] !== undefined) {
                newValue = options[parseInt(choiceIndex) - 1];
            } else if (choiceIndex !== null && choiceIndex.trim() !== '') { // 自由入力も許容する場合
                newValue = choiceIndex.trim();
            } else {
                return; // キャンセル
            }
        } else if (['applyDate', 'interviewDate', 'offerDate', 'hireDate'].includes(field)) {
            newValue = prompt(`「${field}」の新しい値を入力してください (YYYY-MM-DD):`, formatDate(targetApplicant[field]));
            if (newValue !== null) newValue = formatDate(newValue); // 入力値をフォーマット
            else return;
        } else if (field === 'age' || field === 'recruitmentCost') {
            newValue = prompt(`「${field}」の新しい値を入力してください:`, targetApplicant[field]);
            if (newValue !== null) newValue = parseInt(newValue, 10);
            else return;
            if (isNaN(newValue)) {
                alert("有効な数値を入力してください。");
                return;
            }
        }
        else {
            newValue = prompt(`「${field}」の新しい値を入力してください:`, targetApplicant[field]);
            if (newValue === null) return; // キャンセル
        }


        if (newValue !== undefined && targetApplicant[field] !== newValue) {
            targetApplicant[field] = newValue;
            addOrUpdateApplicant(targetApplicant, currentYear, currentMonth);
            renderCurrentMonthData(); // テーブルと統計を再描画
        }
    });
}


/**
 * 統計情報を更新・表示する
 * @param {Array} applicants - 表示中の月の応募者データ
 */
function updateStatsOverview(applicants) {
    const stats = calculateStats(applicants);
    totalApplicantsDisplay.textContent = stats.totalApplicants;
    hiredApplicantsDisplay.textContent = stats.hiredApplicants;
    totalRecruitmentCostDisplay.textContent = formatCurrency(stats.totalRecruitmentCost);
    costPerHireDisplay.textContent = formatCurrency(stats.costPerHire);
}

/**
 * 各種プルダウンを初期化・設定する
 */
function populateDropdowns() {
    // モーダル内のプルダウン
    populateSelectWithOptions('storeName', stores);
    populateSelectWithOptions('applyRoute', applicationRoutes);
    populateSelectWithOptions('status', selectionStatuses);

    // フィルター用のプルダウン
    populateSelectWithOptions('filterStore', stores, true, "全店舗");
    populateSelectWithOptions('filterStatus', selectionStatuses, true, "全ステータス");
    populateSelectWithOptions('filterRoute', applicationRoutes, true, "全経路");
}

/**
 * select要素にoptionを追加する
 * @param {string} selectId - select要素のID
 * @param {Array} optionsArray - optionのテキスト（または{value: '', text: ''}の配列）
 * @param {boolean} includeEmptyOption - 「すべて」のような空の選択肢を含めるか
 * @param {string} emptyOptionText - 空の選択肢のテキスト
 */
function populateSelectWithOptions(selectId, optionsArray, includeEmptyOption = false, emptyOptionText = "選択してください") {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    selectElement.innerHTML = ''; // 既存のオプションをクリア

    if (includeEmptyOption) {
        const emptyOpt = document.createElement('option');
        emptyOpt.value = "";
        emptyOpt.textContent = emptyOptionText;
        selectElement.appendChild(emptyOpt);
    }

    optionsArray.forEach(option => {
        const opt = document.createElement('option');
        if (typeof option === 'object' && option !== null && option.value !== undefined) {
            opt.value = option.value;
            opt.textContent = option.text;
        } else {
            opt.value = option;
            opt.textContent = option;
        }
        selectElement.appendChild(opt);
    });
}

/**
 * 応募者リスト全体を再描画（フィルターやソート後に呼ばれる）
 */
function rerenderApplicantList() {
    let applicantsToDisplay = getApplicantsForMonth(currentYear, currentMonth);
    applicantsToDisplay = applyAllFilters(applicantsToDisplay);
    applicantsToDisplay = sortApplicants(applicantsToDisplay, currentSortColumn, currentSortDirection);
    renderApplicantTable(applicantsToDisplay);
    updateStatsOverview(applicantsToDisplay); // フィルタリング後のデータで統計も更新
}

/**
 * 現在表示している年月のデータを描画/再描画する
 */
function renderCurrentMonthData() {
    document.getElementById('currentMonthDisplay').textContent = `${currentYear}年${currentMonth}月`;
    const applicants = getApplicantsForMonth(currentYear, currentMonth);
    let filteredApplicants = applyAllFilters(applicants); // フィルターを適用
    let sortedApplicants = sortApplicants(filteredApplicants, currentSortColumn, currentSortDirection); // ソートを適用
    renderApplicantTable(sortedApplicants);
    updateStatsOverview(applicants); // 統計はフィルター前の全データで計算（要件に応じて変更可）
    renderMonthlyTrendChart(); // 月別グラフも更新
    updateMonthSelector(); // 過去月セレクタも更新
}


// --- コードの切れ目 (END 04_ui_render.js) ---