chrome.action.onClicked.addListener((tab) => {
  console.log("Extension button clicked on tab:", tab);

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractGameTitle
  }, (results) => {
    if (chrome.runtime.lastError) {
      console.error("Error injecting script:", chrome.runtime.lastError.message);
      return;
    }

    if (results && results[0] && results[0].result) {
      const gameTitle = results[0].result;
      console.log("Extracted game title:", gameTitle);
      
      // Send the game title and open the results window
      chrome.storage.local.set({ gameTitle }, () => {
        chrome.windows.create({
          url: 'results.html',
          type: 'popup',
          width: 400,
          height: 600
        });
      });
    } else {
      console.log("Game title not found");
      chrome.storage.local.set({ gameTitle: null }, () => {
        chrome.windows.create({
          url: 'results.html',
          type: 'popup',
          width: 400,
          height: 600
        });
      });
    }
  });
});

// Function to extract the game title from the Steam page
function extractGameTitle() {
  const gameTitle = document.querySelector('.apphub_AppName')?.innerText;
  console.log("Extracted from page:", gameTitle);
  return gameTitle;
}
