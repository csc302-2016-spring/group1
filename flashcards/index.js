var self = require('sdk/self');

/* Initialize the flashcard persistence object. */
var ss = require('sdk/simple-storage');
if (typeof ss.storage.flashcards == 'undefined') {
  ss.storage.flashcards = [];
}

/* Create the 'Create Flashcard' popup panel. */
var create_flashcard = require('sdk/panel').Panel({
  width: 500,
  height: 390,
  contentURL: self.data.url('create-flashcard.html'),
  contentScriptFile: self.data.url('create-flashcard.js'),
  contentStyle: 'body { margin: 10px; }'
});

/* Store the new flashcard and hide the creation window
 * when the 'Create Flashcard' form is submitted.
 */
create_flashcard.port.on('create-flashcard-submit', function(front, back) {
  ss.storage.flashcards.push({front: front, back: back});
  create_flashcard.hide();
});

/* Hide the creation window when the 'Create Flashcard' form
 * is closed.
 */
create_flashcard.port.on('create-flashcard-close', function() {
  create_flashcard.hide();
});

/* Create the right-click menu entry for flashcard creation,
 * and set the 'Front' field to the highlighted text.
 */
var contextMenu = require('sdk/context-menu');
var menuItem = contextMenu.Item({
  label: 'Create Flashcard',
  context: contextMenu.SelectionContext(),
  contentScript: 'self.on("click", function () {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
  onMessage: function (text) {
    create_flashcard.port.emit('set-front', text);
    create_flashcard.show();
  }
});

/* Create the 'Browse Flashcards' popup panel. */
var browse_flashcards = require('sdk/panel').Panel({
  width: 500,
  height: 390,
  contentURL: self.data.url('browse-flashcards.html'),
  contentScriptFile: self.data.url('browse-flashcards.js'),
  contentStyle: 'body { margin: 10px; }'
});

/* Hide the browsing panel when the 'Browse Flashcards' form
 * is closed.
 */
browse_flashcards.port.on('browse-flashcards-close', function() {
  browse_flashcards.hide();
});

/* Update the flashcard with its new values. */
browse_flashcards.port.on('update-flashcard', function(index, value) {
  ss.storage.flashcards[index] = value;
});

/* Delete the flashcard. */
browse_flashcards.port.on('delete-flashcard', function(index) {
  ss.storage.flashcards.splice(index);
});

/* Create the addon button for browsing flashcards. */
var button = require('sdk/ui/button/action').ActionButton({
  id: 'browse-flashcards',
  label: 'Browse Flashcards',
  icon: {
    '16': './icon-16.png',
    '32': './icon-32.png',
    '64': './icon-64.png'
  },
  onClick: function(state) {
    browse_flashcards.port.emit('flashcards', ss.storage.flashcards);
    browse_flashcards.show();
  }
});
