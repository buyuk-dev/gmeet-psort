let participants = [];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ participants });
});
