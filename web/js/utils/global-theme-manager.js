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
        
        console.log('<¨ Global Theme Manager initialized');
    }

    initSystemThemeQuery() {
        if (window.matchMedia) {
            this.systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.systemThemeQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
        }
    }

    loadSavedTheme() {
        const savedTheme = storage.get(CONFIG.STORAGE_KEYS.THEME);
        const userPrefs = storage.getUserPreferences();
        
        let themeToApply;
        
        if (userPrefs.autoTheme && this.systemThemeQuery) {
            // Use system theme if auto-theme is enabled
            themeToApply = this.systemThemeQuery.matches ? 'dark' : 'light';
        } else if (savedTheme && CONFIG.THEME.AVAILABLE.includes(savedTheme)) {
            // Use saved theme
            themeToApply = savedTheme;
        } else {
            // Use default theme
            themeToApply = CONFIG.THEME.DEFAULT;
        }
        
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
        if (!CONFIG.THEME.AVAILABLE.includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
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
            
            // Store theme preference
            storage.set(CONFIG.STORAGE_KEYS.THEME, theme);
            
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
            
            console.log(`<¨ Theme applied: ${theme}`);
            
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
            themeStylesheet.href = `${basePath}${theme}.css`;
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
            setTimeout(resolve, CONFIG.THEME.TRANSITION_DURATION);
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
            available: CONFIG.THEME.AVAILABLE,
            default: CONFIG.THEME.DEFAULT,
            autoTheme: this.isAutoThemeEnabled(),
            systemTheme: this.getSystemTheme(),
            isTransitioning: this.isTransitioning
        };
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
        
        console.log('<¨ Global Theme Manager destroyed');
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