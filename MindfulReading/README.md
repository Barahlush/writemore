# ✍️ writemore - Safari Extension

A Safari extension for macOS that encourages thoughtful reading by requiring you to write a reflection before moving to the next article.

## Core Concept

**Read one article at a time.** To read the next article, you must:
- Write **200+ words** about the previous one, OR
- Write **10+ words** explaining why you're skipping it

This promotes mindful reading and helps you retain more from what you read.

## Features

### 🎯 Core Functionality
- **One article at a time**: First article loads freely, subsequent articles are blocked
- **Reflection requirement**: Write 200+ words to unlock the next article
- **Skip option**: Write 10+ words explaining why if you want to skip
- **24-hour reset**: If you don't write, the cycle resets after 24 hours

### 🔍 Article Detection
- **Domain whitelist**: Manually add domains you want tracked (most reliable)
- **Auto-detection**: Automatically detect articles on any website (optional)
- **Smart filtering**: Ignores homepages, search results, and non-article pages

### ⚙️ Customization
- **Adjustable timer**: Change reset period (12, 24, 36, 48, 72 hours)
- **Domain management**: Add/remove tracked domains
- **Toggle auto-detection**: Turn automatic article detection on/off
- **Master switch**: Enable/disable entire extension

### 📊 Statistics & History
- Total articles read
- Articles written about vs. skipped
- Full history with your reflections
- Current reading streak

## Installation & Setup

### Prerequisites
- macOS 10.14 (Mojave) or later
- Xcode 12.0 or later
- Safari 14.0 or later

### Building from Source

1. **Open in Xcode**
   ```bash
   cd MindfulReading
   open MindfulReading.xcodeproj
   ```

   If the project file doesn't exist, create it:
   - Open Xcode
   - Create New Project → macOS → App
   - Name: "MindfulReading"
   - Bundle Identifier: "com.mindfulreading.MindfulReading"
   - Add Safari Extension target (File → New → Target → Safari Extension)
   - Name: "MindfulReading Extension"
   - Copy all provided files to the respective targets

2. **Configure Bundle Identifiers**
   - Main app: `com.mindfulreading.MindfulReading`
   - Extension: `com.mindfulreading.MindfulReading-Extension`

3. **Add Files to Targets**
   - Main App target should include:
     - AppDelegate.swift
     - ViewController.swift
     - Main.storyboard
     - Info.plist

   - Extension target should include:
     - SafariExtensionHandler.swift
     - SafariExtensionViewController.swift
     - Info.plist
     - All files in Resources/ folder

4. **Build and Run**
   - Select "MindfulReading" scheme
   - Click Run (⌘R)
   - The app will launch and guide you to enable the extension

5. **Enable in Safari**
   - Safari → Preferences → Extensions
   - Check "writemore"
   - Grant necessary permissions

## First Use

### Setup
1. Install and enable the extension (see above)
2. Open the extension popup (toolbar icon) to configure:
   - Add domains to whitelist (e.g., `lesswrong.com`, `*.substack.com`)
   - Enable/disable auto-detection
   - Set reset timer (default: 24 hours)

### Your First Article
1. Navigate to an article on a whitelisted domain
2. The article loads normally - this is your "current article"
3. Try to open another article → **BLOCKED**
4. You'll see an overlay asking you to write about the first article

### Writing a Reflection
1. Write your thoughts in the text box (minimum 200 words)
2. Word counter updates in real-time
3. Submit button enables when you reach 200 words
4. Click "Submit Reflection"
5. The next article loads immediately

### Skipping an Article
1. On the block overlay, click "Skip Article"
2. Write 10+ words explaining why you're skipping
3. Click "Skip" to unlock the next article

## Usage Guide

### How It Works

**Reading Cycle:**
```
Article A (reads freely)
  ↓
Try to read Article B → BLOCKED
  ↓
Write 200+ words about Article A → Submit
  ↓
Article B loads (becomes current article)
  ↓
Try to read Article C → BLOCKED
  ↓
...and so on
```

**Timer Reset:**
- Timer starts when you read your first article
- Default: 24 hours
- When timer expires: Current article is "forgiven"
- You can read one new article freely (starts new cycle)
- Forgiven articles are NOT whitelisted (blocked if accessed later)

**Whitelisted Articles:**
- Articles you wrote about: ✅ Always accessible
- Articles you skipped: ✅ Always accessible
- Current article: ✅ Accessible until you submit reflection
- Forgiven articles: ❌ Blocked unless it's the first of a new cycle

### Domain Whitelist

Add domains you want tracked:
```
lesswrong.com
astralcodexten.substack.com
*.substack.com          # Tracks ALL Substack blogs
news.ycombinator.com
```

**Tips:**
- Use `*.domain.com` to track all subdomains
- One domain per line
- More reliable than auto-detection

### Auto-Detection

When enabled, the extension tries to detect articles on any website by looking for:
- `<article>` tags
- Article-like meta tags (OpenGraph, Schema.org)
- Substantial text content with headings and paragraphs

**Pros:**
- Works on any website
- No need to maintain whitelist

**Cons:**
- May occasionally misidentify pages
- Less reliable than manual whitelist

**Recommendation:** Enable auto-detection AND maintain a whitelist of your favorite sites.

### Multiple Tabs & Windows

- ✅ Current article: Accessible in all tabs/windows
- ✅ Whitelisted articles: Accessible in all tabs/windows
- ❌ New articles: Blocked in all tabs/windows
- Submitting in one tab: Unblocks all tabs simultaneously

### Statistics

View your reading statistics in the popup:
- **Total articles read**: All articles you've accessed
- **Written about**: Articles with full reflections
- **Skipped**: Articles you chose to skip
- **Current streak**: Days of consecutive reading

Click "View Full History" to see:
- All articles you've read
- Your complete reflections
- Dates and word counts
- Filter by written/skipped

## Troubleshooting

### Extension Not Working

1. **Check if enabled**
   - Safari → Preferences → Extensions → writemore (should be checked)

2. **Check permissions**
   - Extension needs "Access to all websites"
   - Safari → Preferences → Extensions → writemore → Details

3. **Check settings**
   - Click toolbar icon
   - Verify "Extension Enabled" toggle is ON

### Articles Not Being Detected

1. **Domain not whitelisted**
   - Add domain to whitelist in settings
   - OR enable auto-detection

2. **Auto-detection not working**
   - Page might not look like an article (homepage, comments, etc.)
   - Add domain to whitelist for more reliable tracking

3. **Check console**
   - Safari → Develop → Show Web Inspector → Console
   - Look for extension errors

### Pages Blocked Incorrectly

1. **Disable auto-detection**
   - Rely only on domain whitelist
   - Only whitelisted domains will be tracked

2. **Remove domain from whitelist**
   - If you don't want a domain tracked anymore

### Timer Not Resetting

- Timer is based on elapsed time, not calendar days
- Check "Current Status" in popup to see when cycle started
- Timer only resets when expired AND you try to read a new article

## Development

### Project Structure

```
MindfulReading/
├── MindfulReading/                  # Main macOS app
│   ├── AppDelegate.swift
│   ├── ViewController.swift
│   ├── Info.plist
│   └── Base.lproj/
│       └── Main.storyboard
├── MindfulReading Extension/        # Safari extension
│   ├── SafariExtensionHandler.swift
│   ├── SafariExtensionViewController.swift
│   ├── Info.plist
│   └── Resources/
│       ├── manifest.json           # Extension manifest
│       ├── storage.js              # State management
│       ├── article-detector.js     # Article detection
│       ├── background.js           # Background script
│       ├── content.js              # Content script
│       ├── popup.html              # Settings popup
│       ├── popup.css
│       └── popup.js
└── README.md
```

### Key Components

**storage.js**: Manages all persistent state
- Current article
- Whitelist
- Settings
- Statistics
- History

**article-detector.js**: Determines if a page is an article
- Checks for article tags
- Analyzes meta tags
- Detects article-like structure

**content.js**: Runs on every page
- Detects articles
- Blocks pages when needed
- Injects overlay UI
- Handles user input

**background.js**: Coordinates extension logic
- Manages state
- Handles messages from content scripts
- Checks timer expiration
- Updates whitelist

### Adding Features

1. **Modify storage schema**: Update `createDefaultState()` in storage.js
2. **Add settings**: Update popup.html, popup.js, and storage.js
3. **Change UI**: Modify overlay HTML in content.js
4. **Adjust detection**: Update article-detector.js

### Testing

1. **Enable Develop menu**
   - Safari → Preferences → Advanced → Show Develop menu

2. **Inspect extension**
   - Develop → Web Extension Background Pages → writemore
   - Develop → Show Web Inspector (on any page with content script)

3. **Check storage**
   - In background page console: `browser.storage.local.get()`

4. **Reset state**
   - In background page console: `browser.storage.local.clear()`

## Privacy

- **All data stored locally**: Uses Safari's local storage API
- **No analytics**: No tracking or data collection
- **No network requests**: Extension works entirely offline
- **No sync**: Data doesn't leave your device

## License

Copyright © 2024. All rights reserved.

## Contributing

This is a personal project, but feedback and suggestions are welcome!

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Keep writing! 📚**
