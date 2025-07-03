/**
 * YAUSMA News Page JavaScript
 * Handles UI interactions, filtering, and theme-aware animations
 */

// News page state
var NewsPage = {
    currentView: 'grid',
    searchTerm: '',
    isLoading: false,
    articles: []
};

// Initialize news page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('news.html')) {
        initNewsPage();
    }
});

// Main news page initialization
function initNewsPage() {
    try {
        initSearch();
        initViewSwitcher();
        initThemeAnimations();
        
        // Load initial data
        loadNewsArticles();
        
        if (YAUSMA.debug) {
            console.log('News page initialized successfully');
        }
        
    } catch (error) {
        console.error('Failed to initialize news page:', error);
    }
}

// Initialize search functionality
function initSearch() {
    var searchInput = document.getElementById('newsSearch');
    
    if (searchInput) {
        // Debounced search
        var debouncedSearch = debounce(function(value) {
            NewsPage.searchTerm = value;
            performSearch();
        }, 300);
        
        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });
        
        // Search icon animation
        searchInput.addEventListener('focus', function() {
            var searchIcon = this.parentElement.querySelector('.search-icon');
            if (searchIcon) {
                searchIcon.style.color = 'var(--interactive-blue)';
            }
        });
        
        searchInput.addEventListener('blur', function() {
            var searchIcon = this.parentElement.querySelector('.search-icon');
            if (searchIcon) {
                searchIcon.style.color = 'var(--text-tertiary)';
            }
        });
    }
}

// Initialize view switcher (grid/list)
function initViewSwitcher() {
    var viewButtons = document.querySelectorAll('[data-view]');
    var newsGrid = document.getElementById('newsGrid');
    
    viewButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var view = this.getAttribute('data-view');
            switchView(view);
            
            // Update active state
            viewButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Switch between grid and list view
function switchView(view) {
    var newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    
    NewsPage.currentView = view;
    
    if (view === 'list') {
        newsGrid.classList.add('list-view');
    } else {
        newsGrid.classList.remove('list-view');
    }
    
    // Animate view change
    newsGrid.style.opacity = '0.5';
    setTimeout(function() {
        newsGrid.style.opacity = '1';
    }, 150);
}



// Initialize theme-aware animations
function initThemeAnimations() {
    // Add smooth transitions for theme changes
    var newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(function(card) {
        card.style.transition = 'all 0.3s ease, background-color 0.3s ease, border-color 0.3s ease';
    });
    
    // Add hover animations
    newsCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Perform search with search term only
async function performSearch() {
    if (NewsPage.isLoading) return;
    
    NewsPage.isLoading = true;
    
    // Show loading state
    showLoadingState();
    
    try {
        // Use real API to fetch news with search term
        const searchParams = {
            search: NewsPage.searchTerm
        };
        
        console.log('Performing search with term:', NewsPage.searchTerm);
        
        // Fetch articles from API
        const articles = await newsApiClient.fetchAllNews(searchParams);
        
        // Update articles in state
        NewsPage.articles = articles;
        
        // Update UI with fetched articles
        updateNewsGrid(articles);
        
        // Update results count
        updateResultsCount(articles.length);
        
        // Show empty state if no results
        if (articles.length === 0) {
            showEmptyState();
        } else {
            hideEmptyState();
        }
        
    } catch (error) {
        console.error('Error performing search:', error);
        handleSearchError(error);
        
    } finally {
        hideLoadingState();
        NewsPage.isLoading = false;
    }
}


// Create HTML element for a news article
function createArticleElement(article) {
    var colDiv = document.createElement('div');
    colDiv.className = 'col-lg-6 col-md-6 mb-4';
    
    var articleEl = document.createElement('article');
    articleEl.className = 'news-card';
    
    // Handle different data formats - direct news article or from stock data
    var newsData;
    var stockInfo = null;
    
    if (article.news_article) {
        // This is from stock data structure
        newsData = article.news_article;
        stockInfo = {
            symbol: article.symbol,
            name: article.name,
            current_price: article.current_price,
            change: article.change,
            sector: article.sector
        };
    } else {
        // This is direct news data
        newsData = article;
    }
    
    // Format the date for display
    var formattedDate = formatNewsDate(newsData.date);
    
    // Create stock info section if available
    var stockInfoHtml = '';
    if (stockInfo) {
        var changeClass = stockInfo.change >= 0 ? 'positive' : 'negative';
        var changeIcon = stockInfo.change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
        var changeSign = stockInfo.change >= 0 ? '+' : '';
        var sectorClass = stockInfo.sector.toLowerCase();
        
        stockInfoHtml = `
            <div class="stock-context">
                <div class="stock-info-header">
                    <span class="stock-symbol">${escapeHtml(stockInfo.symbol)}</span>
                    <span class="sector-badge ${sectorClass}">${stockInfo.sector}</span>
                </div>
                <div class="stock-price-info">
                    <span class="stock-price">${escapeHtml(stockInfo.current_price)}</span>
                    <span class="price-change ${changeClass}">
                        <i class="bi ${changeIcon}"></i>
                        ${changeSign}${stockInfo.change.toFixed(2)}%
                    </span>
                </div>
            </div>
        `;
    }
    
    articleEl.innerHTML = `
        <div class="news-card-header">
            <div class="news-meta">
                <span class="news-publisher">${escapeHtml(newsData.publisher)}</span>
                <span class="news-date">${formattedDate}</span>
            </div>
        </div>
        ${stockInfoHtml}
        <div class="news-card-body">
            <h4 class="news-title">
                <a href="#" class="news-link">
                    ${escapeHtml(newsData.title)}
                </a>
            </h4>
            <p class="news-summary">
                ${escapeHtml(newsData.summary || generateSummary(newsData.title))}
            </p>
        </div>
        <div class="news-card-footer">
            <a href="${escapeHtml(newsData.source)}" class="news-source" target="_blank">
                <i class="bi bi-box-arrow-up-right"></i>
                Read Full Article
            </a>
        </div>
    `;
    
    colDiv.appendChild(articleEl);
    return colDiv;
}

// Generate a summary from title if summary is not available
function generateSummary(title) {
    if (!title) return 'Click to read the full article for more details.';
    return title.length > 100 ? 
        title.substring(0, 100) + '... Click to read more.' :
        title + ' Click to read the full article for more details.';
}

// Handle search errors
function handleSearchError(error) {
    console.error('Search error:', error);
    
    // Show error message to user
    var newsGrid = document.getElementById('newsGrid');
    var emptyState = document.getElementById('emptyState');
    
    if (newsGrid && emptyState) {
        newsGrid.style.display = 'none';
        emptyState.classList.remove('d-none');
        
        // Update empty state with error message
        var emptyContent = emptyState.querySelector('.empty-state-content');
        if (emptyContent) {
            emptyContent.innerHTML = `
                <div class="empty-state-icon">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
                <h3>Unable to load news</h3>
                <p>${escapeHtml(error.message)}</p>
                <button class="btn btn-primary" onclick="retrySearch()">Try Again</button>
            `;
        }
    }
}

// Retry search after error
function retrySearch() {
    performSearch();
}

// Show empty state
function showEmptyState() {
    var newsGrid = document.getElementById('newsGrid');
    var emptyState = document.getElementById('emptyState');
    
    if (newsGrid) newsGrid.style.display = 'none';
    if (emptyState) {
        emptyState.classList.remove('d-none');
        
        // Reset empty state content to default
        var emptyContent = emptyState.querySelector('.empty-state-content');
        if (emptyContent) {
            emptyContent.innerHTML = `
                <div class="empty-state-icon">
                    <i class="bi bi-newspaper"></i>
                </div>
                <h3>No news articles found</h3>
                <p>Try adjusting your search criteria to find relevant news articles.</p>
                <button class="btn btn-primary" onclick="clearSearch()">Clear Search</button>
            `;
            
            // No additional event listener needed - using onclick in HTML
        }
    }
}

// Hide empty state
function hideEmptyState() {
    var newsGrid = document.getElementById('newsGrid');
    var emptyState = document.getElementById('emptyState');
    
    if (emptyState) emptyState.classList.add('d-none');
    if (newsGrid) newsGrid.style.display = 'flex';
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Clear search
function clearSearch() {
    NewsPage.searchTerm = '';
    
    // Reset search input
    var searchInput = document.getElementById('newsSearch');
    if (searchInput) searchInput.value = '';
    
    // Reload articles
    performSearch();
}



// Show loading state
function showLoadingState() {
    var newsGrid = document.getElementById('newsGrid');
    var loadingState = document.getElementById('loadingState');
    var emptyState = document.getElementById('emptyState');
    
    if (newsGrid) newsGrid.style.display = 'none';
    if (emptyState) emptyState.classList.add('d-none');
    if (loadingState) loadingState.classList.remove('d-none');
}

// Hide loading state
function hideLoadingState() {
    var newsGrid = document.getElementById('newsGrid');
    var loadingState = document.getElementById('loadingState');
    
    if (loadingState) loadingState.classList.add('d-none');
    if (newsGrid) newsGrid.style.display = 'flex';
}

// Update results count
function updateResultsCount(count) {
    var resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = count;
    }
}

// Mock news data similar to stock API structure
var mockNewsData = [
    {
        "name": "MongoDB, Inc.",
        "short": "MDB",
        "sector": "EQUITY",
        "current_price": "$211.34",
        "change": 2.80,
        "symbol": "MDB",
        "news_article": {
            "id": "e6552044-356a-3af2-81ef-985ae8837abc",
            "title": "What Makes Atlas the Core Driver of MongoDB's Revenue Growth?",
            "publisher": "Zacks",
            "source": "https://finance.yahoo.com/news/makes-atlas-core-driver-mongodbs-171600546.html",
            "date": "1751562960"
        }
    },
    {
        "name": "GitLab Inc.",
        "short": "GTLB",
        "sector": "EQUITY",
        "current_price": "$46.37",
        "change": 1.91,
        "symbol": "GTLB",
        "news_article": {
            "id": "d6dfa439-1002-3df1-aa78-28abb318546a",
            "title": "GitLab Maintains Buy Rating Despite Lowered Price Target, Shows Strong Seat Expansion",
            "publisher": "Insider Monkey",
            "source": "https://finance.yahoo.com/news/gitlab-maintains-buy-rating-despite-072056917.html",
            "date": "1751440856"
        }
    },
    {
        "name": "Apple Inc.",
        "short": "AAPL",
        "sector": "EQUITY",
        "current_price": "$175.43",
        "change": 1.66,
        "symbol": "AAPL",
        "news_article": {
            "id": "apple-news-1",
            "title": "Apple's Q3 Earnings Beat Expectations with Strong iPhone Sales",
            "publisher": "MarketWatch",
            "source": "https://www.marketwatch.com/story/apple-earnings-q3-2025",
            "date": "1751550000"
        }
    },
    {
        "name": "Tesla, Inc.",
        "short": "TSLA",
        "sector": "EQUITY",
        "current_price": "$248.50",
        "change": 2.33,
        "symbol": "TSLA",
        "news_article": {
            "id": "tsla-news-1",
            "title": "Tesla Deliveries Exceed Expectations Despite Production Challenges",
            "publisher": "Bloomberg",
            "source": "https://www.bloomberg.com/news/tesla-deliveries-q2-2025",
            "date": "1751546000"
        }
    },
    {
        "name": "Bitcoin USD",
        "short": "BTC-USD",
        "sector": "CRYPTOCURRENCY",
        "current_price": "$67,452.30",
        "change": 3.25,
        "symbol": "BTC-USD",
        "news_article": {
            "id": "btc-news-1",
            "title": "Bitcoin Reaches New Monthly High as Institutional Adoption Grows",
            "publisher": "CoinDesk",
            "source": "https://www.coindesk.com/bitcoin-institutional-adoption-2025",
            "date": "1751544000"
        }
    },
    {
        "name": "Ethereum USD",
        "short": "ETH-USD",
        "sector": "CRYPTOCURRENCY",
        "current_price": "$3,421.67",
        "change": -0.85,
        "symbol": "ETH-USD",
        "news_article": {
            "id": "eth-news-1",
            "title": "Ethereum's Latest Upgrade Shows Promise for Scalability Solutions",
            "publisher": "CoinTelegraph",
            "source": "https://cointelegraph.com/ethereum-upgrade-scalability-2025",
            "date": "1751542000"
        }
    },
    // Add some standalone news articles (without stock context)
    {
        "id": "market-news-1",
        "title": "Federal Reserve Signals Potential Interest Rate Changes in Q4 2025",
        "publisher": "Reuters",
        "source": "https://www.reuters.com/fed-interest-rates-q4-2025",
        "date": "1751540000"
    },
    {
        "id": "market-news-2",
        "title": "Global Market Outlook: Tech Stocks Continue to Lead Recovery",
        "publisher": "Financial Times",
        "source": "https://www.ft.com/global-market-outlook-tech-2025",
        "date": "1751538000"
    }
];

// Load news articles on page initialization
async function loadNewsArticles() {
    try {
        console.log('=== LOADING INITIAL NEWS ARTICLES ===');
        
        // Show loading state
        showLoadingState();
        
        // Simulate API delay and then use mock data
        setTimeout(function() {
            try {
                var articles = mockNewsData;
                
                console.log('Received articles:', articles);
                console.log('Articles count:', articles.length);
                
                // Update state
                NewsPage.articles = articles;
                
                // Update UI
                console.log('Updating news grid...');
                updateNewsGrid(articles);
                updateResultsCount(articles.length);
                
                if (articles.length === 0) {
                    console.log('No articles found, showing empty state');
                    showEmptyState();
                } else {
                    console.log('Articles found, hiding empty state');
                    hideEmptyState();
                }
                
                console.log(`=== LOADED ${articles.length} NEWS ARTICLES SUCCESSFULLY ===`);
                
            } catch (error) {
                console.error('Error processing mock news data:', error);
                handleSearchError(error);
            } finally {
                hideLoadingState();
            }
        }, 600);
        
    } catch (error) {
        console.error('=== ERROR LOADING INITIAL NEWS ARTICLES ===');
        console.error('Error:', error);
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== END ERROR LOADING INITIAL NEWS ARTICLES ===');
        handleSearchError(error);
        hideLoadingState();
    }
}

// Ticker-specific news API functions for future stock detail pages
var TickerNewsAPI = {
    /**
     * Fetch news for a specific ticker
     * @param {string} ticker - Stock ticker symbol
     * @param {Object} filters - Additional filters
     * @returns {Promise<Array>} Array of ticker-specific news articles
     */
    fetchTickerNews: function(ticker, filters) {
        if (!window.newsApiClient) {
            throw new Error('News API client not available');
        }
        return newsApiClient.fetchTickerNews(ticker, filters);
    },
    
    /**
     * Get supported tickers
     * @returns {Array<string>} Array of supported ticker symbols
     */
    getSupportedTickers: function() {
        return window.newsApiClient ? newsApiClient.getSupportedTickers() : [];
    },
    
    /**
     * Check if ticker is supported
     * @param {string} ticker - Ticker symbol to check
     * @returns {boolean} Whether ticker is supported
     */
    isTickerSupported: function(ticker) {
        return window.newsApiClient ? newsApiClient.isTickerSupported(ticker) : false;
    }
};



// Format date for display
function formatNewsDate(date) {
    var now = new Date();
    var diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
        return 'Just now';
    } else if (diffHours < 24) {
        return diffHours + ' hour' + (diffHours === 1 ? '' : 's') + ' ago';
    } else {
        var diffDays = Math.floor(diffHours / 24);
        return diffDays + ' day' + (diffDays === 1 ? '' : 's') + ' ago';
    }
}


// Export functions for global use
window.NewsPage = NewsPage;
window.TickerNewsAPI = TickerNewsAPI;
window.clearSearch = clearSearch;
window.retrySearch = retrySearch;

// Enhanced loading state management
function showLoadingState() {
    var newsGrid = document.getElementById('newsGrid');
    var loadingState = document.getElementById('loadingState');
    var emptyState = document.getElementById('emptyState');
    var resultsHeader = document.querySelector('.results-header');
    
    if (newsGrid) newsGrid.style.display = 'none';
    if (emptyState) emptyState.classList.add('d-none');
    if (loadingState) loadingState.classList.remove('d-none');
    
    // Disable search/filter controls during loading
    toggleControlsState(false);
    
    // Update results header
    if (resultsHeader) {
        var resultsTitle = resultsHeader.querySelector('.results-title');
        if (resultsTitle) {
            resultsTitle.textContent = 'Loading news articles...';
        }
    }
}

function hideLoadingState() {
    var newsGrid = document.getElementById('newsGrid');
    var loadingState = document.getElementById('loadingState');
    var resultsHeader = document.querySelector('.results-header');
    
    if (loadingState) loadingState.classList.add('d-none');
    if (newsGrid) newsGrid.style.display = 'flex';
    
    // Re-enable search/filter controls
    toggleControlsState(true);
    
    // Reset results header
    if (resultsHeader) {
        var resultsTitle = resultsHeader.querySelector('.results-title');
        if (resultsTitle) {
            resultsTitle.textContent = 'Latest Financial News';
        }
    }
}

// Toggle search and filter controls state
function toggleControlsState(enabled) {
    var searchInput = document.getElementById('newsSearch');
    var publisherFilter = document.getElementById('publisherFilter');
    var dateFilter = document.getElementById('dateFilter');
    var clearFiltersBtn = document.getElementById('clearFilters');
    var viewButtons = document.querySelectorAll('[data-view]');
    
    [searchInput, publisherFilter, dateFilter, clearFiltersBtn].forEach(function(element) {
        if (element) {
            element.disabled = !enabled;
            if (enabled) {
                element.classList.remove('loading');
            } else {
                element.classList.add('loading');
            }
        }
    });
    
    viewButtons.forEach(function(button) {
        if (button) {
            button.disabled = !enabled;
            if (enabled) {
                button.classList.remove('loading');
            } else {
                button.classList.add('loading');
            }
        }
    });
}

// Enhanced error handling with retry mechanism
var errorRetryCount = 0;
var maxRetryAttempts = 3;

function handleSearchError(error) {
    console.error('Search error:', error);
    errorRetryCount++;
    
    var newsGrid = document.getElementById('newsGrid');
    var emptyState = document.getElementById('emptyState');
    
    if (newsGrid && emptyState) {
        newsGrid.style.display = 'none';
        emptyState.classList.remove('d-none');
        
        var emptyContent = emptyState.querySelector('.empty-state-content');
        if (emptyContent) {
            var canRetry = errorRetryCount < maxRetryAttempts;
            var retryButton = canRetry ? 
                `<button class="btn btn-primary" onclick="retrySearch()">Try Again (${maxRetryAttempts - errorRetryCount} attempts left)</button>` :
                `<button class="btn btn-secondary" disabled>Maximum retry attempts reached</button>`;
            
            emptyContent.innerHTML = `
                <div class="empty-state-icon">
                    <i class="bi bi-exclamation-triangle text-warning"></i>
                </div>
                <h3>Unable to load news</h3>
                <p class="error-message">${escapeHtml(error.message)}</p>
                <div class="error-actions">
                    ${retryButton}
                    <button class="btn btn-outline-secondary" onclick="clearSearch()">Clear Search</button>
                </div>
            `;
        }
    }
    
    // Update results count to show error state
    updateResultsCount(0);
}

// Enhanced retry with exponential backoff
function retrySearch() {
    if (errorRetryCount >= maxRetryAttempts) {
        console.warn('Maximum retry attempts reached');
        return;
    }
    
    // Reset error count on manual retry
    errorRetryCount = Math.max(0, errorRetryCount - 1);
    
    console.log(`Retrying search... (attempt ${errorRetryCount + 1}/${maxRetryAttempts})`);
    
    // Add small delay before retry
    setTimeout(function() {
        performSearch();
    }, 1000 * errorRetryCount); // Exponential backoff
}

// Reset error state on successful operation
function resetErrorState() {
    errorRetryCount = 0;
}

// Enhanced news grid update with error handling
function updateNewsGrid(articles) {
    try {
        var newsGrid = document.getElementById('newsGrid');
        if (!newsGrid) {
            throw new Error('News grid element not found');
        }
        
        // Clear current articles
        newsGrid.innerHTML = '';
        
        if (!Array.isArray(articles)) {
            throw new Error('Invalid articles data format');
        }
        
        // Add new articles
        articles.forEach(function(article, index) {
            try {
                var articleElement = createArticleElement(article);
                newsGrid.appendChild(articleElement);
            } catch (error) {
                console.warn(`Error creating article element at index ${index}:`, error);
            }
        });
        
        // Reset error state on successful update
        resetErrorState();
        
    } catch (error) {
        console.error('Error updating news grid:', error);
        throw error;
    }
}

// Theme integration
document.addEventListener('themeChanged', function(e) {
    // Re-initialize animations for new theme
    setTimeout(initThemeAnimations, 100);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (window.newsApiClient) {
        newsApiClient.cancelPendingRequests();
    }
});