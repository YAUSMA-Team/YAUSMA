// Global App Initializer - web/js/utils/app-initializer.js
class AppInitializer {
    constructor() {
        this.globalThemeManager = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('Initializing YAUSMA App...');
        
        // Initialize theme manager first
        this.globalThemeManager = new GlobalThemeManager();
        
        // Initialize Bootstrap components
        BootstrapInitializer.init();
        
        // Set up global event handlers
        this.setupGlobalEventHandlers();
        
        // Handle page visibility changes
        this.setupVisibilityHandlers();
        
        // Handle navigation events
        this.setupNavigationHandlers();
        
        this.isInitialized = true;
        console.log('YAUSMA App initialized successfully');
    }

    setupGlobalEventHandlers() {
        // Global theme toggle handler using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.id === 'theme-toggle' || e.target.closest('#theme-toggle')) {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.globalThemeManager) {
                    this.globalThemeManager.toggleTheme();
                }
            }
        });

        // Global logout handler
        window.handleLogout = () => {
            // Clear authentication token
            localStorage.removeItem('yausma_user_token');
            
            // Update auth state if navbar component exists
            if (typeof updateAuthState === 'function') {
                updateAuthState();
            }
            
            // Redirect to home page
            window.location.href = '/';
        };
    }

    setupVisibilityHandlers() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Re-initialize when page becomes visible (handles navigation issues)
                setTimeout(() => {
                    BootstrapInitializer.init();
                    if (this.globalThemeManager) {
                        this.globalThemeManager.applyTheme();
                    }
                }, 100);
            }
        });
    }

    setupNavigationHandlers() {
        // Handle page navigation - reinitialize when necessary
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                // Page was loaded from cache, reinitialize
                setTimeout(() => {
                    BootstrapInitializer.init();
                    if (this.globalThemeManager) {
                        this.globalThemeManager.applyTheme();
                    }
                }, 100);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                BootstrapInitializer.init();
            }, 50);
        });
    }

    getThemeManager() {
        return this.globalThemeManager;
    }

    reinitialize() {
        console.log('Reinitializing app components...');
        BootstrapInitializer.init();
        if (this.globalThemeManager) {
            this.globalThemeManager.applyTheme();
        }
    }
}

// Global app instance
let appInitializer;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    if (!appInitializer) {
        appInitializer = new AppInitializer();
        appInitializer.init();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AppInitializer = AppInitializer;
    window.appInitializer = appInitializer;
}