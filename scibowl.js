let questionInput = document.getElementById("questionInput");

let text = `TOSS-UP
2) CHEMISTRY Multiple Choice An aqueous solution in which the concentration of OH– ions is
greater than that of H+ ions is:
W) basic
X) acidic
Y) neutral
Z) in equilibrium
ANSWER: W) BASIC
BONUS
2) CHEMISTRY Short Answer Find the mass of 1 mole of cuprous oxide, or Cu2O. Assume the
atomic mass of copper is 64 and oxygen is 16.
ANSWER: 144`;

let test;

let questionList = [];

function processQuestions() {
  let rawQuestions = questionInput.value;
  let questions = rawQuestions.split("TOSS-UP");
  for (let i = 1; i < questions.length; i++) {
    questionList.push(parseQuestion(questions[i]));
  }
  console.log(questionList);
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

  tossUp.question = rawTossUp.substring(questionStart, questionEnd).trim();

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

  bonus.question = rawBonus.substring(questionStart, questionEnd).trim();

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
