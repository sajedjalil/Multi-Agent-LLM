const vscode = acquireVsCodeApi();
const droppedItems = []; // This will be populated by the script injected from the extension


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

function cloningDropdown(event){
  var data = event.dataTransfer.getData("text");
  var originalElement = document.getElementById(data);
  var clonedElement = originalElement.cloneNode(true);

  // Assign a unique ID to the cloned element
  clonedElement.id = "clone_" + new Date().getTime() + "_" +originalElement.id.split('_')[1];
  // Find the selected option in the original dropdown
  var selectedValue = originalElement.querySelector('select').value;

  // Set the corresponding option as selected in the cloned dropdown
  var options = clonedElement.querySelector('select').options;
  for (var i = 0; i < options.length; i++) {
    if (options[i].value === selectedValue) {
      options[i].selected = true;
      break;
    }
  }


  // Add event listener for changes in the dropdown
  clonedElement.querySelector('select').addEventListener('change', handleDropdownChange);

  var closeButton = document.createElement("button");
  closeButton.className = "closeButton";
  closeButton.textContent = "X";

  closeButton.onclick = handleCloseButtonClick(clonedElement);
  clonedElement.appendChild(closeButton);

  return clonedElement;
}


function handleDropdownChange(event) {
  // Get the changed dropdown element
  var changedDropdown = event.target;
  var clonedElement = changedDropdown.closest('.draggable-dropdown');

  // Post the message with the new selected value
  vscode.postMessage({
    command: 'saveDroppedItem',
    data: {
      id: clonedElement.id,
      value: changedDropdown.selectedOptions[0].value,
      label: changedDropdown.selectedOptions[0].textContent,
      column: clonedElement.parentElement.id,
    }
  });
}

function handleCloseButtonClick(clonedElement) {
  return function() {
      // Remove the cloned element
      clonedElement.remove();

      // Send a message to inform about the removal
      vscode.postMessage({
          command: 'removeDroppedItem',
          data: { id: clonedElement.id }
      });
  }
}



function isCorrectColumn(droppedElement, targetColumn) {
  // Logic to check if the dropped element belongs to the target column
  const elementId = droppedElement.id.split('_')[2];
  return targetColumn.id.split("_")[1] === elementId;
}


function restoreDroppedItems(droppedItems) {
  droppedItems.forEach(item => {
    console.log(item);
    // Find the corresponding drop column
    const column = document.getElementById(item.column);
    if (column) {
      // Create a new select element or clone from an existing template
      const select = document.createElement('select');
      // Populate the select element with options
      const options = Object.entries(apiMappings).map(([key, value]) => {
        return `<option value="${value}" ${item.value === value ? 'selected' : ''}>${key}</option>`;
      }).join('');
      select.innerHTML = options;

      // Create the draggable item
      const draggableItem = document.createElement('div');
      draggableItem.className = 'draggable-dropdown';
      draggableItem.id = item.id;
      draggableItem.appendChild(select);

      // Add close button
      var closeButton = document.createElement("button");
      closeButton.className = "closeButton";
      closeButton.textContent = "X";
      closeButton.onclick = handleCloseButtonClick(draggableItem);
      draggableItem.appendChild(closeButton);

      // Add event listener for changes in the dropdown
      select.addEventListener('change', handleDropdownChange);

      // Append the draggable item to the column
      column.appendChild(draggableItem);
    }
  });
}


// Assuming apiMappings is available in main.js
const apiMappings = {
  'GPT-4': "gpt-4",
  'GPT-4 32k': "gpt-4-32k",
  'GPT-3.5': "gpt-3.5-turbo",
  'GPT-3.5 16k': "gpt-3.5-turbo-16k",
  'Bard': "text-bison-001",
};