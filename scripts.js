const elem = {
    object: document.getElementById('object'),
    entry: document.getElementById('entry'),
    year: document.getElementById('year'),
    submit: document.getElementById('submit'),
    guesses: document.getElementById('guesses'),
    victory: document.getElementById('victory'),
    instructionsButton: document.getElementById('instructions-button'),
    statsButton: document.getElementById('stats-button'),
    instructions: document.getElementById('instructions'),
    stats: document.getElementById('stats'),
    stat: {
        played: document.getElementById('stat-played'),
        winPercentage: document.getElementById('stat-win-percentage'),
        currentStreak: document.getElementById('stat-current-streak'),
        maxStreak: document.getElementById('stat-max-streak'),
    },
};

const START_DATE = new Date(2022, 2, 25);
let daysPassed = Math.floor((new Date() - START_DATE) / (1000 * 60 * 60 * 24));
let answer = answers[daysPassed % answers.length];

var date = new Date();
var currentDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split('T')[0];

let history = {};
let today = {guesses: [], complete: false};

function readState() {
    let stored = localStorage.history;
    console.log('Read stored history:', stored);
    if (stored != null) {
        history = JSON.parse(stored);
        if (history[currentDate]) {
            today = history[currentDate];
        }
        console.log('Loading stored history.');
    }
}

function storeState() {
    history[currentDate] = today;
    console.log('Storing history:', history);
    localStorage.history = JSON.stringify(history);
}

readState();

function getGuessColor(difference) {
    let distance = Math.abs(difference);
    if (distance == 0) return '#006b3d';
    if (distance < 20) return '#c4f500';
    if (distance < 100) return '#ff980e';
    if (distance < 500) return '#ff681e';
    return '#d3212c';
}
function getGuessLabel(difference) {
    if (difference == 0) {
        return 'Correct!';
    }
    let label;
    if (difference < 0) {
        label = '❯';
    } else if (difference > 0) {
        label = '❮';
    }
    return label.repeat((Math.log(Math.abs(difference)) / Math.log(10)) + 1);
}

function insertGuess(guess) {
    let tr = document.createElement('tr');
    let year = document.createElement('td');
    year.textContent = guess.year;
    tr.appendChild(year);
    let difference = document.createElement('td');
    difference.style.backgroundColor = getGuessColor(guess.difference);
    difference.textContent = getGuessLabel(guess.difference);
    tr.appendChild(difference);
    elem.guesses.prepend(tr);
}

function win() {
    elem.entry.style.display = 'none';
    elem.victory.style.display = 'block';
}

function daysElapsed(a, b) {
    let seconds = new Date(a).getTime() - new Date(b).getTime();
    let days = seconds / (1000 * 3600 * 24);
    return Math.abs(days);
}

function generateStatistics() {

    // Played
    // Win percentage
    let played = 0;
    let wins = 0;
    for (let day in history) {
        played++;
        if (history[day].complete) {
            wins++;
        }
    }
    let winPercentage = 0;
    if (played > 0) {
        winPercentage = (wins / played * 100).toFixed(1);
    }

    let streak = 0;
    let lastWin = null;
    let maxStreak = 0;
    let currentStreak = 0;
    for (let date in history) {
        if (lastWin == null || daysElapsed(date, lastWin) != 1) {
            streak = 0;
        }
        streak += 1;
        lastWin = date;

        if (streak > maxStreak) maxStreak = streak;
        if (date == currentDate) currentStreak = streak;
    }

    console.log(played);
    elem.stat.played.textContent = played;
    elem.stat.winPercentage.textContent = winPercentage;
    elem.stat.maxStreak.textContent = maxStreak;
    elem.stat.currentStreak.textContent = currentStreak;
}

generateStatistics();


// Setup
elem.object.textContent = answer.name;
if (today.guesses) {
    for (let guess of today.guesses) {
        insertGuess(guess);
    }
}
if (today.complete) win();


// Element listeners
elem.year.oninput = function() {
    elem.submit.disabled = !Boolean(elem.year.value);
}

elem.submit.disabled = true;
elem.submit.onclick = function() {
    let guess = {
        year: parseInt(elem.year.value),
    };
    guess.difference = guess.year - answer.year;
    if (guess.difference == 0) {
        today.complete = true;
        win();
    }
    today.guesses.push(guess);
    insertGuess(guess);
    console.log('Added guess:', guess);
    storeState();
    elem.year.value = null;
    elem.submit.disabled = true;
    generateStatistics();
}

onclick = function(e) {
    let target = e.target;
    if (target.className === 'close-button') {
        target.parentElement.parentElement.classList.remove('shown');
    }
}

elem.instructionsButton.onclick = function() {
    elem.instructions.classList.toggle('shown');
}
elem.statsButton.onclick = function() {
    elem.stats.classList.toggle('shown');
}
