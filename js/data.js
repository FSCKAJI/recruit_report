// 応募者データとグローバル変数の定義

// 月ごとのデータ構造
const monthlyData = {
    '2025-05': [
        {
            id: 1,
            applicationDate: '2024-05-01',
            storeName: '北島（ＯＰＥＮ後 徳島へ）',
            name: '山下 那奈',
            gender: '女性',
            age: 28,
            jobTitle: 'スタイリスト',
            employmentType: '正社員',
            applicationSource: '紹介',
            referralFee: '0円',
            interviewDate: '2024-05-03',
            status: '採用',
            startDate: '2024-06-01',
            notes: ''
        },
        {
            id: 2,
            applicationDate: '2024-05-01',
            storeName: 'カットオン長田',
            name: '阿慶田 真希',
            gender: '女性',
            age: 54,
            jobTitle: 'スタイリスト',
            employmentType: '正社員',
            applicationSource: 'リジョブ',
            referralFee: '¥264,000',
            interviewDate: '2024-05-19',
            status: '辞退',
            startDate: '',
            notes: '現地辞退'
        },
        {
            id: 3,
            applicationDate: '2024-05-01',
            storeName: '宇多津',
            name: '小川 眞由美',
            gender: '女性',
            age: 61,
            jobTitle: 'スタイリスト',
            employmentType: 'パート・アルバイト',
            applicationSource: 'バイトルPRO',
            referralFee: '¥150,000',
            interviewDate: '2024-05-12',
            status: '不採用',
            startDate: '',
            notes: 'ブランクが長すぎるため・採用費がかかるため不採用'
        },
        {
            id: 4,
            applicationDate: '2024-05-01',
            storeName: '東原',
            name: '山本 鈴奈',
            gender: '女性',
            age: null,
            jobTitle: 'スタイリスト',
            employmentType: 'パート・アルバイト',
            applicationSource: 'ジョブメドレー',
            referralFee: '¥220,000',
            interviewDate: '2024-05-05',
            status: '採用',
            startDate: '2024-05-08',
            notes: ''
        },
        {
            id: 5,
            applicationDate: '2024-05-08',
            storeName: '富久',
            name: '中本 彩香',
            gender: '女性',
            age: 45,
            jobTitle: 'スタイリスト',
            employmentType: 'パート・アルバイト',
            applicationSource: '自社 （ジェイシティ）',
            referralFee: '0円',
            interviewDate: '2024-05-12',
            status: '採用',
            startDate: '2024-07-01',
            notes: ''
        },
        {
            id: 6,
            applicationDate: '2024-05-02',
            storeName: '国分',
            name: '吉田 理恵子',
            gender: '女性',
            age: 58,
            jobTitle: 'スタイリスト',
            employmentType: 'パート・アルバイト',
            applicationSource: 'ビューティーミライ',
            referralFee: '¥275,000',
            interviewDate: '2024-05-09',
            status: '辞退',
            startDate: '',
            notes: ''
        },
        {
            id: 7,
            applicationDate: '2024-05-03',
            storeName: '西阿知',
            name: '岡本 祐八',
            gender: '男性',
            age: 45,
            jobTitle: 'スタイリスト',
            employmentType: '正社員',
            applicationSource: 'リジョブ',
            referralFee: '¥231,000',
            interviewDate: '2024-05-06',
            status: '辞退',
            startDate: '',
            notes: ''
        },
        {
            id: 8,
            applicationDate: '2024-05-06',
            storeName: 'LALA',
            name: '小林 直美',
            gender: '女性',
            age: 56,
            jobTitle: 'スタイリスト',
            employmentType: 'パート・アルバイト',
            applicationSource: 'ジョブメドレー',
            referralFee: '¥220,000',
            interviewDate: '2024-05-08',
            status: '不採用',
            startDate: '',
            notes: ''
        },
        {
            id: 9,
            applicationDate: '2024-05-08',
            storeName: '神戸北',
            name: '西田 紗由理',
            gender: '女性',
            age: 44,
            jobTitle: 'スタイリスト',
            employmentType: '',
            applicationSource: 'リジョブ',
            referralFee: '¥231,000',
            interviewDate: '2024-05-10',
            status: '辞退',
            startDate: '',
            notes: ''
        },
        {
            id: 10,
            applicationDate: '2024-05-12',
            storeName: '今治',
            name: '矢野 元美',
            gender: '女性',
            age: 57,
            jobTitle: 'スタイリスト',
            employmentType: '正社員',
            applicationSource: '自社 （ジェイシティ）',
            referralFee: '0円',
            interviewDate: '2024-05-15',
            status: '採用',
            startDate: '2024-05-20',
            notes: ''
        },
        {
            id: 11,
            applicationDate: '2024-05-14',
            storeName: '寝屋川',
            name: '上門 明子',
            gender: '女性',
            age: 54,
            jobTitle: '',
            employmentType: 'パート・アルバイト',
            applicationSource: 'ジョブメドレー',
            referralFee: '¥220,000',
            interviewDate: '2024-05-15',
            status: '不採用',
            startDate: '',
            notes: ''
        },
        {
            id: 12,
            applicationDate: '2024-05-16',
            storeName: '二条',
            name: '長田 容子',
            gender: '女性',
            age: 49,
            jobTitle: 'スタイリスト',
            employmentType: '正社員',
            applicationSource: 'バイトルPRO',
            referralFee: '¥220,000',
            interviewDate: '2024-05-22',
            status: '選考中',
            startDate: '',
            notes: ''
        }
    ],
    '2025-04': [],
    '2025-03': []
};

// 現在選択されている月
let currentMonth = '2025-05';

// 現在のフィルター
let currentFilter = 'all';

// 現在の店舗フィルター
let currentStoreFilter = 'all';

// 現在の検索テキスト
let currentSearch = '';

// 現在のソート順
let currentSort = 'desc'; // デフォルトは新しい順（降順）

// 現在編集中の応募者ID
let currentEditId = null;

// ソースに対応するバッジクラス
const sourceBadgeClasses = {
    'リジョブ': 'rijob',
    'ジョブメドレー': 'jobmedley',
    'バイトルPRO': 'baitoru',
    '自社 （ジェイシティ）': 'jcity',
    'ビューティーミライ': 'beauty',
    '紹介': 'referral'
};

// ステータスに対応するバッジクラス
const statusBadgeClasses = {
    '採用': 'hired',
    '不採用': 'rejected',
    '選考中': 'pending',
    '辞退': 'canceled'
};