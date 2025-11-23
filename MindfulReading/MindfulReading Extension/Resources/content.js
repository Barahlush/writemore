// Content Script - Runs on every page to detect and block articles
(function() {
    'use strict';

    let articleDetector = new ArticleDetector();
    let isBlocked = false;
    let overlayInjected = false;

    // Initialize content script
    async function init() {
        // Check if we should process this page
        const shouldProcess = await checkIfShouldProcess();

        if (!shouldProcess) {
            return;
        }

        // Check if this page should be blocked
        const blockStatus = await checkBlockStatus();

        if (blockStatus.shouldBlock) {
            blockPage(blockStatus);
        }
    }

    async function checkIfShouldProcess() {
        // Ask background script if extension is enabled
        const response = await sendMessageToBackground({
            action: 'isExtensionEnabled'
        });

        if (!response || !response.enabled) {
            return false;
        }

        // Check if this is a non-article page
        if (articleDetector.isNonArticlePage()) {
            return false;
        }

        // Check if domain is whitelisted or auto-detection is on
        const domainCheck = await sendMessageToBackground({
            action: 'shouldTrackDomain',
            url: window.location.href
        });

        if (!domainCheck || !domainCheck.shouldTrack) {
            return false;
        }

        // Check if this looks like an article
        if (domainCheck.requiresAutoDetect && !articleDetector.isArticlePage()) {
            return false;
        }

        return true;
    }

    async function checkBlockStatus() {
        const articleInfo = articleDetector.getArticleInfo();

        const response = await sendMessageToBackground({
            action: 'checkArticleAccess',
            article: articleInfo
        });

        return response;
    }

    function blockPage(blockStatus) {
        if (isBlocked) return;

        isBlocked = true;

        // Hide page content
        document.body.style.overflow = 'hidden';

        // Inject overlay
        injectBlockOverlay(blockStatus);

        // Prevent navigation
        preventNavigation();
    }

    function injectBlockOverlay(blockStatus) {
        if (overlayInjected) return;

        overlayInjected = true;

        const overlay = document.createElement('div');
        overlay.id = 'mindful-reading-overlay';
        overlay.innerHTML = `
            <div class="mr-overlay-backdrop"></div>
            <div class="mr-overlay-content">
                <div class="mr-overlay-header">
                    <h1>✋ Hold on...</h1>
                    <p class="mr-current-article-label">You recently read:</p>
                    <h2 class="mr-current-article-title">${escapeHtml(blockStatus.currentArticle.title)}</h2>
                </div>

                <div class="mr-overlay-body">
                    <div class="mr-reflection-section" id="reflectionSection">
                        <p class="mr-instruction">Write at least 200 words about it to continue:</p>
                        <textarea
                            id="reflectionText"
                            class="mr-textarea"
                            placeholder="Share your thoughts, insights, or key takeaways from the article..."
                        ></textarea>
                        <div class="mr-word-count" id="wordCount">0 words</div>
                        <button
                            id="submitReflection"
                            class="mr-button mr-button-primary"
                            disabled
                        >Submit Reflection</button>
                        <button
                            id="skipArticle"
                            class="mr-button mr-button-secondary"
                        >Skip Article</button>
                    </div>

                    <div class="mr-skip-section" id="skipSection" style="display: none;">
                        <p class="mr-instruction">Why are you skipping this article?</p>
                        <textarea
                            id="skipText"
                            class="mr-textarea mr-textarea-small"
                            placeholder="Briefly explain why you're skipping..."
                        ></textarea>
                        <div class="mr-word-count" id="skipWordCount">0 words</div>
                        <button
                            id="confirmSkip"
                            class="mr-button mr-button-primary"
                            disabled
                        >Skip (10+ words required)</button>
                        <button
                            id="cancelSkip"
                            class="mr-button mr-button-secondary"
                        >Cancel</button>
                    </div>
                </div>

                <div class="mr-overlay-footer">
                    <a href="${escapeHtml(blockStatus.currentArticle.url)}" class="mr-link">
                        ← Back to previous article
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Inject styles
        injectStyles();

        // Setup event listeners
        setupOverlayListeners();
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #mindful-reading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            .mr-overlay-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
            }

            .mr-overlay-content {
                position: relative;
                max-width: 600px;
                margin: 50px auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                max-height: calc(100vh - 100px);
                display: flex;
                flex-direction: column;
            }

            .mr-overlay-header {
                padding: 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
            }

            .mr-overlay-header h1 {
                margin: 0 0 10px 0;
                font-size: 32px;
                font-weight: 600;
            }

            .mr-current-article-label {
                margin: 0 0 5px 0;
                opacity: 0.9;
                font-size: 14px;
            }

            .mr-current-article-title {
                margin: 0;
                font-size: 20px;
                font-weight: 500;
            }

            .mr-overlay-body {
                padding: 30px;
                overflow-y: auto;
                flex: 1;
            }

            .mr-instruction {
                font-size: 16px;
                color: #333;
                margin: 0 0 15px 0;
                font-weight: 500;
            }

            .mr-textarea {
                width: 100%;
                min-height: 200px;
                padding: 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 15px;
                font-family: inherit;
                resize: vertical;
                transition: border-color 0.2s;
                box-sizing: border-box;
            }

            .mr-textarea:focus {
                outline: none;
                border-color: #667eea;
            }

            .mr-textarea-small {
                min-height: 100px;
            }

            .mr-word-count {
                text-align: right;
                margin: 8px 0 15px 0;
                font-size: 14px;
                color: #666;
                font-weight: 500;
            }

            .mr-word-count.mr-sufficient {
                color: #10b981;
            }

            .mr-button {
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                margin-right: 10px;
            }

            .mr-button-primary {
                background: #667eea;
                color: white;
            }

            .mr-button-primary:hover:not(:disabled) {
                background: #5568d3;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .mr-button-primary:disabled {
                background: #ccc;
                cursor: not-allowed;
                opacity: 0.6;
            }

            .mr-button-secondary {
                background: #f3f4f6;
                color: #333;
            }

            .mr-button-secondary:hover {
                background: #e5e7eb;
            }

            .mr-overlay-footer {
                padding: 20px 30px;
                background: #f9fafb;
                border-top: 1px solid #e5e7eb;
                text-align: center;
            }

            .mr-link {
                color: #667eea;
                text-decoration: none;
                font-size: 14px;
            }

            .mr-link:hover {
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);
    }

    function setupOverlayListeners() {
        const reflectionText = document.getElementById('reflectionText');
        const wordCount = document.getElementById('wordCount');
        const submitButton = document.getElementById('submitReflection');
        const skipButton = document.getElementById('skipArticle');

        const skipText = document.getElementById('skipText');
        const skipWordCount = document.getElementById('skipWordCount');
        const confirmSkipButton = document.getElementById('confirmSkip');
        const cancelSkipButton = document.getElementById('cancelSkip');

        const reflectionSection = document.getElementById('reflectionSection');
        const skipSection = document.getElementById('skipSection');

        // Reflection input handler
        reflectionText.addEventListener('input', () => {
            const text = reflectionText.value;
            const words = countWords(text);

            wordCount.textContent = `${words} words`;

            if (words >= 200) {
                wordCount.classList.add('mr-sufficient');
                submitButton.disabled = false;
            } else {
                wordCount.classList.remove('mr-sufficient');
                submitButton.disabled = true;
            }
        });

        // Submit reflection
        submitButton.addEventListener('click', async () => {
            const text = reflectionText.value;
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            await sendMessageToBackground({
                action: 'submitReflection',
                reflection: text,
                type: 'written'
            });

            // Reload page to show content
            window.location.reload();
        });

        // Show skip dialog
        skipButton.addEventListener('click', () => {
            reflectionSection.style.display = 'none';
            skipSection.style.display = 'block';
            skipText.focus();
        });

        // Skip input handler
        skipText.addEventListener('input', () => {
            const text = skipText.value;
            const words = countWords(text);

            skipWordCount.textContent = `${words} words`;

            if (words >= 10) {
                skipWordCount.classList.add('mr-sufficient');
                confirmSkipButton.disabled = false;
            } else {
                skipWordCount.classList.remove('mr-sufficient');
                confirmSkipButton.disabled = true;
            }
        });

        // Confirm skip
        confirmSkipButton.addEventListener('click', async () => {
            const text = skipText.value;
            confirmSkipButton.disabled = true;
            confirmSkipButton.textContent = 'Skipping...';

            await sendMessageToBackground({
                action: 'submitReflection',
                reflection: text,
                type: 'skipped'
            });

            // Reload page to show content
            window.location.reload();
        });

        // Cancel skip
        cancelSkipButton.addEventListener('click', () => {
            skipSection.style.display = 'none';
            reflectionSection.style.display = 'block';
            skipText.value = '';
            skipWordCount.textContent = '0 words';
        });
    }

    function preventNavigation() {
        // Prevent clicking through overlay
        document.addEventListener('click', (e) => {
            if (isBlocked && !e.target.closest('#mindful-reading-overlay')) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }

    function countWords(text) {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function sendMessageToBackground(message) {
        return new Promise((resolve) => {
            browser.runtime.sendMessage(message, (response) => {
                resolve(response);
            });
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
