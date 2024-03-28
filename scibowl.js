let questions = JSON.parse(sessionStorage.getItem("questionList"));

let questionNumber = sessionStorage.getItem("currentQuestion")
  ? sessionStorage.getItem("currentQuestion")
  : -1;

let timerText = document.getElementById("timer");
let questionText = document.getElementById("question");
let typeText = document.getElementById("type");
let answerInput = document.getElementById("answerInput");

function newQuestion() {
  questionNumber++;
  question = questions[questionNumber];

  typeText.textContent = `${question.subject} ${question.tossUp.questionType}`;
  questionText.textContent = question.tossUp.question;

  console.log(question);
}
