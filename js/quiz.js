// Quiz Engine - Handles quiz logic and question management

class QuizEngine {
    constructor(questions) {
        this.questions = questions;
        this.currentIndex = 0;
        this.answers = [];
    }

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    hasNextQuestion() {
        return this.currentIndex < this.questions.length;
    }

    nextQuestion() {
        this.currentIndex++;
        return this.hasNextQuestion();
    }

    submitAnswer(selectedIndex, questionIndex = this.currentIndex) {
        const question = this.questions[questionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        this.answers.push({
            questionId: question.id,
            selected: selectedIndex,
            correct: question.correct,
            isCorrect: isCorrect,
            timestamp: Date.now()
        });

        return isCorrect;
    }

    getScore() {
        return {
            total: this.answers.length,
            correct: this.answers.filter(a => a.isCorrect).length,
            incorrect: this.answers.filter(a => !a.isCorrect).length
        };
    }

    reset() {
        this.currentIndex = 0;
        this.answers = [];
    }
}

// Question shuffling utility
function shuffleQuestions(questions) {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function shuffleOptions(options) {
    return shuffleQuestions(options); // Reuse array shuffle logic
}
