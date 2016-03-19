var front = document.getElementById('front');
var back = document.getElementById('back');
var update = document.getElementById('update');
var deleteCard = document.getElementById('delete');
var close = document.getElementById('close');
var previous = document.getElementById('previous');
var next = document.getElementById('next');
var page = document.getElementById('page');
var details = document.getElementById('details');
var noFlashcards = document.getElementById('no-flashcards');

var flashcards;
var currentFlashcard;

/* Store the flashcards array from index.js. Display
 * an error message if there are not yet any
 * flashcards to display. Otherwise, display the first
 * flashcard's details.
 */
self.port.on('flashcards', function setFlashcards(flashcard_array) {
  flashcards = flashcard_array;
  if (flashcards.length == 0) {
  	details.style.display = 'none';
  	noFlashcards.style.display = 'block';
  } else {
  	currentFlashcard = 0;
  	enableDisablePreviousNext();
  	front.value = flashcards[currentFlashcard].front;
  	back.value = flashcards[currentFlashcard].back;
  	details.style.display = 'block';
  	noFlashcards.style.display = 'none';
  }
});

/* Hide the popup when then 'close' link is clicked. */
close.addEventListener('click', function() {
  self.port.emit('browse-flashcards-close');
}, false);

/* Update the current flashcard when the 'update' button
 * is clicked.
 */
update.addEventListener('click', function() {
  flashcards[currentFlashcard].front = front.value;
  flashcards[currentFlashcard].back = back.value;
  self.port.emit('update-flashcard', currentFlashcard, flashcards[currentFlashcard]);
}, false);

/* Delete the current card when the 'delete' button is clicked. */
deleteCard.addEventListener('click', function() {
  flashcards.splice(currentFlashcard, 1);
  self.port.emit('delete-flashcard', currentFlashcard);

  if (flashcards.length == 0) {
  	self.port.emit('browse-flashcards-close');
  } else {
  	if (currentFlashcard = flashcards.length) {
  		currentFlashcard--;
  	}
  	enableDisablePreviousNext();
  	front.value = flashcards[currentFlashcard].front;
  	back.value = flashcards[currentFlashcard].back;
  }

}, false);

/* Disable the 'previous' link if on the first flashcard
 * and disable the 'next' link if on the last flashcard.
 */
function enableDisablePreviousNext() {
  if (currentFlashcard == 0) {
  	previous.className = 'disabled';
  } else {
  	previous.className = '';
  }

  if (currentFlashcard == flashcards.length - 1) {
  	next.className = 'disabled';
  } else {
  	next.className = '';
  }
  front.focus();
  page.innerHTML = (currentFlashcard + 1) + '/' + flashcards.length;
}

/* Display the next flashcard's details. */
next.addEventListener('click', function() {
  currentFlashcard++;
  enableDisablePreviousNext();
  front.value = flashcards[currentFlashcard].front;
  back.value = flashcards[currentFlashcard].back;
}, false);

/* Display the previous flashcard's details. */
previous.addEventListener('click', function() {
  currentFlashcard--;
  enableDisablePreviousNext();
  front.value = flashcards[currentFlashcard].front;
  back.value = flashcards[currentFlashcard].back;
}, false);

