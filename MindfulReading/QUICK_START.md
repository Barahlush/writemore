# Quick Start Guide

Get writemore up and running in 5 minutes.

## Prerequisites

- macOS 10.14+
- Xcode 12.0+
- Safari 14.0+

## Installation

### Option 1: Build from Source (Recommended)

1. **Create Xcode Project**
   ```bash
   # Follow the detailed guide in XCODE_SETUP.md
   ```

2. **Or use Xcode directly**:
   - Open Xcode
   - Create new macOS App project named "MindfulReading"
   - Add Safari Extension target
   - Copy all provided files to respective targets
   - Build and Run

3. **Enable in Safari**:
   - Safari → Preferences → Extensions
   - Check "writemore"
   - Allow "Access to all websites"

### Option 2: Quick Manual Setup

If you have Xcode experience, this is the fastest way:

1. Clone/download this repository
2. Open Xcode → New Project → macOS App
3. Add Safari Extension target
4. Replace all files with provided files
5. Build (⌘B) and Run (⌘R)
6. Click "Open Safari Extensions Preferences"
7. Enable extension

## First Use

### 1. Configure Extension

Click the extension toolbar icon in Safari:

- **Add domains to whitelist**:
  ```
  lesswrong.com
  astralcodexten.substack.com
  *.substack.com
  ```

- **Enable auto-detection** (optional): Detects articles everywhere

- **Set timer**: Default 24 hours (how long until reset)

Click "Save Settings"

### 2. Read Your First Article

1. Go to a whitelisted domain (e.g., lesswrong.com)
2. Click on any article
3. Article loads normally ✅
4. This is now your "current article"

### 3. Try Reading Another Article

1. Click on another article
2. **BLOCKED** ❌
3. You see an overlay:
   - "You recently read: [Previous Article]"
   - Text box for reflection
   - Word counter
   - "Submit Reflection" button
   - "Skip Article" button

### 4. Write Your Reflection

**Option A: Write Full Reflection (200+ words)**
1. Write your thoughts about the previous article
2. Watch word counter
3. Button enables at 200 words
4. Click "Submit Reflection"
5. Next article loads immediately ✅

**Option B: Skip (10+ words)**
1. Click "Skip Article"
2. Write brief reason (10+ words required)
3. Click "Skip"
4. Next article loads ✅

### 5. Continue Reading

Every new article requires writing about (or skipping) the previous one.

## Common Workflows

### Morning Reading Routine

```
☕ Open Safari with coffee
📖 Read first article of the day (loads freely)
✍️ Write reflection in Obsidian/Notes
📝 Paste into extension, submit
📖 Read next article
🔄 Repeat
```

### Focused Research Session

```
🎯 Pick a topic
📚 Find several articles to read
📖 Read first article thoroughly
✍️ Take detailed notes (200+ words)
📥 Submit reflection
📖 Move to next article
✅ Build comprehensive understanding
```

### Casual Browsing

```
🌐 Browse interesting links
📖 Read article that catches your eye
🤔 "Not worth full reflection..."
⏭️ Skip with brief reason (10 words)
📖 Continue browsing
```

## Tips & Best Practices

### Getting the Most Out of writemore

1. **Keep notes open**: Write in your preferred app, then paste
2. **Write immediately**: Reflect while article is fresh
3. **Be honest with skips**: If it's not worth reading, skip it
4. **Use whitelist liberally**: Add all your favorite sources
5. **Adjust timer**: Find what works for your reading habits

### Recommended Domains to Whitelist

High-quality long-form content:
```
lesswrong.com
astralcodexten.substack.com
*.substack.com
paulgraham.com
gwern.net
news.ycombinator.com
aeon.co
longreads.com
```

### Writing Better Reflections

- **What was the main point?** - Summarize the core argument
- **What did you learn?** - New facts, perspectives, or insights
- **Do you agree?** - Your take on the author's position
- **How does it connect?** - Links to other things you've read
- **What questions remain?** - Areas to explore further

Don't just summarize - engage with the ideas!

### Managing the Timer

**24 hours (Default)**: Good for daily reading habit
- Read in morning, writes during breaks
- Natural daily reset

**12 hours**: For intensive reading sessions
- Multiple articles per day
- Faster forgiveness if you get busy

**48-72 hours**: For weekend-only readers
- Read on weekends
- Longer grace period

## Troubleshooting

### "Extension doesn't appear in Safari"

1. Build project in Xcode at least once
2. Restart Safari
3. Check Safari → Preferences → Extensions

### "Articles aren't being blocked"

1. Check domain is in whitelist
2. Enable auto-detection
3. Verify extension is enabled (click toolbar icon)
4. Check page is actually an article (not homepage, etc.)

### "I can't access an article I wrote about"

- Shouldn't happen! All written/skipped articles are whitelisted
- Try: Click extension icon → Check history
- If missing: Clear state and start fresh
  - Safari → Develop → Web Extension Background Pages
  - Console: `browser.storage.local.clear()`

### "Timer reset but I still can't read"

- Timer only resets when you try to read a new article
- Once reset, the next article loads freely
- Check "Current Status" in popup for timer info

### "Word counter is wrong"

- Word count is based on whitespace-separated tokens
- URLs count as 1 word
- Punctuation-only doesn't count
- Should be accurate for normal text

## Keyboard Shortcuts

Extension doesn't currently have custom keyboard shortcuts, but you can:

- **⌘R**: Reload blocked page (overlay reappears)
- **⌘W**: Close tab (doesn't affect state)
- **⌘T**: New tab
- **⌘⇧[**: Back button (return to previous article)

## Statistics

Track your progress:

- **Total Read**: All articles accessed
- **Written About**: Full 200+ word reflections
- **Skipped**: Articles you skipped with brief reason
- **Streak**: Consecutive days reading

Aim for high written/skip ratio!

## Advanced Usage

### Multiple Devices

- Extension state is **local** to each browser
- Whitelist doesn't sync between devices
- Each device has independent cycle

To sync manually:
1. Export whitelist (copy from settings)
2. Import on other device (paste in settings)

### Using with Other Tools

**Obsidian/Notion**: Write reflections there, paste to extension
**Pocket/Instapaper**: Save articles, read through extension
**RSS Reader**: Click through to full articles on whitelisted sites

### Customizing Word Counts

Currently hardcoded, but you can modify:
- Edit `content.js`
- Find `if (words >= 200)` and `if (words >= 10)`
- Change numbers to your preference
- Rebuild extension

## What's Next?

1. **Build consistent habit**: Read daily for a week
2. **Experiment with settings**: Find optimal timer length
3. **Expand whitelist**: Add more quality sources
4. **Review history**: See what you've learned
5. **Adjust workflow**: Integrate with note-taking system

## Need More Help?

- **Detailed setup**: See [XCODE_SETUP.md](XCODE_SETUP.md)
- **Full documentation**: See [README.md](README.md)
- **Issues**: Open issue on GitHub

---

**Now go read mindfully! 📚✨**
