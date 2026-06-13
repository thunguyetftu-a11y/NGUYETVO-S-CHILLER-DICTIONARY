// Leaderboard Management

class Leaderboard {
    constructor() {
        this.scores = this.loadScores();
    }

    loadScores() {
        const stored = localStorage.getItem('chillerLeaderboard');
        return stored ? JSON.parse(stored) : [];
    }

    saveScores() {
        localStorage.setItem('chillerLeaderboard', JSON.stringify(this.scores));
    }

    addScore(playerName, score, groupsPlayed) {
        this.scores.push({
            id: this.generateId(),
            name: playerName,
            score: score,
            groups: groupsPlayed,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        });
        this.saveScores();
    }

    getTopScores(limit = 10) {
        return this.scores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    getPlayerRank(playerName, score) {
        const sorted = this.scores
            .sort((a, b) => b.score - a.score)
            .filter(s => s.score >= score);
        
        return sorted.length;
    }

    getPlayerStats(playerName) {
        const playerScores = this.scores.filter(s => s.name === playerName);
        return {
            totalPlays: playerScores.length,
            bestScore: Math.max(...playerScores.map(s => s.score)),
            averageScore: playerScores.length > 0 
                ? Math.round(playerScores.reduce((sum, s) => sum + s.score, 0) / playerScores.length)
                : 0,
            plays: playerScores
        };
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    clear() {
        this.scores = [];
        this.saveScores();
    }
}

// Render leaderboard HTML
function renderLeaderboard(leaderboardContainer, topScores, currentPlayer = null) {
    leaderboardContainer.innerHTML = '';

    topScores.forEach((entry, index) => {
        const row = document.createElement('div');
        row.className = 'leaderboard-item';
        
        if (currentPlayer && entry.name === currentPlayer) {
            row.classList.add('current');
        }

        row.innerHTML = `
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">${entry.name}</span>
            <span class="leaderboard-score">${entry.score} pts</span>
            <span class="leaderboard-date" style="font-size: 12px; color: #999;">${entry.date}</span>
        `;

        leaderboardContainer.appendChild(row);
    });
}
