// YAUSMA Main Application - Core Application Specialist Implementation
// Professional-grade application initialization and cross-page integration

class YAUSMAApp {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.currentPage = null;
        this.globalState = new Map();
        this.eventHandlers = new Map();
        this.components = new Map();
        this.performanceMetrics = {
            startTime: performance.now(),
            loadTime: null,
            interactions: 0,
            errors: 0
        };
        
        // Global configuration
        this.config = {
            THEME: {
                DEFAULT: 'light',
                STORAGE_KEY: 'yausma_theme',
                TRANSITION_DURATION: 300
            },
            STORAGE_KEYS: {
                THEME: 'yausma_theme',
                USER_PREFERENCES: 'yausma_user_prefs',
                AUTH_TOKEN: 'yausma_auth_token',
                PORTFOLIO_DATA: 'yausma_portfolio',
                WATCHLIST: 'yausma_watchlist',
                CURRENCY: 'yausma_currency',
                LOCATION: 'yausma_location'
            },
            API: {
                BASE_URL: 'http://localhost:8000',
                TIMEOUT: 10000,
                RETRY_ATTEMPTS: 3
            },
            FEATURES: {
                REAL_TIME_UPDATES: true,
                PUSH_NOTIFICATIONS: false,
                OFFLINE_MODE: true,
                ANALYTICS: true
            }
        };
        
        // Make CONFIG globally available
        window.CONFIG = this.config;
        
        this.init();
    }

    async init() {
        try {
            console.log('=€ YAUSMA App initializing...');
            
            // Initialize core systems
            await this.initializeCore();
            
            // Setup global event handlers
            this.setupGlobalEventHandlers();
            
            // Initialize theme system
            await this.initializeThemeSystem();
            
            // Setup navigation and routing
            this.setupNavigation();
            
            // Initialize global components
            await this.initializeGlobalComponents();
            
            // Setup authentication state
            this.initializeAuthenticationState();
            
            // Initialize performance monitoring
            this.initializePerformanceMonitoring();
            
            // Setup global search
            this.initializeGlobalSearch();
            
            // Initialize keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Setup error handling
            this.setupGlobalErrorHandling();
            
            // Initialize analytics
            this.initializeAnalytics();
            
            // Setup offline mode
            this.setupOfflineMode();
            
            // Complete initialization
            this.completeInitialization();
            
        } catch (error) {
            console.error('L YAUSMA App initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    async initializeCore() {
        // Initialize localStorage wrapper
        this.storage = {
            get: (key, defaultValue = null) => {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (error) {
                    console.warn('Storage get error:', error);
                    return defaultValue;
                }
            },
            set: (key, value) => {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.warn('Storage set error:', error);
                    return false;
                }
            },
            remove: (key) => {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    console.warn('Storage remove error:', error);
                    return false;
                }
            }
        };

        // Initialize global state
        this.globalState.set('isOnline', navigator.onLine);
        this.globalState.set('deviceType', this.detectDeviceType());
        this.globalState.set('currentPage', this.detectCurrentPage());
        this.globalState.set('userPreferences', this.loadUserPreferences());
        this.globalState.set('authState', this.loadAuthState());
        
        console.log(' Core systems initialized');
    }

    setupGlobalEventHandlers() {
        // Page visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Network status changes
        window.addEventListener('online', this.handleOnlineStatusChange.bind(this));
        window.addEventListener('offline', this.handleOnlineStatusChange.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.debounce(this.handleWindowResize.bind(this), 250));
        
        // Before unload
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
        
        // Global click handler for analytics
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        
        // Global form submission
        document.addEventListener('submit', this.handleGlobalFormSubmit.bind(this));
        
        console.log(' Global event handlers registered');
    }

    async initializeThemeSystem() {
        // Load saved theme or default
        const savedTheme = this.storage.get(this.config.STORAGE_KEYS.THEME, this.config.THEME.DEFAULT);
        
        // Apply theme
        await this.applyTheme(savedTheme);
        
        // Setup theme toggle functionality
        this.setupThemeToggle();
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
        }
        
        console.log(' Theme system initialized');
    }

    async applyTheme(theme) {
        return new Promise((resolve) => {
            // Add transition class for smooth switching
            document.body.classList.add('theme-transitioning');
            
            // Update theme attributes
            document.documentElement.setAttribute('data-theme', theme);
            document.body.setAttribute('data-theme', theme);
            
            // Update theme stylesheet
            const themeStylesheet = document.getElementById('theme-stylesheet');
            if (themeStylesheet) {
                themeStylesheet.href = `css/themes/${theme}.css`;
            }
            
            // Store theme preference
            this.storage.set(this.config.STORAGE_KEYS.THEME, theme);
            this.globalState.set('currentTheme', theme);
            
            // Remove transition class after animation
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
                resolve();
            }, this.config.THEME.TRANSITION_DURATION);
            
            // Dispatch global theme change event
            this.dispatchEvent('themeChanged', { theme });
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.handleThemeToggle.bind(this));
        }
    }

    async handleThemeToggle() {
        const currentTheme = this.globalState.get('currentTheme') || this.config.THEME.DEFAULT;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        await this.applyTheme(newTheme);
        
        // Update all page-specific theme handlers
        this.dispatchEvent('globalThemeChanged', { theme: newTheme });
        
        // Track theme toggle
        this.trackEvent('theme_toggle', { from: currentTheme, to: newTheme });
    }

    setupNavigation() {
        // Setup active nav link highlighting
        this.updateActiveNavLink();
        
        // Setup mobile navigation
        this.setupMobileNavigation();
        
        // Setup breadcrumbs
        this.setupBreadcrumbs();
        
        // Handle navigation clicks
        document.addEventListener('click', this.handleNavigationClick.bind(this));
        
        console.log(' Navigation system initialized');
    }

    updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href && (currentPath.endsWith(href) || 
                        (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/'))))) {
                link.classList.add('active');
            }
        });
    }

    setupMobileNavigation() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbarCollapse.contains(e.target) && 
                    !navbarToggler.contains(e.target) && 
                    navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });

            // Close mobile menu when clicking on nav links
            const navLinks = navbarCollapse.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        navbarCollapse.classList.remove('show');
                    }
                });
            });
        }
    }

    setupBreadcrumbs() {
        // Create breadcrumbs based on current page
        const breadcrumbContainer = document.querySelector('.breadcrumb-container');
        if (breadcrumbContainer) {
            const breadcrumbs = this.generateBreadcrumbs();
            breadcrumbContainer.innerHTML = breadcrumbs;
        }
    }

    generateBreadcrumbs() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        let breadcrumbs = '<ol class="breadcrumb">';
        breadcrumbs += '<li class="breadcrumb-item"><a href="/">Home</a></li>';
        
        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;
            const title = this.formatBreadcrumbTitle(segment);
            
            if (isLast) {
                breadcrumbs += `<li class="breadcrumb-item active">${title}</li>`;
            } else {
                breadcrumbs += `<li class="breadcrumb-item"><a href="${currentPath}">${title}</a></li>`;
            }
        });
        
        breadcrumbs += '</ol>';
        return breadcrumbs;
    }

    formatBreadcrumbTitle(segment) {
        return segment.replace(/[-_]/g, ' ')
                     .split(' ')
                     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                     .join(' ');
    }

    async initializeGlobalComponents() {
        // Initialize loading overlay
        this.initializeLoadingOverlay();
        
        // Initialize notification system
        this.initializeNotificationSystem();
        
        // Initialize modal system
        this.initializeModalSystem();
        
        // Initialize tooltip system
        this.initializeTooltipSystem();
        
        console.log(' Global components initialized');
    }

    initializeLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            this.components.set('loadingOverlay', {
                element: loadingOverlay,
                show: () => {
                    loadingOverlay.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                },
                hide: () => {
                    loadingOverlay.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    }

    initializeNotificationSystem() {
        // Create notification container if it doesn't exist
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        this.components.set('notifications', {
            container: notificationContainer,
            show: this.showNotification.bind(this),
            success: (message) => this.showNotification(message, 'success'),
            error: (message) => this.showNotification(message, 'error'),
            warning: (message) => this.showNotification(message, 'warning'),
            info: (message) => this.showNotification(message, 'info')
        });
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = this.components.get('notifications').container;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" type="button">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Add to container
        container.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('notification-show');
        });
    }

    removeNotification(notification) {
        notification.classList.add('notification-hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle-fill',
            error: 'exclamation-triangle-fill',
            warning: 'exclamation-circle-fill',
            info: 'info-circle-fill'
        };
        return icons[type] || icons.info;
    }

    initializeModalSystem() {
        // Initialize Bootstrap modals
        if (typeof bootstrap !== 'undefined') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                new bootstrap.Modal(modal);
            });
        }
    }

    initializeTooltipSystem() {
        // Initialize Bootstrap tooltips
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }

    initializeAuthenticationState() {
        const authToken = this.storage.get(this.config.STORAGE_KEYS.AUTH_TOKEN);
        const isAuthenticated = !!authToken;
        
        this.globalState.set('isAuthenticated', isAuthenticated);
        
        // Update UI based on auth state
        this.updateAuthUI(isAuthenticated);
        
        // Setup auth event handlers
        this.setupAuthEventHandlers();
        
        console.log(' Authentication state initialized');
    }

    updateAuthUI(isAuthenticated) {
        const anonymousElements = document.querySelectorAll('[data-auth-anonymous]');
        const authenticatedElements = document.querySelectorAll('[data-auth-required]');
        
        anonymousElements.forEach(element => {
            element.style.display = isAuthenticated ? 'none' : '';
        });
        
        authenticatedElements.forEach(element => {
            element.style.display = isAuthenticated ? '' : 'none';
        });
    }

    setupAuthEventHandlers() {
        // Sign out handler
        const signOutBtn = document.getElementById('signOut');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', this.handleSignOut.bind(this));
        }
        
        // Listen for auth state changes
        this.addEventListener('authStateChanged', this.handleAuthStateChange.bind(this));
    }

    handleSignOut(event) {
        event.preventDefault();
        
        // Clear auth data
        this.storage.remove(this.config.STORAGE_KEYS.AUTH_TOKEN);
        this.storage.remove(this.config.STORAGE_KEYS.USER_PREFERENCES);
        
        // Update state
        this.globalState.set('isAuthenticated', false);
        
        // Update UI
        this.updateAuthUI(false);
        
        // Show notification
        this.components.get('notifications').info('You have been signed out successfully');
        
        // Redirect to auth page if needed
        const currentPage = this.globalState.get('currentPage');
        if (currentPage === 'portfolio' || currentPage === 'pro') {
            window.location.href = 'auth.html';
        }
        
        // Track sign out
        this.trackEvent('user_sign_out');
    }

    initializePerformanceMonitoring() {
        // Record load time
        window.addEventListener('load', () => {
            this.performanceMetrics.loadTime = performance.now() - this.performanceMetrics.startTime;
            console.log(`¡ App loaded in ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
        });
        
        // Monitor performance
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.entryType === 'navigation') {
                            console.log('=Ê Navigation timing:', entry);
                        }
                    });
                });
                observer.observe({ entryTypes: ['navigation'] });
            } catch (error) {
                console.warn('Performance observer not supported');
            }
        }
        
        console.log(' Performance monitoring initialized');
    }

    initializeGlobalSearch() {
        const searchInputs = document.querySelectorAll('.global-search-input');
        
        searchInputs.forEach(input => {
            input.addEventListener('input', this.debounce(this.handleGlobalSearch.bind(this), 300));
            input.addEventListener('keydown', this.handleSearchKeydown.bind(this));
        });
        
        console.log(' Global search initialized');
    }

    handleGlobalSearch(event) {
        const query = event.target.value.trim();
        
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }
        
        // Show loading state
        this.showSearchLoading();
        
        // Simulate search (replace with actual API call)
        setTimeout(() => {
            const results = this.performSearch(query);
            this.showSearchResults(results);
        }, 300);
        
        // Track search
        this.trackEvent('global_search', { query: query.substring(0, 100) });
    }

    performSearch(query) {
        // Mock search results - replace with actual API integration
        const mockResults = [
            { type: 'stock', symbol: 'AAPL', name: 'Apple Inc.', price: 175.43 },
            { type: 'stock', symbol: 'TSLA', name: 'Tesla Inc.', price: 234.56 },
            { type: 'news', title: 'Market Update: Tech Stocks Rally', date: '2024-07-01' },
        ];
        
        return mockResults.filter(item => 
            item.symbol?.toLowerCase().includes(query.toLowerCase()) ||
            item.name?.toLowerCase().includes(query.toLowerCase()) ||
            item.title?.toLowerCase().includes(query.toLowerCase())
        );
    }

    showSearchLoading() {
        // Implementation for search loading state
        console.log('Showing search loading...');
    }

    showSearchResults(results) {
        // Implementation for showing search results
        console.log('Search results:', results);
    }

    hideSearchResults() {
        // Implementation for hiding search results
        console.log('Hiding search results...');
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        console.log(' Keyboard shortcuts initialized');
    }

    handleKeyboardShortcuts(event) {
        // Global keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'k':
                    event.preventDefault();
                    this.focusGlobalSearch();
                    break;
                case 't':
                    event.preventDefault();
                    this.handleThemeToggle();
                    break;
                case '/':
                    event.preventDefault();
                    this.focusGlobalSearch();
                    break;
            }
        }
        
        // ESC key handlers
        if (event.key === 'Escape') {
            this.handleEscapeKey();
        }
    }

    focusGlobalSearch() {
        const searchInput = document.querySelector('.global-search-input');
        if (searchInput) {
            searchInput.focus();
            this.trackEvent('keyboard_shortcut', { action: 'focus_search' });
        }
    }

    handleEscapeKey() {
        // Close modals, search results, etc.
        this.hideSearchResults();
        
        // Remove focus from search inputs
        const searchInputs = document.querySelectorAll('.global-search-input');
        searchInputs.forEach(input => input.blur());
    }

    setupGlobalErrorHandling() {
        // Global error handler
        window.addEventListener('error', this.handleGlobalError.bind(this));
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
        
        console.log(' Global error handling initialized');
    }

    handleGlobalError(event) {
        console.error('Global error:', event.error);
        
        this.performanceMetrics.errors++;
        
        // Show user-friendly error message
        this.components.get('notifications').error('An unexpected error occurred. Please try refreshing the page.');
        
        // Track error
        this.trackEvent('global_error', {
            message: event.error?.message,
            filename: event.filename,
            lineno: event.lineno
        });
    }

    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        this.performanceMetrics.errors++;
        
        // Track error
        this.trackEvent('unhandled_rejection', {
            reason: event.reason?.toString()
        });
    }

    initializeAnalytics() {
        if (this.config.FEATURES.ANALYTICS) {
            // Initialize analytics tracking
            this.analytics = {
                events: [],
                sessionId: this.generateSessionId(),
                startTime: Date.now()
            };
            
            // Track page view
            this.trackPageView();
            
            console.log(' Analytics initialized');
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    trackEvent(eventName, properties = {}) {
        if (!this.config.FEATURES.ANALYTICS) return;
        
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                sessionId: this.analytics.sessionId,
                page: this.globalState.get('currentPage'),
                theme: this.globalState.get('currentTheme'),
                deviceType: this.globalState.get('deviceType')
            }
        };
        
        this.analytics.events.push(event);
        console.log('=Ê Analytics event:', event);
        
        // Send to analytics service (mock implementation)
        // this.sendAnalyticsEvent(event);
    }

    trackPageView() {
        this.trackEvent('page_view', {
            path: window.location.pathname,
            referrer: document.referrer
        });
    }

    setupOfflineMode() {
        if (this.config.FEATURES.OFFLINE_MODE) {
            // Setup service worker for offline support
            if ('serviceWorker' in navigator) {
                this.registerServiceWorker();
            }
            
            console.log(' Offline mode initialized');
        }
    }

    async registerServiceWorker() {
        try {
            // Service worker registration (implement sw.js file)
            // const registration = await navigator.serviceWorker.register('/sw.js');
            // console.log('Service Worker registered:', registration);
        } catch (error) {
            console.warn('Service Worker registration failed:', error);
        }
    }

    completeInitialization() {
        this.isInitialized = true;
        
        // Hide loading overlay
        const loadingComponent = this.components.get('loadingOverlay');
        if (loadingComponent) {
            setTimeout(() => {
                loadingComponent.hide();
            }, 500);
        }
        
        // Dispatch app ready event
        this.dispatchEvent('appReady');
        
        console.log('<‰ YAUSMA App fully initialized!');
        
        // Track initialization complete
        this.trackEvent('app_initialized', {
            loadTime: this.performanceMetrics.loadTime,
            version: this.version
        });
    }

    // Event system
    addEventListener(eventName, handler) {
        if (!this.eventHandlers.has(eventName)) {
            this.eventHandlers.set(eventName, []);
        }
        this.eventHandlers.get(eventName).push(handler);
    }

    removeEventListener(eventName, handler) {
        const handlers = this.eventHandlers.get(eventName);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    dispatchEvent(eventName, data = {}) {
        const handlers = this.eventHandlers.get(eventName);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${eventName}:`, error);
                }
            });
        }
        
        // Also dispatch as DOM event
        const customEvent = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(customEvent);
    }

    // Utility methods
    detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile|android|ios|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
            return 'mobile';
        } else if (/tablet|ipad/i.test(userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path.endsWith('index.html') || path.endsWith('/')) {
            return 'home';
        } else if (path.includes('stocks')) {
            return 'stocks';
        } else if (path.includes('news')) {
            return 'news';
        } else if (path.includes('portfolio')) {
            return 'portfolio';
        } else if (path.includes('pro')) {
            return 'pro';
        } else if (path.includes('auth')) {
            return 'auth';
        } else if (path.includes('stock-detail')) {
            return 'stock-detail';
        }
        return 'unknown';
    }

    loadUserPreferences() {
        return this.storage.get(this.config.STORAGE_KEYS.USER_PREFERENCES, {
            currency: 'USD',
            language: 'en',
            notifications: true,
            autoTheme: false
        });
    }

    loadAuthState() {
        const token = this.storage.get(this.config.STORAGE_KEYS.AUTH_TOKEN);
        return {
            isAuthenticated: !!token,
            token: token,
            lastLogin: this.storage.get('last_login')
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Event handlers
    handleVisibilityChange() {
        const isVisible = !document.hidden;
        this.globalState.set('isVisible', isVisible);
        
        this.dispatchEvent('visibilityChanged', { isVisible });
        
        this.trackEvent('visibility_change', { isVisible });
    }

    handleOnlineStatusChange() {
        const isOnline = navigator.onLine;
        this.globalState.set('isOnline', isOnline);
        
        const message = isOnline ? 'Connection restored' : 'Connection lost';
        const type = isOnline ? 'success' : 'warning';
        
        this.components.get('notifications').show(message, type);
        
        this.dispatchEvent('connectionChanged', { isOnline });
        
        this.trackEvent('connection_change', { isOnline });
    }

    handleWindowResize() {
        const deviceType = this.detectDeviceType();
        this.globalState.set('deviceType', deviceType);
        
        this.dispatchEvent('windowResized', { 
            width: window.innerWidth,
            height: window.innerHeight,
            deviceType 
        });
    }

    handleBeforeUnload() {
        // Track session end
        this.trackEvent('session_end', {
            duration: Date.now() - this.performanceMetrics.startTime,
            interactions: this.performanceMetrics.interactions,
            errors: this.performanceMetrics.errors
        });
    }

    handleNavigationClick(event) {
        const link = event.target.closest('a');
        if (link && link.href) {
            this.trackEvent('navigation_click', {
                href: link.href,
                text: link.textContent?.trim()
            });
        }
    }

    handleGlobalClick(event) {
        this.performanceMetrics.interactions++;
        
        // Track button clicks
        if (event.target.matches('button, .btn')) {
            this.trackEvent('button_click', {
                text: event.target.textContent?.trim(),
                className: event.target.className
            });
        }
    }

    handleGlobalFormSubmit(event) {
        const form = event.target;
        if (form.tagName === 'FORM') {
            this.trackEvent('form_submit', {
                formId: form.id,
                formClass: form.className
            });
        }
    }

    handleSystemThemeChange(event) {
        const systemTheme = event.matches ? 'dark' : 'light';
        const userPrefs = this.globalState.get('userPreferences');
        
        if (userPrefs.autoTheme) {
            this.applyTheme(systemTheme);
        }
    }

    handleAuthStateChange(data) {
        this.updateAuthUI(data.isAuthenticated);
    }

    handleSearchKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleGlobalSearch(event);
        }
    }

    handleInitializationError(error) {
        console.error('Initialization error:', error);
        
        // Show error message to user
        document.body.innerHTML = `
            <div class="initialization-error">
                <div class="container text-center">
                    <h1>  Application Error</h1>
                    <p>YAUSMA failed to initialize properly. Please refresh the page to try again.</p>
                    <button onclick="window.location.reload()" class="btn btn-coinbase-primary">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }

    // Public API methods
    getState(key) {
        return this.globalState.get(key);
    }

    setState(key, value) {
        this.globalState.set(key, value);
        this.dispatchEvent('stateChanged', { key, value });
    }

    showLoading() {
        const loadingComponent = this.components.get('loadingOverlay');
        if (loadingComponent) {
            loadingComponent.show();
        }
    }

    hideLoading() {
        const loadingComponent = this.components.get('loadingOverlay');
        if (loadingComponent) {
            loadingComponent.hide();
        }
    }

    showNotification(message, type = 'info') {
        const notificationComponent = this.components.get('notifications');
        if (notificationComponent) {
            notificationComponent.show(message, type);
        }
    }

    async switchTheme(theme) {
        await this.applyTheme(theme);
    }

    updateAuthState(isAuthenticated, token = null) {
        this.globalState.set('isAuthenticated', isAuthenticated);
        
        if (isAuthenticated && token) {
            this.storage.set(this.config.STORAGE_KEYS.AUTH_TOKEN, token);
        } else {
            this.storage.remove(this.config.STORAGE_KEYS.AUTH_TOKEN);
        }
        
        this.dispatchEvent('authStateChanged', { isAuthenticated, token });
    }

    getComponent(name) {
        return this.components.get(name);
    }

    destroy() {
        // Clean up all event listeners
        this.eventHandlers.clear();
        
        // Clear all timers and intervals
        // (Implementation depends on what timers are running)
        
        // Clean up components
        this.components.clear();
        
        console.log('>ù YAUSMA App destroyed');
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main application
    window.YAUSMAApp = new YAUSMAApp();
    
    // Make app globally available
    window.app = window.YAUSMAApp;
    
    // Expose useful methods globally
    window.showNotification = (message, type) => window.app.showNotification(message, type);
    window.showLoading = () => window.app.showLoading();
    window.hideLoading = () => window.app.hideLoading();
    window.trackEvent = (name, properties) => window.app.trackEvent(name, properties);
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.YAUSMAApp) {
        window.YAUSMAApp.destroy();
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YAUSMAApp;
}