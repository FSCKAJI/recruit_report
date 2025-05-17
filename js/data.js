// js/data.js - データの管理と処理を担当

// 初期データ - 2025年5月のデータ
const initialData = [
    {
        id: 1,
        applyDate: '2025-05-01',
        store: '北島（ＯＰＥＮ後徳島へ）',
        name: '山下 那奈',
        gender: '女性',
        age: 28,
        position: 'スタイリスト',
        employmentType: '正社員',
        source: '紹介',
        fee: '0円',
        interviewDate: '2025-05-03',
        offerDate: '',
        result: '採用',
        startDate: '2025-06-01',
        notes: ''
    },
    {
        id: 2,
        applyDate: '2025-05-01',
        store: 'カットオン長田',
        name: '阿慶田 真希',
        gender: '女性',
        age: 54,
        position: 'スタイリスト',
        employmentType: '正社員',
        source: 'リジョブ',
        fee: '¥264,000',
        interviewDate: '2025-05-19',
        offerDate: '',
        result: '辞退',
        startDate: '',
        notes: ''
    },
    {
        id: 3,
        applyDate: '2025-05-01',
        store: '宇多津',
        name: '小川 眞由美',
        gender: '女性',
        age: 61,
        position: 'スタイリスト',
        employmentType: 'パート・アルバイト',
        source: 'バイトルPRO',
        fee: '¥150,000',
        interviewDate: '2025-05-12',
        offerDate: '',
        result: '不採用',
        startDate: '',
        notes: 'ブランクが長すぎるため・採用費がかかるため不採用'
    },
    {
        id: 4,
        applyDate: '2025-05-01',
        store: '東原',
        name: '山本 鈴奈',
        gender: '女性',
        age: '',
        position: 'スタイリスト',
        employmentType: 'パート・アルバイト',
        source: 'ジョブメドレー',
        fee: '¥220,000',
        interviewDate: '2025-05-05',
        offerDate: '',
        result: '採用',
        startDate: '2025-05-08',
        notes: ''
    },
    {
        id: 5,
        applyDate: '2025-05-08',
        store: '富久',
        name: '中本 彩香',
        gender: '女性',
        age: 45,
        position: 'スタイリスト',
        employmentType: 'パート・アルバイト',
        source: '自社 （ジェイシティ）',
        fee: '0円',
        interviewDate: '2025-05-12',
        offerDate: '',
        result: '採用',
        startDate: '2025-07-01',
        notes: ''
    },
    {
        id: 6,
        applyDate: '2025-05-02',
        store: '国分',
        name: '吉田 理恵子',
        gender: '女性',
        age: 58,
        position: 'スタイリスト',
        employmentType: 'パート・アルバイト',
        source: 'ビューティーミライ',
        fee: '¥275,000',
        interviewDate: '2025-05-09',
        offerDate: '',
        result: '辞退',
        startDate: '',
        notes: ''
    },
    {
        id: 7,
        applyDate: '2025-05-03',
        store: '西阿知',
        name: '岡本 祐八',
        gender: '男性',
        age: 45,
        position: 'スタイリスト',
        employmentType: '正社員',
        source: 'リジョブ',
        fee: '¥231,000',
        interviewDate: '2025-05-06',
        offerDate: '',
        result: '辞退',
        startDate: '',
        notes: ''
    },
    {
        id: 8,
        applyDate: '2025-05-06',
        store: 'LALA',
        name: '小林直美',
        gender: '女性',
        age: 56,
        position: 'スタイリスト',
        employmentType: 'パート・アルバイト',
        source: 'ジョブメドレー',
        fee: '¥220,000',
        interviewDate: '2025-05-08',
        offerDate: '',
        result: '不採用',
        startDate: '',
        notes: ''
    },
    {
        id: 9,
        applyDate: '2025-05-08',
        store: '神戸北',
        name: '西田 紗由理',
        gender: '女性',
        age: 44,
        position: 'スタイリスト',
        employmentType: '',
        source: 'リジョブ',
        fee: '¥231,000',
        interviewDate: '2025-05-10',
        offerDate: '',
        result: '辞退',
        startDate: '',
        notes: ''
    },
    {
        id: 10,
        applyDate: '2025-05-12',
        store: '今治',
        name: '矢野 元美',
        gender: '女性',
        age: 57,
        position: 'スタイリスト',
        employmentType: '正社員',
        source: '自社 （ジェイシティ）',
        fee: '0円',
        interviewDate: '2025-05-15',
        offerDate: '',
        result: '採用',
        startDate: '2025-05-20',
        notes: ''
    },
    {
        id: 11,
        applyDate: '2025-05-14',
        store: '寝屋川',
        name: '上門 明子',
        gender: '女性',
        age: 54,
        position: '',
        employmentType: 'パート・アルバイト',
        source: 'ジョブメドレー',
        fee: '¥220,000',
        interviewDate: '2025-05-15',
        offerDate: '',
        result: '不採用',
        startDate: '',
        notes: ''
    },
    {
        id: 12,
        applyDate: '2025-05-16',
        store: '二条',
        name: '長田 容子',
        gender: '女性',
        age: 49,
        position: 'スタイリスト',
        employmentType: '正社員',
        source: 'バイトルPRO',
        fee: '¥220,000',
        interviewDate: '2025-05-22',
        offerDate: '',
        result: '選考中',
        startDate: '',
        notes: ''
    }
];

// データストレージクラス
class DataManager {
    constructor() {
        this.currentData = {};
        this.archiveData = {};
        this.nextId = 1;
        
        // ローカルストレージからデータを読み込む
        this.loadFromStorage();
        
        // データが空の場合は初期データをセット
        if (Object.keys(this.currentData).length === 0) {
            this.currentData = {
                '2025-05': initialData
            };
            this.saveToStorage();
        }
        
        // 次のIDを設定
        this.updateNextId();
    }
    
    // ローカルストレージからデータをロード
    loadFromStorage() {
        const currentDataJson = localStorage.getItem('beautyRecruitCurrentData');
        const archiveDataJson = localStorage.getItem('beautyRecruitArchiveData');
        
        if (currentDataJson) {
            this.currentData = JSON.parse(currentDataJson);
        } else {
            this.currentData = {};
        }
        
        if (archiveDataJson) {
            this.archiveData = JSON.parse(archiveDataJson);
        } else {
            this.archiveData = {};
        }
    }
    
    // ローカルストレージにデータを保存
    saveToStorage() {
        localStorage.setItem('beautyRecruitCurrentData', JSON.stringify(this.currentData));
        localStorage.setItem('beautyRecruitArchiveData', JSON.stringify(this.archiveData));
    }
    
    // 次のIDを更新
    updateNextId() {
        let maxId = 0;
        
        // 現在のデータから最大IDを探す
        Object.values(this.currentData).forEach(monthData => {
            monthData.forEach(entry => {
                if (entry.id > maxId) {
                    maxId = entry.id;
                }
            });
        });
        
        // アーカイブデータからも最大IDを探す
        Object.values(this.archiveData).forEach(monthData => {
            monthData.forEach(entry => {
                if (entry.id > maxId) {
                    maxId = entry.id;
                }
            });
        });
        
        this.nextId = maxId + 1;
    }
    
    // 現在の月のデータを取得
    getCurrentMonthData() {
        const currentYearMonth = this.getCurrentYearMonth();
        return this.getMonthData(currentYearMonth);
    }
    
    // 特定の月のデータを取得
    getMonthData(yearMonth) {
        if (this.currentData[yearMonth]) {
            return [...this.currentData[yearMonth]];
        }
        
        if (this.archiveData[yearMonth]) {
            return [...this.archiveData[yearMonth]];
        }
        
        return [];
    }
    
    // 現在の年月を取得（YYYY-MM形式）
    getCurrentYearMonth() {
        return '2025-05'; // 現在は2025年5月
    }
    
    // 新しいアプリケーションを追加
    addApplication(data) {
        const yearMonth = this.getCurrentYearMonth();
        
        if (!this.currentData[yearMonth]) {
            this.currentData[yearMonth] = [];
        }
        
        const newApplication = {
            ...data,
            id: this.nextId++
        };
        
        this.currentData[yearMonth].push(newApplication);
        this.saveToStorage();
        
        return newApplication;
    }
    
    // アプリケーションを更新
    updateApplication(id, data) {
        const yearMonth = this.getCurrentYearMonth();
        
        if (!this.currentData[yearMonth]) {
            return null;
        }
        
        const index = this.currentData[yearMonth].findIndex(app => app.id === id);
        
        if (index === -1) {
            return null;
        }
        
        const updatedApplication = {
            ...this.currentData[yearMonth][index],
            ...data
        };
        
        this.currentData[yearMonth][index] = updatedApplication;
        this.saveToStorage();
        
        return updatedApplication;
    }
    
    // アプリケーションを削除
    deleteApplication(id) {
        const yearMonth = this.getCurrentYearMonth();
        
        if (!this.currentData[yearMonth]) {
            return false;
        }
        
        const index = this.currentData[yearMonth].findIndex(app => app.id === id);
        
        if (index === -1) {
            return false;
        }
        
        this.currentData[yearMonth].splice(index, 1);
        this.saveToStorage();
        
        return true;
    }
    
    // 新しい月のデータを作成
    createNewMonth(yearMonth) {
        if (this.currentData[yearMonth] || this.archiveData[yearMonth]) {
            return false; // すでに存在する場合
        }
        
        this.currentData[yearMonth] = [];
        this.saveToStorage();
        
        return true;
    }
    
    // 月のデータをアーカイブに移動
    archiveMonth(yearMonth) {
        if (!this.currentData[yearMonth]) {
            return false;
        }
        
        this.archiveData[yearMonth] = [...this.currentData[yearMonth]];
        delete this.currentData[yearMonth];
        this.saveToStorage();
        
        return true;
    }
    
    // すべての年月のリストを取得
    getAllMonths() {
        const months = [
            ...Object.keys(this.currentData),
            ...Object.keys(this.archiveData)
        ];
        
        // 重複を削除
        const uniqueMonths = [...new Set(months)];
        
        // 日付順にソート（新しい順）
        return uniqueMonths.sort().reverse();
    }
    
    // 月別の統計データを取得
    getMonthlyStats(year) {
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        const result = {
            applications: Array(12).fill(0),
            hired: Array(12).fill(0),
            costs: Array(12).fill(0)
        };
        
        months.forEach((month, index) => {
            const yearMonth = `${year}-${month}`;
            const monthData = this.getMonthData(yearMonth);
            
            if (monthData.length > 0) {
                result.applications[index] = monthData.length;
                
                monthData.forEach(app => {
                    if (app.result === '採用') {
                        result.hired[index]++;
                        
                        // コストを加算
                        const fee = this.parseFee(app.fee);
                        result.costs[index] += fee;
                    }
                });
            }
        });
        
        return result;
    }
    
    // 応募経路別の統計データを取得
    getSourceStats(year) {
        const sourceCounts = {};
        
        // 年のデータを取得
        for (let i = 1; i <= 12; i++) {
            const month = i < 10 ? `0${i}` : `${i}`;
            const yearMonth = `${year}-${month}`;
            const monthData = this.getMonthData(yearMonth);
            
            monthData.forEach(app => {
                if (app.result === '採用') {
                    if (!sourceCounts[app.source]) {
                        sourceCounts[app.source] = 0;
                    }
                    sourceCounts[app.source]++;
                }
            });
        }
        
        // 結果を配列に変換
        const result = Object.entries(sourceCounts).map(([source, count]) => {
            return { source, count };
        });
        
        // 数が多い順にソート
        return result.sort((a, b) => b.count - a.count);
    }
    
    // 店舗別の統計データを取得
    getStoreStats(year) {
        const storeCounts = {};
        
        // 年のデータを取得
        for (let i = 1; i <= 12; i++) {
            const month = i < 10 ? `0${i}` : `${i}`;
            const yearMonth = `${year}-${month}`;
            const monthData = this.getMonthData(yearMonth);
            
            monthData.forEach(app => {
                if (app.result === '採用') {
                    if (!storeCounts[app.store]) {
                        storeCounts[app.store] = 0;
                    }
                    storeCounts[app.store]++;
                }
            });
        }
        
        // 結果を配列に変換
        const result = Object.entries(storeCounts).map(([store, count]) => {
            return { store, count };
        });
        
        // 数が多い順にソート
        return result.sort((a, b) => b.count - a.count);
    }
    
    // 報酬金額をパース（数値に変換）
    parseFee(feeStr) {
        if (!feeStr) return 0;
        
        // 通貨記号や区切り文字を削除
        const numericValue = feeStr.replace(/[¥,円]/g, '');
        
        // 数値に変換
        return Number(numericValue) || 0;
    }
}

// DataManagerのインスタンスを作成
const dataManager = new DataManager();