var front = document.getElementById('front');
var back = document.getElementById('back');
var submit = document.getElementById('submit');
var close = document.getElementById('close');

/* Send the front and back flashcard text to index.js when
 * the form is submitted.
 */
submit.addEventListener('click', function() {
  self.port.emit('create-flashcard-submit', front.value, back.value);
}, false);

/* Hide the popup when then 'close' link is clicked. */
close.addEventListener('click', function() {
  self.port.emit('create-flashcard-close');
}, false);

/* Set the 'Front' field to the highlighted text, clear the
 * 'Back' field, and set focus to it when the popup opens.
 */
self.port.on('set-front', function setFront(text) {
  front.value = text;
  back.value = '';
  back.focus();
});

