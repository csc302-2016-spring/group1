var browse = document.getElementById('browse');
var test = document.getElementById('test');

browse.addEventListener('click', function() {
  self.port.emit('browse-selected');
}, false);

test.addEventListener('click', function() {
  self.port.emit('test-selected');
}, false);
