// Article Detector - Determines if a page is an article
class ArticleDetector {
    constructor() {
        this.articleSelectors = [
            'article',
            '[role="article"]',
            '.post',
            '.article',
            '.entry-content',
            'main article',
            '[itemtype*="Article"]'
        ];
    }

    isArticlePage() {
        // Check for article tags
        if (this.hasArticleTag()) {
            return true;
        }

        // Check meta tags
        if (this.hasArticleMetaTags()) {
            return true;
        }

        // Check for article-like structure
        if (this.hasArticleStructure()) {
            return true;
        }

        return false;
    }

    hasArticleTag() {
        return document.querySelector('article') !== null;
    }

    hasArticleMetaTags() {
        const metaTags = document.querySelectorAll('meta[property^="og:"], meta[name^="article:"]');

        for (const meta of metaTags) {
            const property = meta.getAttribute('property') || meta.getAttribute('name');
            const content = meta.getAttribute('content');

            if (property === 'og:type' && content === 'article') {
                return true;
            }

            if (property && property.startsWith('article:')) {
                return true;
            }
        }

        return false;
    }

    hasArticleStructure() {
        // Look for common article selectors
        for (const selector of this.articleSelectors) {
            const element = document.querySelector(selector);
            if (element && this.isLikelyArticle(element)) {
                return true;
            }
        }

        return false;
    }

    isLikelyArticle(element) {
        const text = element.innerText || '';
        const wordCount = text.trim().split(/\s+/).length;

        // Articles typically have substantial text content
        if (wordCount < 200) {
            return false;
        }

        // Check for heading
        const hasHeading = element.querySelector('h1, h2, .title, .post-title') !== null;
        if (!hasHeading) {
            return false;
        }

        // Check for paragraphs
        const paragraphs = element.querySelectorAll('p');
        if (paragraphs.length < 3) {
            return false;
        }

        return true;
    }

    getArticleInfo() {
        const title = this.getArticleTitle();
        const url = window.location.href;
        const normalizedUrl = this.normalizeUrl(url);

        return {
            title: title,
            url: url,
            normalizedUrl: normalizedUrl,
            timestamp: Date.now(),
            hostname: window.location.hostname
        };
    }

    getArticleTitle() {
        // Try multiple methods to get the title

        // 1. OpenGraph title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            return ogTitle.getAttribute('content');
        }

        // 2. Article heading
        const articleHeading = document.querySelector('article h1, article .title, .post-title, .entry-title');
        if (articleHeading) {
            return articleHeading.innerText.trim();
        }

        // 3. First h1
        const h1 = document.querySelector('h1');
        if (h1) {
            return h1.innerText.trim();
        }

        // 4. Page title
        return document.title;
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

    // Check if current page looks like a non-article page
    isNonArticlePage() {
        const url = window.location.href;
        const pathname = window.location.pathname;

        // Homepage patterns
        if (pathname === '/' || pathname === '') {
            return true;
        }

        // Common non-article patterns
        const nonArticlePatterns = [
            '/search',
            '/tag/',
            '/category/',
            '/archive',
            '/about',
            '/contact',
            '/comments',
            '/user/',
            '/profile/',
            '/settings',
            '/login',
            '/signup',
            '/register'
        ];

        for (const pattern of nonArticlePatterns) {
            if (pathname.includes(pattern)) {
                return true;
            }
        }

        return false;
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArticleDetector;
}
