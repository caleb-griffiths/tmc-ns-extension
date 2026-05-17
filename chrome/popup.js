function sendMessage(message) {
  chrome.runtime.sendMessage(message, () => {
    window.close();
  });
}

document.querySelectorAll("button[data-tab-id]").forEach(button => {
  button.addEventListener("click", () => {
    sendMessage({
      action: "editTabs",
      selectedTabId: button.dataset.tabId
    });
  });
});

document.getElementById("help").addEventListener("click", () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("help.html")
  });
});

document.getElementById("cancel").addEventListener("click", () => {
  sendMessage({
    action: "cancelTabs"
  });
});
