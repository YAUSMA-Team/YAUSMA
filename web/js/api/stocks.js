/**
 * YAUSMA Stocks API Client
 * Handles all stock market data communications with the Rust backend
 */

// API Configuration - Easily configurable for different environments
const STOCKS_API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api/data/market-overview',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes cache
    // Expected tickers from backend (based on Rust code)
    EXPECTED_TICKERS: ["XMR-USD", "MDB", "GTLB", "CFLT"]
};

// Stocks API Client Class
class StocksAPI {
    constructor(config = STOCKS_API_CONFIG) {
        this.config = config;
        this.isLoading = false;
        this.abortController = null;
        this.cache = new Map();
    }

    /**
     * Fetch market overview data (all stocks)
     * @param {Object} options - Request options
     * @param {boolean} options.forceRefresh - Skip cache and fetch fresh data
     * @returns {Promise<Array>} Array of stock market items
     */
    async fetchMarketOverview(options = {}) {
        try {
            this.isLoading = true;
            
            console.log('=== STOCKS API DEBUG ===');
            console.log('Fetching market overview with options:', options);
            console.log('API Config:', this.config);
            
            // Check cache first unless force refresh
            if (!options.forceRefresh) {
                const cachedData = this.getCachedData('market-overview');
                if (cachedData) {
                    console.log('Using cached market overview data:', cachedData);
                    console.log('=== END STOCKS API DEBUG (CACHED) ===');
                    return cachedData;
                }
            }
            
            console.log('Fetching fresh market overview from:', this.config.BASE_URL);
            
            const response = await this.makeRequest(this.config.BASE_URL);
            
            console.log('Raw API response:', response);
            console.log('Response type:', typeof response);
            console.log('Response is array:', Array.isArray(response));
            
            const stocks = this.processStocksResponse(response);
            
            // Cache the processed data
            this.setCachedData('market-overview', stocks);
            
            console.log(`Successfully processed ${stocks.length} stock items`);
            console.log('Processed stocks:', stocks);
            console.log('=== END STOCKS API DEBUG ===');
            
            return stocks;
            
        } catch (error) {
            console.error('=== STOCKS API ERROR ===');
            console.error('Error fetching market overview:', error);
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('=== END STOCKS API ERROR ===');
            throw this.handleApiError(error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Make HTTP request with timeout and abort capability
     * @param {string} url - Request URL
     * @returns {Promise<Object>} Response data
     */
    async makeRequest(url) {
        // Cancel previous request if still pending
        if (this.abortController) {
            this.abortController.abort();
        }
        
        this.abortController = new AbortController();
        
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: this.abortController.signal
        };

        console.log('=== HTTP REQUEST DEBUG ===');
        console.log('Request URL:', url);
        console.log('Request options:', requestOptions);
        console.log('Request timeout:', this.config.TIMEOUT);

        // Add timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                this.abortController.abort();
                reject(new Error(`Request timeout after ${this.config.TIMEOUT}ms`));
            }, this.config.TIMEOUT);
        });

        try {
            console.log('Making fetch request...');
            const response = await Promise.race([
                fetch(url, requestOptions),
                timeoutPromise
            ]);

            console.log('HTTP Response received:');
            console.log('- Status:', response.status);
            console.log('- Status text:', response.statusText);
            console.log('- Headers:', Object.fromEntries(response.headers.entries()));
            console.log('- URL:', response.url);
            console.log('- OK:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response body:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            console.log('Parsing JSON response...');
            const data = await response.json();
            console.log('JSON parsed successfully');
            console.log('=== END HTTP REQUEST DEBUG ===');
            
            return data;
            
        } catch (error) {
            console.error('=== HTTP REQUEST ERROR ===');
            console.error('Error in makeRequest:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('=== END HTTP REQUEST ERROR ===');
            
            if (error.name === 'AbortError') {
                throw new Error('Request was cancelled');
            }
            throw error;
        }
    }

    /**
     * Process and validate API response
     * @param {Array|Object} response - Raw API response
     * @returns {Array} Processed stocks array
     */
    processStocksResponse(response) {
        try {
            console.log('=== PROCESSING STOCKS RESPONSE ===');
            console.log('Raw response:', response);
            console.log('Response type:', typeof response);
            console.log('Is array:', Array.isArray(response));
            
            // Ensure response is an array
            const stocks = Array.isArray(response) ? response : [];
            
            console.log('Stocks to process:', stocks.length);
            
            // Process each stock
            const processedStocks = stocks.map((stock, index) => {
                console.log(`Processing stock ${index + 1}:`, stock);
                const processed = this.processStock(stock);
                console.log(`Processed stock ${index + 1}:`, processed);
                return processed;
            }).filter(Boolean);
            
            console.log('Final processed stocks:', processedStocks);
            console.log('=== END PROCESSING STOCKS RESPONSE ===');
            
            return processedStocks;
            
        } catch (error) {
            console.error('=== PROCESSING ERROR ===');
            console.error('Error processing stocks response:', error);
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('=== END PROCESSING ERROR ===');
            return [];
        }
    }

    /**
     * Process individual stock from API response
     * @param {Object} stock - Raw stock data from backend
     * @returns {Object|null} Processed stock or null if invalid
     */
    processStock(stock) {
        try {
            // Validate required fields
            if (!stock || !stock.symbol || !stock.name) {
                console.warn('Invalid stock data:', stock);
                return null;
            }

            // Backend provides current_price as string (e.g., "$211.34")
            // Format to ensure exactly 2 decimal places
            const currentPrice = this.formatPrice(stock.current_price);
            
            // Backend provides change as f64 (percentage)
            const change = typeof stock.change === 'number' ? stock.change : 0;
            
            // Backend provides high/low as f64 - format to 2 decimal places
            const high = typeof stock.high === 'number' ? stock.high : 0;
            const low = typeof stock.low === 'number' ? stock.low : 0;
            
            // Backend provides volume as u64
            const volume = typeof stock.volume === 'number' ? stock.volume : 0;
            
            // Process news article if present
            const newsArticle = stock.news_article ? this.processNewsArticle(stock.news_article) : null;

            return {
                name: stock.name,
                short: stock.short || stock.symbol,
                sector: stock.sector || 'UNKNOWN',
                current_price: currentPrice,
                change: change,
                high: high,
                low: low,
                symbol: stock.symbol,
                volume: volume,
                news_article: newsArticle,
                rawData: stock // Keep original data for debugging
            };
            
        } catch (error) {
            console.error('Error processing stock:', error);
            return null;
        }
    }

    /**
     * Format price to show exactly 2 decimal places
     * @param {string|number} price - Price value from backend
     * @returns {string} Formatted price string
     */
    formatPrice(price) {
        try {
            if (!price) return '$0.00';
            
            // If price is already a formatted string (e.g., "$211.34"), extract the number
            let numericPrice;
            if (typeof price === 'string') {
                // Remove currency symbols and parse as float
                numericPrice = parseFloat(price.replace(/[$,]/g, ''));
            } else if (typeof price === 'number') {
                numericPrice = price;
            } else {
                numericPrice = 0;
            }
            
            // Ensure it's a valid number
            if (isNaN(numericPrice)) {
                numericPrice = 0;
            }
            
            // Format to exactly 2 decimal places with dollar sign
            return '$' + numericPrice.toFixed(2);
            
        } catch (error) {
            console.warn('Error formatting price:', price, error);
            return '$0.00';
        }
    }

    /**
     * Process news article from stock data
     * @param {Object} newsArticle - Raw news article data
     * @returns {Object|null} Processed news article or null if invalid
     */
    processNewsArticle(newsArticle) {
        try {
            if (!newsArticle || !newsArticle.id || !newsArticle.title) {
                return null;
            }

            return {
                id: newsArticle.id,
                title: newsArticle.title,
                publisher: newsArticle.publisher || 'Unknown Publisher',
                source: newsArticle.source || '#',
                date: newsArticle.date || Date.now().toString(),
                summary: this.generateSummary(newsArticle.title)
            };
            
        } catch (error) {
            console.error('Error processing news article:', error);
            return null;
        }
    }

    /**
     * Generate article summary from title
     * @param {string} title - Article title
     * @returns {string} Generated summary
     */
    generateSummary(title) {
        if (!title) return 'No summary available.';
        
        // Simple summary generation based on title keywords
        const summaryTemplates = [
            'Latest market developments and analysis for this stock.',
            'Breaking financial news with potential impact on stock performance.',
            'Important company announcement affecting investor sentiment.',
            'Strategic business update with market implications.',
            'Financial sector news relevant to stock market participants.'
        ];
        
        // Use title hash to consistently assign summary template
        const hash = this.simpleHash(title);
        return summaryTemplates[hash % summaryTemplates.length];
    }

    /**
     * Simple hash function for consistent summary assignment
     * @param {string} str - String to hash
     * @returns {number} Hash value
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Handle API errors with meaningful messages
     * @param {Error} error - Original error
     * @returns {Error} Processed error with user-friendly message
     */
    handleApiError(error) {
        console.error('API Error:', error);
        
        // Create user-friendly error messages
        if (error.message.includes('timeout')) {
            return new Error('Request timed out. Please check your internet connection and try again.');
        }
        
        if (error.message.includes('HTTP 404')) {
            return new Error('Stock data service is temporarily unavailable. Please try again later.');
        }
        
        if (error.message.includes('HTTP 500')) {
            return new Error('Server error occurred. Please try again in a few moments.');
        }
        
        if (error.message.includes('cancelled')) {
            return new Error('Request was cancelled.');
        }
        
        if (error.message.includes('Failed to fetch')) {
            return new Error('Unable to connect to stock data service. Please check your internet connection.');
        }
        
        // Default error message
        return new Error('Unable to load stock market data. Please try again.');
    }

    /**
     * Cache management methods
     */
    
    /**
     * Set cached data with expiration
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     */
    setCachedData(key, data) {
        try {
            const cacheEntry = {
                data: data,
                timestamp: Date.now(),
                expiry: Date.now() + this.config.CACHE_DURATION
            };
            this.cache.set(key, cacheEntry);
            console.log(`Data cached for key: ${key}`);
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }

    /**
     * Get cached data if still valid
     * @param {string} key - Cache key
     * @returns {any|null} Cached data or null if invalid/expired
     */
    getCachedData(key) {
        try {
            const cacheEntry = this.cache.get(key);
            if (!cacheEntry) return null;

            // Check if cache is still valid
            if (Date.now() > cacheEntry.expiry) {
                console.log(`Cache expired for key: ${key}`);
                this.cache.delete(key);
                return null;
            }

            console.log(`Found valid cached data for key: ${key}`);
            return cacheEntry.data;
            
        } catch (error) {
            console.warn('Failed to read cached data:', error);
            this.cache.delete(key);
            return null;
        }
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.clear();
        console.log('All cache cleared');
    }

    /**
     * Cancel any pending requests
     */
    cancelPendingRequests() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    /**
     * Get loading state
     * @returns {boolean} Whether API is currently loading
     */
    getLoadingState() {
        return this.isLoading;
    }

    /**
     * Get expected tickers
     * @returns {Array<string>} Array of expected ticker symbols
     */
    getExpectedTickers() {
        return [...this.config.EXPECTED_TICKERS];
    }

    /**
     * Update API configuration
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Get current API configuration
     * @returns {Object} Current configuration
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        const stats = {
            totalEntries: this.cache.size,
            entries: []
        };

        for (const [key, entry] of this.cache.entries()) {
            stats.entries.push({
                key: key,
                timestamp: entry.timestamp,
                expiry: entry.expiry,
                isExpired: Date.now() > entry.expiry,
                age: Date.now() - entry.timestamp
            });
        }

        return stats;
    }

    /**
     * Retry wrapper for API calls
     * @param {Function} apiCall - API call function
     * @param {number} attempts - Number of retry attempts
     * @returns {Promise<any>} API call result
     */
    async retryApiCall(apiCall, attempts = this.config.RETRY_ATTEMPTS) {
        let lastError;
        
        for (let i = 0; i < attempts; i++) {
            try {
                console.log(`API call attempt ${i + 1}/${attempts}`);
                const result = await apiCall();
                return result;
            } catch (error) {
                lastError = error;
                console.warn(`API call attempt ${i + 1} failed:`, error.message);
                
                // Don't retry on certain errors
                if (error.message.includes('cancelled') || 
                    error.message.includes('HTTP 404') ||
                    error.message.includes('HTTP 401')) {
                    break;
                }
                
                // Wait before retrying (except on last attempt)
                if (i < attempts - 1) {
                    const delay = this.config.RETRY_DELAY * (i + 1); // Exponential backoff
                    console.log(`Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw lastError;
    }
}

// Create global instance
const stocksApiClient = new StocksAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StocksAPI, stocksApiClient, STOCKS_API_CONFIG };
}

// Make available globally
if (typeof window !== 'undefined') {
    window.StocksAPI = StocksAPI;
    window.stocksApiClient = stocksApiClient;
    window.STOCKS_API_CONFIG = STOCKS_API_CONFIG;
}