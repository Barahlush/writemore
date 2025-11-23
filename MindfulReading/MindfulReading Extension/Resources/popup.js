// Popup Script - Manages settings and displays statistics
document.addEventListener('DOMContentLoaded', async () => {
    await loadCurrentState();
    setupEventListeners();
});

async function loadCurrentState() {
    // Load settings
    const settingsResponse = await sendMessage({ action: 'getSettings' });
    const settings = settingsResponse.settings;

    document.getElementById('extensionEnabled').checked = settings.extensionEnabled;
    document.getElementById('resetTimer').value = settings.resetTimerHours;
    document.getElementById('autoDetection').checked = settings.autoDetection;
    document.getElementById('domainWhitelist').value = settings.domainWhitelist.join('\n');

    // Load statistics
    const statsResponse = await sendMessage({ action: 'getStatistics' });
    const stats = statsResponse.statistics;

    document.getElementById('totalArticles').textContent = stats.totalArticlesRead;
    document.getElementById('writtenAbout').textContent = stats.articlesWrittenAbout;
    document.getElementById('skipped').textContent = stats.articlesSkipped;

    // Load current article status
    const currentResponse = await sendMessage({ action: 'getCurrentArticle' });
    const currentArticle = currentResponse.currentArticle;

    displayCurrentStatus(currentArticle);

    // Load history
    const historyResponse = await sendMessage({ action: 'getHistory' });
    const history = historyResponse.history;

    displayHistory(history);
}

function displayCurrentStatus(currentArticle) {
    const statusDiv = document.getElementById('currentStatus');

    if (currentArticle) {
        const timeAgo = getTimeAgo(currentArticle.timestamp);
        statusDiv.innerHTML = `
            <div class="status-current-article">${escapeHtml(currentArticle.title)}</div>
            <div class="status-time">Started reading ${timeAgo}</div>
        `;
    } else {
        statusDiv.innerHTML = `
            <div class="status-no-article">No active article - you can read freely</div>
        `;
    }
}

function displayHistory(history) {
    const historyList = document.getElementById('historyList');

    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No articles read yet</div>';
        return;
    }

    // Show last 5 items
    const recentHistory = history.slice(-5).reverse();

    historyList.innerHTML = recentHistory.map(item => `
        <div class="history-item">
            <div class="history-title">${escapeHtml(item.title)}</div>
            <div class="history-meta">
                <span class="history-type-${item.type}">${item.type === 'written' ? '✍️ Written' : '⏭️ Skipped'}</span>
                · ${item.wordCount} words
                · ${getTimeAgo(item.dateAdded)}
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Extension toggle
    document.getElementById('extensionEnabled').addEventListener('change', async (e) => {
        await sendMessage({
            action: 'updateSettings',
            settings: { extensionEnabled: e.target.checked }
        });
        showSaveNotification();
    });

    // Save settings button
    document.getElementById('saveSettings').addEventListener('click', async () => {
        const resetTimerHours = parseInt(document.getElementById('resetTimer').value);
        const autoDetection = document.getElementById('autoDetection').checked;
        const domainWhitelistText = document.getElementById('domainWhitelist').value;
        const domainWhitelist = domainWhitelistText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        await sendMessage({
            action: 'updateSettings',
            settings: {
                resetTimerHours: resetTimerHours,
                autoDetection: autoDetection,
                domainWhitelist: domainWhitelist
            }
        });

        showSaveNotification();
    });

    // View full history (could open a new page)
    document.getElementById('viewFullHistory').addEventListener('click', () => {
        // For now, just show an alert
        // In a full implementation, this could open a dedicated history page
        alert('Full history view coming soon!');
    });
}

async function sendMessage(message) {
    return new Promise((resolve) => {
        browser.runtime.sendMessage(message, resolve);
    });
}

function showSaveNotification() {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.textContent = '✓ Settings saved';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    return Math.floor(seconds / 86400) + ' days ago';
}
