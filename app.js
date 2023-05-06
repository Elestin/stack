const gameState = {
  player1: [],
  player2: [],
  player3: [],
  player4: [],
};

const stack = [];
const log = [];

function addCardToPlayer(playerId, cardName) {
  const playerCards = gameState[playerId];
  playerCards.push(cardName);

  const playerCardsList = document.getElementById(`${playerId}-cards`);
  const newCardItem = document.createElement('li');
  newCardItem.textContent = cardName;
  playerCardsList.appendChild(newCardItem);
}

function addCardToStack(cardName, playerId) {
  stack.push({ card: cardName, player: playerId });

  const stackCardsList = document.getElementById('stack-cards');
  const newCardItem = document.createElement('li');
  newCardItem.textContent = `${cardName} (${playerId})`;
  stackCardsList.appendChild(newCardItem);
}

document.querySelectorAll('.player-battlefield').forEach(playerField => {
  const playerId = playerField.id;
  const cardInput = playerField.querySelector('input[type="text"]');
  const searchContainer = playerField.querySelector('.search-container');
  const searchInput = searchContainer.querySelector('input[type="search"]');
  const searchResults = searchContainer.querySelector('.search-results');

  cardInput.addEventListener('input', () => {
    const cardName = cardInput.value.trim();

    if (cardName.length === 0) {
      return;
    }

    addCardToPlayer(playerId, cardName);
    cardInput.value = '';
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    if (query.length < 3) {
      searchResults.innerHTML = '';
      return;
    }

    const apiUrl = `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const cards = data.data;

        if (cards.length === 0) {
          searchResults.innerHTML = '<p>No results found.</p>';
          return;
        }

        const dropdownHtml = cards.map(cardName => {
          return `<li><a href="#" data-card-name="${cardName}">${cardName}</a></li>`;
        }).join('');

        searchResults.innerHTML = `<ul>${dropdownHtml}</ul>`;
      })
      .catch(error => {
        console.error(error);
        searchResults.innerHTML = '<p>An error occurred while fetching search results.</p>';
      });
  });

  searchResults.addEventListener('click', event => {
    const target = event.target;

    if (target.tagName === 'A') {
      event.preventDefault();
      const cardName = target.getAttribute('data-card-name');
      addCardToPlayer(playerId, cardName);
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });
});

const stackCardInput = document.getElementById('stack-card-input');
const stackPlayerSelect = document.getElementById('stack-player-select');
const addToStackButton = document.getElementById('add-to-stack');

addToStackButton.addEventListener('click', () => {
  const cardName = stackCardInput.value;
  const playerId = stackPlayerSelect.value;
  addCardToStack(cardName, playerId);
  stackCardInput.value = '';
});
