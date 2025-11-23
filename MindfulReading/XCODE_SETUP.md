# Xcode Project Setup Guide

This guide walks you through creating the Xcode project for writemore from the provided source files.

## Step-by-Step Instructions

### 1. Create New Xcode Project

1. Open Xcode
2. File → New → Project
3. Select **macOS** → **App**
4. Click **Next**

### 2. Configure Project

Fill in the project details:
- **Product Name**: `MindfulReading`
- **Team**: Select your development team (or leave as "None" for local development)
- **Organization Identifier**: `com.mindfulreading` (or your own)
- **Bundle Identifier**: `com.mindfulreading.MindfulReading` (auto-generated)
- **Interface**: **Storyboard**
- **Language**: **Swift**
- **Use Core Data**: Unchecked
- **Include Tests**: Optional (you can uncheck)

Click **Next** and choose a location (can be temporary).

### 3. Add Safari Extension Target

1. File → New → Target
2. Select **macOS** → **Safari Extension**
3. Click **Next**
4. Configure extension:
   - **Product Name**: `MindfulReading Extension`
   - **Bundle Identifier**: `com.mindfulreading.MindfulReading-Extension` (auto-generated)
   - Click **Finish**
5. When prompted about activating scheme, click **Activate**

### 4. Replace Files with Provided Files

Now copy the files from this repository to your Xcode project:

#### Main App Files (MindfulReading target)

Delete the auto-generated files and replace with:

```
MindfulReading/
├── AppDelegate.swift          → Copy from repo
├── ViewController.swift       → Copy from repo
├── Info.plist                 → Copy from repo
└── Base.lproj/
    └── Main.storyboard       → Copy from repo
```

**Steps:**
1. In Finder, navigate to the Xcode project folder
2. Delete auto-generated `AppDelegate.swift`, `ViewController.swift`, and `Main.storyboard`
3. Copy the provided files from this repo
4. In Xcode, File → Add Files to "MindfulReading"
5. Select the files you just copied
6. Ensure "Add to targets: MindfulReading" is checked

#### Extension Files (MindfulReading Extension target)

Delete the auto-generated extension files and replace with:

```
MindfulReading Extension/
├── SafariExtensionHandler.swift           → Copy from repo
├── SafariExtensionViewController.swift    → Create new file
├── Info.plist                             → Copy from repo
└── Resources/
    ├── manifest.json                      → Copy from repo
    ├── storage.js                         → Copy from repo
    ├── article-detector.js                → Copy from repo
    ├── background.js                      → Copy from repo
    ├── content.js                         → Copy from repo
    ├── popup.html                         → Copy from repo
    ├── popup.css                          → Copy from repo
    └── popup.js                           → Copy from repo
```

**Steps:**
1. Delete auto-generated SafariExtensionHandler.swift
2. Copy provided SafariExtensionHandler.swift and SafariExtensionViewController.swift
3. Copy all Resources/ folder contents
4. In Xcode, File → Add Files to "MindfulReading Extension"
5. Select all the files you just copied
6. Ensure "Add to targets: MindfulReading Extension" is checked
7. Ensure "Create folder references" is selected for the Resources folder

### 5. Configure Extension Resources

The extension's JavaScript and HTML files need to be bundled properly:

1. Select project in Project Navigator
2. Select **MindfulReading Extension** target
3. Go to **Build Phases** tab
4. Expand **Copy Bundle Resources**
5. Click **+** and add all files from Resources/:
   - manifest.json
   - storage.js
   - article-detector.js
   - background.js
   - content.js
   - popup.html
   - popup.css
   - popup.js

### 6. Update Info.plist for Extension

1. Select `MindfulReading Extension/Info.plist`
2. Verify these keys exist:
   ```xml
   <key>NSExtension</key>
   <dict>
       <key>NSExtensionPointIdentifier</key>
       <string>com.apple.Safari.extension</string>
       <key>NSExtensionPrincipalClass</key>
       <string>$(PRODUCT_MODULE_NAME).SafariExtensionHandler</string>
       <key>SFSafariWebsiteAccess</key>
       <dict>
           <key>Level</key>
           <string>All</string>
       </dict>
   </dict>
   ```

If using the provided Info.plist, these should already be set.

### 7. Update Bundle Identifiers (If Needed)

If you used different bundle identifiers:

1. In `ViewController.swift`, find:
   ```swift
   SFSafariExtensionManager.getStateOfSafariExtension(
       withIdentifier: "com.mindfulreading.MindfulReading-Extension"
   )
   ```
   Replace with your extension's bundle identifier.

2. Same for `showPreferencesForExtension`:
   ```swift
   SFSafariApplication.showPreferencesForExtension(
       withIdentifier: "com.mindfulreading.MindfulReading-Extension"
   )
   ```

### 8. Add App Icons (Optional)

For a polished look, add app icons:

1. Create or download icons (PNG format):
   - 16x16, 32x32, 48x48, 96x96, 128x128, 256x256, 512x512

2. In Project Navigator, select `Assets.xcassets`
3. Right-click → New Image Set → Name it "AppIcon"
4. Drag icon files to appropriate slots

For extension toolbar icon:
1. Create icon-16.png, icon-32.png, icon-48.png, icon-96.png, etc.
2. Add to `MindfulReading Extension/Resources/`
3. Add to Copy Bundle Resources (Build Phases)

### 9. Set Deployment Target

1. Select project in Project Navigator
2. Select **MindfulReading** target
3. Go to **General** tab
4. Set **Deployment Target**: macOS 10.14 or later

Repeat for **MindfulReading Extension** target.

### 10. Configure Signing

For local development:

1. Select **MindfulReading** target
2. Go to **Signing & Capabilities** tab
3. Check **Automatically manage signing**
4. Select your **Team** (or use personal team for local development)

Repeat for **MindfulReading Extension** target.

> **Note**: For distribution, you'll need a valid Apple Developer account and proper signing certificates.

### 11. Build and Run

1. Select **MindfulReading** scheme (top toolbar)
2. Select **My Mac** as destination
3. Click **Run** button (or ⌘R)

The app should build successfully and launch.

### 12. Enable Extension in Safari

1. The app will show a button to open Safari Extensions preferences
2. Click the button (or manually: Safari → Preferences → Extensions)
3. Check **writemore** in the list
4. Click **Turn On**
5. Grant permission for "Access to all websites"

### 13. Test the Extension

1. Open Safari
2. Navigate to a website (e.g., lesswrong.com)
3. Click the extension toolbar icon to open settings
4. Add the domain to whitelist
5. Navigate to an article - should load normally
6. Try to open another article - should be blocked
7. Write 200+ words and submit - next article should load

## Troubleshooting

### Build Errors

**Error: "Cannot find 'browser' in scope"**
- This is expected; Safari's JavaScript API uses `browser` object at runtime
- Ignore this error in Xcode; it won't affect functionality

**Error: "Module not found"**
- Ensure all Swift files are added to correct target
- Check Target Membership in File Inspector

**Error: "Resource not found"**
- Verify all Resources files are in Copy Bundle Resources
- Check paths are correct

### Runtime Issues

**Extension doesn't appear in Safari**
- Build the project at least once
- Restart Safari
- Check that extension bundle ID matches in code

**Extension appears but doesn't work**
- Check Safari → Develop → Show Web Inspector
- Look for JavaScript errors in console
- Verify manifest.json is properly formatted

**Overlay doesn't show**
- Check content.js is injected (Safari → Develop → Show Web Inspector)
- Verify permissions are granted
- Check browser console for errors

### Development Tips

1. **Enable Develop Menu**:
   - Safari → Preferences → Advanced → Show Develop menu

2. **Inspect Extension**:
   - Develop → Web Extension Background Pages → writemore
   - Shows background script console

3. **Inspect Content Scripts**:
   - On any webpage, Develop → Show Web Inspector
   - Console shows content script logs

4. **Reset Extension Data**:
   - In background page console: `browser.storage.local.clear()`

5. **Reload Extension**:
   - Safari → Preferences → Extensions
   - Uncheck and re-check writemore

## Next Steps

After successful setup:

1. Read the [README.md](README.md) for usage instructions
2. Test all features thoroughly
3. Customize settings as needed
4. Consider adding app icons for polish
5. If distributing, set up proper code signing

## Common Customizations

### Change Bundle Identifiers

If you want to use your own bundle identifiers:

1. Change in Xcode target settings
2. Update all references in Swift code
3. Update Info.plist if needed

### Add Custom Domains

In `popup.js`, you can pre-populate default domains:

```javascript
const defaultDomains = [
    'lesswrong.com',
    '*.substack.com',
    'news.ycombinator.com'
];
```

### Modify Timer Options

In `popup.html`, change the timer options:

```html
<select id="resetTimer">
    <option value="6">6 hours</option>
    <option value="12">12 hours</option>
    <option value="24" selected>24 hours</option>
    <option value="48">48 hours</option>
    <option value="168">1 week</option>
</select>
```

### Change Word Requirements

In `content.js`, modify the thresholds:

```javascript
// Change from 200 to your preferred minimum
if (words >= 200) {
    // For reflection
}

// Change from 10 to your preferred minimum
if (words >= 10) {
    // For skip
}
```

---

**Need Help?**

If you encounter issues not covered here:
1. Check Safari's console for errors
2. Verify all files are in correct targets
3. Ensure Info.plist is properly configured
4. Try cleaning build folder (Product → Clean Build Folder)
5. Restart Xcode and Safari

Happy building! 🚀
