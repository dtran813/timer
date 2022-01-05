const progressBar = document.querySelector('.outer-ring');
const secEl = document.querySelector('.seconds');
const minEl = document.querySelector('.minutes');
const startButton = document.querySelector('.start');
const clearButton = document.querySelector('.clear');
const SPEED = 1000;

let seconds = +secEl.value;
let minutes = +minEl.value;
let inProgress = null;
let progressStart = 0;
let progressEnd = minutes * 60 + seconds;
let degreeTravel = 360 / progressEnd;
let secRemain = 0;
let minRemain = 0;

const setProgressBar = (deg, color1, color2 = color1) => {
  progressBar.style.background = `conic-gradient(
    ${color1} ${deg}deg,
    ${color2} ${deg}deg
  )`;
};

const checkValue = value => (value.toString().length === 2 ? value : `0${value}`);

const progressTrack = function () {
  progressStart++;

  secRemain = Math.floor((progressEnd - progressStart) % 60);
  minRemain = Math.floor((progressEnd - progressStart) / 60);

  seconds = secRemain;
  minutes = minRemain;

  secEl.value = checkValue(secRemain);
  minEl.value = checkValue(minRemain);

  setProgressBar(progressStart * degreeTravel, '#fa5252', 'rgba(255, 255, 255, 0.75)');

  if (progressStart === progressEnd) {
    setProgressBar('360', '#00aa51');

    clearInterval(inProgress);
    startButton.innerText = 'START';
    inProgress = null;
    progressStart = 0;
  }
};

const resetProgress = function () {
  inProgress = null;
  progressStart = 0;
  progressEnd = minutes * 60 + seconds;
  degreeTravel = 360 / progressEnd;
  setProgressBar('360', 'rgba(255, 255, 255, 0.75)');
};

const resetValues = function (secVal = +secEl.value, minVal = +minEl.value) {
  if (inProgress) clearInterval(inProgress);
  seconds = secVal;
  minutes = minVal;

  secEl.value = checkValue(seconds);
  minEl.value = checkValue(minutes);
  resetProgress();
};

const controlProgress = function () {
  if (!inProgress) {
    inProgress = setInterval(progressTrack, SPEED);
  } else {
    clearInterval(inProgress);
    resetProgress();
  }
};

startButton.addEventListener('click', () => {
  if (startButton.innerText === 'START') {
    if (minutes !== 0 || seconds !== 0) {
      startButton.innerText = 'STOP';
      controlProgress();
    } else {
      alert('Please enter the values into the timer!');
    }
  } else {
    startButton.innerText = 'START';
    controlProgress();
  }
});

clearButton.addEventListener('click', () => {
  resetValues(0, 0);
  startButton.innerText = 'START';
});

[(minEl, secEl)].forEach(el =>
  el.addEventListener('focus', () => {
    if (startButton.innerText === 'STOP') return;
    if (+el.value === 0) el.value = '';
  })
);

[minEl, secEl].forEach(el =>
  el.addEventListener('blur', () => {
    if (startButton.innerText === 'STOP') return;
    resetValues();
  })
);
