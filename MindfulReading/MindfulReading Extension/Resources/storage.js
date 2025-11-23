// Storage Manager - Handles all persistent state
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'mindfulReadingState';
        this.state = null;
    }

    async initialize() {
        await this.loadState();
        if (!this.state) {
            this.state = this.createDefaultState();
            await this.saveState();
        }
    }

    createDefaultState() {
        return {
            currentArticle: null,
            cycleStartTime: null,
            whitelistedArticles: [],
            settings: {
                resetTimerHours: 24,
                autoDetection: true,
                domainWhitelist: [],
                extensionEnabled: true
            },
            statistics: {
                totalArticlesRead: 0,
                articlesWrittenAbout: 0,
                articlesSkipped: 0,
                currentStreak: 0,
                lastReadDate: null
            },
            history: []
        };
    }

    async loadState() {
        return new Promise((resolve) => {
            browser.storage.local.get(this.STORAGE_KEY, (result) => {
                this.state = result[this.STORAGE_KEY] || null;
                resolve(this.state);
            });
        });
    }

    async saveState() {
        return new Promise((resolve) => {
            browser.storage.local.set({ [this.STORAGE_KEY]: this.state }, () => {
                resolve();
            });
        });
    }

    // Current Article Management
    getCurrentArticle() {
        return this.state.currentArticle;
    }

    async setCurrentArticle(article) {
        this.state.currentArticle = article;
        if (!this.state.cycleStartTime) {
            this.state.cycleStartTime = Date.now();
        }
        await this.saveState();
    }

    async clearCurrentArticle() {
        this.state.currentArticle = null;
        await this.saveState();
    }

    // Whitelist Management
    isArticleWhitelisted(normalizedUrl) {
        return this.state.whitelistedArticles.some(
            article => article.normalizedUrl === normalizedUrl
        );
    }

    async addToWhitelist(article, reflection, type = 'written') {
        const entry = {
            ...article,
            dateAdded: Date.now(),
            reflection: reflection,
            type: type,
            wordCount: this.countWords(reflection)
        };

        this.state.whitelistedArticles.push(entry);
        this.state.history.push(entry);

        // Update statistics
        this.state.statistics.totalArticlesRead++;
        if (type === 'written') {
            this.state.statistics.articlesWrittenAbout++;
        } else {
            this.state.statistics.articlesSkipped++;
        }

        await this.saveState();
    }

    // Timer Management
    getCycleStartTime() {
        return this.state.cycleStartTime;
    }

    getResetTimerHours() {
        return this.state.settings.resetTimerHours;
    }

    hasTimerExpired() {
        if (!this.state.cycleStartTime) return false;

        const elapsed = Date.now() - this.state.cycleStartTime;
        const resetMs = this.state.settings.resetTimerHours * 60 * 60 * 1000;

        return elapsed >= resetMs;
    }

    async resetCycle() {
        this.state.currentArticle = null;
        this.state.cycleStartTime = null;
        await this.saveState();
    }

    // Settings Management
    getSettings() {
        return { ...this.state.settings };
    }

    async updateSettings(newSettings) {
        this.state.settings = { ...this.state.settings, ...newSettings };
        await this.saveState();
    }

    isDomainWhitelisted(url) {
        const hostname = new URL(url).hostname;
        return this.state.settings.domainWhitelist.some(domain => {
            if (domain.startsWith('*.')) {
                const baseDomain = domain.substring(2);
                return hostname.endsWith(baseDomain);
            }
            return hostname === domain || hostname.endsWith('.' + domain);
        });
    }

    isExtensionEnabled() {
        return this.state.settings.extensionEnabled;
    }

    isAutoDetectionEnabled() {
        return this.state.settings.autoDetection;
    }

    // Statistics
    getStatistics() {
        return { ...this.state.statistics };
    }

    getHistory() {
        return [...this.state.history];
    }

    // Utility
    countWords(text) {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    normalizeUrl(url) {
        try {
            const urlObj = new URL(url);
            // Remove query parameters and hash
            return urlObj.origin + urlObj.pathname;
        } catch (e) {
            return url;
        }
    }

    // Get full state for debugging
    getState() {
        return { ...this.state };
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
