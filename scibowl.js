let questions = JSON.parse(sessionStorage.getItem("questionList"));

let questionNumber = sessionStorage.getItem("currentQuestion")
  ? sessionStorage.getItem("currentQuestion")
  : -1;

let timerText = document.getElementById("timer");
let questionText = document.getElementById("question");
let typeText = document.getElementById("type");
let answerInput = document.getElementById("answerInput");
let questionContainer = document.getElementById("questionContainer");
let answerContainer = document.getElementById("answerContainer");
let correctContainer = document.getElementById("correctContainer");
let answerText = document.getElementById("correctAnswer");

let speakingSpeed = document.getElementById("rate");
let showQuestion = document.getElementById("showQuestion");

let timeUp = false;

let timeKeeper;

document.addEventListener("keydown", keyDownHandler);

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
    timerText.textContent = "TYPE ANSWER";
    window.speechSynthesis.cancel();
    clearTimeout(timeKeeper);
    answerContainer.style.display = "flex";

    answerInput.focus();
  }
}

function answer() {
  answerInput.blur();
  correctContainer.style.display = "block";
}

async function newQuestion() {
  answerInput.value = "";

  correctContainer.style.display = "none";
  answerContainer.style.display = "none";
  window.speechSynthesis.cancel();
  clearTimeout(timeKeeper);

  timerText.textContent = "-";
  questionNumber++;
  question = questions[questionNumber];

  //Toss Up
  typeText.textContent = `TOSS-UP ${question.subject} ${question.tossUp.questionType}`;
  questionText.textContent = question.tossUp.question;
  answerText.textContent = `ANSWER: ${question.tossUp.answer}`;

  await readQuestion(question);

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
