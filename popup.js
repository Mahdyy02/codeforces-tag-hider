// State management
let tagsHidden = true; // Default state
let currentTabId = null;

// DOM elements
const toggleButton = document.getElementById('toggleTags');
const buttonText = document.getElementById('buttonText');
const statusCard = document.getElementById('statusCard');
const statusValue = document.getElementById('statusValue');

// Initialize popup
async function init() {
    // Check if we're on a Codeforces problem page
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && isCFProblemPage(tab.url)) {
        currentTabId = tab.id;
        updateUI('ready');
        // Load saved state - use correct storage key
        loadState(tab.id);
    } else {
        updateUI('not-cf');
    }
}

// Check if URL is a Codeforces problem page
function isCFProblemPage(url) {
    if (!url) return false;
    const cfPatterns = [
        /codeforces\.com\/contest\/\d+\/problem\/[A-Z0-9]+/i,
        /codeforces\.com\/problemset\/problem\/\d+\/[A-Z0-9]+/i,
        /codeforces\.com\/gym\/\d+\/problem\/[A-Z0-9]+/i
    ];
    return cfPatterns.some(pattern => pattern.test(url));
}

// Update UI based on state
function updateUI(state) {
    switch (state) {
        case 'ready':
            statusCard.className = 'status-card';
            statusValue.textContent = 'Ready to hide tags';
            toggleButton.disabled = false;
            break;
        case 'hidden':
            statusCard.className = 'status-card active';
            statusValue.textContent = 'Tags are hidden';
            toggleButton.classList.add('tags-hidden');
            buttonText.textContent = 'Show Tags';
            tagsHidden = true;
            break;
        case 'visible':
            statusCard.className = 'status-card';
            statusValue.textContent = 'Tags are visible';
            toggleButton.classList.remove('tags-hidden');
            buttonText.textContent = 'Hide Tags';
            tagsHidden = false;
            break;
        case 'not-cf':
            statusCard.className = 'status-card disabled';
            statusValue.textContent = 'Not on a problem page';
            toggleButton.disabled = true;
            break;
        case 'toggling':
            statusValue.textContent = 'Toggling...';
            break;
        case 'error':
            statusCard.className = 'status-card disabled';
            statusValue.textContent = 'Please refresh the page';
            break;
    }
}

// Load state from storage - use correct key matching content.js
async function loadState(tabId) {
    try {
        // Use the same storage key as content.js
        const result = await chrome.storage.local.get([`problemPageTagsHidden_${tabId}`]);
        const hidden = result[`problemPageTagsHidden_${tabId}`] !== false; // Default to hidden
        updateUI(hidden ? 'hidden' : 'visible');
    } catch (error) {
        console.error('Error loading state:', error);
        updateUI('hidden'); // Default to hidden
    }
}

// Save state to storage - use correct key matching content.js
async function saveState(tabId, hidden) {
    try {
        // Use the same storage key as content.js
        await chrome.storage.local.set({ [`problemPageTagsHidden_${tabId}`]: hidden });
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

// Toggle tags
toggleButton.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !isCFProblemPage(tab.url)) {
        return;
    }

    updateUI('toggling');

    try {
        // Send message to content script with timeout
        const response = await Promise.race([
            chrome.tabs.sendMessage(tab.id, { action: 'toggleTags' }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout - content script not responding')), 1000)
            )
        ]);
        
        // Don't manually toggle state here - wait for storage change event
        // The content script will update storage and we'll get notified
        
    } catch (error) {
        console.log('Content script not ready:', error.message);
        
        // Show helpful error message
        updateUI('error');
        
        // Revert to previous state after 2 seconds
        setTimeout(() => {
            updateUI(tagsHidden ? 'hidden' : 'visible');
        }, 2000);
    }
});

// Listen for storage changes from content script
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && currentTabId) {
        const storageKey = `problemPageTagsHidden_${currentTabId}`;
        
        if (changes[storageKey]) {
            const newValue = changes[storageKey].newValue;
            console.log('Popup: Storage changed, updating UI:', newValue);
            updateUI(newValue ? 'hidden' : 'visible');
        }
    }
});

// Initialize on load
init();

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        init();
    }
});