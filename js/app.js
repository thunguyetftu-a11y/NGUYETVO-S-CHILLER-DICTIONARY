// Main Application Logic
class ChillerLearningApp {
    constructor() {
        this.playerName = '';
        this.selectedGroups = [];
        this.currentQuestionIndex = 0;
        this.allQuestions = [];
        this.scores = {
            standard: 0,
            bonus: 0
        };
        this.answers = [];
        this.quizStartTime = null;
        this.quizEndTime = null;
        this.correctCount = 0;
        this.init();
    }

    init() {
        this.loadQuestions();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Welcome Screen
        document.getElementById('startBtn').addEventListener('click', () => this.startLearning());
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startLearning();
        });

        // Rules Screen
        document.getElementById('rulesBackBtn').addEventListener('click', () => this.backToWelcome());
        document.getElementById('rulesOkBtn').addEventListener('click', () => this.goToGroupSelection());
        document.getElementById('rulesInfoBtn').addEventListener('click', () => this.showRules());

        // Group Selection
        document.getElementById('beginQuizBtn').addEventListener('click', () => this.startQuiz());
        document.getElementById('homeBtn').addEventListener('click', () => this.goHome());

        // Quiz Screen
        document.getElementById('exitBtn').addEventListener('click', () => this.exitQuiz());

        // Results Screen
        document.getElementById('playAgainBtn').addEventListener('click', () => this.playAgain());
        document.getElementById('changeGroupsBtn').addEventListener('click', () => this.changeGroups());
        document.getElementById('homeResultsBtn').addEventListener('click', () => this.goHome());
    }

    loadQuestions() {
        // Load questions from JSON with cache busting
        fetch('data/questions.json?v=' + new Date().getTime())
            .then(response => response.json())
            .then(data => {
                this.questionsData = data;
                this.renderGroups();
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    renderGroups() {
        const groupsList = document.getElementById('groupsList');
        groupsList.innerHTML = '';

        this.questionsData.groups.forEach(group => {
            const groupCard = document.createElement('div');
            groupCard.className = 'group-card';
            groupCard.innerHTML = `
                <h3>${group.name}</h3>
                <p>${group.description}</p>
                <p style="margin-top: 8px; font-size: 12px; color: #0066cc;">${group.questions.length} questions</p>
            `;
            groupCard.addEventListener('click', () => this.toggleGroup(group.id, groupCard));
            groupsList.appendChild(groupCard);
        });
    }

    toggleGroup(groupId, element) {
        element.classList.toggle('selected');
        if (this.selectedGroups.includes(groupId)) {
            this.selectedGroups = this.selectedGroups.filter(id => id !== groupId);
        } else {
            this.selectedGroups.push(groupId);
        }

        // Enable/disable begin button
        const beginBtn = document.getElementById('beginQuizBtn');
        beginBtn.disabled = this.selectedGroups.length === 0;
    }

    startLearning() {
        const playerName = document.getElementById('playerName').value.trim();
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }
        this.playerName = playerName;
        this.switchScreen('welcomeScreen', 'rulesScreen');
    }

    showRules() {
        this.switchScreen('groupSelectionScreen', 'rulesScreen');
    }

    backToWelcome() {
        this.switchScreen('rulesScreen', 'welcomeScreen');
        document.getElementById('playerName').value = '';
    }

    goToGroupSelection() {
        this.switchScreen('rulesScreen', 'groupSelectionScreen');
    }

    startQuiz() {
        // Collect all questions from selected groups
        this.allQuestions = [];
        this.questionsData.groups.forEach(group => {
            if (this.selectedGroups.includes(group.id)) {
                this.allQuestions.push(...group.questions);
            }
        });

        // Shuffle questions
        this.allQuestions = this.shuffleArray(this.allQuestions);

        this.currentQuestionIndex = 0;
        this.scores = { standard: 0, bonus: 0 };
        this.answers = [];
        this.correctCount = 0;
        this.quizStartTime = Date.now();
        this.quizEndTime = null;

        this.switchScreen('groupSelectionScreen', 'quizScreen');
        this.displayQuestion();
    }

    playAgain() {
        // Shuffle questions again for play again
        this.allQuestions = this.shuffleArray(this.allQuestions);
        this.scores = { standard: 0, bonus: 0 };
        this.answers = [];
        this.correctCount = 0;
        this.currentQuestionIndex = 0;
        this.quizStartTime = Date.now();
        this.quizEndTime = null;
        this.switchScreen('resultsScreen', 'quizScreen');
        this.displayQuestion();
    }

    changeGroups() {
        this.selectedGroups = [];
        this.scores = { standard: 0, bonus: 0 };
        this.answers = [];
        this.correctCount = 0;
        document.querySelectorAll('.group-card').forEach(card => card.classList.remove('selected'));
        document.getElementById('beginQuizBtn').disabled = true;
        this.switchScreen('resultsScreen', 'groupSelectionScreen');
    }

    goHome() {
        this.selectedGroups = [];
        this.scores = { standard: 0, bonus: 0 };
        this.answers = [];
        this.correctCount = 0;
        this.playerName = '';
        document.querySelectorAll('.group-card').forEach(card => card.classList.remove('selected'));
        document.getElementById('beginQuizBtn').disabled = true;
        document.getElementById('playerName').value = '';
        this.switchScreen('groupSelectionScreen', 'welcomeScreen');
    }

    exitQuiz() {
        if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
            this.goHome();
        }
    }

    switchScreen(fromId, toId) {
        document.getElementById(fromId).classList.remove('active');
        document.getElementById(toId).classList.add('active');
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.allQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.allQuestions[this.currentQuestionIndex];
        const total = this.allQuestions.length;

        // Update question info
        document.getElementById('questionNumber').textContent = 
            `Question ${this.currentQuestionIndex + 1}/${total}`;
        document.getElementById('questionText').textContent = question.question;

        // Update scores display
        document.getElementById('standardScore').textContent = this.scores.standard;
        document.getElementById('bonusScore').textContent = this.scores.bonus;

        // Render options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        const options = this.shuffleArray(question.options.map((opt, idx) => ({ text: opt, index: idx })));

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-option';
            btn.textContent = option.text;
            btn.addEventListener('click', () => this.handleAnswer(option.index, question.correct));
            optionsContainer.appendChild(btn);
        });

        // Start timer
        startTimer(10, () => this.nextQuestion());
    }

    handleAnswer(selectedIndex, correctIndex) {
        const timeRemaining = getTimeRemaining();
        const isCorrect = selectedIndex === correctIndex;

        if (isCorrect) {
            const bonusPoints = calculateBonus(timeRemaining);
            this.scores.standard += 10;
            this.scores.bonus += bonusPoints;
            this.correctCount++;
            this.answers.push({ correct: true, timeRemaining, bonusPoints });
        } else {
            this.answers.push({ correct: false });
        }

        // Highlight the answer
        const buttons = document.querySelectorAll('.btn-option');
        buttons.forEach((btn, idx) => {
            if (idx === correctIndex) {
                btn.classList.add('correct');
            } else if (btn.textContent === document.querySelectorAll('.btn-option')[selectedIndex]?.textContent) {
                btn.classList.add('incorrect');
            }
        });

        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);

        // Move to next question after delay
        setTimeout(() => this.nextQuestion(), 1500);
    }

    nextQuestion() {
        stopTimer();
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    showResults() {
        stopTimer();
        this.quizEndTime = Date.now();
        const totalScore = this.scores.standard + this.scores.bonus;
        const totalTimeSeconds = Math.floor((this.quizEndTime - this.quizStartTime) / 1000);
        const totalQuestions = this.allQuestions.length;

        document.getElementById('finalStandardScore').textContent = this.scores.standard;
        document.getElementById('finalBonusScore').textContent = this.scores.bonus;
        document.getElementById('finalTotalScore').textContent = totalScore;

        // Add statistics display
        const statsHTML = `
            <div class="stats-section">
                <h3>📊 Quiz Statistics</h3>
                <div class="stats-item">
                    <span class="stat-label">Correct Answers:</span>
                    <span class="stat-value">${this.correctCount}/${totalQuestions}</span>
                </div>
                <div class="stats-item">
                    <span class="stat-label">Accuracy:</span>
                    <span class="stat-value">${Math.round((this.correctCount / totalQuestions) * 100)}%</span>
                </div>
                <div class="stats-item">
                    <span class="stat-label">Total Time:</span>
                    <span class="stat-value">${this.formatTime(totalTimeSeconds)}</span>
                </div>
                <div class="stats-item">
                    <span class="stat-label">Average Time per Question:</span>
                    <span class="stat-value">${(totalTimeSeconds / totalQuestions).toFixed(1)}s</span>
                </div>
            </div>
        `;

        let resultsContent = document.querySelector('.results-content');
        let existingStats = resultsContent.querySelector('.stats-section');
        if (existingStats) {
            existingStats.remove();
        }
        
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.insertAdjacentHTML('beforebegin', statsHTML);

        // Show leaderboard
        this.updateLeaderboard(this.playerName, totalScore);

        this.switchScreen('quizScreen', 'resultsScreen');
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) {
            return `${secs}s`;
        }
        return `${mins}m ${secs}s`;
    }

    updateLeaderboard(playerName, score) {
        // Get leaderboard from localStorage
        let leaderboard = JSON.parse(localStorage.getItem('chillerLeaderboard')) || [];
        leaderboard.push({ name: playerName, score, date: new Date().toISOString() });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10); // Keep top 10
        localStorage.setItem('chillerLeaderboard', JSON.stringify(leaderboard));

        // Display leaderboard
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        leaderboard.forEach((entry, idx) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item' + (entry.name === playerName ? ' current' : '');
            item.innerHTML = `
                <span class="leaderboard-rank">#${idx + 1}</span>
                <span class="leaderboard-name">${entry.name}</span>
                <span class="leaderboard-score">${entry.score} pts</span>
            `;
            leaderboardList.appendChild(item);
        });
    }
}

// Timer management
let currentTimer = null;
let timerStartTime = null;

function startTimer(duration, onComplete) {
    timerStartTime = Date.now();
    const endTime = timerStartTime + (duration * 1000);
    const timerDisplay = document.getElementById('timer');
    const progressFill = document.getElementById('progressFill');

    currentTimer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
        timerDisplay.textContent = remaining + 's';
        progressFill.style.width = ((duration - remaining) / duration) * 100 + '%';

        if (remaining <= 3) {
            timerDisplay.classList.add('danger');
        } else {
            timerDisplay.classList.remove('danger');
        }

        if (remaining === 0) {
            stopTimer();
            onComplete();
        }
    }, 100);
}

function stopTimer() {
    if (currentTimer) {
        clearInterval(currentTimer);
        currentTimer = null;
    }
}

function getTimeRemaining() {
    if (!timerStartTime) return 10;
    const elapsed = Math.ceil((Date.now() - timerStartTime) / 1000);
    return Math.max(0, 10 - elapsed);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ChillerLearningApp();
});
