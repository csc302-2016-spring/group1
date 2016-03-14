var self = require("sdk/self");

// Initialize the flashcard persistence object
var ss = require("sdk/simple-storage");
if (typeof ss.storage.flashcards == "undefined") {
  ss.storage.flashcards = [];
}

// Create the "Create Flashcard" popup window
var create_flashcard = require("sdk/panel").Panel({
  width: 500,
  height: 390,
  contentURL: self.data.url("create-flashcard.html"),
  contentScriptFile: self.data.url("create-flashcard.js"),
  contentStyle: "body { margin: 10px; }"
});

// Store the new flashcard and hide the creation window
// when the "Create Flashcard" form is submitted
create_flashcard.port.on("create-flashcard-submit", function(front, back) {
  ss.storage.flashcards.push({front: front, back: back});
  create_flashcard.hide();
});

// Hide the creation window when the "Create Flashcard" form
// is submitted
create_flashcard.port.on("create-flashcard-close", function() {
  create_flashcard.hide();
});

// Create the right-click menu entry for flashcard creation,
// and set the "Front" field to the highlighted text
var contextMenu = require("sdk/context-menu");
var menuItem = contextMenu.Item({
  label: "Create Flashcard",
  context: contextMenu.SelectionContext(),
  contentScript: 'self.on("click", function () {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
  onMessage: function (text) {
    create_flashcard.show();
    create_flashcard.port.emit("set-front", text);
  }
});

