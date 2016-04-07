var categDropdown = document.getElementById('categories');
var newCateg = document.getElementById('new');
var delCateg = document.getElementById('delete');
var rename = document.getElementById('rename');
var new_name = document.getElementById('name');

var categories = [];

function setup(){
  new_name.value = '';
  categDropdown.options.length = 0;
  for(var i = 0; i < categories.length; i++) {
    var opt = document.createElement('option');
    opt.value = categories[i];
    opt.innerHTML = categories[i];
    categDropdown.appendChild(opt);
  }
}

self.port.on('manage', function (categories_array) {
  categories = categories_array;
  setup();
});

newCateg.addEventListener('click', function () {
  if(new_name.value == '') return;
  categories.push(new_name.value);
  self.port.emit('create-category', new_name.value);
  setup();
}, false);

delCateg.addEventListener('click', function () {
  var toDelete = categDropdown.options[categDropdown.selectedIndex].value;
  for(var i = 0; i < categories.length; i++) 
    if(categories[i] == toDelete){
      categories.splice(i, 1);
      self.port.emit('delete-category', i);
      break;
  }
  setup();
}, false);

rename.addEventListener('click', function () {
   if(new_name.value == '') return;
   var toChange = categDropdown.options[categDropdown.selectedIndex].value;
   for(var i = 0; i < categories.length; i++)
      if(categories[i] == toChange){
        categories[i] = new_name.value;
        self.port.emit('rename-category', i, new_name.value);
        break;
   }
   setup();
}, false);
