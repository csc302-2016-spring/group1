var self = require('sdk/self');
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel')

/* Initialize the flashcard persistence object. */
var ss = require('sdk/simple-storage');
if (typeof ss.storage.flashcards == 'undefined') {
  ss.storage.flashcards = [];
}

/* Create the 'Create Flashcard' popup panel. */
var create_flashcard = panels.Panel({
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
  ss.storage.flashcards.splice(index, 1);
});

/* Create the addon button for browsing/testing flashcards. */
var button = ToggleButton({
  id: 'flashcards-button',
  label: 'Flashcards',
  icon: {
    '16': './icon-16.png',
    '32': './icon-32.png',
    '64': './icon-64.png'
  },
  onChange: handleChange
});

/* Create the navigation panel that is displayed when the addon
 * button is clicked.
 */
var buttonPanel = panels.Panel({
  contentURL: self.data.url('button-panel.html'),
  contentScriptFile: self.data.url('button-panel.js'),
  width: 200,
  height: 80,
  onHide: handleHide
});

/* Show the navigation panel when the addon button is clicked. */
function handleChange(state) {
  if (state.checked) {
    buttonPanel.show({
      position: button
    });
  }
}

/* Hide the navigation panel when the addon button is clicked
 * while the panel is open.
 */
function handleHide() {
  button.state('window', {checked: false});
}

/* Open the "Browse Flashcards" popup when the browse option
 * is selected from the navigation panel.
 */
buttonPanel.port.on('browse-selected', function() {
  browse_flashcards.port.emit('flashcards', ss.storage.flashcards);
  browse_flashcards.show();
});

/* Open the "Test Yourself" popup when the test option is
 * selected from the navigation panel.
 */
buttonPanel.port.on('test-selected', function() {
  /* TODO: Add testing stuff here. */
});

