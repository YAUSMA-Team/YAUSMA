/**
 * YAUSMA - Main JavaScript Application
 * Core functionality and initialization
 */

// Global application object
var YAUSMA = {
    version: '1.0.0',
    initialized: false,
    debug: false,
    apiClient: null,
    dataApi: null,
    userApi: null
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main application initialization
function initializeApp() {
    if (YAUSMA.initialized) {
        return;
    }
    
    try {
        // Initialize core components
        initBootstrapComponents();
        initErrorHandling();
        initNavigationHandlers();
        initUtilities();
        initApiClients();
        initAuthIntegration();
        
        // Mark as initialized
        YAUSMA.initialized = true;
        
        if (YAUSMA.debug) {
            console.log('YAUSMA application initialized successfully');
        }
        
    } catch (error) {
        console.error('Failed to initialize YAUSMA application:', error);
    }
}

// Initialize Bootstrap components
function initBootstrapComponents() {
    // Initialize all tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function(tooltipTriggerEl) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            new bootstrap.Tooltip(tooltipTriggerEl);
        }
    });
    
    // Initialize all popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(function(popoverTriggerEl) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
            new bootstrap.Popover(popoverTriggerEl);
        }
    });
    
    // Initialize dropdowns
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.forEach(function(dropdownToggleEl) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
            new bootstrap.Dropdown(dropdownToggleEl);
        }
    });
}

// Initialize error handling
function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        if (YAUSMA.debug) {
            showMessage('An error occurred: ' + e.message, 'danger');
        }
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        if (YAUSMA.debug) {
            showMessage('Promise rejection: ' + e.reason, 'danger');
        }
    });
}

// Initialize navigation handlers
function initNavigationHandlers() {
    // Mobile menu toggle
    var navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            var target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
                target.classList.toggle('show');
            }
        });
    }
    
    // Active nav link highlighting
    updateActiveNavLink();
    
    // Close mobile menu when clicking nav links
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            var navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink() {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && currentPath.endsWith(href)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize utility functions
function initUtilities() {
    // Smooth scrolling for anchor links
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')) {
            var href = e.target.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });
    
    // Add loading class utility
    setupLoadingStates();
}

// Setup loading states utility
function setupLoadingStates() {
    // Add utility function to show loading on buttons
    window.setButtonLoading = function(button, loading) {
        if (loading) {
            button.disabled = true;
            button.setAttribute('data-original-text', button.innerHTML);
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
        } else {
            button.disabled = false;
            var originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.innerHTML = originalText;
                button.removeAttribute('data-original-text');
            }
        }
    };
}

// Utility function to show messages
function showMessage(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;
    
    var alertTypes = {
        'success': 'alert-success',
        'danger': 'alert-danger', 
        'warning': 'alert-warning',
        'info': 'alert-info'
    };
    
    var alertClass = alertTypes[type] || 'alert-info';
    
    var notification = document.createElement('div');
    notification.className = 'alert ' + alertClass + ' alert-dismissible fade show position-fixed';
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1060; min-width: 300px;';
    
    notification.innerHTML = message + 
        '<button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>';
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(function() {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Utility function to format currency
function formatCurrency(amount, currency) {
    currency = currency || 'USD';
    
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (e) {
        return '$' + amount.toFixed(2);
    }
}

// Utility function to format percentage
function formatPercentage(value, decimals) {
    decimals = decimals || 2;
    return (value >= 0 ? '+' : '') + value.toFixed(decimals) + '%';
}

// Utility function to debounce function calls
function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
        var context = this;
        var args = arguments;
        
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced Storage utility with cookie support and localStorage fallback
var Storage = {
    /**
     * Set a value with optional cookie preference
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @param {boolean} useCookie - Whether to prefer cookies over localStorage
     * @param {object} options - Cookie options (expires, path, etc.)
     * @returns {boolean} Whether the value was stored successfully
     */
    set: function(key, value, useCookie = false, options = {}) {
        // For theme-specific keys, always use cookies
        if (key === 'theme' || key === 'yausma_theme') {
            if (window.cookieManager) {
                return window.cookieManager.setTheme(value);
            }
            useCookie = true;
        }
        
        // Try cookie first if requested and available
        if (useCookie && window.cookieManager && window.cookieManager.cookiesEnabled) {
            try {
                const success = window.cookieManager.setCookie(key, JSON.stringify(value), options);
                if (success) {
                    console.log(`[Storage] Saved to cookie: ${key}`);
                    return true;
                }
            } catch (e) {
                console.warn('[Storage] Cookie storage failed, falling back to localStorage:', e);
            }
        }
        
        // Fallback to localStorage
        try {
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`[Storage] Saved to localStorage: ${key}`);
            return true;
        } catch (e) {
            console.error('[Storage] Failed to save to localStorage:', e);
            return false;
        }
    },
    
    /**
     * Get a value with automatic cookie/localStorage detection
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @param {boolean} preferCookie - Whether to check cookies first
     * @returns {*} Stored value or default value
     */
    get: function(key, defaultValue, preferCookie = false) {
        // For theme-specific keys, always check cookies first
        if (key === 'theme' || key === 'yausma_theme') {
            if (window.cookieManager) {
                const themeValue = window.cookieManager.getTheme(null);
                if (themeValue !== null) {
                    console.log(`[Storage] Retrieved theme from cookie: ${themeValue}`);
                    return themeValue;
                }
            }
            preferCookie = true;
        }
        
        // Try cookie first if requested and available
        if (preferCookie && window.cookieManager && window.cookieManager.cookiesEnabled) {
            try {
                const cookieValue = window.cookieManager.getCookie(key, null);
                if (cookieValue !== null) {
                    const parsedValue = JSON.parse(cookieValue);
                    console.log(`[Storage] Retrieved from cookie: ${key}`);
                    return parsedValue;
                }
            } catch (e) {
                console.warn('[Storage] Cookie retrieval failed, checking localStorage:', e);
            }
        }
        
        // Try localStorage
        try {
            var item = localStorage.getItem(key);
            if (item !== null) {
                const parsedValue = JSON.parse(item);
                console.log(`[Storage] Retrieved from localStorage: ${key}`);
                
                // Migrate to cookie if this is a theme preference
                if ((key === 'theme' || key === 'yausma_theme') && window.cookieManager) {
                    console.log(`[Storage] Migrating theme to cookie: ${parsedValue}`);
                    window.cookieManager.setTheme(parsedValue);
                }
                
                return parsedValue;
            }
            return defaultValue;
        } catch (e) {
            console.error('[Storage] Failed to read from localStorage:', e);
            return defaultValue;
        }
    },
    
    /**
     * Remove a value from both cookies and localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Whether the value was removed successfully
     */
    remove: function(key) {
        let success = true;
        
        // Remove from cookie if available
        if (window.cookieManager) {
            try {
                if (key === 'theme' || key === 'yausma_theme') {
                    success = window.cookieManager.deleteTheme() && success;
                } else {
                    success = window.cookieManager.deleteCookie(key) && success;
                }
                console.log(`[Storage] Removed from cookie: ${key}`);
            } catch (e) {
                console.warn('[Storage] Cookie removal failed:', e);
                success = false;
            }
        }
        
        // Remove from localStorage
        try {
            localStorage.removeItem(key);
            console.log(`[Storage] Removed from localStorage: ${key}`);
            return success;
        } catch (e) {
            console.error('[Storage] Failed to remove from localStorage:', e);
            return false;
        }
    },
    
    /**
     * Check if a key exists in storage
     * @param {string} key - Storage key
     * @returns {boolean} Whether the key exists
     */
    has: function(key) {
        // Check cookies first for theme
        if ((key === 'theme' || key === 'yausma_theme') && window.cookieManager) {
            if (window.cookieManager.hasCookie(key) || window.cookieManager.hasCookie('yausma_theme')) {
                return true;
            }
        }
        
        // Check localStorage
        return localStorage.getItem(key) !== null;
    },
    
    /**
     * Get all stored values
     * @returns {object} All stored key-value pairs
     */
    getAll: function() {
        const all = {};
        
        // Get from cookies
        if (window.cookieManager) {
            try {
                const cookies = window.cookieManager.getAllCookies();
                Object.assign(all, cookies);
            } catch (e) {
                console.warn('[Storage] Failed to get all cookies:', e);
            }
        }
        
        // Get from localStorage
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && !all.hasOwnProperty(key)) {
                    const value = localStorage.getItem(key);
                    try {
                        all[key] = JSON.parse(value);
                    } catch (e) {
                        all[key] = value;
                    }
                }
            }
        } catch (e) {
            console.error('[Storage] Failed to get all localStorage items:', e);
        }
        
        return all;
    },
    
    /**
     * Clear all YAUSMA storage (cookies and localStorage)
     * @returns {boolean} Whether storage was cleared successfully
     */
    clear: function() {
        let success = true;
        
        // Clear cookies
        if (window.cookieManager) {
            try {
                success = window.cookieManager.clearAllYausmaCookies() && success;
                console.log('[Storage] Cleared all YAUSMA cookies');
            } catch (e) {
                console.error('[Storage] Failed to clear cookies:', e);
                success = false;
            }
        }
        
        // Clear localStorage
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('yausma_') || key === 'theme')) {
                    keys.push(key);
                }
            }
            
            keys.forEach(key => localStorage.removeItem(key));
            console.log('[Storage] Cleared YAUSMA localStorage items');
            return success;
        } catch (e) {
            console.error('[Storage] Failed to clear localStorage:', e);
            return false;
        }
    },
    
    /**
     * Get storage status and configuration
     * @returns {object} Storage status information
     */
    getStatus: function() {
        return {
            cookieManager: !!window.cookieManager,
            cookiesEnabled: window.cookieManager ? window.cookieManager.cookiesEnabled : false,
            localStorageAvailable: typeof localStorage !== 'undefined',
            currentTheme: this.get('theme', 'light'),
            allValues: this.getAll()
        };
    }
};

// Export utilities for global use
window.YAUSMA = YAUSMA;
window.showMessage = showMessage;
window.formatNumber = formatNumber;
window.formatCurrency = formatCurrency;
window.formatPercentage = formatPercentage;
window.debounce = debounce;
window.Storage = Storage;

// Global theme toggle function
function toggleTheme() {
    if (window.globalThemeManager) {
        window.globalThemeManager.toggleTheme();
    } else {
        // Fallback for when theme manager isn't loaded yet
        var body = document.body;
        var currentTheme = body.getAttribute('data-theme') || 'light';
        var newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        body.setAttribute('data-theme', newTheme);
        
        // Store preference
        Storage.set('theme', newTheme);
    }
}

// Export utilities for global use
window.YAUSMA = YAUSMA;
window.showMessage = showMessage;
window.formatNumber = formatNumber;
window.formatCurrency = formatCurrency;
window.formatPercentage = formatPercentage;
window.debounce = debounce;
window.Storage = Storage;
window.toggleTheme = toggleTheme;

// Initialize API clients
function initApiClients() {
    try {
        // Check if OpenAPI client is available
        if (typeof ApiClient !== 'undefined') {
            // Configure API client with backend URL
            YAUSMA.apiClient = new ApiClient('http://localhost:8000');
            
            // Create API instances if available
            if (typeof DataApi !== 'undefined') {
                YAUSMA.dataApi = new DataApi(YAUSMA.apiClient);
                window.dataApi = YAUSMA.dataApi;
            }
            
            if (typeof UserApi !== 'undefined') {
                YAUSMA.userApi = new UserApi(YAUSMA.apiClient);
                window.userApi = YAUSMA.userApi;
            }
            
            // Make API client globally available
            window.apiClient = YAUSMA.apiClient;
            
            if (YAUSMA.debug) {
                console.log('API clients initialized successfully');
            }
            
        } else {
            console.warn('OpenAPI client not available. Using fallback mode.');
            
            // Create fallback clients that will trigger empty state
            window.dataApi = null;
            window.userApi = null;
            window.apiClient = null;
        }
        
    } catch (error) {
        console.error('Failed to initialize API clients:', error);
        
        // Ensure fallback clients are set
        window.dataApi = null;
        window.userApi = null;
        window.apiClient = null;
    }
}

// API Debug Console Functions (available globally for debugging)
window.YAUSMA_DEBUG = {
    // Test news API
    testNews: function(ticker) {
        if (!window.dataApi) {
            console.error('[YAUSMA-DEBUG] DataApi not available. Check API client initialization.');
            return;
        }
        
        const params = ticker ? { ticker: ticker } : {};
        console.log('[YAUSMA-DEBUG] Testing news API with params:', params);
        
        window.dataApi.getNews(params, (error, data, response) => {
            console.group('[YAUSMA-DEBUG] News API Test Results');
            console.log('Error:', error);
            console.log('Data:', data);
            console.log('Data type:', typeof data);
            console.log('Data is array:', Array.isArray(data));
            console.log('Data length:', data ? data.length : 'N/A');
            console.log('Response status:', response ? response.status : 'N/A');
            console.log('Response body:', response ? response.body : 'N/A');
            console.log('Response text:', response ? response.text : 'N/A');
            if (data && Array.isArray(data) && data.length > 0) {
                console.log('First item:', data[0]);
            }
            console.groupEnd();
        });
    },
    
    // Test market overview API
    testMarket: function() {
        if (!window.dataApi) {
            console.error('[YAUSMA-DEBUG] DataApi not available. Check API client initialization.');
            return;
        }
        
        console.log('[YAUSMA-DEBUG] Testing market overview API');
        
        window.dataApi.getMarketOverview((error, data, response) => {
            console.group('[YAUSMA-DEBUG] Market API Test Results');
            console.log('Error:', error);
            console.log('Data:', data);
            console.log('Data type:', typeof data);
            console.log('Data is array:', Array.isArray(data));
            console.log('Data length:', data ? data.length : 'N/A');
            console.log('Response status:', response ? response.status : 'N/A');
            console.log('Response body:', response ? response.body : 'N/A');
            if (data && Array.isArray(data) && data.length > 0) {
                console.log('First item:', data[0]);
            }
            console.groupEnd();
        });
    },
    
    // Check API client status
    checkApiClient: function() {
        console.group('[YAUSMA-DEBUG] API Client Status');
        console.log('window.dataApi exists:', !!window.dataApi);
        console.log('window.dataApi type:', typeof window.dataApi);
        
        if (window.dataApi) {
            console.log('apiClient exists:', !!window.dataApi.apiClient);
            console.log('apiClient type:', typeof window.dataApi.apiClient);
            console.log('apiClient basePath:', window.dataApi.apiClient.basePath);
            console.log('apiClient timeout:', window.dataApi.apiClient.timeout);
            console.log('apiClient defaultHeaders:', window.dataApi.apiClient.defaultHeaders);
        }
        
        console.log('YAUSMA.apiClient:', YAUSMA.apiClient);
        console.log('YAUSMA.dataApi:', YAUSMA.dataApi);
        console.log('ApiClient class exists:', typeof ApiClient !== 'undefined');
        console.log('DataApi class exists:', typeof DataApi !== 'undefined');
        console.log('superagent exists:', typeof superagent !== 'undefined');
        console.groupEnd();
    },
    
    // Raw fetch test
    testRawFetch: function(endpoint) {
        endpoint = endpoint || '/api/data/news';
        const url = 'http://localhost:8000' + endpoint;
        
        console.log('[YAUSMA-DEBUG] Testing raw fetch to:', url);
        
        fetch(url)
            .then(response => {
                console.group('[YAUSMA-DEBUG] Raw Fetch Results');
                console.log('Status:', response.status);
                console.log('Status Text:', response.statusText);
                console.log('Headers:', [...response.headers.entries()]);
                console.log('Content-Type:', response.headers.get('content-type'));
                console.log('Content-Length:', response.headers.get('content-length'));
                return response.text();
            })
            .then(text => {
                console.log('Response text length:', text.length);
                console.log('Response text preview:', text.substring(0, 500));
                try {
                    const json = JSON.parse(text);
                    console.log('Parsed JSON:', json);
                    console.log('JSON type:', typeof json);
                    console.log('JSON is array:', Array.isArray(json));
                    if (Array.isArray(json)) {
                        console.log('JSON array length:', json.length);
                    }
                } catch (e) {
                    console.warn('Failed to parse as JSON:', e.message);
                }
                console.groupEnd();
            })
            .catch(error => {
                console.error('[YAUSMA-DEBUG] Raw fetch error:', error);
                console.groupEnd();
            });
    },
    
    // Enable verbose logging
    enableVerboseLogging: function() {
        console.log('[YAUSMA-DEBUG] Enabling verbose logging for all API calls');
        
        // Enable debug mode
        YAUSMA.debug = true;
        
        console.log('[YAUSMA-DEBUG] Verbose logging enabled. All API calls will be logged.');
        console.log('[YAUSMA-DEBUG] YAUSMA.debug =', YAUSMA.debug);
    },
    
    // Disable verbose logging
    disableVerboseLogging: function() {
        console.log('[YAUSMA-DEBUG] Disabling verbose logging');
        YAUSMA.debug = false;
        console.log('[YAUSMA-DEBUG] YAUSMA.debug =', YAUSMA.debug);
    },
    
    // Test superagent directly
    testSuperagent: function(endpoint) {
        if (typeof superagent === 'undefined') {
            console.error('[YAUSMA-DEBUG] Superagent not available');
            return;
        }
        
        endpoint = endpoint || '/api/data/news';
        const url = 'http://localhost:8000' + endpoint;
        
        console.log('[YAUSMA-DEBUG] Testing superagent directly to:', url);
        
        superagent
            .get(url)
            .timeout(10000)
            .end((err, res) => {
                console.group('[YAUSMA-DEBUG] Superagent Test Results');
                console.log('Error:', err);
                console.log('Response:', res);
                if (res) {
                    console.log('Status:', res.status);
                    console.log('Headers:', res.headers);
                    console.log('Body:', res.body);
                    console.log('Text:', res.text);
                    console.log('Body type:', typeof res.body);
                    console.log('Body is array:', Array.isArray(res.body));
                }
                console.groupEnd();
            });
    },
    
    // Test cookie functionality
    testCookies: function() {
        if (!window.cookieManager) {
            console.error('[YAUSMA-DEBUG] Cookie manager not available');
            return;
        }
        
        console.group('[YAUSMA-DEBUG] Cookie Functionality Test');
        console.log('Cookie manager status:', window.cookieManager.getStatus());
        
        // Test setting a theme cookie
        console.log('Testing theme cookie...');
        const testTheme = 'dark';
        const success = window.cookieManager.setTheme(testTheme);
        console.log('Set theme result:', success);
        
        const retrievedTheme = window.cookieManager.getTheme();
        console.log('Retrieved theme:', retrievedTheme);
        
        // Test all cookies
        console.log('All cookies:', window.cookieManager.getAllCookies());
        
        // Test Storage utility
        console.log('Storage status:', Storage.getStatus());
        
        console.groupEnd();
    },
    
    // Test theme persistence
    testThemePersistence: function() {
        if (!window.globalThemeManager) {
            console.error('[YAUSMA-DEBUG] Global theme manager not available');
            return;
        }
        
        console.group('[YAUSMA-DEBUG] Theme Persistence Test');
        console.log('Current theme:', window.globalThemeManager.getCurrentTheme());
        console.log('Theme config:', window.globalThemeManager.getThemeConfig());
        
        // Test theme switching
        console.log('Testing theme toggle...');
        const originalTheme = window.globalThemeManager.getCurrentTheme();
        window.globalThemeManager.toggleTheme();
        
        setTimeout(() => {
            const newTheme = window.globalThemeManager.getCurrentTheme();
            console.log('Theme changed from', originalTheme, 'to', newTheme);
            
            // Check if it was saved to cookie
            if (window.cookieManager) {
                const cookieTheme = window.cookieManager.getTheme();
                console.log('Theme in cookie:', cookieTheme);
                console.log('Cookie and current theme match:', cookieTheme === newTheme);
            }
            
            console.groupEnd();
        }, 1000);
    },
    
    // Show help
    help: function() {
        console.group('[YAUSMA-DEBUG] Available Debug Commands');
        console.log('YAUSMA_DEBUG.testNews()                           - Test news API (all news)');
        console.log('YAUSMA_DEBUG.testNews("AAPL")                     - Test news API for specific ticker');
        console.log('YAUSMA_DEBUG.testMarket()                         - Test market overview API');
        console.log('YAUSMA_DEBUG.checkApiClient()                     - Check API client configuration');
        console.log('YAUSMA_DEBUG.testRawFetch()                       - Test raw HTTP fetch');
        console.log('YAUSMA_DEBUG.testRawFetch("/api/data/market-overview") - Test specific endpoint');
        console.log('YAUSMA_DEBUG.testSuperagent()                     - Test superagent directly');
        console.log('YAUSMA_DEBUG.testCookies()                        - Test cookie functionality');
        console.log('YAUSMA_DEBUG.testThemePersistence()               - Test theme persistence');
        console.log('YAUSMA_DEBUG.enableVerboseLogging()               - Enable detailed logging');
        console.log('YAUSMA_DEBUG.disableVerboseLogging()              - Disable detailed logging');
        console.log('YAUSMA_DEBUG.help()                               - Show this help');
        console.log('');
        console.log('For comprehensive testing, visit: /pages/api-test.html');
        console.groupEnd();
    }
};

// Initialize authentication integration
function initAuthIntegration() {
    try {
        // Initialize auth system if available
        if (window.authManager) {
            console.log('[YAUSMA] Auth manager available, initializing authentication');
            
            // Listen for auth state changes across tabs
            if (window.cookieManager) {
                // Cookie change listener for cross-tab sync
                setInterval(function() {
                    if (window.authManager) {
                        window.authManager.updateNavigation();
                    }
                }, 1000); // Check every second for auth state changes
            }
            
            console.log('[YAUSMA] Authentication integration initialized successfully');
        } else {
            console.warn('[YAUSMA] Auth manager not available, skipping auth integration');
        }
    } catch (error) {
        console.error('[YAUSMA] Failed to initialize auth integration:', error);
    }
}

// Show debug console availability message
console.log('%c[YAUSMA-DEBUG] Debug console available. Type YAUSMA_DEBUG.help() for commands.', 'color: #00d395; font-weight: bold;');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        YAUSMA: YAUSMA,
        showMessage: showMessage,
        formatNumber: formatNumber,
        formatCurrency: formatCurrency,
        formatPercentage: formatPercentage,
        debounce: debounce,
        Storage: Storage,
        toggleTheme: toggleTheme
    };
}