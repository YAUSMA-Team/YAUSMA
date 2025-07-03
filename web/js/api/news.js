/**
 * YAUSMA News API Client
 * Handles all news-related API communications with the Rust backend
 */

// API Configuration - Easily configurable for different environments
const NEWS_API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api/data/news',
    TIMEOUT: 30000, // 30 seconds
    SUPPORTED_TICKERS: ["XMR-USD", "MDB", "GTLB", "CFLT", "GOOG"],
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    // Backend expects ticker parameter - use first ticker as default for general news
    DEFAULT_TICKER: "GOOG"
};

// News API Client Class
class NewsAPI {
    constructor(config = NEWS_API_CONFIG) {
        this.config = config;
        this.isLoading = false;
        this.abortController = null;
    }

    /**
     * Fetch all news articles with optional filtering
     * @param {Object} filters - Filter parameters
     * @param {string} filters.search - Search term
     * @param {string} filters.publisher - Publisher filter
     * @param {string} filters.date - Date range filter
     * @returns {Promise<Array>} Array of news articles
     */
    async fetchAllNews(filters = {}) {
        try {
            this.isLoading = true;
            
            console.log('=== NEWS API DEBUG ===');
            console.log('Original filters:', filters);
            
            // IMPORTANT: Backend requires ticker parameter
            // If no ticker specified, use default ticker for general news
            if (!filters.ticker) {
                filters.ticker = this.config.DEFAULT_TICKER;
                console.log('No ticker specified, using default:', filters.ticker);
            }
            
            // Remove empty filter values to clean up query
            Object.keys(filters).forEach(key => {
                if (!filters[key]) {
                    delete filters[key];
                }
            });
            
            // Build query parameters
            const queryParams = this.buildQueryParams(filters);
            const url = queryParams ? `${this.config.BASE_URL}?${queryParams}` : this.config.BASE_URL;
            
            console.log('Fetching news from:', url);
            console.log('Final filters applied:', filters);
            console.log('Query params:', queryParams);
            console.log('Full config:', this.config);
            
            const response = await this.makeRequest(url);
            
            console.log('Raw API response:', response);
            console.log('Response type:', typeof response);
            console.log('Response is array:', Array.isArray(response));
            
            const articles = this.processNewsResponse(response);
            
            console.log(`Successfully processed ${articles.length} news articles`);
            console.log('Processed articles:', articles);
            console.log('=== END NEWS API DEBUG ===');
            
            return articles;
            
        } catch (error) {
            console.error('=== NEWS API ERROR ===');
            console.error('Error fetching all news:', error);
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('=== END NEWS API ERROR ===');
            throw this.handleApiError(error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Fetch news articles for a specific ticker
     * @param {string} ticker - Stock ticker symbol
     * @param {Object} filters - Additional filter parameters
     * @returns {Promise<Array>} Array of ticker-specific news articles
     */
    async fetchTickerNews(ticker, filters = {}) {
        try {
            // Validate ticker
            if (!this.config.SUPPORTED_TICKERS.includes(ticker)) {
                throw new Error(`Unsupported ticker: ${ticker}. Supported tickers: ${this.config.SUPPORTED_TICKERS.join(', ')}`);
            }

            this.isLoading = true;
            
            // Build query parameters with ticker
            const allFilters = { ...filters, ticker };
            const queryParams = this.buildQueryParams(allFilters);
            const url = `${this.config.BASE_URL}?${queryParams}`;
            
            console.log(`Fetching news for ticker ${ticker} from:`, url);
            
            const response = await this.makeRequest(url);
            const articles = this.processNewsResponse(response);
            
            console.log(`Successfully fetched ${articles.length} news articles for ${ticker}`);
            return articles;
            
        } catch (error) {
            console.error(`Error fetching news for ticker ${ticker}:`, error);
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
     * Build query parameters string from filters object
     * @param {Object} filters - Filter parameters
     * @returns {string} URL-encoded query string
     */
    buildQueryParams(filters) {
        const params = new URLSearchParams();
        
        // Add each filter if it has a value
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.toString().trim()) {
                params.append(key, value.toString().trim());
            }
        });
        
        return params.toString();
    }

    /**
     * Process and validate API response
     * @param {Array|Object} response - Raw API response
     * @returns {Array} Processed articles array
     */
    processNewsResponse(response) {
        try {
            console.log('=== PROCESSING NEWS RESPONSE ===');
            console.log('Raw response:', response);
            console.log('Response type:', typeof response);
            console.log('Is array:', Array.isArray(response));
            
            // Ensure response is an array
            const articles = Array.isArray(response) ? response : [];
            
            console.log('Articles to process:', articles.length);
            
            // Process each article
            const processedArticles = articles.map((article, index) => {
                console.log(`Processing article ${index + 1}:`, article);
                const processed = this.processArticle(article);
                console.log(`Processed article ${index + 1}:`, processed);
                return processed;
            }).filter(Boolean);
            
            console.log('Final processed articles:', processedArticles);
            console.log('=== END PROCESSING NEWS RESPONSE ===');
            
            return processedArticles;
            
        } catch (error) {
            console.error('=== PROCESSING ERROR ===');
            console.error('Error processing news response:', error);
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('=== END PROCESSING ERROR ===');
            return [];
        }
    }

    /**
     * Process individual article from API response
     * @param {Object} article - Raw article data
     * @returns {Object|null} Processed article or null if invalid
     */
    processArticle(article) {
        try {
            // Validate required fields
            if (!article || !article.id || !article.title) {
                console.warn('Invalid article data:', article);
                return null;
            }

            return {
                id: article.id,
                title: article.title || 'Untitled',
                publisher: article.publisher || 'Unknown Publisher',
                source: article.source || '#',
                date: this.parseDate(article.date),
                summary: this.generateSummary(article.title),
                rawData: article // Keep original data for debugging
            };
            
        } catch (error) {
            console.error('Error processing article:', error);
            return null;
        }
    }

    /**
     * Parse date from various formats (primarily string from backend)
     * @param {string|number} dateValue - Date value from API
     * @returns {Date} Parsed date object
     */
    parseDate(dateValue) {
        try {
            if (!dateValue) {
                return new Date();
            }
            
            // Handle Unix timestamp as string (from backend)
            if (typeof dateValue === 'string' && /^\d+$/.test(dateValue)) {
                const timestamp = parseInt(dateValue);
                // Yahoo Finance API returns Unix timestamp in seconds
                const date = new Date(timestamp * 1000);
                return isNaN(date.getTime()) ? new Date() : date;
            }
            
            // Handle Unix timestamp as number
            if (typeof dateValue === 'number') {
                const timestamp = dateValue;
                // Check if it's in seconds (typical Unix timestamp) or milliseconds
                const date = timestamp < 1e12 ? new Date(timestamp * 1000) : new Date(timestamp);
                return isNaN(date.getTime()) ? new Date() : date;
            }
            
            // Handle ISO string or other date string formats
            const date = new Date(dateValue);
            return isNaN(date.getTime()) ? new Date() : date;
            
        } catch (error) {
            console.warn('Error parsing date:', dateValue, error);
            return new Date();
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
            'Latest developments and market insights related to this financial news story.',
            'Breaking news update with potential implications for market participants and investors.',
            'Important announcement affecting industry trends and market dynamics.',
            'Strategic business development with focus on market positioning and growth.',
            'Financial sector update with implications for stakeholders and market observers.'
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
            return new Error('News service is temporarily unavailable. Please try again later.');
        }
        
        if (error.message.includes('HTTP 500')) {
            return new Error('Server error occurred. Please try again in a few moments.');
        }
        
        if (error.message.includes('cancelled')) {
            return new Error('Request was cancelled.');
        }
        
        if (error.message.includes('Failed to fetch')) {
            return new Error('Unable to connect to news service. Please check your internet connection.');
        }
        
        // Default error message
        return new Error('Unable to load news articles. Please try again.');
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
     * Get supported tickers
     * @returns {Array<string>} Array of supported ticker symbols
     */
    getSupportedTickers() {
        return [...this.config.SUPPORTED_TICKERS];
    }

    /**
     * Validate ticker support
     * @param {string} ticker - Ticker symbol to validate
     * @returns {boolean} Whether ticker is supported
     */
    isTickerSupported(ticker) {
        return this.config.SUPPORTED_TICKERS.includes(ticker);
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
     * Fetch unique publishers from all supported tickers
     * @returns {Promise<Array<string>>} Array of unique publisher names
     */
    async fetchUniquePublishers() {
        try {
            console.log('=== FETCHING UNIQUE PUBLISHERS ===');
            
            // Check cache first
            const cachedPublishers = this.getCachedPublishers();
            if (cachedPublishers) {
                console.log('Using cached publishers:', cachedPublishers);
                return cachedPublishers;
            }

            const allPublishers = new Set();
            const fetchPromises = [];

            // Fetch news from all supported tickers
            for (const ticker of this.config.SUPPORTED_TICKERS) {
                console.log(`Fetching publishers for ticker: ${ticker}`);
                const promise = this.fetchTickerNews(ticker)
                    .then(articles => {
                        articles.forEach(article => {
                            if (article.publisher) {
                                allPublishers.add(article.publisher);
                            }
                        });
                        console.log(`Found ${articles.length} articles for ${ticker}`);
                    })
                    .catch(error => {
                        console.warn(`Failed to fetch publishers for ticker ${ticker}:`, error);
                    });
                fetchPromises.push(promise);
            }

            // Wait for all API calls to complete
            await Promise.all(fetchPromises);

            // Convert to sorted array
            const uniquePublishers = Array.from(allPublishers).sort();
            
            console.log('Unique publishers found:', uniquePublishers);
            console.log('Total unique publishers:', uniquePublishers.length);

            // Cache the results
            this.cachePublishers(uniquePublishers);
            
            console.log('=== END FETCHING UNIQUE PUBLISHERS ===');
            return uniquePublishers;

        } catch (error) {
            console.error('Error fetching unique publishers:', error);
            
            // Return fallback publishers if API fails
            const fallbackPublishers = [
                'Bloomberg', 'Reuters', 'Yahoo Finance', 'PR Newswire', 
                'MT Newswires', 'Barrons.com', 'GuruFocus.com'
            ];
            console.log('Using fallback publishers:', fallbackPublishers);
            return fallbackPublishers;
        }
    }

    /**
     * Cache publishers in localStorage
     * @param {Array<string>} publishers - Array of publisher names
     */
    cachePublishers(publishers) {
        try {
            const cacheData = {
                publishers: publishers,
                timestamp: Date.now(),
                expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            };
            localStorage.setItem('yausma_publishers_cache', JSON.stringify(cacheData));
            console.log('Publishers cached successfully');
        } catch (error) {
            console.warn('Failed to cache publishers:', error);
        }
    }

    /**
     * Get cached publishers if still valid
     * @returns {Array<string>|null} Cached publishers or null if invalid/expired
     */
    getCachedPublishers() {
        try {
            const cachedData = localStorage.getItem('yausma_publishers_cache');
            if (!cachedData) return null;

            const parsed = JSON.parse(cachedData);
            
            // Check if cache is still valid
            if (Date.now() > parsed.expiry) {
                console.log('Publisher cache expired, will fetch fresh data');
                localStorage.removeItem('yausma_publishers_cache');
                return null;
            }

            console.log('Found valid cached publishers');
            return parsed.publishers;
            
        } catch (error) {
            console.warn('Failed to read cached publishers:', error);
            localStorage.removeItem('yausma_publishers_cache');
            return null;
        }
    }

    /**
     * Clear publisher cache (useful for testing or forced refresh)
     */
    clearPublisherCache() {
        localStorage.removeItem('yausma_publishers_cache');
        console.log('Publisher cache cleared');
    }
}

// Create global instance
const newsApiClient = new NewsAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NewsAPI, newsApiClient, NEWS_API_CONFIG };
}

// Make available globally
if (typeof window !== 'undefined') {
    window.NewsAPI = NewsAPI;
    window.newsApiClient = newsApiClient;
    window.NEWS_API_CONFIG = NEWS_API_CONFIG;
}

