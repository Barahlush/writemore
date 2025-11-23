# Testing Guide for writemore

Since this is a Safari extension for macOS, it requires manual testing on a Mac. This guide provides a comprehensive testing checklist.

## Prerequisites

- macOS 10.14+
- Xcode installed
- Safari 14.0+
- Extension built and installed (see XCODE_SETUP.md)

## Testing Checklist

### ✅ 1. Installation & Setup

- [ ] Build succeeds in Xcode without errors
- [ ] App launches successfully
- [ ] Extension appears in Safari Preferences → Extensions
- [ ] Extension can be enabled
- [ ] "Access to all websites" permission can be granted
- [ ] Extension toolbar icon appears in Safari

### ✅ 2. Settings Interface

- [ ] Click extension toolbar icon → Popup opens
- [ ] All UI elements visible and styled correctly
- [ ] Extension toggle works (enable/disable)
- [ ] Timer dropdown shows correct options
- [ ] Auto-detection checkbox works
- [ ] Domain whitelist textarea accepts input
- [ ] "Save Settings" button works
- [ ] Settings persist after restart

### ✅ 3. Domain Whitelist

Test adding domains:
- [ ] Add `lesswrong.com` to whitelist
- [ ] Add `*.substack.com` to whitelist
- [ ] Save settings
- [ ] Navigate to lesswrong.com → Should track
- [ ] Navigate to any substack.com → Should track
- [ ] Navigate to unlisted domain → Should not track (if auto-detect off)

### ✅ 4. Article Detection

**With Auto-Detection ON:**
- [ ] Navigate to Wikipedia article → Detected as article
- [ ] Navigate to Medium post → Detected as article
- [ ] Navigate to Google.com → NOT detected (homepage)
- [ ] Navigate to Reddit comments → NOT detected
- [ ] Navigate to Twitter → NOT detected

**With Auto-Detection OFF:**
- [ ] Only whitelisted domains are tracked
- [ ] Non-whitelisted domains load normally

### ✅ 5. Core Reading Flow

**First Article:**
- [ ] Navigate to article on whitelisted domain
- [ ] Article loads normally (no blocking)
- [ ] Check popup → Shows as "current article"

**Second Article:**
- [ ] Try to navigate to another article
- [ ] Page is blocked with overlay
- [ ] Overlay shows correct previous article title
- [ ] Word counter shows "0 words"
- [ ] "Submit Reflection" button is disabled
- [ ] "Skip Article" button is visible

**Write Reflection (200+ words):**
- [ ] Type 100 words → Counter updates, button stays disabled
- [ ] Type 199 words → Counter shows 199, button stays disabled
- [ ] Type 200 words → Counter shows 200, button enables
- [ ] Button turns green or shows visual change
- [ ] Click "Submit Reflection"
- [ ] Overlay disappears
- [ ] Article loads successfully

**Third Article:**
- [ ] Previous article now accessible (whitelisted)
- [ ] New article becomes current
- [ ] Try fourth article → Blocked again

### ✅ 6. Skip Functionality

- [ ] On block overlay, click "Skip Article"
- [ ] Skip dialog appears
- [ ] Type 5 words → Button disabled
- [ ] Type 9 words → Button disabled
- [ ] Type 10 words → Button enables
- [ ] Click "Skip" button
- [ ] Article unlocks and loads
- [ ] Skipped article added to history as "skipped"

### ✅ 7. Word Counter Accuracy

Test with different text:
- [ ] Single word: "Test" → 1 word
- [ ] Multiple words: "This is a test" → 4 words
- [ ] Extra spaces: "Word  with   spaces" → 3 words
- [ ] Line breaks: "Line\nBreak\nTest" → 3 words
- [ ] Punctuation: "Don't stop! Keep going..." → 4 words
- [ ] 200 exact words → Button enables
- [ ] 201 words → Still enabled

### ✅ 8. URL Normalization

Test same article with different URLs:
- [ ] Access `example.com/article`
- [ ] Try `example.com/article?utm_source=twitter` → Same article (not blocked)
- [ ] Try `example.com/article#section` → Same article (not blocked)
- [ ] Try `example.com/article/` → Same article (not blocked)
- [ ] Try `example.com/different-article` → Different (blocked)

### ✅ 9. Timer & Reset Cycle

**24-hour timer (default):**
- [ ] Read first article at time T
- [ ] Check popup → Shows cycle start time
- [ ] Wait 23 hours → Article still blocked
- [ ] Wait 24 hours → Next article loads freely
- [ ] Previous article NOT in whitelist (was forgiven)

**Custom timer:**
- [ ] Set timer to 12 hours
- [ ] Read article
- [ ] Wait 12 hours
- [ ] Verify reset works

### ✅ 10. Statistics

- [ ] Check popup stats after reading:
  - [ ] Total Read increments
  - [ ] Written About increments (for full reflections)
  - [ ] Skipped increments (for skipped articles)

- [ ] History section shows recent articles
- [ ] Each entry shows:
  - [ ] Article title
  - [ ] Type (written/skipped)
  - [ ] Word count
  - [ ] Time ago

### ✅ 11. Multiple Tabs

**Same Article:**
- [ ] Open article in Tab 1
- [ ] Open same article in Tab 2
- [ ] Both tabs load (same current article)

**Different Articles:**
- [ ] Tab 1: Current article
- [ ] Tab 2: Try different article → Blocked
- [ ] Tab 3: Try another article → Blocked
- [ ] Write reflection in Tab 2
- [ ] Submit → Tab 2 unblocks
- [ ] Tab 3 still blocked (need to write about Tab 2's article)

**Simultaneous Submission:**
- [ ] Open block overlay in 2 tabs
- [ ] Write in Tab 1, submit
- [ ] Tab 2 should update/unblock

### ✅ 12. Navigation

**Back Button:**
- [ ] At blocked article, click back
- [ ] Returns to previous page correctly

**Refresh:**
- [ ] On current article → F5 → Reloads normally
- [ ] On blocked article → F5 → Overlay reappears
- [ ] On whitelisted article → F5 → Reloads normally

**Links from Article:**
- [ ] Click external link (Wikipedia, etc.) → Opens normally
- [ ] Click link to another article → Blocked

### ✅ 13. Extension Enable/Disable

- [ ] Disable extension mid-cycle
- [ ] All blocks disappear
- [ ] Can read any article
- [ ] Re-enable extension
- [ ] Blocks reappear
- [ ] Same article still current
- [ ] Cycle continues where it left off

### ✅ 14. Edge Cases

**Empty reflection:**
- [ ] Try submitting with 0 words → Button disabled

**Whitespace only:**
- [ ] Type only spaces/tabs → Should count as 0 words

**Very long reflection:**
- [ ] Paste 10,000 word essay → Should work
- [ ] Submission succeeds

**Special characters:**
- [ ] URLs in text: Counts as words
- [ ] Emojis: Handled gracefully
- [ ] Unicode: No crashes

**Non-article pages:**
- [ ] Visit homepage → Not tracked
- [ ] Visit search results → Not tracked
- [ ] Visit author page → Not tracked (usually)

**Storage limits:**
- [ ] Read 100+ articles
- [ ] Check history still works
- [ ] Check stats accuracy

### ✅ 15. Performance

- [ ] Extension doesn't slow down page loads noticeably
- [ ] Overlay injection is instant
- [ ] Word counter updates smoothly
- [ ] No lag when typing

### ✅ 16. Error Handling

**Network errors:**
- [ ] Disable WiFi mid-page load
- [ ] Extension handles gracefully

**Invalid URLs:**
- [ ] Navigate to malformed URL
- [ ] No crashes

**Storage corruption:**
- [ ] In console: `browser.storage.local.clear()`
- [ ] Extension reinitializes with defaults

### ✅ 17. Safari Integration

**Developer Tools:**
- [ ] Safari → Develop → Web Extension Background Pages → writemore
- [ ] Background console opens
- [ ] Check for errors
- [ ] `browser.storage.local.get()` works

**Content Script:**
- [ ] On any page → Inspect Element
- [ ] Console shows no errors
- [ ] Content script logs visible (if debug mode)

**Permissions:**
- [ ] Extension requests only necessary permissions
- [ ] No unexpected permission requests

## Testing Workflow

### Quick Smoke Test (5 minutes)

1. Install extension
2. Add lesswrong.com to whitelist
3. Read one article
4. Try second article → Blocked
5. Write 200 words → Submit
6. Second article loads
7. Check stats → Incremented

### Full Regression Test (30 minutes)

Go through entire checklist above.

### Stress Test

1. Read 50 articles in one session
2. Write reflections for all
3. Check performance
4. Check history accuracy
5. Verify no memory leaks

## Debugging Tips

### Extension Not Working

1. Check Safari console for JS errors
2. Verify extension is enabled
3. Check domain is whitelisted
4. Verify page is detected as article

### Block Overlay Not Appearing

1. Inspect page elements (look for `#mindful-reading-overlay`)
2. Check browser console for CSS errors
3. Verify content script is injected

### Word Counter Issues

1. Copy text to external word counter
2. Compare results
3. Check for special characters

### Storage Issues

Reset storage:
```javascript
// In background page console
browser.storage.local.clear()
```

View storage:
```javascript
browser.storage.local.get().then(console.log)
```

## Reporting Issues

When reporting bugs, include:

- [ ] macOS version
- [ ] Safari version
- [ ] Extension version
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Console errors (if any)
- [ ] Screenshots

## Success Criteria

Extension is ready for use when:

✅ All critical tests pass (1-10)
✅ No console errors in normal usage
✅ Statistics accurate
✅ Performance acceptable
✅ UI responsive and polished

---

**Happy Testing! 🧪**
