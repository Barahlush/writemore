// Background Script - Manages state and coordinates extension logic
let storage = new StorageManager();

// Initialize extension
browser.runtime.onInstalled.addListener(async () => {
    await storage.initialize();
    console.log('writemore Extension installed');
});

// Initialize storage on startup
(async () => {
    await storage.initialize();
    checkAndResetCycle();
})();

// Message handling from content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender).then(sendResponse);
    return true; // Keep channel open for async response
});

async function handleMessage(message, sender) {
    switch (message.action) {
        case 'isExtensionEnabled':
            return { enabled: storage.isExtensionEnabled() };

        case 'shouldTrackDomain':
            return checkShouldTrackDomain(message.url);

        case 'checkArticleAccess':
            return checkArticleAccess(message.article);

        case 'submitReflection':
            return handleSubmitReflection(message.reflection, message.type);

        case 'getSettings':
            return { settings: storage.getSettings() };

        case 'updateSettings':
            await storage.updateSettings(message.settings);
            return { success: true };

        case 'getStatistics':
            return { statistics: storage.getStatistics() };

        case 'getHistory':
            return { history: storage.getHistory() };

        case 'getCurrentArticle':
            return { currentArticle: storage.getCurrentArticle() };

        case 'getFullState':
            return { state: storage.getState() };

        default:
            return { error: 'Unknown action' };
    }
}

function checkShouldTrackDomain(url) {
    const settings = storage.getSettings();

    // If extension is disabled, don't track anything
    if (!settings.extensionEnabled) {
        return { shouldTrack: false };
    }

    // Check if domain is in whitelist
    const isDomainWhitelisted = storage.isDomainWhitelisted(url);

    if (isDomainWhitelisted) {
        return {
            shouldTrack: true,
            requiresAutoDetect: false
        };
    }

    // If auto-detection is enabled, track all domains
    if (settings.autoDetection) {
        return {
            shouldTrack: true,
            requiresAutoDetect: true
        };
    }

    // Neither whitelisted nor auto-detect enabled
    return { shouldTrack: false };
}

async function checkArticleAccess(article) {
    // Check if timer has expired and reset if needed
    await checkAndResetCycle();

    const normalizedUrl = storage.normalizeUrl(article.url);

    // Check if article is already whitelisted
    if (storage.isArticleWhitelisted(normalizedUrl)) {
        return {
            shouldBlock: false,
            reason: 'whitelisted'
        };
    }

    // Check if this is the current article
    const currentArticle = storage.getCurrentArticle();

    if (currentArticle && currentArticle.normalizedUrl === normalizedUrl) {
        return {
            shouldBlock: false,
            reason: 'current'
        };
    }

    // If there's no current article, this becomes the current article
    if (!currentArticle) {
        await storage.setCurrentArticle(article);
        return {
            shouldBlock: false,
            reason: 'new_current'
        };
    }

    // Block: user needs to write about current article first
    return {
        shouldBlock: true,
        reason: 'needs_reflection',
        currentArticle: currentArticle
    };
}

async function handleSubmitReflection(reflection, type) {
    const currentArticle = storage.getCurrentArticle();

    if (!currentArticle) {
        return { error: 'No current article' };
    }

    // Add current article to whitelist
    await storage.addToWhitelist(currentArticle, reflection, type);

    // Clear current article
    await storage.clearCurrentArticle();

    return { success: true };
}

async function checkAndResetCycle() {
    if (storage.hasTimerExpired()) {
        const currentArticle = storage.getCurrentArticle();

        if (currentArticle) {
            // Current article is "forgiven" but not whitelisted
            console.log('Cycle expired - current article forgiven:', currentArticle.title);
        }

        await storage.resetCycle();
        return true;
    }

    return false;
}

// Periodic check for timer expiration (every 5 minutes)
setInterval(async () => {
    await checkAndResetCycle();
}, 5 * 60 * 1000);

// Tab updates - check if we need to update blocking state
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Check and reset cycle if needed
        await checkAndResetCycle();
    }
});

// Listen for tab activation (switching between tabs)
browser.tabs.onActivated.addListener(async (activeInfo) => {
    await checkAndResetCycle();
});

console.log('writemore Extension background script loaded');
