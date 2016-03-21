var question = document.getElementById('question');
var answerToDisplay = document.getElementById('answer');
var show_answer = document.getElementById('show_answer');
var close = document.getElementById('close');
var divQuestion = document.getElementById('question-div');
var divAnswer = document.getElementById('answer-div');
var url = document.getElementById('url');
var answer = ''; // actual answer

/*
 * Reveals the answer 
 */ 
show_answer.addEventListener('click', function () {
  answerToDisplay.value = answer;
  divAnswer.style.display = 'block';
  divQuestion.style.display = 'none';
  question.value = '';
}, false);

/*
 * Hide the pop-up when the close is clicked
 */ 
close.addEventListener('click', function () {
  self.port.emit('test-panel-close');
}, false);

/*
 * Sets the 'Question' field to the front of the given flashcard, 
 * clears the 'Answer' field and sets focus to 'Show Answer' button and displays the URL
 */
self.port.on('set-question', function setQuestion(flashcard) {
  divAnswer.style.display = 'none';
  divQuestion.style.display = 'block';

  question.value = flashcard.front;
  answerToDisplay.value = ''
  answer = flashcard.back;
  url.value = flashcard.url;

  show_answer.focus();
});
