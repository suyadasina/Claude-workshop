/**
 * Whac-A-Mole Game Logic
 * Modernized Class-based implementation
 */
class WhacAMole {
    constructor() {
        // DOM Elements
        this.holes = document.querySelectorAll('.hole');
        this.scoreBoard = document.querySelector('.score');
        this.highScoreBoard = document.querySelector('.high-score');
        this.timeLeftDisplay = document.querySelector('.time-left');
        this.moles = document.querySelectorAll('.mole');
        this.startBtn = document.querySelector('#start-btn');
        this.muteBtn = document.querySelector('#mute-btn');
        this.whackSound = document.querySelector('#whack-sound');
        this.gameOverSound = document.querySelector('#game-over-sound');

        // Game State
        this.lastHole = null;
        this.timeUp = false;
        this.score = 0;
        this.countdown = null;
        this.gameTime = 30; // seconds
        this.highScore = localStorage.getItem('whacAMoleHighScore') || 0;
        this.isMuted = false;

        this.init();
    }

    init() {
        // Initialize UI
        this.highScoreBoard.textContent = this.highScore;

        // Event Listeners
        this.startBtn.addEventListener('click', () => this.startGame());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.moles.forEach(mole => mole.addEventListener('click', (e) => this.bonk(e)));
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.muteBtn.textContent = this.isMuted ? 'Unmute' : 'Mute';
    }

    randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === this.lastHole) {
            return this.randomHole(holes);
        }
        this.lastHole = hole;
        return hole;
    }

    peep() {
        const time = this.randomTime(200, 1000);
        const hole = this.randomHole(this.holes);
        hole.classList.add('up');
        setTimeout(() => {
            hole.classList.remove('up');
            if (!this.timeUp) this.peep();
        }, time);
    }

    startGame() {
        if (this.countdown) clearInterval(this.countdown);
        
        this.startBtn.disabled = true;
        this.scoreBoard.textContent = 0;
        this.timeLeftDisplay.textContent = this.gameTime;
        this.timeUp = false;
        this.score = 0;
        
        this.peep();
        
        let timeLeft = this.gameTime;
        this.countdown = setInterval(() => {
            timeLeft--;
            this.timeLeftDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.countdown);
        this.timeUp = true;
        this.startBtn.disabled = false;
        this.checkHighScore();
        
        if (!this.isMuted) {
            this.gameOverSound.play();
        }
        
        // Use a small delay for alert to allow UI/Sound to update
        setTimeout(() => {
            alert(`Game Over! Your score: ${this.score}`);
        }, 100);
    }

    checkHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('whacAMoleHighScore', this.highScore);
            this.highScoreBoard.textContent = this.highScore;
        }
    }

    bonk(e) {
        if (!e.isTrusted) return; // cheater!
        
        this.score++;
        
        if (!this.isMuted) {
            this.whackSound.currentTime = 0;
            this.whackSound.play();
        }
        
        e.target.parentNode.classList.remove('up');
        this.scoreBoard.textContent = this.score;
    }
}

// Start the game instance
document.addEventListener('DOMContentLoaded', () => {
    new WhacAMole();
});