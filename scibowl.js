let questions = JSON.parse(sessionStorage.getItem("questionList"));

let questionNumber =
  sessionStorage.getItem("currentQuestion") === null
    ? -1
    : sessionStorage.getItem("currentQuestion");

let timerText = document.getElementById("timer");
let questionText = document.getElementById("question");
let typeText = document.getElementById("type");
let answerInput = document.getElementById("answerInput");
let questionContainer = document.getElementById("questionContainer");
let answerContainer = document.getElementById("answerContainer");
let correctContainer = document.getElementById("correctContainer");
let answerText = document.getElementById("correctAnswer");

let scoreStat = document.getElementById("score");
let totalQuestionsStat = document.getElementById("totalQuestions");
let accuracyStat = document.getElementById("accuracy");
let interruptStat = document.getElementById("interrupts");
let interruptAccuracyStat = document.getElementById("interruptAccuracy");

let speakingSpeed = document.getElementById("rate");
let showQuestion = document.getElementById("showQuestion");

let timeUp = false;

let timeKeeper, interrupt;

let stats =
  sessionStorage.getItem("stats") === null
    ? {
        score: 0,
        total: 0,
        totalCorrect: 0,
        interrupts: 0,
        interruptsCorrect: 0,
      }
    : JSON.parse(sessionStorage.getItem("stats"));

updateStats();

document.addEventListener("keydown", keyDownHandler);

function clearStats() {
  stats = {
    score: 0,
    total: 0,
    totalCorrect: 0,
    interrupts: 0,
    interruptsCorrect: 0,
  };
  updateStats();
}

function updateStats() {
  sessionStorage.setItem("stats", JSON.stringify(stats));

  scoreStat.textContent = stats.score;
  totalQuestionsStat.textContent = stats.total;
  accuracyStat.textContent =
    stats.total == 0 ? 0 : (stats.totalCorrect / stats.total) * 100;
  interruptStat.textContent = stats.interrupts;
  interruptAccuracyStat.textContent =
    stats.interrupts == 0
      ? 0
      : (stats.interruptsCorrect / stats.interrupts) * 100;
}

showQuestion.addEventListener("change", () => {
  if (showQuestion.checked) {
    questionContainer.style.display = "block";
  } else {
    questionContainer.style.display = "none";
  }
});

function keyDownHandler(e) {
  switch (e.key) {
    case "=":
      newQuestion();
      break;
    case " ":
      buzz();
      break;
    case "Enter":
      answer();
      break;
    default:
      break;
  }
}

function buzz() {
  if (window.speechSynthesis.speaking || timeKeeper != null) {
    if (interrupt) stats.interrupts++;

    timerText.textContent = "TYPE ANSWER";
    window.speechSynthesis.cancel();
    interrupt = true;
    clearTimeout(timeKeeper);
    answerContainer.style.display = "flex";

    answerInput.focus();
  }
}

function answer() {
  stats.total++;
  answerInput.blur();
  correctContainer.style.display = "block";
}

function correct() {
  if (interrupt) stats.interruptsCorrect++;
  stats.totalCorrect++;
  stats.score += 4;
  updateStats();
}

function wrong() {
  if (interrupt) stats.score -= 4;
  updateStats();
}

async function newQuestion() {
  interrupt = false;

  answerInput.value = "";

  correctContainer.style.display = "none";
  answerContainer.style.display = "none";
  window.speechSynthesis.cancel();
  clearTimeout(timeKeeper);

  timerText.textContent = "-";
  questionNumber++;
  sessionStorage.setItem("currentQuestion", questionNumber);
  question = questions[questionNumber];

  //Toss Up
  typeText.textContent = `TOSS-UP ${question.subject} ${question.tossUp.questionType}`;
  questionText.textContent = question.tossUp.question;
  answerText.textContent = `ANSWER: ${question.tossUp.answer}`;

  interrupt = true;
  await readQuestion(question);
  interrupt = false;

  questionTimer(false);
}

async function readQuestion(question) {
  let questionSpeech = new SpeechSynthesisUtterance();
  questionSpeech.text =
    `TOSS-UP ${question.subject} ${question.tossUp.questionType}` +
    question.tossUp.question;

  questionSpeech.rate = speakingSpeed.value;

  window.speechSynthesis.speak(questionSpeech);

  return new Promise((resolve) => {
    questionSpeech.onend = resolve;
  });
}

function questionTimer(isBonus) {
  let warningSpeech = new SpeechSynthesisUtterance();
  warningSpeech.text = "Five Seconds";
  let timeSpeech = new SpeechSynthesisUtterance();
  timeSpeech.text = "Time";

  timerText.textContent = "WORK";

  if (isBonus) {
    timeKeeper = setTimeout(() => {
      timerText.textContent = "5 Seconds";
      window.speechSynthesis.speak(warningSpeech);
    }, 15000);

    timeKeeper = setTimeout(() => {
      timerText.textContent = "TIME!";
      window.speechSynthesis.speak(timeSpeech);
    }, 5000);

    timeKeeper = null;
  } else {
    timeKeeper = setTimeout(() => {
      timerText.textContent = "TIME!";
      window.speechSynthesis.speak(timeSpeech);
    }, 5000);

    timeKeeper = null;
  }
}
