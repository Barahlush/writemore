# Changelog

All notable changes to Mindful Reading will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-23

### Initial Release

#### Added
- Core blocking mechanism
  - Block subsequent articles until reflection submitted
  - 200+ word requirement for full reflections
  - 10+ word requirement for skipping articles
  - Real-time word counter

- Article detection
  - Manual domain whitelist
  - Automatic article detection via tags and meta data
  - Smart filtering of non-article pages

- Timer system
  - Configurable reset timer (default 24 hours)
  - Automatic cycle reset when timer expires
  - Current article "forgiven" after reset

- Settings interface
  - Domain whitelist management
  - Auto-detection toggle
  - Timer configuration
  - Master enable/disable switch

- Statistics tracking
  - Total articles read
  - Articles written about
  - Articles skipped
  - Current reading streak

- History
  - Full list of read articles
  - All reflections saved
  - Timestamps and word counts
  - Filter by written/skipped

- User interface
  - Beautiful block overlay
  - Settings popup
  - Main app with status display
  - Responsive design

#### Technical Details
- Built with Safari App Extension framework
- JavaScript content and background scripts
- Local storage for state persistence
- No network requests (fully offline)
- No tracking or analytics

### Known Issues
- Extension must be manually enabled in Safari after installation
- No cross-device sync
- Icons are placeholders (need proper designs)
- History view is basic (no search/filter)

### Future Improvements
See IMPLEMENTATION_NOTES.md for planned features.

---

## Development Notes

### Version Numbering
- **Major** (1.x.x): Breaking changes, major rewrites
- **Minor** (x.1.x): New features, enhancements
- **Patch** (x.x.1): Bug fixes, minor improvements

### Release Process
1. Update version in Info.plist (both targets)
2. Update CHANGELOG.md
3. Create git tag
4. Build release version
5. Test thoroughly
6. Archive and distribute (if applicable)

---

## Upcoming in v1.1.0

### Planned Features
- [ ] Proper app icons (all sizes)
- [ ] Export reflections to markdown
- [ ] Enhanced statistics dashboard
- [ ] Reading time tracking
- [ ] Improved article detection
- [ ] Dark mode support
- [ ] Keyboard shortcuts

### Planned Fixes
- [ ] Better handling of redirects
- [ ] Improved URL normalization
- [ ] More robust storage error handling
- [ ] Performance optimizations

---

## Feedback & Contributions

Found a bug? Have a feature request? Open an issue on GitHub!
