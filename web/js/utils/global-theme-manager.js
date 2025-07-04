// YAUSMA Global Theme Manager - Coinbase-Inspired Theme System
// Professional theme management with smooth transitions and system integration

class GlobalThemeManager {
    constructor() {
        this.currentTheme = null;
        this.isTransitioning = false;
        this.systemThemeQuery = null;
        this.observers = new Set();
        this.themeChangeCallbacks = new Map();
        
        this.init();
    }

    init() {
        // Initialize system theme media query
        this.initSystemThemeQuery();
        
        // Load and apply saved theme
        this.loadSavedTheme();
        
        // Setup theme toggle event listeners
        this.setupThemeToggleListeners();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup cookie event listeners
        this.setupCookieEventListeners();
        
        console.log('<� Global Theme Manager initialized');
    }

    initSystemThemeQuery() {
        if (window.matchMedia) {
            this.systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.systemThemeQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
        }
    }

    loadSavedTheme() {
        console.log('🎨 Global Theme Manager loading saved theme...');
        
        let themeToApply;
        let themeSource = 'default';
        
        // First priority: Check cookies for theme preference
        if (window.cookieManager) {
            const cookieTheme = window.cookieManager.getTheme(null);
            if (cookieTheme && ['light', 'dark'].includes(cookieTheme)) {
                themeToApply = cookieTheme;
                themeSource = 'cookie';
                console.log(`🍪 Global Theme Manager found theme in cookie: ${cookieTheme}`);
            }
        }
        
        // Second priority: Check localStorage for migration
        if (!themeToApply && typeof Storage !== 'undefined') {
            const localTheme = Storage.get('theme', null, false); // Don't prefer cookie here to avoid recursion
            if (localTheme && ['light', 'dark'].includes(localTheme)) {
                themeToApply = localTheme;
                themeSource = 'localStorage';
                console.log(`💾 Global Theme Manager found theme in localStorage: ${localTheme}`);
                
                // Migrate to cookie if cookie manager is available
                if (window.cookieManager) {
                    console.log(`🔄 Global Theme Manager migrating theme to cookie: ${localTheme}`);
                    window.cookieManager.setTheme(localTheme);
                }
            }
        }
        
        // Third priority: Check system preference
        if (!themeToApply && this.systemThemeQuery) {
            themeToApply = this.systemThemeQuery.matches ? 'dark' : 'light';
            themeSource = 'system';
            console.log(`⚙️ Global Theme Manager using system theme: ${themeToApply}`);
        }
        
        // Final fallback: Use default theme
        if (!themeToApply) {
            themeToApply = 'light';
            themeSource = 'default';
            console.log(`🔄 Global Theme Manager using default theme: ${themeToApply}`);
        }
        
        console.log(`🎨 Global Theme Manager applying theme: ${themeToApply} (source: ${themeSource})`);
        this.applyTheme(themeToApply, false);
    }

    setupThemeToggleListeners() {
        // Listen for theme toggle button clicks
        document.addEventListener('click', (event) => {
            if (event.target.matches('#themeToggle, #themeToggle *')) {
                event.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Listen for global theme change events
        window.addEventListener('globalThemeChanged', (event) => {
            this.applyTheme(event.detail.theme, true);
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + T for theme toggle
            if ((event.ctrlKey || event.metaKey) && event.key === 't') {
                event.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * Apply theme to the document
     * @param {string} theme - Theme name ('light' or 'dark')
     * @param {boolean} animate - Whether to animate the transition
     * @returns {Promise} Promise that resolves when theme is applied
     */
    async applyTheme(theme, animate = true) {
        // Validate theme
        const availableThemes = (typeof CONFIG !== 'undefined' && CONFIG.THEME && CONFIG.THEME.AVAILABLE) 
            ? CONFIG.THEME.AVAILABLE 
            : ['light', 'dark'];
        
        if (!availableThemes.includes(theme)) {
            console.warn(`Invalid theme: ${theme}, using default`);
            theme = 'light';
        }

        if (this.currentTheme === theme && !animate) {
            return;
        }

        this.isTransitioning = true;
        
        try {
            if (animate) {
                // Add transition class for smooth animation
                document.body.classList.add('theme-transitioning');
            }
            
            // Update theme attributes
            document.documentElement.setAttribute('data-theme', theme);
            document.body.setAttribute('data-theme', theme);
            
            // Update theme-specific elements
            this.updateThemeElements(theme);
            
            // Update theme stylesheet
            this.updateThemeStylesheet(theme);
            
            // Update theme toggle button
            this.updateThemeToggleButton(theme);
            
            // Store theme preference - prioritize cookies
            this.saveThemePreference(theme);
            
            // Update current theme
            const previousTheme = this.currentTheme;
            this.currentTheme = theme;
            
            // Notify observers
            this.notifyObservers(theme, previousTheme);
            
            // Dispatch theme change event
            this.dispatchThemeChangeEvent(theme, previousTheme);
            
            // Update charts and other components
            this.updateThemeComponents(theme);
            
            if (animate) {
                // Wait for transition to complete
                await this.waitForTransition();
                
                // Remove transition class
                document.body.classList.remove('theme-transitioning');
            }
            
            console.log(`<� Theme applied: ${theme}`);
            
        } catch (error) {
            console.error('Theme application error:', error);
        } finally {
            this.isTransitioning = false;
        }
    }

    updateThemeElements(theme) {
        // Update theme-specific icons
        const themeIcons = document.querySelectorAll('[data-theme-icon]');
        themeIcons.forEach(icon => {
            const lightIcon = icon.dataset.themeIconLight;
            const darkIcon = icon.dataset.themeIconDark;
            
            if (theme === 'dark' && darkIcon) {
                icon.className = darkIcon;
            } else if (theme === 'light' && lightIcon) {
                icon.className = lightIcon;
            }
        });
        
        // Update theme-specific content
        const themeContent = document.querySelectorAll('[data-theme-content]');
        themeContent.forEach(element => {
            const lightContent = element.dataset.themeContentLight;
            const darkContent = element.dataset.themeContentDark;
            
            if (theme === 'dark' && darkContent) {
                element.textContent = darkContent;
            } else if (theme === 'light' && lightContent) {
                element.textContent = lightContent;
            }
        });
    }

    updateThemeStylesheet(theme) {
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            const isInPages = window.location.pathname.includes('/pages/');
            const basePath = isInPages ? '../css/themes/' : 'css/themes/';
            const newHref = `${basePath}${theme}.css`;
            
            console.log(`🎨 Global Theme Manager updating stylesheet: ${newHref}`);
            console.log(`📍 Current path: ${window.location.pathname}, isInPages: ${isInPages}`);
            
            // Add load error handling
            const onLoad = () => {
                console.log(`✅ Global Theme Manager stylesheet loaded: ${newHref}`);
                themeStylesheet.removeEventListener('load', onLoad);
                themeStylesheet.removeEventListener('error', onError);
            };
            
            const onError = () => {
                console.error(`❌ Global Theme Manager failed to load: ${newHref}`);
                if (window.app && window.app.components && window.app.components.get('notifications')) {
                    window.app.components.get('notifications').error(`Failed to load ${theme} theme stylesheet.`);
                }
                themeStylesheet.removeEventListener('load', onLoad);
                themeStylesheet.removeEventListener('error', onError);
            };
            
            themeStylesheet.addEventListener('load', onLoad);
            themeStylesheet.addEventListener('error', onError);
            themeStylesheet.href = newHref;
        } else {
            console.warn('🚨 Theme stylesheet element not found (#theme-stylesheet)');
        }
    }

    updateThemeToggleButton(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const lightIcon = themeToggle.querySelector('.theme-icon-light');
            const darkIcon = themeToggle.querySelector('.theme-icon-dark');
            
            if (lightIcon && darkIcon) {
                if (theme === 'dark') {
                    lightIcon.style.display = 'inline-block';
                    darkIcon.style.display = 'none';
                } else {
                    lightIcon.style.display = 'none';
                    darkIcon.style.display = 'inline-block';
                }
            }
            
            // Update aria-label
            const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            themeToggle.setAttribute('aria-label', label);
        }
    }

    updateThemeComponents(theme) {
        // Update Chart.js charts if available
        if (typeof Chart !== 'undefined') {
            this.updateChartThemes(theme);
        }
        
        // Update other components
        this.updateComponentThemes(theme);
    }

    updateChartThemes(theme) {
        // Update all Chart.js instances
        Object.values(Chart.instances || {}).forEach(chart => {
            if (chart && chart.options) {
                // Update chart colors based on theme
                const isDark = theme === 'dark';
                
                if (chart.options.plugins && chart.options.plugins.legend) {
                    chart.options.plugins.legend.labels = {
                        ...chart.options.plugins.legend.labels,
                        color: isDark ? '#ffffff' : '#050f19'
                    };
                }
                
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        if (scale.ticks) {
                            scale.ticks.color = isDark ? '#9ca0a6' : '#5b616e';
                        }
                        if (scale.grid) {
                            scale.grid.color = isDark ? '#2d3139' : '#d8dce0';
                        }
                    });
                }
                
                chart.update('none');
            }
        });
    }

    updateComponentThemes(theme) {
        // Notify all registered components about theme change
        this.themeChangeCallbacks.forEach(callback => {
            try {
                callback(theme);
            } catch (error) {
                console.error('Component theme update error:', error);
            }
        });
    }

    waitForTransition() {
        return new Promise(resolve => {
            const duration = (typeof CONFIG !== 'undefined' && CONFIG.THEME && CONFIG.THEME.TRANSITION_DURATION) 
                ? CONFIG.THEME.TRANSITION_DURATION 
                : 300;
            setTimeout(resolve, duration);
        });
    }

    notifyObservers(newTheme, previousTheme) {
        this.observers.forEach(observer => {
            try {
                observer({ newTheme, previousTheme });
            } catch (error) {
                console.error('Theme observer error:', error);
            }
        });
    }

    dispatchThemeChangeEvent(newTheme, previousTheme) {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: newTheme,
                previousTheme: previousTheme,
                timestamp: Date.now()
            }
        });
        
        window.dispatchEvent(event);
    }

    handleSystemThemeChange(event) {
        if (typeof storage === 'undefined') {
            return;
        }
        
        const userPrefs = storage.getUserPreferences();
        
        if (userPrefs.autoTheme) {
            const systemTheme = event.matches ? 'dark' : 'light';
            this.applyTheme(systemTheme, true);
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        if (this.isTransitioning) {
            return;
        }
        
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme, true);
        
        // Track theme toggle
        if (window.app && window.app.trackEvent) {
            window.app.trackEvent('theme_toggle', {
                from: this.currentTheme,
                to: newTheme,
                method: 'manual'
            });
        }
    }

    /**
     * Set theme to specific value
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        this.applyTheme(theme, true);
    }

    /**
     * Get current theme
     * @returns {string} Current theme name
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if theme is currently transitioning
     * @returns {boolean} Whether theme is transitioning
     */
    isThemeTransitioning() {
        return this.isTransitioning;
    }

    /**
     * Get system theme preference
     * @returns {string} System theme preference ('light' or 'dark')
     */
    getSystemTheme() {
        if (this.systemThemeQuery) {
            return this.systemThemeQuery.matches ? 'dark' : 'light';
        }
        return 'light';
    }

    /**
     * Enable or disable auto theme (follows system preference)
     * @param {boolean} enabled - Whether to enable auto theme
     */
    setAutoTheme(enabled) {
        if (typeof storage === 'undefined') {
            console.warn('Storage not available for auto theme setting');
            return;
        }
        
        const userPrefs = storage.getUserPreferences();
        userPrefs.autoTheme = enabled;
        storage.setUserPreferences(userPrefs);
        
        if (enabled) {
            this.applyTheme(this.getSystemTheme(), true);
        }
    }

    /**
     * Check if auto theme is enabled
     * @returns {boolean} Whether auto theme is enabled
     */
    isAutoThemeEnabled() {
        if (typeof storage === 'undefined') {
            return false;
        }
        
        const userPrefs = storage.getUserPreferences();
        return userPrefs.autoTheme || false;
    }

    /**
     * Add theme change observer
     * @param {Function} observer - Observer function
     */
    addObserver(observer) {
        this.observers.add(observer);
    }

    /**
     * Remove theme change observer
     * @param {Function} observer - Observer function
     */
    removeObserver(observer) {
        this.observers.delete(observer);
    }

    /**
     * Register component theme change callback
     * @param {string} componentName - Component name
     * @param {Function} callback - Callback function
     */
    registerComponentCallback(componentName, callback) {
        this.themeChangeCallbacks.set(componentName, callback);
    }

    /**
     * Unregister component theme change callback
     * @param {string} componentName - Component name
     */
    unregisterComponentCallback(componentName) {
        this.themeChangeCallbacks.delete(componentName);
    }

    /**
     * Force refresh theme styles
     */
    refreshTheme() {
        if (this.currentTheme) {
            this.applyTheme(this.currentTheme, false);
        }
    }

    /**
     * Get theme configuration
     * @returns {object} Theme configuration
     */
    getThemeConfig() {
        return {
            current: this.currentTheme,
            available: (typeof CONFIG !== 'undefined' && CONFIG.THEME && CONFIG.THEME.AVAILABLE) ? CONFIG.THEME.AVAILABLE : ['light', 'dark'],
            default: (typeof CONFIG !== 'undefined' && CONFIG.THEME && CONFIG.THEME.DEFAULT) ? CONFIG.THEME.DEFAULT : 'light',
            autoTheme: this.isAutoThemeEnabled(),
            systemTheme: this.getSystemTheme(),
            isTransitioning: this.isTransitioning
        };
    }

    /**
     * Save theme preference using cookies with localStorage fallback
     * @param {string} theme - Theme to save
     */
    saveThemePreference(theme) {
        console.log(`💾 Global Theme Manager saving theme preference: ${theme}`);
        
        // Primary: Save to cookie if available
        if (window.cookieManager) {
            const success = window.cookieManager.setTheme(theme);
            if (success) {
                console.log(`🍪 Global Theme Manager saved theme to cookie: ${theme}`);
                return;
            }
        }
        
        // Fallback: Save to localStorage via Storage utility
        if (typeof Storage !== 'undefined') {
            const success = Storage.set('theme', theme);
            if (success) {
                console.log(`💾 Global Theme Manager saved theme to localStorage: ${theme}`);
                return;
            }
        }
        
        console.warn('⚠️ Global Theme Manager failed to save theme preference');
    }
    
    /**
     * Setup cookie event listeners for cross-tab synchronization
     */
    setupCookieEventListeners() {
        // Listen for cookie change events from CookieManager
        window.addEventListener('cookiechange', (event) => {
            console.log('🍪 Global Theme Manager received cookie change event:', event.detail);
            
            // Handle theme cookie changes from other tabs
            if (event.detail.name === 'yausma_theme' && event.detail.action === 'sync') {
                const newTheme = event.detail.value;
                if (newTheme && newTheme !== this.currentTheme && ['light', 'dark'].includes(newTheme)) {
                    console.log(`🔄 Global Theme Manager syncing theme from other tab: ${newTheme}`);
                    this.applyTheme(newTheme, true);
                }
            }
        });
        
        // Listen for storage events (localStorage fallback synchronization)
        window.addEventListener('storage', (event) => {
            if (event.key === 'theme' && event.newValue !== event.oldValue) {
                try {
                    const newTheme = JSON.parse(event.newValue);
                    if (newTheme && newTheme !== this.currentTheme && ['light', 'dark'].includes(newTheme)) {
                        console.log(`🔄 Global Theme Manager syncing theme from localStorage: ${newTheme}`);
                        this.applyTheme(newTheme, true);
                    }
                } catch (e) {
                    console.warn('⚠️ Global Theme Manager failed to parse theme from storage event:', e);
                }
            }
        });
    }
    
    /**
     * Get theme preference with cookie priority
     * @returns {string} Current theme preference
     */
    getThemePreference() {
        // First check cookies
        if (window.cookieManager) {
            const cookieTheme = window.cookieManager.getTheme(null);
            if (cookieTheme) {
                return cookieTheme;
            }
        }
        
        // Fallback to localStorage
        if (typeof Storage !== 'undefined') {
            return Storage.get('theme', 'light');
        }
        
        return 'light';
    }
    
    /**
     * Clear theme preference from all storage
     */
    clearThemePreference() {
        console.log('🗑️ Global Theme Manager clearing theme preference');
        
        // Clear from cookies
        if (window.cookieManager) {
            window.cookieManager.deleteTheme();
        }
        
        // Clear from localStorage
        if (typeof Storage !== 'undefined') {
            Storage.remove('theme');
        }
    }
    
    /**
     * Destroy theme manager
     */
    destroy() {
        // Remove event listeners
        if (this.systemThemeQuery) {
            this.systemThemeQuery.removeEventListener('change', this.handleSystemThemeChange);
        }
        
        // Clear observers and callbacks
        this.observers.clear();
        this.themeChangeCallbacks.clear();
        
        console.log('<� Global Theme Manager destroyed');
    }
}

// Create global theme manager instance
const globalThemeManager = new GlobalThemeManager();

// Make theme manager globally available
if (typeof window !== 'undefined') {
    window.globalThemeManager = globalThemeManager;
    window.GlobalThemeManager = GlobalThemeManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { globalThemeManager, GlobalThemeManager };
}