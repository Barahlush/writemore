# Implementation Notes

Technical details and design decisions for developers.

## Architecture Overview

### Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Safari Browser                       │
│                                                           │
│  ┌────────────┐      ┌─────────────────────────────┐   │
│  │  Popup UI  │◄────►│   Background Script          │   │
│  │ (popup.js) │      │   - State management         │   │
│  └────────────┘      │   - Timer checks             │   │
│                       │   - Message routing          │   │
│                       └──────────┬──────────────────┘   │
│                                  │                       │
│                                  ▼                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Content Script (content.js)            │   │
│  │  ┌──────────────┐        ┌──────────────────┐   │   │
│  │  │Article        │        │ Block Overlay    │   │   │
│  │  │Detector       │───────►│ - UI injection   │   │   │
│  │  │- Tag checking │        │ - Word counter   │   │   │
│  │  │- Meta parsing │        │ - Event handling │   │   │
│  │  └──────────────┘        └──────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  Local Storage   │
              │  - Current state │
              │  - Whitelist     │
              │  - History       │
              │  - Settings      │
              └──────────────────┘
```

## Data Structures

### State Schema

```javascript
{
    currentArticle: {
        title: String,
        url: String,
        normalizedUrl: String,
        timestamp: Number,
        hostname: String
    } | null,

    cycleStartTime: Number | null,

    whitelistedArticles: [
        {
            title: String,
            url: String,
            normalizedUrl: String,
            timestamp: Number,
            hostname: String,
            dateAdded: Number,
            reflection: String,
            type: 'written' | 'skipped',
            wordCount: Number
        }
    ],

    settings: {
        resetTimerHours: Number,
        autoDetection: Boolean,
        domainWhitelist: [String],
        extensionEnabled: Boolean
    },

    statistics: {
        totalArticlesRead: Number,
        articlesWrittenAbout: Number,
        articlesSkipped: Number,
        currentStreak: Number,
        lastReadDate: Number | null
    },

    history: [
        // Same as whitelistedArticles entries
    ]
}
```

## Key Algorithms

### Article Detection Flow

```javascript
function shouldProcessPage() {
    // 1. Check if extension enabled
    if (!extensionEnabled) return false;

    // 2. Check if obviously non-article
    if (isNonArticlePage()) return false;

    // 3. Check domain whitelist
    if (isDomainWhitelisted(currentUrl)) {
        return true; // Always track whitelisted domains
    }

    // 4. Check auto-detection
    if (!autoDetectionEnabled) return false;

    // 5. Run article detection
    if (!isArticlePage()) return false;

    return true;
}
```

### Block Decision Flow

```javascript
function shouldBlockArticle(article) {
    const normalized = normalizeUrl(article.url);

    // 1. Already whitelisted? Allow
    if (isWhitelisted(normalized)) {
        return { block: false, reason: 'whitelisted' };
    }

    // 2. Is current article? Allow
    if (currentArticle?.normalizedUrl === normalized) {
        return { block: false, reason: 'current' };
    }

    // 3. No current article? Make it current
    if (!currentArticle) {
        setCurrentArticle(article);
        return { block: false, reason: 'new_current' };
    }

    // 4. Has timer expired? Reset and allow
    if (hasTimerExpired()) {
        resetCycle();
        setCurrentArticle(article);
        return { block: false, reason: 'timer_expired' };
    }

    // 5. Block - need to write about current first
    return {
        block: true,
        reason: 'needs_reflection',
        currentArticle: currentArticle
    };
}
```

### Timer Calculation

```javascript
function hasTimerExpired() {
    if (!cycleStartTime) return false;

    const now = Date.now();
    const elapsed = now - cycleStartTime;
    const resetMs = resetTimerHours * 60 * 60 * 1000;

    return elapsed >= resetMs;
}

// Example:
// cycleStartTime: 1700000000000 (timestamp)
// resetTimerHours: 24
// now: 1700086400000
// elapsed: 86400000 ms (24 hours)
// resetMs: 86400000 ms (24 hours)
// expired: true
```

### URL Normalization

```javascript
function normalizeUrl(url) {
    const urlObj = new URL(url);

    // Remove:
    // - Query parameters (?utm_source=twitter)
    // - Hash fragments (#section-1)
    // - Trailing slashes

    return urlObj.origin + urlObj.pathname.replace(/\/$/, '');
}

// Examples:
// https://example.com/article?ref=twitter#intro
// → https://example.com/article

// https://example.com/article/
// → https://example.com/article
```

## Message Passing

### Content → Background

```javascript
// Content script sends
browser.runtime.sendMessage({
    action: 'checkArticleAccess',
    article: {
        title: "Example Article",
        url: "https://example.com/article",
        normalizedUrl: "https://example.com/article",
        timestamp: Date.now(),
        hostname: "example.com"
    }
}, (response) => {
    // response: { shouldBlock: true/false, ... }
});

// Background script handles
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkArticleAccess') {
        const result = checkArticleAccess(message.article);
        sendResponse(result);
    }
});
```

### Popup → Background

```javascript
// Popup sends
browser.runtime.sendMessage({
    action: 'updateSettings',
    settings: {
        resetTimerHours: 24,
        autoDetection: true
    }
}, (response) => {
    // response: { success: true }
});
```

## Performance Considerations

### 1. Content Script Injection

- Runs on **every page load**
- Must be fast to avoid slowing down browsing
- Early returns for non-tracked pages

**Optimization:**
```javascript
// Fast checks first
if (!extensionEnabled) return;
if (isNonArticlePage()) return;  // Simple pathname checks

// Slower checks later
if (autoDetectionEnabled && isArticlePage()) {
    // DOM analysis
}
```

### 2. Storage Operations

- All storage operations are async
- Use batching for multiple reads/writes
- Cache frequently accessed data

**Optimization:**
```javascript
// Bad: Multiple storage calls
const settings = await storage.loadSettings();
const stats = await storage.loadStats();
const history = await storage.loadHistory();

// Good: Single storage call
const state = await storage.loadState();
const { settings, statistics, history } = state;
```

### 3. DOM Manipulation

- Overlay injection happens once per page
- Reuse existing overlay if possible
- Minimize reflows/repaints

**Optimization:**
```javascript
// Inject once
if (!overlayInjected) {
    injectOverlay();
    overlayInjected = true;
}
```

## Security Considerations

### 1. Content Script Isolation

- Content scripts run in isolated world
- Cannot directly access page JavaScript
- Cannot be modified by page scripts

### 2. Message Validation

Always validate messages:

```javascript
browser.runtime.onMessage.addListener((message, sender) => {
    // Validate sender
    if (!sender.tab) return;

    // Validate message structure
    if (!message.action || typeof message.action !== 'string') {
        return { error: 'Invalid message' };
    }

    // Handle message
    switch (message.action) {
        // ...
    }
});
```

### 3. XSS Prevention

All user content must be escaped:

```javascript
// Bad
overlay.innerHTML = `<div>${article.title}</div>`;

// Good
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

overlay.innerHTML = `<div>${escapeHtml(article.title)}</div>`;
```

### 4. URL Handling

Validate URLs before use:

```javascript
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
```

## Browser Compatibility

### Safari-Specific APIs

Safari uses the `browser` namespace (WebExtension API):

```javascript
// Storage
browser.storage.local.get()
browser.storage.local.set()

// Messaging
browser.runtime.sendMessage()
browser.runtime.onMessage.addListener()

// Tabs
browser.tabs.onUpdated.addListener()
browser.tabs.onActivated.addListener()
```

### Polyfills Not Needed

Safari 14+ supports WebExtension APIs natively.

## Testing Strategies

### 1. Unit Testing (Manual)

Test individual components in browser console:

```javascript
// In background page console
const detector = new ArticleDetector();
detector.isArticlePage(); // Should return true/false

const storage = new StorageManager();
await storage.initialize();
storage.getState(); // Should return current state
```

### 2. Integration Testing

Test full workflows:

1. Fresh install → Verify default state
2. Read first article → Verify becomes current
3. Try second article → Verify blocked
4. Submit reflection → Verify whitelist updated
5. Access previous article → Verify allowed
6. Wait for timer → Verify reset

### 3. Edge Cases to Test

- **URL variations**: Same article with different query params
- **Multiple tabs**: Opening multiple articles simultaneously
- **Timer boundary**: Reading right before/after timer expires
- **Storage corruption**: Invalid data in storage
- **Non-article pages**: Homepages, search results
- **Very long reflections**: 10,000+ words
- **Special characters**: URLs with unicode, emojis in text
- **Slow page loads**: Network throttling
- **Extension disable/enable**: Mid-cycle

## Common Pitfalls

### 1. Race Conditions

**Problem**: Multiple tabs trying to set current article

```javascript
// Bad
if (!currentArticle) {
    setCurrentArticle(article); // Race!
}

// Better
async function setCurrentArticle(article) {
    await storage.loadState(); // Reload fresh state
    if (!storage.getCurrentArticle()) {
        storage.state.currentArticle = article;
        await storage.saveState();
    }
}
```

### 2. Timer Drift

**Problem**: Timer calculated client-side, can drift

```javascript
// Store absolute timestamp, not elapsed time
cycleStartTime: Date.now() // Good

// Not:
cycleElapsed: 0 // Bad - won't survive page reload
```

### 3. Memory Leaks

**Problem**: Event listeners not cleaned up

```javascript
// Add cleanup
window.addEventListener('beforeunload', () => {
    // Clean up listeners
    removeEventListeners();
});
```

### 4. Storage Quota

**Problem**: Large history can hit storage limits

```javascript
// Limit history size
if (history.length > 1000) {
    history = history.slice(-1000);
}

// Or compress old entries
if (history.length > 100) {
    history = history.map(entry => ({
        ...entry,
        reflection: entry.reflection.substring(0, 500)
    }));
}
```

## Debugging Tips

### 1. Enable Verbose Logging

Add debug flag:

```javascript
const DEBUG = true;

function log(...args) {
    if (DEBUG) console.log('[MindfulReading]', ...args);
}

// Use throughout code
log('Article detected:', article);
log('Block status:', shouldBlock);
```

### 2. Inspect Storage

```javascript
// In background page console
browser.storage.local.get().then(console.log);

// Clear storage
browser.storage.local.clear();

// Watch storage changes
browser.storage.onChanged.addListener((changes, area) => {
    console.log('Storage changed:', changes);
});
```

### 3. Monitor Messages

```javascript
// Log all messages
browser.runtime.onMessage.addListener((message, sender) => {
    console.log('Message received:', message, 'from:', sender);
});
```

### 4. Test Article Detection

```javascript
// In page console
const detector = new ArticleDetector();
console.log('Is article?', detector.isArticlePage());
console.log('Article info:', detector.getArticleInfo());
```

## Future Enhancements

### Potential Features

1. **Cloud Sync**: Sync state across devices via iCloud
2. **Reflection Export**: Export history to markdown/PDF
3. **Reading Stats**: Time spent reading, reading speed
4. **Suggested Domains**: Auto-suggest domains based on usage
5. **Custom Word Minimums**: Per-domain word count requirements
6. **Reading Goals**: Daily/weekly article targets
7. **Spaced Repetition**: Reminder to re-read old articles
8. **Keyboard Shortcuts**: Quick access to common actions
9. **Dark Mode**: For late-night reading
10. **Mobile Version**: iOS Safari extension

### Technical Improvements

1. **Better article detection**: ML-based classification
2. **Fuzzy URL matching**: Detect same article on different domains
3. **Offline support**: Service worker for offline functionality
4. **Performance**: Lazy load resources
5. **Accessibility**: ARIA labels, keyboard navigation
6. **Internationalization**: Multi-language support

## Resources

### Safari Extension Documentation
- [Safari App Extensions](https://developer.apple.com/documentation/safariservices/safari_app_extensions)
- [WebExtension API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

### Useful Tools
- [Xcode](https://developer.apple.com/xcode/)
- [Safari Web Inspector](https://developer.apple.com/safari/tools/)

### Similar Projects
- [News Feed Eradicator](https://github.com/jordwest/news-feed-eradicator)
- [LeechBlock](https://www.proginosko.com/leechblock/)

---

**Questions? Check the main README or open an issue.**
