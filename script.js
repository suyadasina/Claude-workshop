const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const timeLeftDisplay = document.querySelector('.time-left');
const moles = document.querySelectorAll('.mole');
let lastHole;
let timeUp = false;
let score = 0;
let countdown;
let gameTime = 30; // seconds

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
            alert('Game Over! Your score: ' + score);
        }
    }, 1000);
}

function bonk(e) {
    if(!e.isTrusted) return; // cheater!
    score++;
    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', bonk));
