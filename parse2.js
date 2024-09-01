// Get references to HTML elements
const questionInput = document.getElementById("questionInput");
const questionInputLabel = document.getElementById("questionInputLabel");
const sizeDisplay = document.getElementById("numberQuestions");

// Initialize question list from session storage or create a new one
let questionList = sessionStorage.getItem("questionList")
  ? JSON.parse(sessionStorage.getItem("questionList"))
  : [];

// Update display with the current question set size
updateDisplay();

function updateDisplay() {
  sizeDisplay.textContent = `Current Question Set Size: ${Math.max(
    questionList.length - 1,
    0
  )} Questions`;
}

function clearSet() {
  questionList = [];
  sessionStorage.setItem("questionList", JSON.stringify(questionList));
  sessionStorage.setItem("currentQuestion", -1);
  updateDisplay();
}

function processQuestions() {
  const rawQuestions = questionInput.value;
  const questions = rawQuestions.includes("TOSS-UP")
    ? rawQuestions.split("TOSS-UP")
    : rawQuestions.split("TOSS UP");

  for (let i = 1; i < questions.length; i++) {
    questionList.push(parseQuestion(questions[i]));
  }

  questionList.unshift(""); // Add an empty question to the beginning of the list
  sessionStorage.setItem("questionList", JSON.stringify(questionList)); // Save the list to session storage
  questionInput.value = ""; // Clear the input field
  questionInputLabel.textContent =
    "Question Set Successfully Submitted! Please go to the Questions tab to practice!";
  updateDisplay();
}

function parseQuestion(text) {
  const questionGroup = {};
  const [rawTossUp, rawBonus] = text.split("BONUS");

  // Extract subject from toss-up question
  const tossUpText = rawTossUp.split("\n");
  const subjectParts = tossUpText[1].split(" ");

  // Determine if the subject is one or two words
  let subject;
  let questionTypeIndex;
  if (subjectParts[2] === "Multiple" || subjectParts[2] === "Short") {
    subject = subjectParts[1];
    questionTypeIndex = 2;
  } else {
    subject = subjectParts.slice(1, 3).join(" ");
    questionTypeIndex = 3;
  }

  questionGroup.subject = subject;

  // Parse Toss-Up question
  const tossUp = {
    questionType:
      subjectParts[questionTypeIndex] === "Multiple"
        ? "Multiple Choice"
        : "Short Answer",
    question: extractText(
      rawTossUp,
      subjectParts[questionTypeIndex + 1],
      "ANSWER"
    ),
    answer: extractAnswer(rawTossUp),
  };

  // Parse Bonus question
  const bonusText = rawBonus.split("\n");
  const bonusParts = bonusText[1].split(" ");
  const bonus = {
    questionType:
      bonusParts[2] === "Multiple" ? "Multiple Choice" : "Short Answer",
    question: extractText(rawBonus, bonusParts[3], "ANSWER"),
    answer: extractAnswer(rawBonus),
  };

  questionGroup.tossUp = tossUp;
  questionGroup.bonus = bonus;

  return questionGroup;
}

function extractText(rawText, startMarker, endMarker) {
  const start = rawText.indexOf(startMarker) + startMarker.length;
  const end = rawText.indexOf(endMarker);
  return rawText.substring(start, end).trim();
}

function extractAnswer(rawText) {
  return rawText
    .substring(rawText.indexOf("ANSWER:") + 7)
    .split("\n")[0]
    .trim();
}
