let questionInput = document.getElementById("questionInput");
let questionInputLabel = document.getElementById("questionInputLabel");
let sizeDisplay = document.getElementById("numberQuestions");

let questionList = JSON.parse(sessionStorage.getItem("questionList"));
updateDisplay();

function updateDisplay() {
  sizeDisplay.textContent = `Current Question Set Size: ${questionList.length} Questions`;
}

function clearSet() {
  questionList = [];
  sessionStorage.setItem("questionList", JSON.stringify(questionList));
  sessionStorage.setItem("currentQuestion", -1);
  updateDisplay();
}

function processQuestions() {
  let rawQuestions = questionInput.value;
  let questions = rawQuestions.split("TOSS-UP");
  for (let i = 1; i < questions.length; i++) {
    questionList.push(parseQuestion(questions[i]));
  }
  sessionStorage.setItem("questionList", JSON.stringify(questionList)); //Pass to the next page
  questionInput.value = "";
  questionInputLabel.textContent =
    "Question Set Successfully Submitted! Please go to the Questions tab to practice!";
  updateDisplay();
}

function parseQuestion(text) {
  let questionGroup = {};

  let temp = text.split("BONUS");
  let [rawTossUp, rawBonus] = [temp[0], temp[1]];
  let [tossUpText, bonusText] = [temp[0].split("\n"), temp[1].split("\n")];

  /*
  console.log(tossUpText);
  console.log(bonusText);

  console.log(rawTossUp);
  console.log(rawBonus);
  */

  //Subject
  temp = tossUpText[1].split(" ");

  questionGroup.subject = temp[1];
  console.log(questionGroup.subject);

  //Toss Up
  let tossUp = {};

  tossUp.questionType =
    temp[2] == "Multiple" ? "Multiple Choice" : "Short Answer";
  console.log(tossUp.questionType);

  //Question
  let questionStart =
    rawTossUp.indexOf(tossUp.questionType) + tossUp.questionType.length;
  let questionEnd = rawTossUp.indexOf("ANSWER");

  tossUp.question = rawTossUp.substring(questionStart, questionEnd);

  console.log(tossUp.question);

  //Answer
  temp = rawTossUp
    .substring(rawTossUp.indexOf("ANSWER:"))
    .replace("ANSWER:", "")
    .split("\n");
  tossUp.answer = temp[0].trim();
  console.log(tossUp.answer);

  //Bonus
  temp = bonusText[1].split(" ");

  let bonus = {};

  bonus.questionType =
    temp[2] == "Multiple" ? "Multiple Choice" : "Short Answer";
  console.log(bonus.questionType);

  //Question
  questionStart =
    rawBonus.indexOf(bonus.questionType) + bonus.questionType.length;
  questionEnd = rawBonus.indexOf("ANSWER");

  bonus.question = rawBonus.substring(questionStart, questionEnd);

  console.log(bonus.question);

  //Answer
  temp = rawBonus
    .substring(rawBonus.indexOf("ANSWER:"))
    .replace("ANSWER:", "")
    .split("\n");
  bonus.answer = temp[0].trim();
  console.log(bonus.answer);

  questionGroup.tossUp = tossUp;
  questionGroup.bonus = bonus;

  return questionGroup;
}
