// js/stores.js - 店舗リストの管理を担当

// 店舗リストの初期データ
const initialStores = [
    { name: '福山南本庄店', address: '広島県福山市南本庄4丁目2-2' },
    { name: '神戸長田店', address: '兵庫県神戸市長田区大橋町5丁目3-1' },
    { name: '寝屋川店', address: '大阪府寝屋川市日新町3-15' },
    { name: 'JR高槻駅前店', address: '大阪府高槻市紺屋町1-1 グリーンプラザたかつき1号館2階' },
    { name: '茨木中津店', address: '大阪府茨木市中津町18-23 プラザタツミ1-B' },
    { name: '京阪守口市駅京街道店', address: '大阪府守口市本町1-6-5' },
    { name: '阪急桂駅前店', address: '京都府京都市西京区川島有栖川町3 オリエントビル1階' },
    { name: '京都四条烏丸店', address: '京都府京都市中京区室町通蛸薬師下る山伏山町541' },
    { name: '京都亀屋丸太町店', address: '京都府京都市上京区油小路通中長者町上る134-2' },
    { name: '京都JR二条駅西口店', address: '' },
    { name: '広畑東新町店', address: '兵庫県姫路市広畑区東新町3-30-1' },
    { name: '兵庫別府店', address: '兵庫県加古川市別府町朝日町58' },
    { name: '加古川平野店', address: '兵庫県加古川市加古川町平野44-18' },
    { name: '板宿店', address: '兵庫県神戸市長田区庄山町1丁目4-21ドルフィンズマンション板宿108' },
    { name: '神戸駅北口店', address: '兵庫県神戸市中央区相生町4-5-16 神戸駅前ATビル2階' },
    { name: '大久保店', address: '兵庫県明石市大久保町大久保町634-1' },
    { name: '三木大村店', address: '兵庫県三木市大村175-1' },
    { name: 'ピフレ新長田店', address: '兵庫県神戸市長田区若松町4丁目2-15 ピフレ新長田2階' },
    { name: '岡山高島店', address: '岡山県岡山市中区清水2丁目98-7' },
    { name: '倉敷西阿知店', address: '岡山県倉敷市西阿知町17-1' },
    { name: '倉敷白壁通り店', address: '岡山県倉敷市南町3−3' },
    { name: '福山南蔵王店', address: '広島県福山市南蔵王町4丁目14-13' },
    { name: '福山三吉店', address: '広島県福山市三吉町3-7-19' },
    { name: '福山西新涯店', address: '広島県福山市西新涯町1-11-2' },
    { name: '福山駅家店', address: '広島県福山市駅家町大字近田222-4' },
    { name: '尾道新浜店', address: '広島県尾道市新浜1丁目7-38' },
    { name: '東広島西条中央店', address: '東広島市西条中央5丁目7-1' },
    { name: '広島可部店', address: '広島県広島市安佐北区亀山2丁目1-29 谷口ビル101' },
    { name: '広島高陽店', address: '広島市安佐北区口田1-1-19' },
    { name: '広島府中店', address: '安芸郡府中町本町2丁目9-30' },
    { name: '広島東原店', address: '広島市安佐南区東原1-3-1' },
    { name: '広島段原店', address: '広島市南区段原南1-3-52 広島イオン6階' },
    { name: '広島舟入幸町店', address: '広島市中区舟入幸町5-16 ESビル1階' },
    { name: '広島庚午橋店', address: '広島市西区庚午中4丁目4-33' },
    { name: '広島八幡東店', address: '広島市佐伯区八幡東3丁目26-20-1' },
    { name: '藤三広店', address: '広島県呉市広本町3丁目12番1号(火曜日定休)' },
    { name: 'ゆめタウン南岩国店', address: '山口県岩国市南岩国町1丁目20-30' },
    { name: 'ゆめタウン宇部店', address: '山口県宇部市黒石北3丁目4−1' },
    { name: '松山東石井店', address: '愛媛県松山市東石井3丁目9-11' },
    { name: '松山富久店', address: '愛媛県松山市富久町383-1' },
    { name: '松山道後北代店', address: '愛媛県松山市道後北代6番7号 シャルマン道後1階' },
    { name: '松山鴨川店', address: '愛媛県松山市鴨川1丁目6-31' },
    { name: '松山山西店', address: '' },
    { name: '今治ワールドプラザ前店', address: '愛媛県今治市拝志4-1' },
    { name: '高松勅使店', address: '香川県高松市勅使町558-4' },
    { name: '高松松縄店', address: '香川県高松市松縄町34-7' },
    { name: '丸亀土器店', address: '香川県丸亀市土器町東1-785-3' },
    { name: 'イオンタウン宇多津店', address: '香川県綾歌郡宇多津町浜二番丁16 イオンタウン宇多津2F' },
    { name: '徳島イオンタウン北島店', address: '徳島県板野郡北島町高房字川ノ上2-1' },
    { name: 'ゆめタウン徳島店', address: '徳島県板野郡藍住町奥野東中須８８−１' },
    { name: '久留米国分店', address: '福岡県久留米市国分町1447-1' },
    { name: '久留米小森野店', address: '福岡県久留米市小森野1丁目6-15' },
    { name: '福岡イオン小郡店', address: '福岡県小郡市大保字弓場110 イオン小郡店内1階' },
    { name: '鳥栖蔵上店', address: '佐賀県鳥栖市蔵上4-103' },
    { name: 'LALA', address: '' },
    { name: '神戸北', address: '' },
    { name: '今治', address: '' },
    { name: '二条', address: '' },
    { name: '富久', address: '' },
    { name: '国分', address: '' },
    { name: '西阿知', address: '' },
    { name: '北島（ＯＰＥＮ後徳島へ）', address: '' },
    { name: 'カットオン長田', address: '' },
    { name: '宇多津', address: '' }
];

// 店舗管理クラス
class StoreManager {
    constructor() {
        this.stores = [];
        
        // ローカルストレージからデータを読み込む
        this.loadFromStorage();
        
        // データが空の場合は初期データをセット
        if (this.stores.length === 0) {
            this.stores = [...initialStores];
            this.saveToStorage();
        }
    }
    
    // ローカルストレージからデータをロード
    loadFromStorage() {
        const storesJson = localStorage.getItem('beautyRecruitStores');
        if (storesJson) {
            this.stores = JSON.parse(storesJson);
        }
    }
    
    // ローカルストレージにデータを保存
    saveToStorage() {
        localStorage.setItem('beautyRecruitStores', JSON.stringify(this.stores));
    }
    
    // すべての店舗を取得
    getAllStores() {
        return [...this.stores];
    }
    
    // 店舗名のリストを取得（セレクトボックス用）
    getStoreNames() {
        return this.stores.map(store => store.name);
    }
    
    // 店舗の追加
    addStore(name, address) {
        // 既に同じ名前の店舗が存在するかチェック
        if (this.stores.some(store => store.name === name)) {
            return false;
        }
        
        this.stores.push({ name, address });
        this.stores.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
        this.saveToStorage();
        
        return true;
    }
    
    // 店舗の更新
    updateStore(oldName, newName, address) {
        // 変更先の名前が既に存在する場合（自分自身は除く）
        if (oldName !== newName && this.stores.some(store => store.name === newName)) {
            return false;
        }
        
        const index = this.stores.findIndex(store => store.name === oldName);
        if (index === -1) {
            return false;
        }
        
        this.stores[index] = { name: newName, address };
        this.stores.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
        this.saveToStorage();
        
        return true;
    }
    
    // 店舗の削除
    deleteStore(name) {
        const index = this.stores.findIndex(store => store.name === name);
        if (index === -1) {
            return false;
        }
        
        this.stores.splice(index, 1);
        this.saveToStorage();
        
        return true;
    }
    
    // 店舗の住所を取得
    getStoreAddress(name) {
        const store = this.stores.find(store => store.name === name);
        return store ? store.address : '';
    }
}

// StoreManagerのインスタンスを作成
const storeManager = new StoreMa