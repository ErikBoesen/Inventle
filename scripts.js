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
    if (distance < 20) return '#069c56';
    if (distance < 100) return '#ff980e';
    if (distance < 500) return '#ff681e';
    return '#d3212c';
}

function insertGuess(guess) {
    let tr = document.createElement('tr');
    let year = document.createElement('td');
    year.textContent = guess.year;
    tr.appendChild(year)
    let difference = document.createElement('td');
    if (guess.difference == 0) {
        difference.textContent = 'Success!';
    } else if (guess.difference < 0) {
        difference.textContent = '>';
    } else if (guess.difference > 0) {
        difference.textContent = '<';
    }
    difference.style.backgroundColor = getGuessColor(guess.difference);
    tr.appendChild(difference);
    elem.guesses.prepend(tr);
}

function win() {
    elem.entry.style.display = 'none';
    elem.victory.style.display = 'block';
}


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
}

onclick = function(e) {
    let target = e.target;
    if (target.className == 'close-button') {
        target.parentElement.parentElement.classList.remove('shown');
    }
}
