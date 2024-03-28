let questions = JSON.parse(sessionStorage.getItem("questionList"));
let currentQuestion = sessionStorage.getItem("currentQuestion")
  ? sessionStorage.getItem("currentQuestion")
  : 0;

console.log(currentQuestion);

function newQuestion() {
  console.log(questions[currentQuestion]);
  currentQuestion++;
}
