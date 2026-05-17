browser.runtime.onMessage.addListener((message) => {
    if (message.action === "editTabs") {
        return editNetSuiteTabs(message.selectedTabId)
            .then(() => ({ ok: true }))
            .catch((error) => ({
                ok: false,
                error: String(error)
            }));
    }

    if (message.action === "cancelTabs") {
        return cancelNetSuiteTabs()
            .then(() => ({ ok: true }))
            .catch((error) => ({
                ok: false,
                error: String(error)
            }));
    }

    return false;
});

async function editNetSuiteTabs(selectedTabId) {
    const tabs = await browser.tabs.query({
        url: "https://4635302.app.netsuite.com/app/common/item/*"
    });

    for (const tab of tabs) {
        if (!tab.id || !tab.url) continue;

        let url;

        try {
            url = new URL(tab.url);
        }   catch {
            continue;
        }

        if (!url.searchParams.has("id")) continue;
        if (url.searchParams.get("e") === "T") continue;

        await browser.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            args: [selectedTabId],
            func: async (selectedTabId) => {
                const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

                const targetTab = document.querySelector(
                    `[data-nsps-id="${selectedTabId}"]`
                );

                if (targetTab) {
                    targetTab.click();
                    await wait(500);
                }

                const selectedTabInput = document.querySelector(
                    'input[name="selectedtab"]'
                );

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
    }
}

async function cancelNetSuiteTabs() {
    const tabs = await browser.tabs.query({
        url: "https://4635302.app.netsuite.com/*"
    });

    for (const tab of tabs) {
        if (!tab.id || !tab.url) continue;

        let url;

        try {
            url = new URL(tab.url);
        }   catch {
            continue;
        }

        if (url.searchParams.get("e") !== "T") continue;

        await browser.scripting.executeScript({
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
                }   else {
                    history.back();
                }
            }
        });
    }
}
