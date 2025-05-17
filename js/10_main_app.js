// js/10_main_app.js
// アプリケーション全体の初期化、イベントリスナーの集約、各モジュールの連携

// --- コードの切れ目 (START 10_main_app.js) ---

let monthlyChartInstance = null; // 月別トレンドグラフのインスタンス

/**
 * 月別応募者数推移グラフを描画/更新する
 * Chart.js が必要です。HTML側で読み込んでください。
 */
function renderMonthlyTrendChart() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded. Skipping chart rendering.');
        const canvas = document.getElementById('monthlyTrendChart');
        if (canvas) {
             const ctx = canvas.getContext('2d');
             ctx.clearRect(0,0,canvas.width, canvas.height);
             ctx.font = "16px Arial";
             ctx.textAlign = "center";
             ctx.fillText("グラフ表示にはChart.jsが必要です。", canvas.width/2, canvas.height/2);
        }
        return;
    }

    const availableMonths = getAvailableMonths().sort(); // 古い順にソート
    if (availableMonths.length === 0) {
         if (monthlyChartInstance) {
            monthlyChartInstance.destroy();
            monthlyChartInstance = null;
        }
        return;
    }

    const labels = []; // X軸ラベル (月)
    const applicantCounts = []; // 応募者数
    const hiredCounts = []; // 採用数

    // 直近12ヶ月などの表示期間を設けることも可能
    // ここでは利用可能な全ての月のデータを表示
    availableMonths.forEach(monthKey => {
        const { year, month } = parseMonthKey(monthKey);
        labels.push(`${year}/${String(month).padStart(2, '0')}`);
        const monthData = getApplicantsForMonth(year, month);
        applicantCounts.push(monthData.length);
        hiredCounts.push(monthData.filter(app => app.status === '採用').length);
    });

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: '総応募者数',
                data: applicantCounts,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.1,
                fill: true,
            },
            {
                label: '採用数',
                data: hiredCounts,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true,
            }
        ]
    };

const config = {
    type: 'line',
    data: chartData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    padding: 10 // Y軸の目盛りラベルにパディングを追加
                }
            }
            // x軸の設定も必要であればここに追加
            // x: {
            //     ticks: {
            //         // X軸のラベルに関する設定
            //     }
            // }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false, // HTML側でタイトル設定済み
                text: '月別応募者数・採用数推移'
            }
        },
        layout: { // ← この layout オブジェクトを追加
            padding: {
                bottom: 10, // グラフ描画エリアの下部に10pxのパディング
                left: 5,    // (任意) 左側にも少しパディングがあるとY軸ラベルが見やすいかも
                right: 10   // (任意) 右側にもパディング
            }
        }
    }
};
    const canvas = document.getElementById('monthlyTrendChart');
    if (!canvas) {
        console.error("Chart canvas not found");
        return;
    }
    const ctx = canvas.getContext('2d');

    if (monthlyChartInstance) {
        monthlyChartInstance.destroy(); // 既存のグラフがあれば破棄
    }
    monthlyChartInstance = new Chart(ctx, config);
}


/**
 * アプリケーションの初期化処理
 */
function initializeApp() {
    loadAllApplicantsFromLocalStorage(); // 最初にデータをロード

    // 現在の日付を初期表示月とする
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth() + 1; // getMonthは0始まり

    populateDropdowns(); // フィルターとモーダルのプルダウンを設定
    updateDisplayedMonth(); // 最初のデータ表示
    // renderCurrentMonthData(); // updateDisplayedMonth内で呼ばれるので不要な場合あり

    console.log("応募者管理ダッシュボードが初期化されました。");
}

// DOMContentLoaded イベントで初期化を実行
document.addEventListener('DOMContentLoaded', initializeApp);

// --- コードの切れ目 (END 10_main_app.js) ---
