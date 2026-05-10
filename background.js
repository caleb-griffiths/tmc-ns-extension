chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "editTabs") {
    editNetSuiteTabs(message.selectedTabId).then(() => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.action === "cancelTabs") {
    cancelNetSuiteTabs().then(() => {
      sendResponse({ ok: true });
    });
    return true;
  }
});

async function editNetSuiteTabs(selectedTabId) {
  const tabs = await chrome.tabs.query({
    url: "https://4635302.app.netsuite.com/*"
  });

  await Promise.all(tabs.map(async (tab) => {
    if (!tab.id || !tab.url) return;

    const url = new URL(tab.url);

    if (!url.searchParams.has("id")) return;
    if (url.searchParams.get("e") === "T") return;

    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      args: [selectedTabId],
      func: async (selectedTabId) => {
        const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

        const targetTab =
          document.querySelector(`[data-nsps-id="${selectedTabId}"]`);

        if (targetTab) {
          targetTab.click();
          await wait(500);
        }

        const selectedTabInput =
          document.querySelector('input[name="selectedtab"]');

        if (selectedTabInput) {
          selectedTabInput.value = selectedTabId;
        }

        const editButton =
          document.getElementById("edit") ||
          document.querySelector('input[data-nsps-label="Edit"]');

        if (editButton) {
          editButton.click();
        }
      }
    });
  }));
}

async function cancelNetSuiteTabs() {
  const tabs = await chrome.tabs.query({
    url: "https://4635302.app.netsuite.com/*"
  });

  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;

    const url = new URL(tab.url);

    if (url.searchParams.get("e") !== "T") continue;

    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      world: "MAIN",
      func: () => {
        if (typeof setWindowChanged === "function") {
          setWindowChanged(window, false);
        }

        const cancelButton =
          document.getElementById("_cancel") ||
          document.querySelector('input[data-nsps-label="Cancel"]');

        if (cancelButton) {
          cancelButton.click();
        } else {
          history.back();
        }
      }
    });
  }
}
