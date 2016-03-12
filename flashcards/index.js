var self = require("sdk/self");

var contextMenu = require("sdk/context-menu");
var menuItem = contextMenu.Item({
  label: "Create Flashcard",
  context: contextMenu.SelectionContext(),
  contentScript: 'self.on("click", function () {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
  onMessage: function (text) {
    console.log(text);
  }
});

