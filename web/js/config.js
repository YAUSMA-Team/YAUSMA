// API Configuration
const CONFIG = {
    // Backend API (Your Rust API)
    API: {
        BASE_URL: 'http://localhost:8000', // Development
        // BASE_URL: 'https://your-domain.com', // Production
        ENDPOINTS: {
            LOGIN: '/login',
            SIGNUP: '/signup',
            DELETE_USER: '/user/delete'
        }
    },

    // Marketstack API Configuration
    STOCK_API: {
        BASE_URL: 'http://api.marketstack.com/v1/',
        ACCESS_KEY: '', // To be set via environment variable
        ENDPOINTS: {
            EOD: 'eod',              // End of day prices
            INTRADAY: 'intraday',    // Real-time data
            TICKERS: 'tickers',      // Company info
            NEWS: 'news'             // Financial news
        }
    },

    // Alternative APIs
    ADDITIONAL_APIS: {
        ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
        NEWS_API: 'https://newsapi.org/v2/'
    },

    // Local Storage Keys
    STORAGE_KEYS: {
        USER_TOKEN: 'yausma_user_token',
        THEME: 'yausma_theme',
        WATCHLIST: 'yausma_watchlist',
        USER_PREFERENCES: 'yausma_preferences'
    },

    // Theme Settings
    THEME: {
        LIGHT: 'light',
        DARK: 'dark'
    },

    // API Request Settings
    REQUEST: {
        TIMEOUT: 5000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    },

    // Cache Settings
    CACHE: {
        STOCK_DATA_TTL: 5 * 60 * 1000,  // 5 minutes
        NEWS_DATA_TTL: 15 * 60 * 1000,  // 15 minutes
        MAX_CACHE_SIZE: 100             // Maximum number of items to cache
    }
}; 