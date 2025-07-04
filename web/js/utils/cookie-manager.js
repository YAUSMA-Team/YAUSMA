/**
 * YAUSMA Cookie Manager
 * Comprehensive cookie management utility with security features and fallbacks
 */

class CookieManager {
    constructor() {
        this.cookiesEnabled = this.checkCookieSupport();
        this.defaultOptions = {
            expires: 365,          // Days
            path: '/',
            sameSite: 'Lax',
            secure: this.isSecureContext()
        };
        
        // Initialize event listeners for cross-tab synchronization
        this.initCrossTabSync();
    }
    
    /**
     * Check if cookies are supported and enabled
     * @returns {boolean} Whether cookies are available
     */
    checkCookieSupport() {
        try {
            // Test if we can set and read a test cookie
            const testKey = '_cookie_test_';
            const testValue = 'test';
            
            document.cookie = `${testKey}=${testValue}; path=/; max-age=1`;
            const supported = document.cookie.indexOf(testKey) !== -1;
            
            // Clean up test cookie
            if (supported) {
                document.cookie = `${testKey}=; path=/; max-age=0`;
            }
            
            return supported;
        } catch (error) {
            console.warn('[CookieManager] Cookie support check failed:', error);
            return false;
        }
    }
    
    /**
     * Check if we're in a secure context (HTTPS)
     * @returns {boolean} Whether the context is secure
     */
    isSecureContext() {
        return window.location.protocol === 'https:' || 
               window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1';
    }
    
    /**
     * Set a cookie with optional configuration
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {object} options - Cookie options (expires, path, domain, secure, sameSite)
     * @returns {boolean} Whether the cookie was set successfully
     */
    setCookie(name, value, options = {}) {
        if (!this.cookiesEnabled) {
            console.warn('[CookieManager] Cookies not available, falling back to localStorage');
            return this.setLocalStorageFallback(name, value, options);
        }
        
        try {
            const config = { ...this.defaultOptions, ...options };
            let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
            
            // Add expiration
            if (config.expires) {
                const expiryDate = new Date();
                expiryDate.setTime(expiryDate.getTime() + (config.expires * 24 * 60 * 60 * 1000));
                cookieString += `; expires=${expiryDate.toUTCString()}`;
            }
            
            // Add path
            if (config.path) {
                cookieString += `; path=${config.path}`;
            }
            
            // Add domain
            if (config.domain) {
                cookieString += `; domain=${config.domain}`;
            }
            
            // Add secure flag (only for HTTPS)
            if (config.secure && this.isSecureContext()) {
                cookieString += `; secure`;
            }
            
            // Add SameSite
            if (config.sameSite) {
                cookieString += `; samesite=${config.sameSite}`;
            }
            
            // Set the cookie
            document.cookie = cookieString;
            
            // Verify the cookie was set
            const wasSet = this.getCookie(name) === value;
            
            if (wasSet) {
                console.log(`[CookieManager] Cookie set: ${name}=${value}`);
                
                // Dispatch custom event for cross-tab synchronization
                this.dispatchCookieChangeEvent(name, value, 'set');
            }
            
            return wasSet;
            
        } catch (error) {
            console.error('[CookieManager] Failed to set cookie:', error);
            return this.setLocalStorageFallback(name, value, options);
        }
    }
    
    /**
     * Get a cookie value
     * @param {string} name - Cookie name
     * @param {*} defaultValue - Default value if cookie doesn't exist
     * @returns {string|*} Cookie value or default value
     */
    getCookie(name, defaultValue = null) {
        if (!this.cookiesEnabled) {
            return this.getLocalStorageFallback(name, defaultValue);
        }
        
        try {
            const encodedName = encodeURIComponent(name);
            const cookies = document.cookie.split(';');
            
            for (let cookie of cookies) {
                let [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
                
                if (cookieName === encodedName) {
                    const value = decodeURIComponent(cookieValue);
                    console.log(`[CookieManager] Cookie retrieved: ${name}=${value}`);
                    return value;
                }
            }
            
            // Cookie not found, check localStorage for migration
            const localStorageValue = this.getLocalStorageFallback(name, null);
            if (localStorageValue !== null) {
                console.log(`[CookieManager] Migrating from localStorage: ${name}=${localStorageValue}`);
                this.setCookie(name, localStorageValue);
                return localStorageValue;
            }
            
            return defaultValue;
            
        } catch (error) {
            console.error('[CookieManager] Failed to get cookie:', error);
            return this.getLocalStorageFallback(name, defaultValue);
        }
    }
    
    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     * @param {object} options - Cookie options (path, domain)
     * @returns {boolean} Whether the cookie was deleted successfully
     */
    deleteCookie(name, options = {}) {
        if (!this.cookiesEnabled) {
            return this.deleteLocalStorageFallback(name);
        }
        
        try {
            const config = { ...this.defaultOptions, ...options };
            
            // Set cookie with past expiry date
            let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
            
            if (config.path) {
                cookieString += `; path=${config.path}`;
            }
            
            if (config.domain) {
                cookieString += `; domain=${config.domain}`;
            }
            
            document.cookie = cookieString;
            
            // Verify deletion
            const wasDeleted = this.getCookie(name) === null;
            
            if (wasDeleted) {
                console.log(`[CookieManager] Cookie deleted: ${name}`);
                
                // Dispatch custom event for cross-tab synchronization
                this.dispatchCookieChangeEvent(name, null, 'delete');
            }
            
            // Also clean up localStorage fallback
            this.deleteLocalStorageFallback(name);
            
            return wasDeleted;
            
        } catch (error) {
            console.error('[CookieManager] Failed to delete cookie:', error);
            return this.deleteLocalStorageFallback(name);
        }
    }
    
    /**
     * Get all cookies as an object
     * @returns {object} All cookies as key-value pairs
     */
    getAllCookies() {
        if (!this.cookiesEnabled) {
            return this.getAllLocalStorageFallback();
        }
        
        try {
            const cookies = {};
            const cookieStrings = document.cookie.split(';');
            
            for (let cookie of cookieStrings) {
                const [name, value] = cookie.split('=').map(c => c.trim());
                if (name && value) {
                    cookies[decodeURIComponent(name)] = decodeURIComponent(value);
                }
            }
            
            return cookies;
            
        } catch (error) {
            console.error('[CookieManager] Failed to get all cookies:', error);
            return this.getAllLocalStorageFallback();
        }
    }
    
    /**
     * Check if a cookie exists
     * @param {string} name - Cookie name
     * @returns {boolean} Whether the cookie exists
     */
    hasCookie(name) {
        return this.getCookie(name) !== null;
    }
    
    /**
     * LocalStorage fallback methods
     */
    setLocalStorageFallback(name, value, options = {}) {
        try {
            const data = {
                value: value,
                timestamp: Date.now(),
                expires: options.expires ? Date.now() + (options.expires * 24 * 60 * 60 * 1000) : null
            };
            
            localStorage.setItem(`cookie_fallback_${name}`, JSON.stringify(data));
            console.log(`[CookieManager] LocalStorage fallback set: ${name}=${value}`);
            return true;
            
        } catch (error) {
            console.error('[CookieManager] LocalStorage fallback failed:', error);
            return false;
        }
    }
    
    getLocalStorageFallback(name, defaultValue = null) {
        try {
            const stored = localStorage.getItem(`cookie_fallback_${name}`);
            if (!stored) {
                // Also check legacy localStorage without prefix for migration
                const legacy = localStorage.getItem(name);
                return legacy || defaultValue;
            }
            
            const data = JSON.parse(stored);
            
            // Check if expired
            if (data.expires && Date.now() > data.expires) {
                this.deleteLocalStorageFallback(name);
                return defaultValue;
            }
            
            return data.value;
            
        } catch (error) {
            console.error('[CookieManager] LocalStorage fallback retrieval failed:', error);
            return defaultValue;
        }
    }
    
    deleteLocalStorageFallback(name) {
        try {
            localStorage.removeItem(`cookie_fallback_${name}`);
            localStorage.removeItem(name); // Clean up legacy
            return true;
        } catch (error) {
            console.error('[CookieManager] LocalStorage fallback deletion failed:', error);
            return false;
        }
    }
    
    getAllLocalStorageFallback() {
        try {
            const cookies = {};
            const prefix = 'cookie_fallback_';
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    const name = key.substring(prefix.length);
                    const value = this.getLocalStorageFallback(name);
                    if (value !== null) {
                        cookies[name] = value;
                    }
                }
            }
            
            return cookies;
            
        } catch (error) {
            console.error('[CookieManager] LocalStorage fallback get all failed:', error);
            return {};
        }
    }
    
    /**
     * Initialize cross-tab synchronization
     */
    initCrossTabSync() {
        // Listen for storage events (localStorage changes)
        window.addEventListener('storage', (event) => {
            if (event.key && event.key.startsWith('cookie_fallback_')) {
                const cookieName = event.key.substring('cookie_fallback_'.length);
                const newValue = event.newValue ? JSON.parse(event.newValue).value : null;
                
                console.log(`[CookieManager] Cross-tab sync detected: ${cookieName}=${newValue}`);
                
                // Dispatch custom event
                this.dispatchCookieChangeEvent(cookieName, newValue, 'sync');
            }
        });
        
        // Listen for custom cookie change events
        window.addEventListener('cookiechange', (event) => {
            console.log('[CookieManager] Cookie change event received:', event.detail);
        });
    }
    
    /**
     * Dispatch cookie change event for cross-tab communication
     * @param {string} name - Cookie name
     * @param {*} value - Cookie value
     * @param {string} action - Action type (set, delete, sync)
     */
    dispatchCookieChangeEvent(name, value, action) {
        const event = new CustomEvent('cookiechange', {
            detail: {
                name: name,
                value: value,
                action: action,
                timestamp: Date.now()
            }
        });
        
        window.dispatchEvent(event);
    }
    
    /**
     * Theme-specific convenience methods
     */
    
    /**
     * Set theme preference cookie
     * @param {string} theme - Theme name ('light' or 'dark')
     * @returns {boolean} Whether the theme was set successfully
     */
    setTheme(theme) {
        return this.setCookie('yausma_theme', theme, {
            expires: 365,
            path: '/',
            sameSite: 'Lax',
            secure: this.isSecureContext()
        });
    }
    
    /**
     * Get theme preference
     * @param {string} defaultTheme - Default theme if none is set
     * @returns {string} Theme preference
     */
    getTheme(defaultTheme = 'light') {
        return this.getCookie('yausma_theme', defaultTheme);
    }
    
    /**
     * Delete theme preference
     * @returns {boolean} Whether the theme preference was deleted
     */
    deleteTheme() {
        return this.deleteCookie('yausma_theme');
    }
    
    /**
     * Simple Authentication convenience methods
     */
    
    /**
     * Set user login state
     * @param {boolean} isLoggedIn - Whether user is logged in
     * @returns {boolean} Whether the login state was set successfully
     */
    setLoggedIn(isLoggedIn) {
        console.log(`[CookieManager] Setting login state: ${isLoggedIn}`);
        return this.setCookie('yausma_isLoggedIn', isLoggedIn ? 'true' : 'false', {
            expires: 1, // 24 hours
            path: '/',
            sameSite: 'Lax',
            secure: this.isSecureContext()
        });
    }
    
    /**
     * Check if user is logged in
     * @returns {boolean} Whether user is logged in
     */
    isLoggedIn() {
        const loginState = this.getCookie('yausma_isLoggedIn', 'false');
        const isLoggedIn = loginState === 'true';
        console.log(`[CookieManager] Login state check: ${isLoggedIn}`);
        return isLoggedIn;
    }
    
    /**
     * Logout user (clear login state)
     * @returns {boolean} Whether logout was successful
     */
    logout() {
        console.log('[CookieManager] Logging out user');
        return this.deleteCookie('yausma_isLoggedIn');
    }
    
    /**
     * Get cookie manager status
     * @returns {object} Status information
     */
    getStatus() {
        return {
            cookiesEnabled: this.cookiesEnabled,
            isSecureContext: this.isSecureContext(),
            defaultOptions: this.defaultOptions,
            allCookies: this.getAllCookies()
        };
    }
    
    /**
     * Clear all YAUSMA cookies
     * @returns {boolean} Whether all cookies were cleared
     */
    clearAllYausmaCookies() {
        const allCookies = this.getAllCookies();
        let success = true;
        
        for (const name in allCookies) {
            if (name.startsWith('yausma_')) {
                success = this.deleteCookie(name) && success;
            }
        }
        
        return success;
    }
}

// Create global cookie manager instance
const cookieManager = new CookieManager();

// Make cookie manager globally available
if (typeof window !== 'undefined') {
    window.cookieManager = cookieManager;
    window.CookieManager = CookieManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cookieManager, CookieManager };
}

console.log('[CookieManager] Cookie manager initialized. Status:', cookieManager.getStatus());