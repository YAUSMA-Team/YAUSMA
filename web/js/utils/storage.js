// YAUSMA Storage Utility - Professional Local Storage Management
// Provides robust storage operations with error handling and data validation

class StorageManager {
    constructor() {
        this.isSupported = this.checkSupport();
        this.cache = new Map();
    }

    checkSupport() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('localStorage not supported:', error);
            return false;
        }
    }

    /**
     * Get item from storage with optional default value
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Stored value or default value
     */
    get(key, defaultValue = null) {
        if (!this.isSupported) {
            return this.cache.get(key) || defaultValue;
        }

        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (error) {
            console.warn(`Storage get error for key "${key}":`, error);
            return defaultValue;
        }
    }

    /**
     * Set item in storage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        if (!this.isSupported) {
            this.cache.set(key, value);
            return true;
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Storage set error for key "${key}":`, error);
            
            // If quota exceeded, try to clear old items
            if (error.name === 'QuotaExceededError') {
                this.clearOldItems();
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (retryError) {
                    console.error('Storage retry after cleanup failed:', retryError);
                }
            }
            
            return false;
        }
    }

    /**
     * Remove item from storage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        if (!this.isSupported) {
            return this.cache.delete(key);
        }

        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Storage remove error for key "${key}":`, error);
            return false;
        }
    }

    /**
     * Check if key exists in storage
     * @param {string} key - Storage key
     * @returns {boolean} Whether key exists
     */
    has(key) {
        if (!this.isSupported) {
            return this.cache.has(key);
        }

        return localStorage.getItem(key) !== null;
    }

    /**
     * Clear all storage items
     * @returns {boolean} Success status
     */
    clear() {
        if (!this.isSupported) {
            this.cache.clear();
            return true;
        }

        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Storage clear error:', error);
            return false;
        }
    }

    /**
     * Get all keys in storage
     * @returns {string[]} Array of storage keys
     */
    keys() {
        if (!this.isSupported) {
            return Array.from(this.cache.keys());
        }

        return Object.keys(localStorage);
    }

    /**
     * Get storage size in bytes (approximate)
     * @returns {number} Storage size in bytes
     */
    getSize() {
        if (!this.isSupported) {
            return 0;
        }

        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }

    /**
     * Get available storage space (approximate)
     * @returns {number} Available space in bytes
     */
    getAvailableSpace() {
        if (!this.isSupported) {
            return 0;
        }

        const testKey = '__space_test__';
        let high = 1024 * 1024 * 10; // 10MB
        let low = 0;
        let available = 0;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const testValue = 'x'.repeat(mid);
            
            try {
                localStorage.setItem(testKey, testValue);
                localStorage.removeItem(testKey);
                available = mid;
                low = mid + 1;
            } catch (error) {
                high = mid - 1;
            }
        }

        return available;
    }

    /**
     * Clear old cache items to free up space
     */
    clearOldItems() {
        if (!this.isSupported) {
            return;
        }

        const cacheKeys = this.keys().filter(key => 
            key.startsWith(CONFIG.STORAGE_KEYS.CACHE_PREFIX)
        );

        // Remove oldest cache items first
        cacheKeys.forEach(key => {
            try {
                this.remove(key);
            } catch (error) {
                console.warn(`Failed to remove cache key "${key}":`, error);
            }
        });
    }

    /**
     * Set item with expiration time
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @param {number} ttl - Time to live in milliseconds
     * @returns {boolean} Success status
     */
    setWithTTL(key, value, ttl) {
        const expirationTime = Date.now() + ttl;
        const item = {
            value: value,
            expiration: expirationTime
        };
        return this.set(key, item);
    }

    /**
     * Get item with expiration check
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist or expired
     * @returns {*} Stored value or default value
     */
    getWithTTL(key, defaultValue = null) {
        const item = this.get(key);
        
        if (!item || typeof item !== 'object' || !item.expiration) {
            return defaultValue;
        }

        if (Date.now() > item.expiration) {
            this.remove(key);
            return defaultValue;
        }

        return item.value;
    }

    /**
     * Store user preferences
     * @param {object} preferences - User preferences object
     * @returns {boolean} Success status
     */
    setUserPreferences(preferences) {
        return this.set(CONFIG.STORAGE_KEYS.USER_PREFERENCES, preferences);
    }

    /**
     * Get user preferences
     * @returns {object} User preferences object
     */
    getUserPreferences() {
        return this.get(CONFIG.STORAGE_KEYS.USER_PREFERENCES, {
            theme: CONFIG.THEME.DEFAULT,
            currency: CONFIG.CURRENCY.DEFAULT,
            language: 'en',
            notifications: true,
            autoTheme: false,
            compactMode: false,
            showWelcome: true
        });
    }

    /**
     * Update specific user preference
     * @param {string} key - Preference key
     * @param {*} value - Preference value
     * @returns {boolean} Success status
     */
    updateUserPreference(key, value) {
        const preferences = this.getUserPreferences();
        preferences[key] = value;
        return this.setUserPreferences(preferences);
    }

    /**
     * Store authentication token
     * @param {string} token - Authentication token
     * @returns {boolean} Success status
     */
    setAuthToken(token) {
        return this.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
    }

    /**
     * Get authentication token
     * @returns {string|null} Authentication token or null
     */
    getAuthToken() {
        return this.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    }

    /**
     * Remove authentication token
     * @returns {boolean} Success status
     */
    removeAuthToken() {
        return this.remove(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    }

    /**
     * Store watchlist
     * @param {string[]} watchlist - Array of stock symbols
     * @returns {boolean} Success status
     */
    setWatchlist(watchlist) {
        return this.set(CONFIG.STORAGE_KEYS.WATCHLIST, watchlist);
    }

    /**
     * Get watchlist
     * @returns {string[]} Array of stock symbols
     */
    getWatchlist() {
        return this.get(CONFIG.STORAGE_KEYS.WATCHLIST, []);
    }

    /**
     * Add stock to watchlist
     * @param {string} symbol - Stock symbol
     * @returns {boolean} Success status
     */
    addToWatchlist(symbol) {
        const watchlist = this.getWatchlist();
        if (!watchlist.includes(symbol)) {
            watchlist.push(symbol);
            return this.setWatchlist(watchlist);
        }
        return true;
    }

    /**
     * Remove stock from watchlist
     * @param {string} symbol - Stock symbol
     * @returns {boolean} Success status
     */
    removeFromWatchlist(symbol) {
        const watchlist = this.getWatchlist();
        const index = watchlist.indexOf(symbol);
        if (index > -1) {
            watchlist.splice(index, 1);
            return this.setWatchlist(watchlist);
        }
        return true;
    }

    /**
     * Check if stock is in watchlist
     * @param {string} symbol - Stock symbol
     * @returns {boolean} Whether stock is in watchlist
     */
    isInWatchlist(symbol) {
        const watchlist = this.getWatchlist();
        return watchlist.includes(symbol);
    }

    /**
     * Store portfolio data
     * @param {object} portfolio - Portfolio data object
     * @returns {boolean} Success status
     */
    setPortfolio(portfolio) {
        return this.set(CONFIG.STORAGE_KEYS.PORTFOLIO_DATA, portfolio);
    }

    /**
     * Get portfolio data
     * @returns {object} Portfolio data object
     */
    getPortfolio() {
        return this.get(CONFIG.STORAGE_KEYS.PORTFOLIO_DATA, {
            holdings: [],
            totalValue: 0,
            totalGainLoss: 0,
            totalGainLossPercent: 0,
            lastUpdated: null
        });
    }

    /**
     * Cache data with key and TTL
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds
     * @returns {boolean} Success status
     */
    cache(key, data, ttl = CONFIG.CACHE.DEFAULT_TTL) {
        const cacheKey = CONFIG.STORAGE_KEYS.CACHE_PREFIX + key;
        return this.setWithTTL(cacheKey, data, ttl);
    }

    /**
     * Get cached data
     * @param {string} key - Cache key
     * @param {*} defaultValue - Default value if not found or expired
     * @returns {*} Cached data or default value
     */
    getCache(key, defaultValue = null) {
        const cacheKey = CONFIG.STORAGE_KEYS.CACHE_PREFIX + key;
        return this.getWithTTL(cacheKey, defaultValue);
    }

    /**
     * Clear all cache items
     * @returns {boolean} Success status
     */
    clearCache() {
        const cacheKeys = this.keys().filter(key => 
            key.startsWith(CONFIG.STORAGE_KEYS.CACHE_PREFIX)
        );

        let success = true;
        cacheKeys.forEach(key => {
            if (!this.remove(key)) {
                success = false;
            }
        });

        return success;
    }

    /**
     * Export all data for backup
     * @returns {object} All storage data
     */
    exportData() {
        const data = {};
        const keys = this.keys();
        
        keys.forEach(key => {
            data[key] = this.get(key);
        });
        
        return data;
    }

    /**
     * Import data from backup
     * @param {object} data - Data to import
     * @returns {boolean} Success status
     */
    importData(data) {
        let success = true;
        
        Object.keys(data).forEach(key => {
            if (!this.set(key, data[key])) {
                success = false;
            }
        });
        
        return success;
    }

    /**
     * Get storage statistics
     * @returns {object} Storage statistics
     */
    getStats() {
        return {
            isSupported: this.isSupported,
            totalKeys: this.keys().length,
            totalSize: this.getSize(),
            availableSpace: this.getAvailableSpace(),
            cacheKeys: this.keys().filter(key => 
                key.startsWith(CONFIG.STORAGE_KEYS.CACHE_PREFIX)
            ).length
        };
    }
}

// Create global storage instance
const storage = new StorageManager();

// Make storage globally available
if (typeof window !== 'undefined') {
    window.storage = storage;
    window.StorageManager = StorageManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { storage, StorageManager };
}