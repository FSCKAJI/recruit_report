// js/08_stats_calculator.js
// 統計情報（採用コスト合計、採用単価など）の計算

// --- コードの切れ目 (START 08_stats_calculator.js) ---

/**
 * 応募者データから統計情報を計算する
 * @param {Array} applicants - 計算対象の応募者データ配列 (特定の月のデータ)
 * @returns {Object} 計算された統計情報を含むオブジェクト
 * { totalApplicants, hiredApplicants, totalRecruitmentCost, costPerHire }
 */
function calculateStats(applicants) {
    if (!applicants || applicants.length === 0) {
        return {
            totalApplicants: 0,
            hiredApplicants: 0,
            totalRecruitmentCost: 0,
            costPerHire: 0
        };
    }

    const totalApplicants = applicants.length;
    let hiredApplicants = 0;
    let totalRecruitmentCost = 0;

    applicants.forEach(applicant => {
        if (applicant.status === '採用') {
            hiredApplicants++;
            if (typeof applicant.recruitmentCost === 'number') {
                totalRecruitmentCost += applicant.recruitmentCost;
            }
        }
    });

    const costPerHire = hiredApplicants > 0 ? totalRecruitmentCost / hiredApplicants : 0;

    return {
        totalApplicants: totalApplicants,
        hiredApplicants: hiredApplicants,
        totalRecruitmentCost: totalRecruitmentCost,
        costPerHire: Math.round(costPerHire) // 整数に丸める
    };
}

// --- コードの切れ目 (END 08_stats_calculator.js) ---