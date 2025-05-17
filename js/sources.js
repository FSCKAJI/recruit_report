// js/sources.js - 応募経路の管理を担当

// 応募経路の初期データ
const initialSources = [
    'リジョブ',
    'ジョブメドレー',
    'ワークキャンバス',
    'バイトルPRO',
    'キレイビズ',
    'しゅふJOB',
    'ビューティーキャリア',
    'タイミー',
    'シェアフル',
    '自社 （ジェイシティ）',
    'WEB説明会',
    '公式LINE',
    'indeed',
    '求人ボックス',
    'エンゲージ',
    'ハローワーク',
    'instagram',
    '電話',
    '紹介',
    '出戻り',
    'ビューティーミライ'
];

// 応募経路管理クラス
class SourceManager {
    constructor() {
        this.sources = [];
        
        // ローカルストレージからデータを読み込む
        this.loadFromStorage();
        
        // データが空の場合は初期データをセット
        if (this.sources.length === 0) {
            this.sources = [...initialSources];
            this.saveToStorage();
        }
    }
    
    // ローカルストレージからデータをロード
    loadFromStorage() {
        const sourcesJson = localStorage.getItem('beautyRecruitSources');
        if (sourcesJson) {
            this.sources = JSON.parse(sourcesJson);
        }
    }
    
    // ローカルストレージにデータを保存
    saveToStorage() {
        localStorage.setItem('beautyRecruitSources', JSON.stringify(this.sources));
    }
    
    // すべての応募経路を取得
    getAllSources() {
        return [...this.sources];
    }
    
    // 応募経路の追加
    addSource(name) {
        // 既に同じ名前の応募経路が存在するかチェック
        if (this.sources.includes(name)) {
            return false;
        }
        
        this.sources.push(name);
        this.sources.sort((a, b) => a.localeCompare(b, 'ja'));
        this.saveToStorage();
        
        return true;
    }
    
    // 応募経路の更新
    updateSource(oldName, newName) {
        // 変更先の名前が既に存在する場合（自分自身は除く）
        if (oldName !== newName && this.sources.includes(newName)) {
            return false;
        }
        
        const index = this.sources.indexOf(oldName);
        if (index === -1) {
            return false;
        }
        
        this.sources[index] = newName;
        this.sources.sort((a, b) => a.localeCompare(b, 'ja'));
        this.saveToStorage();
        
        return true;
    }
    
    // 応募経路の削除
    deleteSource(name) {
        const index = this.sources.indexOf(name);
        if (index === -1) {
            return false;
        }
        
        this.sources.splice(index, 1);
        this.saveToStorage();
        
        return true;
    }
}

// SourceManagerのインスタンスを作成
const sourceManager = new SourceMana