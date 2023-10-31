const vscode = acquireVsCodeApi();

const droppedItems = []; // This will be populated by the script injected from the extension

window.addEventListener('DOMContentLoaded', (event) => {
  restoreDroppedItems(droppedItems);
});

function drag(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  
  clonedElement = cloningDropdown(event);
  
  // Check if the dropped column is the correct one for the draggable element
  if (event.target.classList.contains('drop-column') && isCorrectColumn(clonedElement, event.target)) {
  
    // Append the element to the target column
    event.target.appendChild(clonedElement);

    // After appending the element, post the message
    vscode.postMessage({
      command: 'saveDroppedItem',
      data: {
        id: clonedElement.id,
        value: clonedElement.querySelector('select').selectedOptions[0].value,
        label: clonedElement.querySelector('select').selectedOptions[0].textContent,
        column: event.target.id,
      }
    });

  } 

  
}

function restoreDroppedItems(droppedItems) {
  // Logic to restore the dropped items in the webview
  droppedItems.forEach(item => {
    // You will need to find the corresponding column and dropdown
    // and then create the dropped element as it was before
  });
}

function cloningDropdown(event){
  var data = event.dataTransfer.getData("text");
  var originalElement = document.getElementById(data);
  var clonedElement = originalElement.cloneNode(true);

  // Assign a unique ID to the cloned element
  clonedElement.id = "clone_" + new Date().getTime() + "_" +originalElement.id.split('_')[1];
  clonedElement.querySelector('select').selectedOptions = originalElement.querySelector('select').selectedOptions;

  var closeButton = document.createElement("button");
  closeButton.className = "closeButton";
  closeButton.textContent = "X";

  closeButton.onclick = function() {
    clonedElement.remove();
  };
  clonedElement.appendChild(closeButton);

  return clonedElement;
}


function isCorrectColumn(droppedElement, targetColumn) {
  // Logic to check if the dropped element belongs to the target column
  const elementId = droppedElement.id.split('_')[2];
  return targetColumn.id.split("_")[1] === elementId;
}