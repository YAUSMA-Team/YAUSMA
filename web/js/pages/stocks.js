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
        console.log('DataApi client available:', !!window.dataApi);
        
        showLoadingState();
        
        let stocks;
        
        // Check if API client is available
        if (window.dataApi) {
            // Use real API to fetch market overview
            stocks = await new Promise((resolve, reject) => {
                window.dataApi.getMarketOverview((error, data, response) => {
                    if (error) {
                        console.error('API error loading stocks:', error);
                        reject(error);
                    } else {
                        resolve(data || []);
                    }
                });
            });
            
        } else {
            console.log('API client not available');
            stocks = [];
        }
        
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
        
        // Show error state
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

// Load mock data as fallback - no longer available
function loadMockData() {
    console.log('Mock data no longer available. Please ensure API is running.');
    showEmptyState();
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
    // Navigate to stock detail page
    console.log('Navigating to stock detail for:', stock.symbol);
    window.location.href = `stock-detail.html?symbol=${encodeURIComponent(stock.symbol)}`;
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