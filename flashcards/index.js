var self = require('sdk/self');
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel')
var tabs = require('sdk/tabs')

/* Constants, used to determine which flashcard to display */
const FLASHCARD_RANDOM = 0;
const FLASHCARD_SEQUENCE = 1;

/* Initialize the flashcard persistence object. */
var ss = require('sdk/simple-storage');
if (typeof ss.storage.flashcards == 'undefined') {
  ss.storage.flashcards = [];
}
if (typeof ss.storage.categories == 'undefined') {
  ss.storage.categories = [];
  ss.storage.categories.push("Untitled");
}

ss.storage.categories = [];
ss.storage.categories.push("Category1");
ss.storage.categories.push("Category2");

if (typeof ss.storage.counter == 'undefined'){
  ss.storage.counter = [];
  ss.storage.counter['all'] = 0;
  if(ss.storage.categories){
     for(var i = 0; i < ss.storage.categories.length; i++)
       ss.storage.counter[ss.storage.categories[i]] = 0;
  }
}

var sidebar = require("sdk/ui/sidebar").Sidebar({
  id: 'flashcardsSidebar',
  title: 'Flashcards',
  url: self.data.url("sidebar.html"),
  onAttach: function (worker) {
    console.log("attaching");
  },
  onShow: function () {
    console.log("showing");
  },
  onHide: function () {
    console.log("hiding");
  },
  onDetach: function () {
    console.log("detaching");
  }
});

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
create_flashcard.port.on('create-flashcard-submit', function(front, back, category) {
  ss.storage.flashcards.push({front: front, back: back, url: tabs.activeTab.url, category: category});
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
    create_flashcard.port.emit('set-front', text, ss.storage.categories);
    create_flashcard.show();
  }
});

/* Create the 'Browse Flashcards' popup panel. */
var browse_flashcards = require('sdk/panel').Panel({
  width: 500,
  height: 500,
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
  ss.storage.counter['all'] = 0;
  var cat = ss.storage.flashcards[index].category;
  ss.storage.counter[cat] = 0;
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
  width: 200,
  height: 80,
  onHide: handleHide
});

/* Show the navigation panel when the addon button is clicked. */
function handleChange(state) {
  sidebar.show();
  if (state.checked) {
    if (ss.storage.flashcards.length == 0) {
      buttonPanel.show({
        position: button
      });
    } else {
      //var flashcard = flashcardToDisplay(FLASHCARD_SEQUENCE);
      //test_panel.port.emit('set-question', flashcard);
      //test_panel.show();
      browse_flashcards.port.emit('flashcards', ss.storage.flashcards, ss.storage.categories)
      browse_flashcards.show();
    }
  }
}

/* Hide the navigation panel when the addon button is clicked
 * while the panel is open.
 */
function handleHide() {
  button.state('window', {checked: false});
}

/* Create the "Test Yourself" pop-up panel.
 *
 */
var test_panel = require('sdk/panel').Panel({
  width: 500,
  height: 220,
  contentURL: self.data.url('test-panel.html'),
  contentScriptFile: self.data.url('test-panel.js'),
  contentStyle: 'body: { margin: 10px; }',
  onHide: handleHide
});

test_panel.port.on('source-in-new-tab', function(url) {
  tabs.open(url);
});

var currentCategory = "all";

/* Helper function to determine which flashcard to show.
 *
 * @param method Either FLASHCARD_RANDOM for a random flashcard
 *               or FLASHCARD_SEQUENCE for a flashcard in sequential order
 * @return       Flashcard to be displayed by a test panel
 */
function flashcardToDisplay (method) {
  var relevantFlashcards = [];
  if(currentCategory == "all") {
    relevantFlashcards = ss.storage.flashcards;
  } else {
    for(var i = 0; i < ss.storage.flashcards.length; i++) { 
      if (ss.storage.flashcards[i].category == currentCategory)
        relevantFlashcards.push(ss.storage.flashcards[i]);
    }
  }

  if(method == FLASHCARD_RANDOM) {
    var length = relevantFlashcards.length;
    if (length == 0) return null;
    var rand = Math.floor(Math.random() * length);
    return relevantFlashcards[rand];
  } else if (method == FLASHCARD_SEQUENCE){
    var ind = ss.storage.counter[currentCategory];
    if (relevantFlashcards[ind] == null) return null;
    ss.storage.counter[currentCategory] = (ss.storage.counter[currentCategory] + 1) % relevantFlashcards.length;
    return relevantFlashcards[ind];
  } else {
    return null;
  }
}

function launchTesting() {
  var flashcard = flashcardToDisplay(FLASHCARD_SEQUENCE);
  if (flashcard == null) return; 
  test_panel.port.emit('set-question', flashcard);
  test_panel.show();
}

test_panel.port.on('test-selected', function() {
  launchTesting();
});

browse_flashcards.port.on('test-selected', function(selectedCategory) {
  currentCategory = selectedCategory;
  launchTesting();
});

test_panel.port.on('browse-selected', function() {
  browse_flashcards.port.emit('flashcards', ss.storage.flashcards, ss.storage.categories)
  browse_flashcards.show();
});


