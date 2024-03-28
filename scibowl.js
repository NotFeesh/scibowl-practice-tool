let questions = JSON.parse(sessionStorage.getItem("questionList"));

let questionNumber = sessionStorage.getItem("currentQuestion")
  ? sessionStorage.getItem("currentQuestion")
  : -1;

let timerText = document.getElementById("timer");
let questionText = document.getElementById("question");
let typeText = document.getElementById("type");
let answerInput = document.getElementById("answerInput");

let timeUp = false;

function newQuestion() {
  timerText.textContent = "-";
  questionNumber++;
  question = questions[questionNumber];

  //Toss Up
  typeText.textContent = `TOSS-UP ${question.subject} ${question.tossUp.questionType}`;
  questionText.textContent = question.tossUp.question;

  let readTime = question.tossUp.question.split(" ").length * (1000 / 3);
  timerText.textContent = "READ";
  setTimeout(() => {
    timer(false);
  }, readTime);
}

function timer(isBonus) {
  //console.log("timer");
  let time = isBonus ? 20000 : 5000;
  timerText.textContent = "WORK";
  setTimeout(() => {
    //console.log("timeout finsihed");
    timerText.textContent = "TIME!";
  }, time);
}
