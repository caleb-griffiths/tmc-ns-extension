async function sendMessage(message) {
    try {
        const response = await browser.runtime.sendMessage(message);

        if (!response || response.ok !== true) {
            console.error("Extension action failed:", response);
        }
    } catch (error) {
        console.error("Extension message failed:", error);
    } finally {
        window.close();
    }
}

document.querySelectorAll("button[data-tab-id]").forEach((button) => {
    button.addEventListener("click", () => {
        sendMessage({
            action: "editTabs",
            selectedTabId: button.dataset.tabId
        });
    });
});

document.getElementById("help").addEventListener("click", async () => {
    await browser.tabs.create({
        url: browser.runtime.getURL("help.html")
    });

    window.close();
});

document.getElementById("cancel").addEventListener("click", () => {
    sendMessgae({
        action: "cancelTabs"
    });
});
