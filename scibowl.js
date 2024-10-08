let questions = JSON.parse(sessionStorage.getItem("questionList"));

let questionNumber =
  sessionStorage.getItem("currentQuestion") === null
    ? -1
    : sessionStorage.getItem("currentQuestion");

let timerText = document.getElementById("timer");
let questionText = document.getElementById("question");
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
let speakingSpeedDisplay = document.getElementById("speakingSpeedDisplay");
let showQuestion = document.getElementById("showQuestion");

let answerTime = document.getElementById("answerTime");
let answerTimeDisplay = document.getElementById("tossupTimeDisplay");

let timeUp = false;

let timeKeeper = null;
let interrupt = false;
let canAnswer = false;

let questionTextContent = "";

let previousBoundaryIndex = 0;

speakingSpeed.oninput = function () {
  speakingSpeedDisplay.innerHTML = `Current Speaking Speed: ${this.value}x`;
};

answerTime.oninput = function () {
  answerTimeDisplay.innerHTML = `Toss-Up Answer Time: ${this.value / 1000}s`;
};

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
    stats.total == 0
      ? "0.00"
      : ((stats.totalCorrect / stats.total) * 100).toFixed(2);
  interruptStat.textContent = stats.interrupts;
  interruptAccuracyStat.textContent =
    stats.interrupts == 0
      ? "0.00"
      : ((stats.interruptsCorrect / stats.interrupts) * 100).toFixed(2);
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
    case "[":
      correct();
      break;
    case "]":
      wrong();
      break;
    default:
      break;
  }
}

function buzz() {
  if (canAnswer) {
    if (interrupt) {
      timerText.textContent = "INTERRUPT - TYPE ANSWER";
      window.speechSynthesis.cancel();
    } else {
      timerText.textContent = "TYPE ANSWER";
    }

    // Clear the timeout on buzz
    if (timeKeeper !== null) {
      clearTimeout(timeKeeper);
      timeKeeper = null;
    }

    answerContainer.style.display = "flex";
    answerInput.focus();
  }
}

function answer() {
  if (interrupt) {
    stats.interrupts++;
  }
  stats.total++;
  answerInput.blur();
  correctContainer.style.display = "block";
}

function correct() {
  if (interrupt) {
    stats.interruptsCorrect++;
  }
  stats.totalCorrect++;
  stats.score += 4;
  updateStats();
  correctContainer.style.display = "none";
}

function wrong() {
  if (interrupt) stats.score -= 4;
  updateStats();
  correctContainer.style.display = "none";
}

function onboundaryHandler(event) {
  const question = questions[0];
  const value = `TOSS UP ${question.subject} ${question.tossUp.questionType} ${question.tossUp.question}`;

  let word;

  const index = event.charIndex;
  word = value.substring(previousBoundaryIndex, index);

  // Extract the word at the current boundary

  // Append the word to the text content, avoiding duplicate first words
  if (word) {
    questionText.textContent += (questionText.textContent ? " " : "") + word;
  }

  previousBoundaryIndex = index;
}

function onendHandler() {
  const question = questions[0];
  const value = `TOSS UP ${question.subject} ${question.tossUp.questionType} ${question.tossUp.question}`;

  questionText.textContent += " " + value.substring(previousBoundaryIndex);
}

async function newQuestion() {
  previousBoundaryIndex = 0;
  canAnswer = true;
  interrupt = false;
  questionTextContent = "";
  questionText.textContent = questionTextContent;
  answerInput.value = "";

  correctContainer.style.display = "none";
  answerContainer.style.display = "none";
  window.speechSynthesis.cancel();
  clearTimeout(timeKeeper);
  timeKeeper = null;

  timerText.textContent = "-";
  questions.shift();
  sessionStorage.setItem("questionList", JSON.stringify(questions));
  question = questions[0];

  //Toss Up
  answerText.textContent = `ANSWER: ${question.tossUp.answer}`;

  interrupt = true;
  await readQuestion(question);
  onendHandler();
  interrupt = false;

  questionTimer(false);
}

async function readQuestion(question) {
  let questionSpeech = new SpeechSynthesisUtterance();
  questionSpeech.onboundary = onboundaryHandler;
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
      if (canAnswer) {
        timerText.textContent = "5 Seconds";
        window.speechSynthesis.speak(warningSpeech);
      }
    }, 15000);

    timeKeeper = setTimeout(() => {
      if (canAnswer) {
        canAnswer = false;
        timerText.textContent = "TIME!";
        window.speechSynthesis.speak(timeSpeech);
        stats.total++;
        updateStats();
      }
    }, 20000); // 5 seconds after the warning speech
  } else {
    timeKeeper = setTimeout(() => {
      if (canAnswer) {
        canAnswer = false;
        timerText.textContent = "TIME!";
        window.speechSynthesis.speak(timeSpeech);
        stats.total++;
        updateStats();
      }
    }, answerTime.value);
  }
}
