
function drag(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  
  var data = event.dataTransfer.getData("text");
  var originalElement = document.getElementById(data);
  var clonedElement = originalElement.cloneNode(true);
  
  // Assign a unique ID to the cloned element
  clonedElement.id = "clone_" + new Date().getTime() + "_" +originalElement.id.split('_')[1];


  var closeButton = document.createElement("button");
  closeButton.className = "closeButton";
  closeButton.textContent = "X";

  closeButton.onclick = function() {
    clonedElement.remove();
  };
  clonedElement.appendChild(closeButton);

  
  // Check if the dropped column is the correct one for the draggable element
  if (event.target.classList.contains('drop-column') && isCorrectColumn(clonedElement, event.target)) {
    
    // Adjust the top position so items do not overlap
    var nextItemTop = event.target.querySelectorAll('.draggable-dropdown').length * (originalElement.offsetHeight + 10); // 10 is the margin

    // Append the element to the target column
    event.target.appendChild(clonedElement);

  } 
  
}

function isCorrectColumn(droppedElement, targetColumn) {
  // Logic to check if the dropped element belongs to the target column
  const elementId = droppedElement.id.split('_')[2];
  return targetColumn.id.split("_")[1] === elementId;
}