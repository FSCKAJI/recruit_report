// グラフ関連の機能

// グラフ初期化用変数
let applicantsChart = null;

// グラフ初期化
function initCharts() {
    const ctx = document.getElementById('applicantsChart').getContext('2d');
    
    applicantsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['3月', '4月', '5月', '6月', '7月', '8月'],
            datasets: [
                {
                    label: '応募者数',
                    data: [0, 0, 12, 0, 0, 0],
                    backgroundColor: 'rgba(52, 152, 219, 0.5)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                },
                {
                    label: '採用数',
                    data: [0, 0, 6, 0, 0, 0],
                    backgroundColor: 'rgba(46, 204, 113, 0.5)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '人数'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '月'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '月別応募者・採用者数',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
    
    // 店舗別分析データを初期化
    updateStoreAnalyticsData();
}

// グラフを更新
function updateChart(chartType) {
    if (chartType === 'applicants') {
        // 応募者集計グラフ
        applicantsChart.data.datasets = [
            {
                label: '応募者数',
                data: [0, 0, 12, 0, 0, 0],
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            },
            {
                label: '採用数',
                data: [0, 0, 6, 0, 0, 0],
                backgroundColor: 'rgba(46, 204, 113, 0.5)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }
        ];
        applicantsChart.options.plugins.title.text = '月別応募者・採用者数';
        applicantsChart.options.scales = {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '人数'
                }
            },
            x: {
                title: {
                    display: true,
                    text: '月'
                }
            }
        };
        
    } else if (chartType === 'source') {
        // 応募経路分析グラフ
        applicantsChart.data.datasets = [
            {
                label: 'リジョブ',
                data: [0, 0, 3, 0, 0, 0],
                backgroundColor: 'rgba(241, 196, 15, 0.5)',
                borderColor: 'rgba(241, 196, 15, 1)',
                borderWidth: 1
            },
            {
                label: 'ジョブメドレー',
                data: [0, 0, 3, 0, 0, 0],
                backgroundColor: 'rgba(230, 126, 34, 0.5)',
                borderColor: 'rgba(230, 126, 34, 1)',
                borderWidth: 1
            },
            {
                label: 'バイトルPRO',
                data: [0, 0, 2, 0, 0, 0],
                backgroundColor: 'rgba(231, 76, 60, 0.5)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            },
            {
                label: '自社・紹介',
                data: [0, 0, 3, 0, 0, 0],
                backgroundColor: 'rgba(155, 89, 182, 0.5)',
                borderColor: 'rgba(155, 89, 182, 1)',
                borderWidth: 1
            },
            {
                label: 'その他',
                data: [0, 0, 1, 0, 0, 0],
                backgroundColor: 'rgba(149, 165, 166, 0.5)',
                borderColor: 'rgba(149, 165, 166, 1)',
                borderWidth: 1
            }
        ];
        applicantsChart.options.plugins.title.text = '応募経路別応募者数';
        applicantsChart.options.scales = {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '人数'
                }
            },
            x: {
                title: {
                    display: true,
                    text: '月'
                }
            }
        };
        
    } else if (chartType === 'cost') {
        // コスト分析グラフ
        applicantsChart.data.datasets = [
            {
                label: '採用コスト合計',
                data: [0, 0, 660000, 0, 0, 0],
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1,
                type: 'bar',
                yAxisID: 'y'
            },
            {
                label: '採用単価',
                data: [0, 0, 110000, 0, 0, 0],
                backgroundColor: 'rgba(231, 76, 60, 0.5)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 2,
                type: 'line',
                yAxisID: 'y1'
            }
        ];
        applicantsChart.options.scales = {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '採用コスト合計'
                },
                position: 'left'
            },
            y1: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '採用単価'
                },
                position: 'right',
                grid: {
                    drawOnChartArea: false
                }
            },
            x: {
                title: {
                    display: true,
                    text: '月'
                }
            }
        };
        applicantsChart.options.plugins.title.text = '月別採用コスト分析';
    } else if (chartType === 'stores') {
        // 店舗別分析グラフ
        // このグラフデータは updateStoreAnalyticsData() で更新されます
        updateStoreAnalyticsData();
        return; // すでにupdateStoreAnalyticsData()内でchart.update()が呼ばれているので、ここではreturn
    }
    
    applicantsChart.update();
}

// 店舗別グラフを更新
function updateStoresChart(storeStats) {
    // 描画する店舗数を制限（多すぎるとグラフが見づらくなるため）
    const maxStores = 10;
    
    // 応募者総数で降順ソートした店舗リスト
    const sortedStores = Object.entries(storeStats)
        .filter(([_, stats]) => stats.totalApplicants > 0)
        .sort((a, b) => b[1].totalApplicants - a[1].totalApplicants)
        .slice(0, maxStores);
    
    const labels = sortedStores.map(([name]) => name);
    const applicantsData = sortedStores.map(([_, stats]) => stats.totalApplicants);
    const hiredData = sortedStores.map(([_, stats]) => stats.hired);
    
    applicantsChart.data.labels = labels;
    applicantsChart.data.datasets = [
        {
            label: '応募者数',
            data: applicantsData,
            backgroundColor: 'rgba(52, 152, 219, 0.5)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
        },
        {
            label: '採用数',
            data: hiredData,
            backgroundColor: 'rgba(46, 204, 113, 0.5)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 1
        }
    ];
    
    applicantsChart.options.plugins.title.text = '店舗別応募者・採用者数';
    applicantsChart.options.scales.x.title.text = '店舗';
    applicantsChart.update();
}