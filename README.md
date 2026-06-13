# NGUYETVO'S CHILLER DICTIONARY LEARNING PROGRAM

An interactive learning program for Daikin chiller products.

## Features

- **Player Registration**: Enter your name to start
- **Group Selection**: Choose which chiller dictionary groups to learn
- **Timed Questions**: 10 seconds per question
- **Bonus Points System**:
  - Base: 10 points for correct answers
  - Bonus: Up to 5 extra points for speed (1 point per second faster within 5 seconds)
- **Real-time Scoring**: Left panel shows standard points, right panel shows bonus points
- **Auto-advance**: Automatically moves to next question after 10 seconds
- **Leaderboard**: Final ranking among all players

## Project Structure

```
├── index.html           # Main HTML entry point
├── css/
│   └── styles.css       # Styling for the learning program
├── js/
│   ├── app.js           # Main application logic
│   ├── quiz.js          # Quiz engine and question handler
│   ├── scoring.js       # Point calculation logic
│   └── leaderboard.js   # Leaderboard management
├── data/
│   └── questions.json   # Chiller dictionary questions and groups
└── README.md
```

## Getting Started

1. Open `index.html` in your browser
2. Enter your name
3. Select the chiller groups you want to study
4. Answer questions within 10 seconds each
5. View your final score and ranking
