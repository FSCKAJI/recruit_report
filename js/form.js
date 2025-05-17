// js/form.js - フォーム入力の管理を担当

// フォーム管理クラス
class FormManager {
    constructor() {
        this.form = document.getElementById('application-form');
        this.editId = null;
        
        this.initFormEvents();
        this.updateStoreSelect();
        this.updateSourceSelect();
    }
    
    // フォームのイベントを初期化
    initFormEvents() {
        // フォーム送信イベント
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.saveApplication();
        });
        
        // 結果選択時のイベント（採用の場合は入社日を必須に）
        document.getElementById('result').addEventListener('change', e => {
            const startDateField = document.getElementById('start-date');
            if (e.target.value === '採用') {
                startDateField.setAttribute('required', '');
            } else {
                startDateField.removeAttribute('required');
            }
        });
    }
    
    // 店舗のセレクトボックスを更新
    updateStoreSelect() {
        const storeSelect = document.getElementById('store');
        if (!storeSelect) return;
        
        const storeNames = storeManager.getStoreNames();
        
        // 現在の選択を保持
        const currentSelection = storeSelect.value;
        
        // オプションをクリア（最初のオプションは残す）
        while (storeSelect.options.length > 1) {
            storeSelect.remove(1);
        }
        
        // 店舗名のオプションを追加
        storeNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            storeSelect.appendChild(option);
        });
        
        // 以前の選択を復元
        if (currentSelection) {
            storeSelect.value = currentSelection;
        }
    }
    
    // 応募経路のセレクトボックスを更新
    updateSourceSelect() {
        const sourceSelect = document.getElementById('source');
        if (!sourceSelect) return;
        
        const sources = sourceManager.getAllSources();
        
        // 現在の選択を保持
        const currentSelection = sourceSelect.value;
        
        // オプションをクリア（最初のオプションは残す）
        while (sourceSelect.options.length > 1) {
            sourceSelect.remove(1);
        }
        
        // 応募経路のオプションを追加
        sources.forEach(source => {
            const option = document.createElement('option');
            option.value = source;
            option.textContent = source;
            sourceSelect.appendChild(option);
        });
        
        // 以前の選択を復元
        if (currentSelection) {
            sourceSelect.value = currentSelection;
        }
    }
    
    // フォームをリセット
    resetForm() {
        this.form.reset();
        this.editId = null;
        document.getElementById('edit-id').value = '';
        
        // 応募日を今日の日付に設定
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('apply-date').value = today;
        
        // 必須属性をリセット
        document.getElementById('start-date').removeAttribute('required');
    }
    
    // モーダルのタイトルを設定
    setModalTitle(title) {
        document.getElementById('modal-title').textContent = title;
    }
    
    // フォームに応募データをセット
    setFormData(application) {
        this.editId = application.id;
        document.getElementById('edit-id').value = application.id;
        
        document.getElementById('apply-date').value = application.applyDate;
        document.getElementById('store').value = application.store;
        document.getElementById('name').value = application.name;
        
        // 性別の設定
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        genderRadios.forEach(radio => {
            if (radio.value === application.gender) {
                radio.checked = true;
            }
        });
        
        document.getElementById('age').value = application.age;
        document.getElementById('position').value = application.position;
        document.getElementById('employment-type').value = application.employmentType;
        document.getElementById('source').value = application.source;
        document.getElementById('fee').value = application.fee;
        document.getElementById('interview-date').value = application.interviewDate;
        document.getElementById('offer-date').value = application.offerDate;
        document.getElementById('result').value = application.result;
        document.getElementById('start-date').value = application.startDate;
        document.getElementById('notes').value = application.notes;
        
        // 採用の場合は入社日を必須に
        if (application.result === '採用') {
            document.getElementById('start-date').setAttribute('required', '');
        }
    }
    
    // フォームデータを取得
    getFormData() {
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        let gender = '';
        genderRadios.forEach(radio => {
            if (radio.checked) {
                gender = radio.value;
            }
        });
        
        return {
            applyDate: document.getElementById('apply-date').value,
            store: document.getElementById('store').value,
            name: document.getElementById('name').value,
            gender: gender,
            age: document.getElementById('age').value,
            position: document.getElementById('position').value,
            employmentType: document.getElementById('employment-type').value,
            source: document.getElementById('source').value,
            fee: document.getElementById('fee').value,
            interviewDate: document.getElementById('interview-date').value,
            offerDate: document.getElementById('offer-date').value,
            result: document.getElementById('result').value,
            startDate: document.getElementById('start-date').value,
            notes: document.getElementById('notes').value
        };
    }
    
    // 応募データを保存
    saveApplication() {
        const formData = this.getFormData();
        
        if (this.editId) {
            // 既存の応募データを更新
            const updatedApp = dataManager.updateApplication(this.editId, formData);
            
            if (updatedApp) {
                uiManager.closeModal(document.getElementById('application-modal'));
                tableManager.refreshTable();
                statsManager.updateCurrentStats();
                uiManager.showNotification('応募データを更新しました');
            } else {
                uiManager.showNotification('データの更新に失敗しました', 'error');
            }
        } else {
            // 新規応募データを追加
            const newApp = dataManager.addApplication(formData);
            
            if (newApp) {
                uiManager.closeModal(document.getElementById('application-modal'));
                tableManager.refreshTable();
                statsManager.updateCurrentStats();
                uiManager.showNotification('新規応募データを登録しました');
            } else {
                uiManager.showNotification('データの登録に失敗しました', 'error');
            }
        }
    }
}

// グローバル変数として宣言（他のスクリプトから参照するため）
let formManager;