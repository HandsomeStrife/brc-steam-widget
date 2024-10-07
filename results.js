// Get the game title from local storage
chrome.storage.local.get("gameTitle", (data) => {
  const gameTitle = data.gameTitle;

  const resultsContainer = document.getElementById('results');
  const searchedTitleContainer = document.createElement('p');
  
  // Display the searched game title
  if (gameTitle) {
    searchedTitleContainer.textContent = `Searched for: ${gameTitle}`;
  } else {
    searchedTitleContainer.textContent = 'No game title found.';
    resultsContainer.innerHTML = ''; // Clear the loading message
    resultsContainer.appendChild(searchedTitleContainer);
    return;
  }

  // Append the game title to the HTML before showing the results
  resultsContainer.innerHTML = ''; // Clear the loading message
  resultsContainer.appendChild(searchedTitleContainer);

  // Fetch the results from speedrun.com
  fetch(`https://www.speedrun.com/api/v1/games?name=${encodeURIComponent(gameTitle)}`)
    .then(response => response.json())
    .then(data => {
      console.log("Response from speedrun.com:", data);
      
      if (data.data.length > 0) {
        data.data.forEach(game => {
          const gameLink = document.createElement('a');
          gameLink.href = game.weblink;
          gameLink.target = '_blank';
          gameLink.textContent = game.names.international;

          const listItem = document.createElement('li');
          listItem.appendChild(gameLink);
          resultsContainer.appendChild(listItem);
        });
      } else {
        resultsContainer.innerHTML += '<li>No matching games found on speedrun.com.</li>';
      }
    })
    .catch(error => {
      console.error('Error fetching speedrun.com data:', error);
      resultsContainer.innerHTML += '<li>Error fetching data. Try again later.</li>';
    });
});
