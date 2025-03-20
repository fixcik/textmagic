// Слушаем сообщения от content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'enhance_text') {
    // Здесь можно добавить дополнительную логику обработки, если потребуется
    sendResponse({ success: true });
  }
});

// При установке расширения
chrome.runtime.onInstalled.addListener(() => {
  // Инициализация расширения
}); 