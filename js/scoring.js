// Scoring System - Handles point calculation

function calculateBonus(timeRemaining) {
    // timeRemaining is in seconds (0-10)
    // If answered within 5 seconds, get bonus points
    // 1 second = 1 bonus point (max 5 points)
    
    const timeUsed = 10 - timeRemaining;
    
    if (timeUsed <= 5) {
        // Bonus = 5 - (time_used - 1) = 6 - time_used
        return Math.max(0, 6 - timeUsed);
    }
    
    return 0;
}

function getPointsForAnswer(correct, timeRemaining) {
    if (!correct) {
        return { standard: 0, bonus: 0 };
    }
    
    const standardPoints = 10;
    const bonusPoints = calculateBonus(timeRemaining);
    
    return {
        standard: standardPoints,
        bonus: bonusPoints,
        total: standardPoints + bonusPoints
    };
}

function updateScoreDisplay(standardScore, bonusScore) {
    const standardDisplay = document.getElementById('standardScore');
    const bonusDisplay = document.getElementById('bonusScore');
    
    if (standardDisplay) {
        standardDisplay.textContent = standardScore;
    }
    if (bonusDisplay) {
        bonusDisplay.textContent = bonusScore;
    }
}

// Example scoring scenarios for reference:
// Answer within 1 second: standard 10 + bonus 5 = 15 points
// Answer within 2 seconds: standard 10 + bonus 4 = 14 points
// Answer within 3 seconds: standard 10 + bonus 3 = 13 points
// Answer within 4 seconds: standard 10 + bonus 2 = 12 points
// Answer within 5 seconds: standard 10 + bonus 1 = 11 points
// Answer within 6-10 seconds: standard 10 + bonus 0 = 10 points
// Wrong answer: 0 points
