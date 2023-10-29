function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  var originalElement = document.getElementById(data);
  if (originalElement) {
    // Clone the original element
    var clone = originalElement.cloneNode(true);
    // Generate a new unique ID for the cloned element
    clone.id = 'clone_' + new Date().getTime();
    // Append the cloned element to the drop zone
    event.target.appendChild(clone);
  }
}
