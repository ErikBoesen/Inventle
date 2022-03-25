const elem = {
    object: document.getElementById('object'),
    year: document.getElementById('year'),
    submit: document.getElementById('submit'),
};

const START_DATE = new Date(2022, 2, 25);
let daysPassed = Math.floor((new Date() - START_DATE) / (1000 * 60 * 60 * 24));
let answer = answers[daysPassed % answers.length];

var date = new Date();
var currentDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split('T')[0];

let history = {};
let today = {};

function readState() {
    let stored = localStorage.getItem('history');
    if (stored !== null) {
        history = JSON.parse(stored);
        today = history[currentDate] || {};
        console.log('Loading stored history.');
    }
}

function storeState() {
    localStorage.setItem('history', history);
}

readState();

elem.object.textContent = answer.name;

