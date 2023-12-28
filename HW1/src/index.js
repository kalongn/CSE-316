'use strict'

import Model from './model.js';

const model = new Model();
const mainPage = document.getElementById('main');
const questionsWrapper = document.getElementById('questions-wrapper');
const tagPage = document.getElementById('tag-main');
const allQuestions = model.getAllQuestions();
const allTags = model.getAllTags();
const allQuestionHeader = document.getElementById('all-questions-header');
const questionCounter = document.getElementById('question-counter');
const questionsBtn = document.getElementById('questions-button');
const tagsBtn = document.getElementById('tags-button');
const newQuestionsPageWrapper = document.getElementById("new-questions-page-wrapper");
const tagsPageItemWrapper = document.getElementById('tag-body-tags');
const answerPageWrapper = document.getElementById('ans-page-wrapper');
const newAnswerPageWrapper = document.getElementById('new-answer-page-wrapper');

window.onload = function () {
  //binding methods
  window.newestButton = newestButton;
  window.activeButton = activeButton;
  window.unansweredButton = unansweredButton;
  window.questionButtonOnClick = questionButtonOnClick;
  window.tagsButtonOnClick = tagsButtonOnClick;
  window.askQuestion = askQuestion;
  window.postQuestion = postQuestion;
  window.questionTitleOnClick = questionTitleOnClick;
  window.postAnswerPage = postAnswerPage;
  window.postAnswer = postAnswer;
  window.generateQuetionOnClick = generateQuetionOnClick;
  //assume newest sort
  sortQuestionByLatest();
  displayQuestionPage();
};

/**
 * Generate the time passed given a Date input.
 * @param {Date} questionPostDate 
 *    the date input
 * @returns 
 *    a string representing how long it has elasped.
 */
function timeElapsedDisplay(questionPostDate) {
  const Months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();

  const timeDifference = currentDate - questionPostDate;
  const secondPassed = Math.floor(timeDifference / 1000);
  const minutePassed = Math.floor(timeDifference / (1000 * 60));
  const hourPassed = Math.floor(timeDifference / (1000 * 60 * 60));
  const yearPassed = Math.floor(timeDifference / (365 * 24 * 60 * 60 * 1000));

  if (yearPassed > 0) {
    return `${Months[questionPostDate.getMonth()]}, ${String(questionPostDate.getDate()).padStart(2, '0')} ${questionPostDate.getFullYear()} at ${String(questionPostDate.getHours()).padStart(2, '0')}:${String(questionPostDate.getMinutes()).padStart(2, '0')}`;
  }

  if (hourPassed >= 24) {
    return `${Months[questionPostDate.getMonth()]}, ${String(questionPostDate.getDate()).padStart(2, '0')} at ${String(questionPostDate.getHours()).padStart(2, '0')}:${String(questionPostDate.getMinutes()).padStart(2, '0')}`;
  }

  if (minutePassed >= 60) {
    return `${hourPassed} hours ago`
  }

  if (secondPassed >= 60) {
    return `${minutePassed} minutes ago`
  }

  return `${secondPassed} seconds ago`

}

/**
 * Describe the behavior when the questionButton is clicked.
 */
function questionButtonOnClick() {
  displayQuestionPage();
  newestButton();
  questionsBtn.classList.add('sidenav-button-highlighted');
  tagsBtn.classList.remove('sidenav-button-highlighted');
}

/**
 * Describe the behavior when the tagButton is clicked.
 */
function tagsButtonOnClick() {
  displayTagPage();
  questionsBtn.classList.remove('sidenav-button-highlighted');
  tagsBtn.classList.add('sidenav-button-highlighted');
}

/**
 * 
 * Generate the answer page as the user click on a question.
 * @param {String} qID
 *    the input will be the question id associated. 
 */
function questionTitleOnClick(qID) {
  const quesObj = model.getQuestion(qID);
  displayAnswerPage();
  answerPageWrapper.innerHTML = '';
  model.incrementQuestionViewsBy1(quesObj.qid);
  answerPageWrapper.innerHTML = `
    <div id="ansPg-ques-head">
      <div id="ansPg-ques-head-toprow">
        <div id="ansPg-ques-answer-num" class="answerPg-bold asn-element-min-width">
        ${quesObj.ansIds.length} answers
        </div>
        <div id="ansPg-qtitle" class="answerPg-bold">
        ${quesObj.title}
        </div>
        <div id="ansPg-askQ"><button class="ask-question-button" type="button" onclick="askQuestion()">Ask Question</button></div>
      </div>

      <div id="ansPg-ques-head-botrow">
        <div id="ansPg-ques-views" class="answerPg-bold asn-element-min-width">
        ${quesObj.views} views
        </div>
        <div id="ansPg-qDescription">
          ${quesObj.text}
        </div>
        <div id="ansPg-ques-user-info">
          <div id="ansPg-ques-usrname" class="new-questions-page-important">
          ${quesObj.askedBy}
          </div>
          <div id="ansPg-ques-askDate" class="date">
          asked ${timeElapsedDisplay(quesObj.askDate)}
          </div>
        </div>
      </div>
    </div>
  `;
  displayQuesAnswers(quesObj);
}

/**
 * 
 * make the post answer page appear as the user click on a question.
 */
function displayQuestionPage() {
  tagPage.style.display = 'none';
  newQuestionsPageWrapper.style.display = "none";
  answerPageWrapper.style.display = 'none';
  newAnswerPageWrapper.style.display = 'none';
  mainPage.style.display = 'block';
}

/**
 * 
 * make the tag page appear as the user click on a tag button.
 */
function displayTagPage() {
  mainPage.style.display = 'none';
  newQuestionsPageWrapper.style.display = "none";
  answerPageWrapper.style.display = 'none';
  newAnswerPageWrapper.style.display = 'none';
  tagPage.style.display = 'block';
  questionsBtn.classList.remove('sidenav-button-highlighted');
  tagsBtn.classList.add('sidenav-button-highlighted');
  displayAllTags();
}

/**
 * 
 * make the new question page appear as the user click on the new question button.
 */
function displayNewQuestionPage() {
  mainPage.style.display = 'none';
  tagPage.style.display = 'none';
  answerPageWrapper.style.display = 'none';
  newAnswerPageWrapper.style.display = 'none';
  newQuestionsPageWrapper.style.display = 'flex';
  questionsBtn.classList.remove('sidenav-button-highlighted');
  tagsBtn.classList.remove('sidenav-button-highlighted');
}

/**
 * 
 * make the answer page appear as the user click on the question.
 */
function displayAnswerPage() {
  mainPage.style.display = 'none';
  tagPage.style.display = 'none';
  newQuestionsPageWrapper.style.display = 'none';
  newAnswerPageWrapper.style.display = 'none';
  answerPageWrapper.style.display = 'flex';
  questionsBtn.classList.remove('sidenav-button-highlighted');
  tagsBtn.classList.remove('sidenav-button-highlighted');
}

/**
 * 
 * make the new answer page appear as the user click on the answer button.
 */
function displayPostAnswerPage() {
  mainPage.style.display = 'none';
  tagPage.style.display = 'none';
  newQuestionsPageWrapper.style.display = 'none';
  answerPageWrapper.style.display = 'none';
  newAnswerPageWrapper.style.display = 'flex';
  questionsBtn.classList.remove('sidenav-button-highlighted');
  tagsBtn.classList.remove('sidenav-button-highlighted');
}

/**
 * describe the behavior of the newest button
 */
function newestButton() {
  sortQuestionByLatest();
  allQuestionHeader.innerText = "All Questions"
}

/**
 * describe the behavior of the active button
 */
function activeButton() {
  sortQuestionByActive();
  allQuestionHeader.innerText = "All Questions"
}

/**
 * describe the behavior of the unanswered button
 */
function unansweredButton() {
  sortQuestionByUnanswered();
  allQuestionHeader.innerText = "All Questions"
}

/**
 * Sort the list of questions base on the most recently asked.
 */
function sortQuestionByLatest() {
  questionsWrapper.innerHTML = '';
  allQuestions.sort((a, b) => b.askDate - a.askDate);
  displayAllQuestions();
}

/**
 * 
 * @param {model.getAllQuestions()} questions 
 *    the selected questions
 * Sort the list of selected questions base on the most recently asked.
 */
function SortQuestionByLatest(questions) {
  questionsWrapper.innerHTML = '';
  questions.sort((a, b) => b.askDate - a.askDate);
  displaySomeQuestions(questions);
}
/**
 * all questions in the model sorted by answer activity.
 */
function sortQuestionByActive() {
  questionsWrapper.innerHTML = '';
  allQuestions.sort((a, b) => {
    if (b.ansIds.length === 0) return 1;
    if (a.ansIds.length === 0) return -1;
    return model.getAnswers(b.ansIds[b.ansIds.length - 1]).ansDate - model.getAnswers(a.ansIds[a.ansIds.length - 1]).ansDate;
  });
  displayAllQuestions();
}

/**
 * filter out question that has an answer and keep all the questions that does not have answer
 */
function sortQuestionByUnanswered() {
  questionsWrapper.innerHTML = '';
  const unansweredQuestions = allQuestions.filter(question => question.ansIds.length === 0);
  displaySomeQuestions(unansweredQuestions);
}

/**
 * Shows selected questions in someQuestions object on homepage
 * @param {Object} someQuestions 
 */
function displaySomeQuestions(someQuestions) {
  let id = 0;
  for (let question of someQuestions) {
    createHTMLForQuestion(question);
    id++;
  }
  questionCounter.innerText = id;
}

/**
 * Show all questions on homepage.
 */
function displayAllQuestions() {
  let id = 0;
  for (let question of allQuestions) {
    createHTMLForQuestion(question);
    id++;
  }
  questionCounter.innerText = id;
}
/**
 * display all the questions under the question metadata. 
 * @param {Object} ques 
 *    the question object that is being displayed.
 */
function displayQuesAnswers(ques) {
  const answersWrapper = document.createElement('div');
  answersWrapper.className = 'answer-scoll-wrapper';
  answerPageWrapper.append(answersWrapper);
  ques.ansIds.forEach(ansID => {
    const answer = model.getAnswers(ansID);
    if (answer !== "DNE") {
      createHTMLForAnswer(answer, answersWrapper);
    }
  });

  const answerButton = document.createElement('div');
  answerButton.id = 'answer-button';
  answerButton.innerHTML = `
    <button class="ask-question-button" type="button" onclick="postAnswerPage('${ques.qid}')">
      Answer Question
    </button>
  `;

  answerPageWrapper.appendChild(answerButton);
}

/**
 * given an answer, generate the proper html structure which display each answer correctly.
 * @param {Object} answer 
 *    the answer object that is being displayed.
 */
function createHTMLForAnswer(answer, wrapper) {
  const eachAnswer = document.createElement('div');
  eachAnswer.className = 'answer';
  wrapper.append(eachAnswer);

  eachAnswer.innerHTML = `
    <div class="answer-description">
      ${answer.text}
    </div>
    <div class="answerer-info">
      <div class="answerer-username">
        ${answer.ansBy}
      </div>
      <div class="date-answered">
        answered ${timeElapsedDisplay(answer.ansDate)}
      </div>
    </div>
  `;
}

/**
 * Creating the structure for each question so they display properly.
 * @param {Object} question 
 *    each individual question object.
 */
function createHTMLForQuestion(question) {
  const eachQuestion = document.createElement('div');
  eachQuestion.className = 'question';
  questionsWrapper.append(eachQuestion);
  const tagsForQuestion = generateTagsForQuestions(question);

  eachQuestion.innerHTML = `
  <div class="question-info">
    <div class="question-info-left">
      <div>
        <span>${question.ansIds.length}</span> answers
      </div>
      <div>
        <span>${question.views}</span> views
      </div>
    </div>

    <div class="question-title bold title-font" onclick="questionTitleOnClick('${question.qid}')">
      ${question.title}
    </div>

    <div class="question-info-right">
      <span class="question-user-name">${question.askedBy}</span> asked 
      <span>${timeElapsedDisplay(question.askDate)}</span>
    </div>
  </div>
  `;
  eachQuestion.appendChild(tagsForQuestion);

}

/**
 * Generate the corresponding tags for each individual question
 * @param {Object} question 
 *    each individual question object.
 * @returns 
 *    a html button object.
 */
function generateTagsForQuestions(question) {
  const tagsWrapper = document.createElement('div');
  tagsWrapper.className = 'question-tags';
  let result = "";
  for (let i = 0; i < question.tagIds.length; i++) {
    result += `<button class="question-tag">${model.getTags(question.tagIds[i]).name}</button>`
  }
  tagsWrapper.innerHTML = result;
  return tagsWrapper
}

// Search Function
const searchBox = document.getElementById('header-search-bar');

searchBox.addEventListener("keyup", function (event) {
  // If it is not enter ignores
  if (!(event.key === "Enter")) {
    return;
  }
  event.preventDefault(); // prevent normal behavior for enter key

  const searchItem = searchBox.value.toLowerCase();
  //ensure items is not empty string
  if (searchItem === '') {
    allQuestionHeader.innerText = "All Questions"
    sortQuestionByLatest();
    return;
  }
  questionsWrapper.innerHTML = '';

  // searching by questions and tags
  if (/\[.*\]/.test(searchItem) && searchItem.split(' ').length > 1) {
    let allKeyWords = searchItem.split(' ');
    let allTags = '';
    for (let i = 0; i < allKeyWords.length; i++) {
      if (/\[.*\]/.test(allKeyWords[i])) {
        allTags += allKeyWords[i];
        allKeyWords.splice(i, 1);
        i--;
      }
    }
    SortQuestionByLatest(searchByKeywords(allKeyWords.join(' ')).concat(searchByTags(allTags)));
  }
  // searching by tags.
  else if (/\[.*\]/.test(searchItem)) {
    SortQuestionByLatest(searchByTags(searchItem))
  } else { //searching by keywords
    SortQuestionByLatest(searchByKeywords(searchItem));
  }
  if (questionsWrapper.innerHTML === '') {
    noQuestionFound();
  }
  allQuestionHeader.innerText = "Search Result"
});

/**
 * describe behavior when no question is found.
 */
function noQuestionFound() {
  const itemDiv = document.createElement('div');
  itemDiv.classList = 'question-not-found bold big-font'
  itemDiv.innerText = 'No Question Found.'
  questionsWrapper.appendChild(itemDiv);
}

/**
 * return all the questions that has the include at least one of the tag within the input.
 * @param {String} input 
 * @returns 
 *    an array of questions that has at least one of the tag within the input.
 */
function searchByTags(input) {
  if (input === '' || input === null || input === undefined || input.length === 0) {
    return [];
  }
  let allKeyTags = input.split(']');
  allKeyTags = allKeyTags.map(function (item) {
    return item.substring(1);
  });
  allKeyTags.pop();
  const questionsDetected = allQuestions.filter(
    question => allKeyTags.some(
      tag => question.tagIds.some(
        tagId =>
          (model.getTagsFromName(tag) === 'DNE' ? 'DNE' : model.getTagsFromName(tag).tid) === tagId
      )
    )
  );
  return questionsDetected;
}

/**
 * return all the questions that has the include at least one of the keyword within the input.
 * @param {String} input 
 * @returns 
 *    an array of questions that has at least one of the keyword within the input.
 */
function searchByKeywords(input) {
  if (input === '' || input === null || input === undefined || input.length === 0) {
    return [];
  }
  const allKeyWords = input.split(' ');
  for (let i = 0; i < allKeyWords.length; i++) {
    if (allKeyWords[i] === "") {
      allKeyWords.splice(i, 1);
      i--;
    }
  }
  console.log(allKeyWords);
  const questionsDetected = allQuestions.filter(
    question => allKeyWords.some(
      keyword => (question.title + " " + question.text).toLowerCase().split(" ").includes(keyword)
    )
  );
  return questionsDetected;
}

/**
 * Generates html for inputting a new question when the ask question button is clicked.
 */
function askQuestion() {
  displayNewQuestionPage();
  newQuestionsPageWrapper.innerHTML = `
    <div class="new-questions-page-titles">
      Question Title<span class="new-questions-page-important">*</span>
    </div>
    <div class="new-questions-page-subtitles">
      Limit title to 100 characters or less
    </div>
    <div>
      <input id="new-question-title" class="new-questions-page-textboxes" type="text" maxlength="100">
    </div>
    <div id="new-question-title-error-msg" class="new-questions-page-error-message">
      
    </div>

    <div class="new-questions-page-titles">
      Question Text<span class="new-questions-page-important">*</span>
    </div>
    <div class="new-questions-page-subtitles">
      Add details
    </div>
    <div>
      <textarea id="new-question-details" class="new-questions-page-textboxes" rows="6"></textarea>
    </div>
    <div id="new-question-details-error-msg" class="new-questions-page-error-message">
      
    </div>

    <div class="new-questions-page-titles">
      Tags<span class="new-questions-page-important">*</span>
    </div>
    <div class="new-questions-page-subtitles">
      Add keywords separated by whitespace
    </div>
    <div>
      <input id="new-question-tags" class="new-questions-page-textboxes" type="text" maxlength="54">
    </div>
    <div id="new-question-tags-error-msg" class="new-questions-page-error-message">
      
    </div>

    <div class="new-questions-page-titles">
      Username<span class="new-questions-page-important">*</span>
    </div>
    <div>
      <input id="new-question-username" class="new-questions-page-textboxes" type="text" maxlength="100">
    </div>
    <div id="new-question-username-error-msg" class="new-questions-page-error-message">
      
    </div>

    <div class="new-questions-page-footer">
      <div id="post-button-wrapper">
        <button id="post-question-button" class= "post-question-button" type="button" onclick="postQuestion()">Post Question</button>
      </div>
      <div id="new-questions-page-bottom-text">
        <span class="new-questions-page-important">* indicates mandatory fields</span>
      </div>
    </div>
  `;
}

/**
 * Generates html for inputting a new answer when the post answer button is clicked.
 * @param {string} qid 
 */
function postAnswerPage(qid) {
  displayPostAnswerPage();
  newAnswerPageWrapper.innerHTML = '';
  newAnswerPageWrapper.innerHTML = `
    <div class="new-questions-page-titles">
    Username<span class="new-questions-page-important">*</span>
    </div>
    <div>
      <input id="new-answer-username" class="new-questions-page-textboxes" type="text" maxlength="100">
    </div>
    <div id="new-answer-username-error-msg" class="new-questions-page-error-message"></div>

    <div class="new-questions-page-titles">
      Answer Text<span class="new-questions-page-important">*</span>
    </div>
    <div>
      <textarea id="new-answer-details" class="new-questions-page-textboxes" rows="9"></textarea>
    </div>
    <div id="new-answer-details-error-msg" class="new-questions-page-error-message"></div>

    <div class="new-questions-page-footer">
      <div>
        <button id="post-answer-button" class="post-question-button" type="button" onclick="postAnswer('${qid}')">Post Answer</button>
      </div>
      <div class="new-questions-page-bottom-text">
        <span class="new-questions-page-important">* indicates mandatory fields</span>
      </div>
    </div>
  `;
}

/**
   * Helper function to reset all error messages once post question button is clicked
   */
function resetErrorMessages() {
  const errorElements = document.querySelectorAll('.new-questions-page-error-message');
  errorElements.forEach((errorElement) => {
    errorElement.textContent = '';
  });
}

/**
 * Display an error message for the specified element
 * @param {string} elementId 
 * @param {string} message 
 */
function displayErrorMessage(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.innerHTML = message;
}


/**
   * Checks if user input is valid once post question button is clicked. If valid calls addQuestionToModel otherwise
   * displays relevant error messages
   */
function postQuestion() {
  // Retrieve user inputs
  let titleInput = document.getElementById('new-question-title').value.trim();
  let detailsInput = document.getElementById('new-question-details').value.trim();
  let tagsInput = document.getElementById('new-question-tags').value.trim();
  let usernameInput = document.getElementById('new-question-username').value.trim();

  // Reset error messages
  resetErrorMessages();

  // Validation flags
  let isValid = true;

  // Validate title
  if (titleInput.length === 0 || titleInput.length > 100) {
    displayErrorMessage('new-question-title-error-msg', 'Error: Title must be 1-100 characters');
    isValid = false;
  }

  // Validate details
  if (detailsInput.length === 0) {
    displayErrorMessage('new-question-details-error-msg', 'Error: Details cannot be empty');
    isValid = false;
  }

  let tagArray = tagsInput.split(/\s+/); // Split by whitespace
  tagArray = tagArray.map((tag) => tag.toLowerCase());

  // Validate tags
  if (tagsInput.length != 0) {
    if (tagArray.length > 5) {
      displayErrorMessage('new-question-tags-error-msg', 'Error: Maximum of 5 tags allowed');
      isValid = false;
    }
    for (const tag of tagArray) {
      if (tag.length > 10) {
        displayErrorMessage('new-question-tags-error-msg', 'Error: Tag length should not exceed 10 characters');
        isValid = false;
        break; // Stop checking tags on first error
      }
    }
  } else {
    displayErrorMessage('new-question-tags-error-msg', 'Error: Tags are required and cannot be empty');
    isValid = false;
  }

  // Validate username
  if (usernameInput.length === 0) {
    displayErrorMessage('new-question-username-error-msg', 'Error: Username cannot be empty');
    isValid = false;
  }


  // If all inputs are valid, you can proceed to post the question
  if (isValid) {
    model.addQuestionToModel(titleInput, detailsInput, tagArray, usernameInput);

    titleInput = '';
    detailsInput = '';
    tagsInput = '';
    usernameInput = '';

    questionButtonOnClick();
  }
}

/**
 * Handles the process of posting an answer to a question identified by its qid.
 * @param {string} qid - The ID of the question to which the answer is posted.
 */
function postAnswer(qid) {

  // Retrieve user inputs
  let usernameInput = document.getElementById('new-answer-username').value.trim();
  let detailsInput = document.getElementById('new-answer-details').value.trim();

  // Reset error messages
  resetErrorMessages();

  // Validation flags
  let isValid = true;

  // Validate username
  if (usernameInput.length === 0) {
    displayErrorMessage('new-answer-username-error-msg', 'Error: Username cannot be empty');
    isValid = false;
  }

  // Validate details
  if (detailsInput.length === 0) {
    displayErrorMessage('new-answer-details-error-msg', 'Error: Details cannot be empty');
    isValid = false;
  }

  // If all inputs are valid, you can proceed to post the question
  if (isValid) {
    model.addAnswerToModel(qid, usernameInput, detailsInput);

    usernameInput = '';
    detailsInput = '';

    questionTitleOnClick(qid);
  }
}

// TagPage
function displayAllTags() {
  const tagCounter = document.getElementById('tag-counter');
  let id = 0;
  tagsPageItemWrapper.innerHTML = '';
  for (let tag of allTags) {
    generateTags(tag);
    id++;
  }
  tagCounter.innerHTML = id;
}

/**
 * Generates a tag item on the tags page.
 * @param {Object} tag 
 *    The tag object to be displayed.
 */
function generateTags(tag) {
  const tagsWrapper = document.createElement('div');
  const allQuestionFromThisTag = model.getAllQuestionsFromTag(tag.tid);
  tagsWrapper.className = 'tag-body-items';
  tagsWrapper.innerHTML = `
    <div class="tag-body-items">
      <div class="border-dash">
        <a onclick="generateQuetionOnClick('${tag.tid}')"><span class="tag-body-items-title">${tag.name}</span></a>${tag.name}</a>
        <div><span>${allQuestionFromThisTag.length}</span> questions</div>
      </div>
    </div>`;
  tagsPageItemWrapper.append(tagsWrapper);
}

/**
 * generate question base on tag id.
 * @param {*} tagTid 
 *    tag id.s
 */
function generateQuetionOnClick(tagTid) {
  questionButtonOnClick();
  questionsWrapper.innerHTML = '';
  allQuestionHeader.innerText = "Tag's Questions"
  displaySomeQuestions(model.getAllQuestionsFromTag(tagTid));
} 