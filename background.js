// Background service worker for TagHider

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('TagHider installed successfully!');
        
        // Set default settings
        chrome.storage.local.set({
            defaultHidden: true,
            showNotifications: true
        });
    } else if (details.reason === 'update') {
        console.log('TagHider updated to version', chrome.runtime.getManifest().version);
    }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getTabId') {
        sendResponse({ tabId: sender.tab?.id || null });
    }
    return true;
});

// Clean up old storage entries periodically
chrome.tabs.onRemoved.addListener((tabId) => {
    // Remove storage for closed tabs after a delay
    setTimeout(() => {
        chrome.storage.local.remove([`tagsHidden_${tabId}`]);
    }, 1000);
});

// Listen for tab updates to reinitialize content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Check if it's a Codeforces problem page
        const cfPatterns = [
            /codeforces\.com\/contest\/\d+\/problem\/[A-Z]/i,
            /codeforces\.com\/problemset\/problem\/\d+\/[A-Z]/i,
            /codeforces\.com\/gym\/\d+\/problem\/[A-Z]/i
        ];
        
        const isCFPage = cfPatterns.some(pattern => pattern.test(tab.url));
        
        if (isCFPage) {
            // Update badge to show extension is active
            chrome.action.setBadgeText({ text: '✓', tabId: tabId });
            chrome.action.setBadgeBackgroundColor({ color: '#3b82f6', tabId: tabId });
        } else {
            chrome.action.setBadgeText({ text: '', tabId: tabId });
        }
    }
});

console.log('TagHider background service worker initialized');
