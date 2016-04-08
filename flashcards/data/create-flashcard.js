var front = document.getElementById('front');
var back = document.getElementById('back');
var submit = document.getElementById('submit');
var categDropdown = document.getElementById('category');

/* Send the front and back flashcard text to index.js when
 * the form is submitted.
 */
submit.addEventListener('click', function() {
  var selectedCateg = categDropdown.options[categDropdown.selectedIndex].text;
  self.port.emit('create-flashcard-submit', front.value, back.value, selectedCateg);
}, false);

/* Set the 'Front' field to the highlighted text, clear the
 * 'Back' field, and set focus to it when the popup opens.
 */
self.port.on('set-front', function setFront(text, categories) {
  front.value = text;
  back.value = '';
  categDropdown.options.length = 0;
  for (i = 0; i < categories.length; i++){
    var opt = document.createElement('option');
    opt.value = categories[i];
    opt.innerHTML = categories[i];
    categDropdown.appendChild(opt);
  }
  back.focus();
});

