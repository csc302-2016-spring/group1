var front = document.getElementById('front');
var back = document.getElementById('back');
var url = document.getElementById('url');
var update = document.getElementById('update');
var deleteCard = document.getElementById('delete');
var previous = document.getElementById('previous');
var next = document.getElementById('next');
var page = document.getElementById('page');
var details = document.getElementById('details');
var noFlashcards = document.getElementById('no-flashcards');
var test = document.getElementById('test');
var categDropdown = document.getElementById('category');
var testCategories = document.getElementById('test-category');

var flashcards;
var currentFlashcard;
var categories;

/* Set up all the flashcard related properties.
 * 
 */
function setup() {
  front.value = flashcards[currentFlashcard].front;
  back.value = flashcards[currentFlashcard].back;
  url.value = flashcards[currentFlashcard].url;
  categDropdown.value = flashcards[currentFlashcard].category;
} 

/* Set up the categories dropdown list.
 *
 */ 
function setCategories() {
  categDropdown.options.length = 0;
  testCategories.options.length = 0;
  var opt_all = document.createElement('option');
  opt_all.value = "all";
  opt_all.innerHTML = "all";
  testCategories.appendChild(opt_all);
 
  for(var i = 0; i < categories.length;i++){
     var opt = document.createElement('option');
     var opt_test = document.createElement('option');
     opt.value = opt_test.value = categories[i];
     opt.innerHTML = opt_test.innerHTML = categories[i];
     categDropdown.appendChild(opt); 
     testCategories.appendChild(opt_test);
  }
}

/* Store the flashcards array from index.js. Display
 * an error message if there are not yet any
 * flashcards to display. Otherwise, display the first
 * flashcard's details.
 */
self.port.on('flashcards', function setFlashcards(flashcard_array, categories_array) {
  flashcards = flashcard_array;
  categories = categories_array;
  if (flashcards.length == 0) {
  	details.style.display = 'none';
  	noFlashcards.style.display = 'block';
  } else {
        setCategories();
  	currentFlashcard = 0;
  	enableDisablePreviousNext();
  	setup();
  	details.style.display = 'block';
  	noFlashcards.style.display = 'none';
  }
});

/* Update the current flashcard when the 'update' button
 * is clicked.
 */
update.addEventListener('click', function() {
  flashcards[currentFlashcard].front = front.value;
  flashcards[currentFlashcard].back = back.value;
  flashcards[currentFlashcard].url = url.value;
  flashcards[currentFlashcard].category = categDropdown.value;
  self.port.emit('update-flashcard', currentFlashcard, flashcards[currentFlashcard]);
}, false);

/* Delete the current card when the 'delete' button is clicked. */
deleteCard.addEventListener('click', function() {
  flashcards.splice(currentFlashcard, 1);
  self.port.emit('delete-flashcard', currentFlashcard);

  if (flashcards.length == 0) {
  	self.port.emit('browse-flashcards-close');
  } else {
  	if (currentFlashcard == flashcards.length) {
  		currentFlashcard--;
  	}
  	enableDisablePreviousNext();
  	setup();
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
  setup();
}, false);

/* Display the previous flashcard's details. */
previous.addEventListener('click', function() {
  currentFlashcard--;
  enableDisablePreviousNext();
  setup();
}, false);

test.addEventListener('click', function() {
  var selectedCateg = testCategories.options[testCategories.selectedIndex].value;
  self.port.emit('test-selected', selectedCateg);
}, false);

