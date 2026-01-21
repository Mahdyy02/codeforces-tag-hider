// State management
let tagsHidden = true;
let tagBox = null;
let isInitialized = false;

// Configuration
const CONFIG = {
    animationDuration: 300,
    selectors: {
        // Primary selectors for tag box
        tagBoxClass: 'roundbox.sidebox',
        captionText: '→ Problem tags',
        tagClass: 'tag-box'
    }
};

// Find tag box using multiple methods
function findTagBox() {
    // Method 1: Find by caption text "→ Problem tags"
    const allDivs = document.querySelectorAll('.roundbox.sidebox');
    for (const div of allDivs) {
        const caption = div.querySelector('.caption.titled');
        if (caption && caption.textContent.includes('→ Problem tags')) {
            console.log('TagHider: Found tag box by caption text');
            return div;
        }
    }
    
    // Method 2: Find by tag-box class inside
    const tagBoxElements = document.querySelectorAll('.tag-box');
    if (tagBoxElements.length > 0) {
        // Find the parent roundbox sidebox
        let parent = tagBoxElements[0].parentElement;
        while (parent && !parent.classList.contains('sidebox')) {
            parent = parent.parentElement;
        }
        if (parent) {
            console.log('TagHider: Found tag box by tag-box elements');
            return parent;
        }
    }
    
    // Method 3: Search in sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        const boxes = sidebar.querySelectorAll('.roundbox.sidebox');
        for (const box of boxes) {
            const caption = box.querySelector('.caption');
            if (caption && caption.textContent.toLowerCase().includes('tag')) {
                console.log('TagHider: Found tag box in sidebar');
                return box;
            }
        }
    }
    
    // Method 4: XPath fallback
    const xpaths = [
        "//div[contains(@class, 'roundbox') and contains(@class, 'sidebox')]//div[contains(text(), 'Problem tags')]/..",
        "//div[contains(@class, 'roundbox') and contains(@class, 'sidebox')][.//span[contains(@class, 'tag-box')]]"
    ];
    
    for (const xpath of xpaths) {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        
        if (result.singleNodeValue) {
            console.log('TagHider: Found tag box by XPath');
            return result.singleNodeValue;
        }
    }
    
    console.log('TagHider: Tag box not found with any method');
    return null;
}

// Add smooth animation styles
function injectStyles() {
    if (document.getElementById('taghider-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'taghider-styles';
    style.textContent = `
        .taghider-hidden {
            display: none !important;
        }
        
        .taghider-visible {
            display: block !important;
            animation: taghider-fadeIn ${CONFIG.animationDuration}ms ease !important;
        }
        
        @keyframes taghider-fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Premium badge button */
        .taghider-badge-btn {
            background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
            color: white !important;
            padding: 10px 20px !important;
            border-radius: 24px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            z-index: 1000 !important;
            box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35) !important;
            cursor: pointer !important;
            user-select: none !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border: none !important;
        }
        
        .taghider-badge-btn:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45) !important;
            transform: translateY(-2px) !important;
        }
        
        .taghider-badge-btn:active {
            transform: translateY(0px) scale(0.98) !important;
            box-shadow: 0 2px 10px rgba(59, 130, 246, 0.35) !important;
        }
        
        .taghider-badge-btn svg {
            flex-shrink: 0 !important;
            stroke-width: 2.5 !important;
        }
        
        /* Placeholder styling */
        .taghider-placeholder {
            padding: 0 !important;
            background: white !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            margin: 10px 0 !important;
            animation: taghider-fadeIn ${CONFIG.animationDuration}ms ease !important;
        }
        
        .taghider-placeholder .caption.titled {
            padding: 8px 12px !important;
            border-bottom: 1px solid #e0e0e0 !important;
            font-weight: 600 !important;
            font-size: 13px !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('TagHider: Styles injected');
}

// Remove hidden badge
function removeHiddenBadge() {
    const badge = document.querySelector('.taghider-badge');
    if (badge) {
        badge.style.opacity = '0';
        setTimeout(() => badge.remove(), 200);
    }
}

// Hide tags with smooth animation
function hideTags() {
    if (!tagBox) return;
    
    // Hide the entire tag box
    tagBox.classList.remove('taghider-visible');
    tagBox.classList.add('taghider-hidden');
    
    // Add a placeholder to show where tags are
    addPlaceholder();
    
    tagsHidden = true;
    saveState();
    
    console.log('TagHider: Tags hidden');
}

// Add placeholder when tags are hidden
function addPlaceholder() {
    if (!tagBox || document.querySelector('.taghider-placeholder')) return;
    
    const placeholder = document.createElement('div');
    placeholder.className = 'taghider-placeholder roundbox sidebox borderTopRound';
    placeholder.innerHTML = `
        <div class="caption titled">→ Problem tags</div>
        <div style="padding: 30px 20px; text-align: center;">
            <div class="taghider-badge-btn" style="position: relative !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; transform: none !important;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Tags Hidden</span>
            </div>
            <div style="margin-top: 14px; font-size: 12px; color: #64748b; line-height: 1.5;">
                Click the badge or extension icon to reveal
            </div>
        </div>
    `;
    
    // Make badge clickable
    const badge = placeholder.querySelector('.taghider-badge-btn');
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTags();
    });
    
    // Insert placeholder after the hidden tag box
    tagBox.parentNode.insertBefore(placeholder, tagBox.nextSibling);
    
    console.log('TagHider: Placeholder added');
}

// Remove placeholder
function removePlaceholder() {
    const placeholder = document.querySelector('.taghider-placeholder');
    if (placeholder) {
        placeholder.remove();
        console.log('TagHider: Placeholder removed');
    }
}

// Show tags with smooth animation
function showTags() {
    if (!tagBox) return;
    
    // Remove placeholder
    removePlaceholder();
    
    // Show the entire tag box
    tagBox.classList.remove('taghider-hidden');
    tagBox.classList.add('taghider-visible');
    
    removeHiddenBadge();
    tagsHidden = false;
    saveState();
    
    console.log('TagHider: Tags shown');
}

// Toggle tags
function toggleTags() {
    if (tagsHidden) {
        showTags();
    } else {
        hideTags();
    }
}

// Save state to Chrome storage
async function saveState() {
    try {
        const tabId = await getCurrentTabId();
        if (tabId) {
            await chrome.storage.local.set({ [`tagsHidden_${tabId}`]: tagsHidden });
        }
    } catch (error) {
        console.error('TagHider: Error saving state:', error);
    }
}

// Load state from Chrome storage
async function loadState() {
    try {
        const tabId = await getCurrentTabId();
        if (tabId) {
            const result = await chrome.storage.local.get([`tagsHidden_${tabId}`]);
            tagsHidden = result[`tagsHidden_${tabId}`] !== false; // Default to hidden
        }
    } catch (error) {
        console.error('TagHider: Error loading state:', error);
        tagsHidden = true; // Default to hidden
    }
}

// Get current tab ID
function getCurrentTabId() {
    return new Promise((resolve) => {
        try {
            chrome.runtime.sendMessage({ action: 'getTabId' }, (response) => {
                if (chrome.runtime.lastError) {
                    resolve(null);
                } else {
                    resolve(response?.tabId || null);
                }
            });
        } catch {
            resolve(null);
        }
    });
}

// Initialize the extension
async function init() {
    if (isInitialized) return;
    
    tagBox = findTagBox();
    
    if (!tagBox) {
        console.log('TagHider: Tag box not found');
        return;
    }
    
    console.log('TagHider: Tag box found, initializing...');
    
    // Inject styles
    injectStyles();
    
    // Load saved state
    await loadState();
    
    // Apply initial state
    if (tagsHidden) {
        hideTags();
    } else {
        showTags();
    }
    
    isInitialized = true;
    console.log('TagHider: Initialized successfully');
}

// Watch for DOM changes (for dynamic content loading)
const observer = new MutationObserver((mutations) => {
    if (!isInitialized) {
        init();
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleTags') {
        if (!isInitialized) {
            init();
        }
        toggleTags();
        sendResponse({ success: true, tagsHidden });
    }
    return true;
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Re-initialize on page navigation (for single-page app behavior)
window.addEventListener('popstate', () => {
    isInitialized = false;
    setTimeout(init, 500);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    observer.disconnect();
});