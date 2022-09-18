chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ participants: {} });
    chrome.storage.local.set({ refreshInterval: 1000 });
});

