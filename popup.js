// State management
let tagsHidden = true; // Default state

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
        updateUI('ready');
        // Load saved state
        loadState(tab.id);
    } else {
        updateUI('not-cf');
    }
}

// Check if URL is a Codeforces problem page
function isCFProblemPage(url) {
    if (!url) return false;
    const cfPatterns = [
        /codeforces\.com\/contest\/\d+\/problem\/[A-Z]/i,
        /codeforces\.com\/problemset\/problem\/\d+\/[A-Z]/i
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
    }
}

// Load state from storage
async function loadState(tabId) {
    try {
        const result = await chrome.storage.local.get([`tagsHidden_${tabId}`]);
        const hidden = result[`tagsHidden_${tabId}`] !== false; // Default to hidden
        updateUI(hidden ? 'hidden' : 'visible');
    } catch (error) {
        console.error('Error loading state:', error);
        updateUI('hidden'); // Default to hidden
    }
}

// Save state to storage
async function saveState(tabId, hidden) {
    try {
        await chrome.storage.local.set({ [`tagsHidden_${tabId}`]: hidden });
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
        // Send message to content script
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleTags' });
        
        // Toggle state
        const newState = !tagsHidden;
        
        // Save state
        await saveState(tab.id, newState);
        
        // Update UI with new state
        setTimeout(() => {
            updateUI(newState ? 'hidden' : 'visible');
        }, 150);
        
    } catch (error) {
        console.error('Error toggling tags:', error);
        // Revert to previous state
        updateUI(tagsHidden ? 'hidden' : 'visible');
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
