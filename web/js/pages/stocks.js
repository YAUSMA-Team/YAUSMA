/**
 * YAUSMA Stocks Page JavaScript
 * Handles stock display, search functionality, and theme-aware animations
 */

// Stocks page state
var StocksPage = {
    searchTerm: '',
    isLoading: false,
    stocks: [],
    filteredStocks: []
};

// Mock data matching the API structure provided by user
var mockStocksData = [
    {
        "name": "Monero USD",
        "short": "XMR-USD",
        "sector": "CRYPTOCURRENCY",
        "current_price": "$316.41",
        "change": -1.58,
        "high": 336.57,
        "low": 316.03,
        "symbol": "XMR-USD",
        "volume": 126227824,
        "news_article": {
            "id": "f532845e-5229-4b9c-beea-6df5837f8b6f",
            "title": "Best high-yield savings interest rates today, July 3, 2025 (top account pays 4.3% APY)",
            "publisher": "Yahoo Personal Finance",
            "source": "https://finance.yahoo.com/personal-finance/banking/article/best-high-yield-savings-interest-rates-today-thursday-july-3-2025-200632473.html",
            "date": "1751573192"
        }
    },
    {
        "name": "MongoDB, Inc.",
        "short": "MDB",
        "sector": "EQUITY",
        "current_price": "$211.34",
        "change": 2.80,
        "high": 213.79,
        "low": 205.41,
        "symbol": "MDB",
        "volume": 1516513,
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
        "high": 46.73,
        "low": 45.39,
        "symbol": "GTLB",
        "volume": 2197903,
        "news_article": {
            "id": "d6dfa439-1002-3df1-aa78-28abb318546a",
            "title": "GitLab Maintains Buy Rating Despite Lowered Price Target, Shows Strong Seat Expansion",
            "publisher": "Insider Monkey",
            "source": "https://finance.yahoo.com/news/gitlab-maintains-buy-rating-despite-072056917.html",
            "date": "1751440856"
        }
    },
    {
        "name": "Confluent, Inc.",
        "short": "CFLT",
        "sector": "EQUITY",
        "current_price": "$26.30",
        "change": 2.53,
        "high": 26.70,
        "low": 25.63,
        "symbol": "CFLT",
        "volume": 4695980,
        "news_article": {
            "id": "3d6e945d-6e4d-361b-924d-0e69d903fa1c",
            "title": "The 5 Most Interesting Analyst Questions From Confluent's Q1 Earnings Call",
            "publisher": "StockStory",
            "source": "https://finance.yahoo.com/news/5-most-interesting-analyst-questions-122842359.html",
            "date": "1750854522"
        }
    },
    {
        "name": "Apple Inc.",
        "short": "AAPL",
        "sector": "EQUITY",
        "current_price": "$175.43",
        "change": 1.66,
        "high": 178.21,
        "low": 173.52,
        "symbol": "AAPL",
        "volume": 89542103,
        "news_article": {
            "id": "apple-news-1",
            "title": "Apple's Q3 Earnings Beat Expectations with Strong iPhone Sales",
            "publisher": "MarketWatch",
            "source": "https://www.marketwatch.com/story/apple-earnings-q3-2025",
            "date": "1751550000"
        }
    },
    {
        "name": "Microsoft Corporation",
        "short": "MSFT",
        "sector": "EQUITY",
        "current_price": "$387.92",
        "change": 1.19,
        "high": 392.45,
        "low": 384.15,
        "symbol": "MSFT",
        "volume": 25847302,
        "news_article": {
            "id": "msft-news-1",
            "title": "Microsoft Azure Growth Accelerates as AI Demand Surges",
            "publisher": "Reuters",
            "source": "https://www.reuters.com/technology/microsoft-azure-ai-growth-2025",
            "date": "1751548000"
        }
    },
    {
        "name": "Tesla, Inc.",
        "short": "TSLA",
        "sector": "EQUITY",
        "current_price": "$248.50",
        "change": 2.33,
        "high": 255.78,
        "low": 243.12,
        "symbol": "TSLA",
        "volume": 156732891,
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
        "high": 68901.45,
        "low": 65234.12,
        "symbol": "BTC-USD",
        "volume": 892341567,
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
        "high": 3498.23,
        "low": 3398.45,
        "symbol": "ETH-USD",
        "volume": 234567891,
        "news_article": {
            "id": "eth-news-1",
            "title": "Ethereum's Latest Upgrade Shows Promise for Scalability Solutions",
            "publisher": "CoinTelegraph",
            "source": "https://cointelegraph.com/ethereum-upgrade-scalability-2025",
            "date": "1751542000"
        }
    }
];

// Initialize stocks page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('stocks.html')) {
        initStocksPage();
    }
});

// Main stocks page initialization
function initStocksPage() {
    try {
        initSearch();
        initThemeAnimations();
        initStatsCounter();
        
        // Load initial data
        loadStocksData();
        
        if (YAUSMA.debug) {
            console.log('Stocks page initialized successfully');
        }
        
    } catch (error) {
        console.error('Failed to initialize stocks page:', error);
    }
}

// Initialize search functionality
function initSearch() {
    var searchInput = document.getElementById('stockSearch');
    var clearButton = document.getElementById('clearSearch');
    
    if (searchInput) {
        // Debounced search
        var debouncedSearch = debounce(function(value) {
            StocksPage.searchTerm = value;
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
    
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            clearSearch();
        });
    }
}

// Initialize theme-aware animations
function initThemeAnimations() {
    // Add smooth transitions for theme changes
    var stockCards = document.querySelectorAll('.stock-card');
    stockCards.forEach(function(card) {
        card.style.transition = 'all 0.3s ease, background-color 0.3s ease, border-color 0.3s ease';
    });
    
    // Add hover animations
    stockCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('loading-card')) {
                this.style.transform = 'translateY(-4px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('loading-card')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Initialize stats counter animation
function initStatsCounter() {
    var stats = document.querySelectorAll('.stat-number[data-target]');
    
    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-target'));
        var duration = 2000; // 2 seconds
        var start = 0;
        var startTime = null;
        
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var current = Math.floor(progress * target);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Use Intersection Observer to trigger animation when visible
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(function(stat) {
            observer.observe(stat);
        });
    } else {
        // Fallback for older browsers
        stats.forEach(function(stat) {
            animateCounter(stat);
        });
    }
}

// Perform search with search term
function performSearch() {
    if (StocksPage.isLoading) return;
    
    var searchTerm = StocksPage.searchTerm.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Show all stocks if search is empty
        StocksPage.filteredStocks = StocksPage.stocks;
    } else {
        // Filter stocks by symbol or name
        StocksPage.filteredStocks = StocksPage.stocks.filter(function(stock) {
            return stock.symbol.toLowerCase().includes(searchTerm) ||
                   stock.name.toLowerCase().includes(searchTerm) ||
                   stock.short.toLowerCase().includes(searchTerm);
        });
    }
    
    // Update UI
    updateStocksGrid(StocksPage.filteredStocks);
    updateResultsCount(StocksPage.filteredStocks.length);
    
    // Show empty state if no results
    if (StocksPage.filteredStocks.length === 0) {
        showEmptyState();
    } else {
        hideEmptyState();
    }
}

// Load stocks data from API
async function loadStocksData() {
    try {
        console.log('=== LOADING STOCKS DATA ===');
        console.log('StocksAPI client available:', !!window.stocksApiClient);
        console.log('StocksAPI client config:', window.stocksApiClient ? window.stocksApiClient.getConfig() : 'N/A');
        
        showLoadingState();
        
        // Check if API client is available
        if (!window.stocksApiClient) {
            throw new Error('Stocks API client not available. Please ensure the API client script is loaded.');
        }
        
        console.log('Calling fetchMarketOverview...');
        const stocks = await stocksApiClient.fetchMarketOverview();
        
        console.log('Received stocks:', stocks);
        console.log('Stocks count:', stocks.length);
        
        // Update state
        StocksPage.stocks = stocks;
        StocksPage.filteredStocks = stocks;
        
        // Update UI
        console.log('Updating stocks grid...');
        updateStocksGrid(stocks);
        updateResultsCount(stocks.length);
        
        if (stocks.length === 0) {
            console.log('No stocks found, showing empty state');
            showEmptyState();
        } else {
            console.log('Stocks found, hiding empty state');
            hideEmptyState();
        }
        
        console.log(`=== LOADED ${stocks.length} STOCKS SUCCESSFULLY ===`);
        
        // Re-initialize animations for new cards
        setTimeout(initThemeAnimations, 100);
        
    } catch (error) {
        console.error('=== ERROR LOADING STOCKS DATA ===');
        console.error('Error:', error);
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== END ERROR LOADING STOCKS DATA ===');
        
        // Handle error by showing empty state with error message
        handleStockLoadError(error);
    } finally {
        hideLoadingState();
        StocksPage.isLoading = false;
    }
}

// Handle stock loading errors
function handleStockLoadError(error) {
    console.error('Stock loading error:', error);
    
    // Show error message to user
    var stocksGrid = document.getElementById('stocksGrid');
    var emptyState = document.getElementById('emptyState');
    
    if (stocksGrid && emptyState) {
        stocksGrid.style.display = 'none';
        emptyState.classList.remove('d-none');
        
        // Update empty state with error message
        var emptyContent = emptyState.querySelector('.empty-state-content');
        if (emptyContent) {
            emptyContent.innerHTML = `
                <div class="empty-state-icon">
                    <i class="bi bi-exclamation-triangle text-warning"></i>
                </div>
                <h3>Unable to load stocks</h3>
                <p class="error-message">${escapeHtml(error.message)}</p>
                <div class="error-actions">
                    <button class="btn btn-primary" onclick="retryLoadStocks()">Try Again</button>
                    <button class="btn btn-outline-secondary" onclick="loadMockData()">Load Sample Data</button>
                </div>
            `;
        }
    }
    
    // Update results count to show error state
    updateResultsCount(0);
}

// Retry loading stocks after error
function retryLoadStocks() {
    console.log('Retrying stock data load...');
    loadStocksData();
}

// Load mock data as fallback
function loadMockData() {
    try {
        console.log('Loading mock data as fallback...');
        StocksPage.stocks = mockStocksData;
        StocksPage.filteredStocks = mockStocksData;
        
        updateStocksGrid(StocksPage.stocks);
        updateResultsCount(StocksPage.stocks.length);
        hideEmptyState();
        
        // Re-initialize animations for new cards
        setTimeout(initThemeAnimations, 100);
        
        console.log('Mock data loaded successfully');
        
    } catch (error) {
        console.error('Error loading mock data:', error);
    }
}

// Update stocks grid
function updateStocksGrid(stocks) {
    var stocksGrid = document.getElementById('stocksGrid');
    if (!stocksGrid) return;
    
    // Clear current stocks
    stocksGrid.innerHTML = '';
    
    // Add new stocks
    stocks.forEach(function(stock) {
        var stockElement = createStockElement(stock);
        stocksGrid.appendChild(stockElement);
    });
}

// Create HTML element for a stock
function createStockElement(stock) {
    var colDiv = document.createElement('div');
    colDiv.className = 'col-lg-4 col-md-6 mb-4';
    
    var stockCard = document.createElement('div');
    stockCard.className = 'stock-card';
    stockCard.setAttribute('data-symbol', stock.symbol);
    
    // Format change percentage
    var changePercent = stock.change.toFixed(2);
    var changeClass = stock.change >= 0 ? 'positive' : 'negative';
    var changeIcon = stock.change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
    var changeSign = stock.change >= 0 ? '+' : '';
    
    // Format volume
    var formattedVolume = formatVolume(stock.volume);
    
    // Format high/low prices
    var formattedHigh = formatPrice(stock.high);
    var formattedLow = formatPrice(stock.low);
    
    // Determine sector badge class
    var sectorClass = stock.sector.toLowerCase();
    
    // Format news date
    var newsDate = formatNewsDate(parseInt(stock.news_article.date) * 1000);
    
    stockCard.innerHTML = `
        <div class="stock-card-header">
            <div class="stock-info">
                <h4 class="stock-symbol">${escapeHtml(stock.symbol)}</h4>
                <p class="stock-name">${escapeHtml(stock.name)}</p>
            </div>
            <span class="sector-badge ${sectorClass}">${stock.sector}</span>
        </div>
        
        <div class="stock-price-info">
            <div class="current-price">${escapeHtml(stock.current_price)}</div>
            <div class="price-change ${changeClass}">
                <i class="bi ${changeIcon}"></i>
                ${changeSign}${changePercent}%
            </div>
        </div>
        
        <div class="stock-stats">
            <div class="stat-item-small">
                <span class="stat-label-small">High</span>
                <span class="stat-value-small">${formattedHigh}</span>
            </div>
            <div class="stat-item-small">
                <span class="stat-label-small">Low</span>
                <span class="stat-value-small">${formattedLow}</span>
            </div>
            <div class="stat-item-small">
                <span class="stat-label-small">Volume</span>
                <span class="stat-value-small">${formattedVolume}</span>
            </div>
            <div class="stat-item-small">
                <span class="stat-label-small">Sector</span>
                <span class="stat-value-small">${stock.sector}</span>
            </div>
        </div>
        
        <div class="news-preview">
            <div class="news-headline">${escapeHtml(stock.news_article.title)}</div>
            <div class="news-meta">
                <span class="news-publisher">${escapeHtml(stock.news_article.publisher)}</span>
                <span class="news-date">${newsDate}</span>
            </div>
        </div>
    `;
    
    // Add click handler for stock card
    stockCard.addEventListener('click', function() {
        handleStockClick(stock);
    });
    
    colDiv.appendChild(stockCard);
    return colDiv;
}

// Handle stock card click
function handleStockClick(stock) {
    // In a real app, this would navigate to stock detail page
    console.log('Clicked on stock:', stock.symbol);
    
    // For now, show a simple alert
    alert(`Stock: ${stock.name} (${stock.symbol})\nPrice: ${stock.current_price}\nChange: ${stock.change.toFixed(2)}%`);
}

// Format volume number
function formatVolume(volume) {
    if (volume >= 1000000000) {
        return (volume / 1000000000).toFixed(1) + 'B';
    } else if (volume >= 1000000) {
        return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
}

// Format price number to exactly 2 decimal places
function formatPrice(price) {
    try {
        if (typeof price === 'string') {
            // If already formatted string, ensure 2 decimal places
            const numericPrice = parseFloat(price.replace(/[$,]/g, ''));
            if (isNaN(numericPrice)) return '$0.00';
            return '$' + numericPrice.toFixed(2);
        }
        
        if (typeof price === 'number') {
            return '$' + price.toFixed(2);
        }
        
        return '$0.00';
    } catch (error) {
        console.warn('Error formatting price:', price, error);
        return '$0.00';
    }
}

// Format news date
function formatNewsDate(timestamp) {
    var date = new Date(timestamp);
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

// Show loading state
function showLoadingState() {
    var stocksGrid = document.getElementById('stocksGrid');
    var loadingState = document.getElementById('loadingState');
    var emptyState = document.getElementById('emptyState');
    
    if (stocksGrid) stocksGrid.style.display = 'none';
    if (emptyState) emptyState.classList.add('d-none');
    if (loadingState) loadingState.classList.remove('d-none');
    
    StocksPage.isLoading = true;
}

// Hide loading state
function hideLoadingState() {
    var stocksGrid = document.getElementById('stocksGrid');
    var loadingState = document.getElementById('loadingState');
    
    if (loadingState) loadingState.classList.add('d-none');
    if (stocksGrid) stocksGrid.style.display = 'flex';
    
    StocksPage.isLoading = false;
}

// Show empty state
function showEmptyState() {
    var stocksGrid = document.getElementById('stocksGrid');
    var emptyState = document.getElementById('emptyState');
    
    if (stocksGrid) stocksGrid.style.display = 'none';
    if (emptyState) emptyState.classList.remove('d-none');
}

// Hide empty state
function hideEmptyState() {
    var stocksGrid = document.getElementById('stocksGrid');
    var emptyState = document.getElementById('emptyState');
    
    if (emptyState) emptyState.classList.add('d-none');
    if (stocksGrid) stocksGrid.style.display = 'flex';
}

// Update results count
function updateResultsCount(count) {
    var resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = count;
    }
}

// Clear search
function clearSearch() {
    StocksPage.searchTerm = '';
    
    // Reset search input
    var searchInput = document.getElementById('stockSearch');
    if (searchInput) searchInput.value = '';
    
    // Reset to show all stocks
    performSearch();
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Debounce utility function
function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
        var later = function() {
            clearTimeout(timeout);
            func.apply(this, arguments);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global use
window.StocksPage = StocksPage;
window.clearSearch = clearSearch;
window.retryLoadStocks = retryLoadStocks;
window.loadMockData = loadMockData;

// Theme integration
document.addEventListener('themeChanged', function(e) {
    // Re-initialize animations for new theme
    setTimeout(initThemeAnimations, 100);
});

// Handle page visibility change to potentially refresh data
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.location.pathname.includes('stocks.html')) {
        // Optionally refresh data when page becomes visible
        console.log('Stocks page became visible - could refresh data here');
    }
});