var test = document.getElementById('test');

test.addEventListener('click', function() {
  self.port.emit('test-selected');
}, false);

self.port.on("flashcards", function(flashcards) {
  document.getElementById('flashcardsList').innerHTML = ''
  var index = 0;
  flashcards.forEach(function(flashcard) {
    var flashID = "flashcard-"+index;
    var flashEditID = "flashcard-edit-"+index;
     document.getElementById('flashcardsList').innerHTML +='<div class="flashcard" id="'+flashID+'"> <div class="edit-container"> <div class="flashcard-edit" id="'+flashEditID+'">Edit</div></div><p class="flashcard-title">'+ flashcard.front +'</p><div class="source-container"> <div class="flashcard-source">'+flashcard.url.split("/")[2]+'</div></div></div>';

     index += 1;
  });
  var flashcardviews = document.getElementsByClassName("flashcard-edit");
  for (var i = 0; i < flashcardviews.length; i++) {
    var fcardview = flashcardviews[i];
    fcardview.addEventListener('click', function() {
      var idx = parseInt(this.id.split("-")[2]);
      self.port.emit('browse-selected', idx);
    }, false);
  }

});
