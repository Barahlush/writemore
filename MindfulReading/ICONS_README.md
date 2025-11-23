# Icon Requirements

The extension needs icons in various sizes for different purposes.

## Required Icon Sizes

### App Icon (Main Application)
- 16x16px
- 32x32px
- 64x64px
- 128x128px
- 256x256px
- 512x512px
- 1024x1024px

### Extension Toolbar Icon
- 16x16px (Regular)
- 32x32px (Retina)
- 48x48px
- 96x96px (Retina)

### Extension Icon (in Safari Preferences)
- 48x48px
- 96x96px (Retina)
- 128x128px
- 256x256px (Retina)

## Design Guidelines

### Concept
The icon should represent:
- **Reading** (book, article, text)
- **Mindfulness** (calm, focused, intentional)
- **Writing** (pen, pencil, reflection)

### Suggested Design
A simple, clean design that works at small sizes:

**Option 1: Book + Pen**
```
📚 + ✍️
```
A book icon with a pen/pencil overlay

**Option 2: Article + Checkmark**
```
📄 + ✓
```
A document/article with a checkmark

**Option 3: Abstract Representation**
```
Simple geometric shape representing:
- A book (rectangle with spine)
- A writing line (horizontal line)
- Focus/attention (dot or circle)
```

### Colors
- **Primary**: Purple/Blue gradient (#667eea to #764ba2)
  - Matches UI theme
  - Professional and calming
- **Accent**: White/Light gray for contrast
- **Alternative**: Green for completion/success (#10b981)

### Style
- **Flat design**: Works well at small sizes
- **Clear silhouette**: Recognizable in toolbar
- **High contrast**: Visible in both light and dark mode
- **Simple**: No tiny details that disappear at 16x16

## Creating Icons

### Using Design Tools

**Sketch / Figma:**
1. Create artboard at 1024x1024px
2. Design icon with 10% padding on all sides
3. Export at all required sizes
4. Use PNG format with transparency

**Adobe Illustrator:**
1. Create document at 1024x1024px
2. Design in vectors
3. Export as PNG at various sizes
4. Use "Export for Screens" for batch export

**Free Tool - Pixelmator / GIMP:**
1. Create 1024x1024 canvas
2. Design icon
3. Export/resize to all sizes

### Using Icon Generators

**SF Symbols (macOS):**
- Use built-in SF Symbols app
- Find book/writing related symbols
- Export as template images

**Online Tools:**
- [IconKitchen](https://icon.kitchen/)
- [MakeAppIcon](https://makeappicon.com/)
- [AppIconGenerator](https://appicon.co/)

### Quick Placeholder

For development, you can use emoji as temporary icons:

1. Open Preview app
2. File → New from Clipboard
3. Type emoji: 📚 or ✍️ or 📖
4. Scale to desired size
5. Export as PNG

## Implementation

### In Xcode

1. **Add to Asset Catalog:**
   - Select Assets.xcassets
   - Right-click → New Image Set
   - Name it "AppIcon"
   - Drag icons to appropriate slots

2. **For Extension:**
   - Add icons to Resources/ folder
   - Name them: icon-16.png, icon-32.png, etc.
   - Reference in manifest.json

3. **Update Info.plist:**
   ```xml
   <key>CFBundleIconFile</key>
   <string>AppIcon</string>
   ```

### File Naming Convention

```
AppIcon.iconset/
├── icon_16x16.png
├── icon_16x16@2x.png
├── icon_32x32.png
├── icon_32x32@2x.png
├── icon_128x128.png
├── icon_128x128@2x.png
├── icon_256x256.png
├── icon_256x256@2x.png
└── icon_512x512.png
    icon_512x512@2x.png
```

## Example SVG Template

Here's a simple SVG you can customize:

```svg
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="512" cy="512" r="460" fill="url(#grad)"/>

  <!-- Book shape -->
  <rect x="312" y="312" width="400" height="500" rx="20" fill="white" opacity="0.9"/>
  <rect x="312" y="312" width="50" height="500" rx="20" fill="white" opacity="0.6"/>

  <!-- Writing lines -->
  <line x1="400" y1="450" x2="650" y2="450" stroke="url(#grad)" stroke-width="15" stroke-linecap="round"/>
  <line x1="400" y1="550" x2="650" y2="550" stroke="url(#grad)" stroke-width="15" stroke-linecap="round"/>
  <line x1="400" y1="650" x2="600" y2="650" stroke="url(#grad)" stroke-width="15" stroke-linecap="round"/>
</svg>
```

Save as `icon-template.svg` and edit in any SVG editor.

## Testing Icons

### Visual Check
- View at actual sizes (16px, 32px, etc.)
- Check on light and dark backgrounds
- Verify clarity and recognizability

### In Safari
1. Build app with new icons
2. Check toolbar icon
3. Check Safari Preferences extension list
4. Check macOS application icon in Finder

### Accessibility
- Sufficient contrast ratio
- Clear shape/silhouette
- Works for color-blind users

## Resources

- [Apple Human Interface Guidelines - Icons](https://developer.apple.com/design/human-interface-guidelines/macos/icons-and-images/app-icon/)
- [SF Symbols App](https://developer.apple.com/sf-symbols/)
- [Icon Design Tutorial](https://developer.apple.com/design/resources/)

---

**For now, the extension works without custom icons, but adding them will make it look professional!**
