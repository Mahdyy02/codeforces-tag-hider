// State management
let problemPageTagsHidden = true;
let problemsetListTagsHidden = true;
let tagBox = null;
let problemsetTags = [];
let isInitialized = false;

// Configuration
const CONFIG = {
    animationDuration: 300,
    selectors: {
        tagBoxClass: 'roundbox.sidebox',
        captionText: '→ Problem tags',
        tagClass: 'tag-box'
    }
};

// Detect current page type
function getPageType() {
    const path = window.location.pathname;
    
    // Check for individual problem page
    // Formats:
    // - /contest/1234/problem/A
    // - /problemset/problem/2185/H  (problemset has different structure!)
    // - /gym/567890/problem/B1
    if (/\/contest\/\d+\/problem\/[A-Z0-9]+/i.test(path) ||
        /\/problemset\/problem\/\d+\/[A-Z0-9]+/i.test(path) ||
        /\/gym\/\d+\/problem\/[A-Z0-9]+/i.test(path)) {
        return 'problem';
    }
    
    // Check for problemset list
    if (path === '/problemset' || path.startsWith('/problemset?')) {
        return 'problemset-list';
    }
    
    return 'unknown';
}

// ============================================
// PROBLEM PAGE FUNCTIONALITY
// ============================================

function findTagBox() {
    // Method 1: Find by caption text
    const allDivs = document.querySelectorAll('.roundbox.sidebox');
    for (const div of allDivs) {
        const caption = div.querySelector('.caption.titled');
        if (caption && caption.textContent.includes('→ Problem tags')) {
            console.log('TagHider: Found tag box by caption');
            return div;
        }
    }
    
    // Method 2: Find by tag-box class
    const tagBoxElements = document.querySelectorAll('.tag-box');
    if (tagBoxElements.length > 0) {
        let parent = tagBoxElements[0].parentElement;
        while (parent && !parent.classList.contains('sidebox')) {
            parent = parent.parentElement;
        }
        if (parent) {
            console.log('TagHider: Found tag box by elements');
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
    
    console.log('TagHider: Tag box not found');
    return null;
}

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
    
    const badge = placeholder.querySelector('.taghider-badge-btn');
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTags();
    });
    
    tagBox.parentNode.insertBefore(placeholder, tagBox.nextSibling);
    console.log('TagHider: Placeholder added');
}

function removePlaceholder() {
    const placeholder = document.querySelector('.taghider-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
}

function hideProblemTags() {
    if (!tagBox) return;
    tagBox.classList.remove('taghider-visible');
    tagBox.classList.add('taghider-hidden');
    addPlaceholder();
    console.log('TagHider: Problem tags hidden');
}

function showProblemTags() {
    if (!tagBox) return;
    removePlaceholder();
    tagBox.classList.remove('taghider-hidden');
    tagBox.classList.add('taghider-visible');
    console.log('TagHider: Problem tags shown');
}

// ============================================
// PROBLEMSET LIST FUNCTIONALITY
// ============================================

function findProblemsetTags() {
    const tags = [];
    const rightFloatDivs = document.querySelectorAll('div[style*="float: right"]');
    
    rightFloatDivs.forEach(div => {
        const hasTagLinks = div.querySelector('a[href*="tags="]');
        if (hasTagLinks && !tags.includes(div)) {
            tags.push(div);
        }
    });
    
    console.log(`TagHider: Found ${tags.length} tag containers`);
    return tags;
}

function addProblemsetToggle() {
    const existing = document.querySelector('.taghider-problemset-toggle');
    if (existing) existing.remove();
    
    const table = document.querySelector('.problems');
    if (!table) return;
    
    const headerRow = table.querySelector('tr');
    if (!headerRow) return;
    
    const headers = headerRow.querySelectorAll('th');
    const nameHeader = headers[1];
    if (!nameHeader) return;
    
    const toggleContainer = document.createElement('div');
    toggleContainer.style.float = 'right';
    toggleContainer.style.marginLeft = '10px';
    
    const toggle = document.createElement('span');
    toggle.className = 'taghider-problemset-toggle';
    toggle.textContent = problemsetListTagsHidden ? 'show' : 'hide';
    toggle.title = 'Toggle tag visibility';
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTags();
    });
    
    toggleContainer.appendChild(toggle);
    nameHeader.appendChild(toggleContainer);
    console.log('TagHider: Toggle button added');
}

function hideProblemsetTags() {
    problemsetTags.forEach(container => {
        container.classList.add('taghider-problemset-tag-hidden');
    });
    
    const toggle = document.querySelector('.taghider-problemset-toggle');
    if (toggle) toggle.textContent = 'show';
    console.log('TagHider: Problemset tags hidden');
}

function showProblemsetTags() {
    problemsetTags.forEach(container => {
        container.classList.remove('taghider-problemset-tag-hidden');
    });
    
    const toggle = document.querySelector('.taghider-problemset-toggle');
    if (toggle) toggle.textContent = 'hide';
    console.log('TagHider: Problemset tags shown');
}

// ============================================
// SHARED FUNCTIONALITY
// ============================================

function injectStyles() {
    if (document.getElementById('taghider-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'taghider-styles';
    style.textContent = `
        .taghider-hidden { display: none !important; }
        .taghider-visible { display: block !important; animation: taghider-fadeIn 300ms ease !important; }
        
        @keyframes taghider-fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .taghider-badge-btn {
            background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
            color: white !important;
            padding: 10px 20px !important;
            border-radius: 24px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35) !important;
            cursor: pointer !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border: none !important;
        }
        
        .taghider-badge-btn:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45) !important;
            transform: translateY(-2px) !important;
        }
        
        .taghider-badge-btn:active {
            transform: scale(0.98) !important;
        }
        
        .taghider-placeholder {
            padding: 0 !important;
            background: white !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            margin: 10px 0 !important;
        }
        
        .taghider-placeholder .caption.titled {
            padding: 8px 12px !important;
            border-bottom: 1px solid #e0e0e0 !important;
            font-weight: 600 !important;
        }
        
        .taghider-problemset-toggle {
            display: inline-block !important;
            padding: 3px 10px !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            color: white !important;
            background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
            border-radius: 12px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3) !important;
        }
        
        .taghider-problemset-toggle:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af) !important;
            transform: translateY(-1px) !important;
        }
        
        .taghider-problemset-tag-hidden { display: none !important; }
    `;
    document.head.appendChild(style);
}

function toggleTags() {
    const pageType = getPageType();
    
    if (pageType === 'problem') {
        if (problemPageTagsHidden) {
            showProblemTags();
            problemPageTagsHidden = false;
        } else {
            hideProblemTags();
            problemPageTagsHidden = true;
        }
        console.log('TagHider: Problem page tags now', problemPageTagsHidden ? 'hidden' : 'visible');
    } else if (pageType === 'problemset-list') {
        if (problemsetListTagsHidden) {
            showProblemsetTags();
            problemsetListTagsHidden = false;
        } else {
            hideProblemsetTags();
            problemsetListTagsHidden = true;
        }
        console.log('TagHider: Problemset list tags now', problemsetListTagsHidden ? 'hidden' : 'visible');
    }
    
    saveState();
}

async function saveState() {
    try {
        const pageType = getPageType();
        const tabId = await getCurrentTabId();
        
        if (!tabId) return;
        
        if (pageType === 'problem') {
            await chrome.storage.local.set({ 
                [`problemPageTagsHidden_${tabId}`]: problemPageTagsHidden 
            });
            console.log('TagHider: Problem page state saved:', problemPageTagsHidden);
        } else if (pageType === 'problemset-list') {
            // For problemset list, save globally (not per tab)
            await chrome.storage.local.set({ 
                'problemsetListTagsHidden': problemsetListTagsHidden 
            });
            console.log('TagHider: Problemset list state saved:', problemsetListTagsHidden);
        }
    } catch (error) {
        console.error('TagHider: Error saving state:', error);
    }
}

async function loadState() {
    try {
        const pageType = getPageType();
        const tabId = await getCurrentTabId();
        
        if (pageType === 'problem') {
            if (tabId) {
                const result = await chrome.storage.local.get([`problemPageTagsHidden_${tabId}`]);
                problemPageTagsHidden = result[`problemPageTagsHidden_${tabId}`] !== false;
                console.log('TagHider: Problem page state loaded:', problemPageTagsHidden);
            }
        } else if (pageType === 'problemset-list') {
            const result = await chrome.storage.local.get(['problemsetListTagsHidden']);
            problemsetListTagsHidden = result['problemsetListTagsHidden'] !== false;
            console.log('TagHider: Problemset list state loaded:', problemsetListTagsHidden);
        }
    } catch (error) {
        console.error('TagHider: Error loading state:', error);
        problemPageTagsHidden = true;
        problemsetListTagsHidden = true;
    }
}

function getCurrentTabId() {
    return new Promise((resolve) => {
        try {
            chrome.runtime.sendMessage({ action: 'getTabId' }, (response) => {
                resolve(response?.tabId || null);
            });
        } catch {
            resolve(null);
        }
    });
}

async function init() {
    if (isInitialized) return;
    
    const pageType = getPageType();
    console.log('TagHider: Detected page type:', pageType);
    
    if (pageType === 'unknown') {
        console.log('TagHider: Not a supported page');
        return;
    }
    
    injectStyles();
    await loadState();
    
    if (pageType === 'problem') {
        tagBox = findTagBox();
        if (!tagBox) {
            console.log('TagHider: Tag box not found, will retry...');
            return;
        }
        
        if (problemPageTagsHidden) {
            hideProblemTags();
        } else {
            showProblemTags();
        }
    } else if (pageType === 'problemset-list') {
        // Wait a bit for table to load
        await new Promise(resolve => setTimeout(resolve, 100));
        
        problemsetTags = findProblemsetTags();
        if (problemsetTags.length === 0) {
            console.log('TagHider: No tags found yet, will retry...');
            return;
        }
        
        addProblemsetToggle();
        
        if (problemsetListTagsHidden) {
            hideProblemsetTags();
        } else {
            showProblemsetTags();
        }
    }
    
    isInitialized = true;
    console.log('TagHider: Initialized');
}

const observer = new MutationObserver((mutations) => {
    const pageType = getPageType();
    
    // For problem pages, only initialize once
    if (pageType === 'problem' && !isInitialized) {
        init();
        return;
    }
    
    // For problemset list, check if table was modified
    if (pageType === 'problemset-list') {
        const tableModified = mutations.some(mutation => {
            // Check if problems table was added or modified
            if (mutation.target.classList && mutation.target.classList.contains('problems')) {
                return true;
            }
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.classList && node.classList.contains('problems')) {
                        return true;
                    }
                    if (node.querySelector && node.querySelector('.problems')) {
                        return true;
                    }
                }
            }
            return false;
        });
        
        if (!isInitialized) {
            init();
        } else if (tableModified) {
            console.log('TagHider: Table updated, re-finding tags...');
            problemsetTags = findProblemsetTags();
            addProblemsetToggle();
            if (problemsetListTagsHidden) {
                hideProblemsetTags();
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleTags') {
        if (!isInitialized) init();
        toggleTags();
        
        const pageType = getPageType();
        const currentState = pageType === 'problem' ? problemPageTagsHidden : problemsetListTagsHidden;
        sendResponse({ success: true, tagsHidden: currentState });
    }
    return true;
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.addEventListener('popstate', () => {
    isInitialized = false;
    tagBox = null;
    problemsetTags = [];
    setTimeout(init, 500);
});

window.addEventListener('beforeunload', () => {
    observer.disconnect();
});
