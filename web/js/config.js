// YAUSMA Application Configuration
// Core configuration settings and constants

const CONFIG = {
    // Application Information
    APP: {
        NAME: 'YAUSMA',
        VERSION: '1.0.0',
        DESCRIPTION: 'Your Advanced User Stock Market Analysis',
        AUTHOR: 'YAUSMA Team'
    },

    // API Configuration
    API: {
        BASE_URL: 'http://localhost:8000',
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3,
        ENDPOINTS: {
            STOCKS: '/api/stocks',
            NEWS: '/api/news',
            AUTH: '/api/auth',
            PORTFOLIO: '/api/portfolio',
            SEARCH: '/api/search',
            MARKET_DATA: '/api/market-data'
        }
    },

    // Storage Keys for LocalStorage
    STORAGE_KEYS: {
        THEME: 'yausma_theme',
        USER_PREFERENCES: 'yausma_user_prefs',
        AUTH_TOKEN: 'yausma_auth_token',
        USER_DATA: 'yausma_user_data',
        PORTFOLIO_DATA: 'yausma_portfolio',
        WATCHLIST: 'yausma_watchlist',
        CURRENCY: 'yausma_currency',
        LOCATION: 'yausma_location',
        LANGUAGE: 'yausma_language',
        CACHE_PREFIX: 'yausma_cache_',
        ANALYTICS: 'yausma_analytics'
    },

    // Theme Configuration
    THEME: {
        DEFAULT: 'light',
        AVAILABLE: ['light', 'dark'],
        STORAGE_KEY: 'yausma_theme',
        TRANSITION_DURATION: 300,
        AUTO_SYSTEM_THEME: false
    },

    // Currency Configuration
    CURRENCY: {
        DEFAULT: 'USD',
        SUPPORTED: [
            { code: 'USD', symbol: '$', name: 'US Dollar' },
            { code: 'EUR', symbol: '¬', name: 'Euro' },
            { code: 'GBP', symbol: '£', name: 'British Pound' },
            { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
            { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
            { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
            { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
            { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' }
        ]
    },

    // Feature Flags
    FEATURES: {
        REAL_TIME_UPDATES: true,
        PUSH_NOTIFICATIONS: false,
        OFFLINE_MODE: true,
        ANALYTICS: true,
        ADVANCED_CHARTS: true,
        SOCIAL_FEATURES: false,
        MOBILE_APP_PROMPT: true,
        KEYBOARD_SHORTCUTS: true,
        ACCESSIBILITY_MODE: true,
        BETA_FEATURES: false
    },

    // UI Configuration
    UI: {
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 100,
        PAGINATION_SIZE: 20,
        SEARCH_MIN_CHARS: 2,
        NOTIFICATION_DURATION: 5000,
        MOBILE_BREAKPOINT: 768,
        TABLET_BREAKPOINT: 992,
        DESKTOP_BREAKPOINT: 1200
    },

    // Chart Configuration
    CHARTS: {
        DEFAULT_TYPE: 'line',
        COLORS: {
            PRIMARY: '#344afb',
            SUCCESS: '#00d395',
            ERROR: '#f92364',
            WARNING: '#ffc947',
            NEUTRAL: '#8a919e'
        },
        ANIMATION_DURATION: 1000,
        RESPONSIVE: true,
        MAINTAIN_ASPECT_RATIO: false
    },

    // Stock Market Configuration
    MARKET: {
        TRADING_HOURS: {
            OPEN: '09:30',
            CLOSE: '16:00',
            TIMEZONE: 'America/New_York'
        },
        UPDATE_INTERVALS: {
            REAL_TIME: 1000,
            FAST: 5000,
            NORMAL: 30000,
            SLOW: 300000
        },
        MAJOR_INDICES: [
            { symbol: 'SPY', name: 'S&P 500 ETF' },
            { symbol: 'QQQ', name: 'NASDAQ 100 ETF' },
            { symbol: 'DIA', name: 'Dow Jones ETF' },
            { symbol: 'IWM', name: 'Russell 2000 ETF' }
        ]
    },

    // News Configuration
    NEWS: {
        SOURCES: ['reuters', 'bloomberg', 'cnbc', 'marketwatch'],
        CATEGORIES: ['market', 'stocks', 'economy', 'crypto', 'commodities'],
        REFRESH_INTERVAL: 300000, // 5 minutes
        MAX_ARTICLES: 50
    },

    // Security Configuration
    SECURITY: {
        SESSION_TIMEOUT: 3600000, // 1 hour
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 900000, // 15 minutes
        PASSWORD_MIN_LENGTH: 8,
        REQUIRE_2FA: false
    },

    // Analytics Configuration
    ANALYTICS: {
        ENABLED: true,
        TRACK_ERRORS: true,
        TRACK_PERFORMANCE: true,
        TRACK_USER_INTERACTIONS: true,
        BATCH_SIZE: 10,
        FLUSH_INTERVAL: 30000
    },

    // Cache Configuration
    CACHE: {
        DEFAULT_TTL: 300000, // 5 minutes
        LONG_TTL: 3600000, // 1 hour
        SHORT_TTL: 60000, // 1 minute
        MAX_SIZE: 100,
        ENABLED: true
    },

    // Error Messages
    ERRORS: {
        NETWORK: 'Network connection error. Please check your internet connection.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        NOT_FOUND: 'The requested resource was not found.',
        SERVER_ERROR: 'Server error occurred. Please try again later.',
        VALIDATION: 'Please check your input and try again.',
        GENERIC: 'An unexpected error occurred. Please try again.'
    },

    // Success Messages
    SUCCESS: {
        LOGIN: 'Successfully signed in!',
        LOGOUT: 'Successfully signed out!',
        SAVE: 'Changes saved successfully!',
        UPDATE: 'Updated successfully!',
        DELETE: 'Deleted successfully!',
        WATCHLIST_ADD: 'Added to watchlist!',
        WATCHLIST_REMOVE: 'Removed from watchlist!'
    },

    // Regular Expressions
    REGEX: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE: /^\+?[\d\s\-\(\)]+$/,
        STOCK_SYMBOL: /^[A-Z0-9]{1,5}$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
        URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    // Keyboard Shortcuts
    KEYBOARD_SHORTCUTS: {
        SEARCH: ['ctrl+k', 'cmd+k', '/'],
        THEME_TOGGLE: ['ctrl+t', 'cmd+t'],
        HOME: ['g', 'h'],
        PORTFOLIO: ['g', 'p'],
        MARKETS: ['g', 'm'],
        NEWS: ['g', 'n'],
        HELP: ['?']
    },

    // Date and Time Formats
    DATE_FORMATS: {
        SHORT: 'MM/DD/YYYY',
        LONG: 'MMMM DD, YYYY',
        TIME: 'HH:mm:ss',
        DATETIME: 'MM/DD/YYYY HH:mm:ss',
        ISO: 'YYYY-MM-DDTHH:mm:ssZ'
    },

    // Number Formats
    NUMBER_FORMATS: {
        CURRENCY: {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        },
        PERCENTAGE: {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            style: 'percent'
        },
        LARGE_NUMBER: {
            notation: 'compact',
            compactDisplay: 'short'
        }
    },

    // Validation Rules
    VALIDATION: {
        STOCK_SYMBOL: {
            minLength: 1,
            maxLength: 5,
            pattern: /^[A-Z0-9]+$/
        },
        PASSWORD: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false
        },
        EMAIL: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    },

    // External Services
    EXTERNAL_SERVICES: {
        MARKETSTACK: {
            BASE_URL: 'https://api.marketstack.com/v1',
            RATE_LIMIT: 1000 // requests per month for free tier
        },
        NEWS_API: {
            BASE_URL: 'https://newsapi.org/v2',
            RATE_LIMIT: 500 // requests per day for free tier
        }
    },

    // Development Configuration
    DEVELOPMENT: {
        DEBUG_MODE: false,
        MOCK_API: true,
        SHOW_CONSOLE_LOGS: true,
        ENABLE_PERFORMANCE_MONITORING: true,
        SKIP_AUTH: false
    }
};

// Freeze the configuration object to prevent modifications
Object.freeze(CONFIG);

// Make CONFIG globally available
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}