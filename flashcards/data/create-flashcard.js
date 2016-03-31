var front = document.getElementById('front');
var back = document.getElementById('back');
var submit = document.getElementById('submit');

/* Send the front and back flashcard text to index.js when
 * the form is submitted.
 */
submit.addEventListener('click', function() {
  self.port.emit('create-flashcard-submit', front.value, back.value);
}, false);

/* Set the 'Front' field to the highlighted text, clear the
 * 'Back' field, and set focus to it when the popup opens.
 */
self.port.on('set-front', function setFront(text) {
  front.value = text;
  back.value = '';
  back.focus();
});

