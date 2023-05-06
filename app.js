document.addEventListener('DOMContentLoaded', () => {
  // All the code in app.js should be inside this event listener



// Initialize player containers and the stack container
const playerContainers = document.querySelectorAll('.player-container');
const stackContainer = document.querySelector('.stack-container');

// Add event listeners for search fields
document.querySelectorAll('.card-search').forEach((searchField) => {
  searchField.addEventListener('input', (event) => {
    searchCards(event.target.value, (cards) => {
      document.querySelectorAll('.card-search').forEach((searchField) => {
  searchField.addEventListener('input', (event) => {
    searchCards(event.target.value, (cards) => {
      updateAutosuggestDropdown(cards, event.target);
    });
  });
});

    });
  });
});

// Event listener for player search fields
document.querySelectorAll('.player-container ~ .mt-2 .card-search').forEach((searchField) => {
  searchField.addEventListener('input', (event) => {
    searchCards(event.target.value, (cards) => {
      updateAutosuggestDropdown(cards, event.target);
    });
  });
});

// Event listener for the stack search field
const stackSearchField = document.querySelector('.stack-container + .mt-2 .card-search');
stackSearchField.addEventListener('input', (event) => {
  searchCards(event.target.value, (cards) => {
    updateAutosuggestDropdown(cards, event.target, true); // Add an additional parameter to indicate this is for the stack
  });
});


function updateAutosuggestDropdown(cards, searchField) {
  // Remove any existing dropdown
  const existingDropdown = searchField.parentElement.querySelector('.dropdown-menu');
  if (existingDropdown) {
    existingDropdown.remove();
  }

  // Create a new dropdown menu
  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'dropdown-menu show';
  searchField.parentElement.appendChild(dropdownMenu);

  // Add the fetched cards to the dropdown menu
  cards.forEach((card) => {
    const dropdownItem = document.createElement('button');
    dropdownItem.className = 'dropdown-item';
    dropdownItem.type = 'button';
    dropdownItem.textContent = card;
    dropdownItem.addEventListener('click', () => {
      const container = searchField.parentElement.previousElementSibling;
      addCardToContainer(card, container);
      dropdownMenu.remove();
    });
    dropdownMenu.appendChild(dropdownItem);
  });
}


function searchCards(query, callback) {
  if (query.length < 3) {
    callback([]);
    return;
  }

  fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => {
      callback(data.data);
    })
    .catch((error) => {
      console.error('Error fetching cards:', error);
      callback([]);
    });
}


function addCardToContainer(cardName, container) {
  // Add the card to the container
}

function resolveStack() {
  // Implement stack resolution logic here
  const resolvedStackLog = 'Example resolved stack log'; // Replace this with the actual resolved stack log

  document.getElementById('stackLog').innerText = resolvedStackLog;
  $('#stackLogModal').modal('show');
}

function addCardToContainer(cardName, container, playerNumber) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card m-1 p-1';
  cardElement.textContent = cardName;

  // Add player number if provided
  if (playerNumber) {
    const playerLabel = document.createElement('small');
    playerLabel.className = 'text-muted ml-1';
    playerLabel.textContent = `(Player ${playerNumber})`;
    cardElement.appendChild(playerLabel);
  }

  // Add a delete button to remove the card from the container
  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-sm btn-danger ml-2';
  deleteButton.textContent = 'x';
  deleteButton.addEventListener('click', () => {
    cardElement.remove();
  });

  cardElement.appendChild(deleteButton);
  container.appendChild(cardElement);
}


document.getElementById('resolveButton').addEventListener('click', resolveStack);
});