const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const highScoreBoard = document.querySelector('.high-score');
const timeLeftDisplay = document.querySelector('.time-left');
const moles = document.querySelectorAll('.mole');
const startBtn = document.querySelector('#start-btn');
const muteBtn = document.querySelector('#mute-btn');
const whackSound = document.querySelector('#whack-sound');
const gameOverSound = document.querySelector('#game-over-sound');
let lastHole;
let timeUp = false;
let score = 0;
let countdown;
let gameTime = 30; // seconds
let highScore = localStorage.getItem('whacAMoleHighScore') || 0;
let isMuted = false;

highScoreBoard.textContent = highScore;

function toggleMute() {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
}

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(200, 1000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    if (countdown) clearInterval(countdown);
    startBtn.disabled = true;
    scoreBoard.textContent = 0;
    timeLeftDisplay.textContent = gameTime;
    timeUp = false;
    score = 0;
    peep();
    
    let timeLeft = gameTime;
    countdown = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timeUp = true;
            startBtn.disabled = false;
            checkHighScore();
            if (!isMuted) gameOverSound.play();
            alert('Game Over! Your score: ' + score);
        }
    }, 1000);
}

function checkHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('whacAMoleHighScore', highScore);
        highScoreBoard.textContent = highScore;
    }
}

function bonk(e) {
    if(!e.isTrusted) return; // cheater!
    score++;
    if (!isMuted) {
        whackSound.currentTime = 0;
        whackSound.play();
    }
    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', bonk));
