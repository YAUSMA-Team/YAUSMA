// Main application initialization
class App {
    constructor() {
        this.initializeEventListeners();
        this.initializeTheme();
        this.initializeAuth();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize Bootstrap components
            BootstrapInitializer.init();
            
            // Initialize navigation
            this.initializeNavigation();
            
            // Load initial data
            this.loadInitialData();
        });

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.refreshData();
            }
        });

        // Handle theme changes
        window.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail.theme);
        });
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || CONFIG.THEME.LIGHT;
        document.body.setAttribute('data-theme', savedTheme);
        document.getElementById('theme-stylesheet').href = `css/themes/${savedTheme}.css`;
    }

    initializeAuth() {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
        if (token) {
            this.validateToken(token);
        } else {
            this.updateUIForAnonymousUser();
        }
    }

    initializeNavigation() {
        // Handle navigation menu for mobile
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', () => {
                navbarCollapse.classList.toggle('show');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                    navbarCollapse.classList.remove('show');
                }
            });
        }
    }

    async loadInitialData() {
        try {
            this.showLoadingState();
            
            // Load market overview data if on home page
            if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
                const marketData = await this.fetchMarketOverview();
                this.updateMarketOverview(marketData);
            }
            
            this.hideLoadingState();
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showErrorState(error);
        }
    }

    async refreshData() {
        // Refresh data when tab becomes visible
        this.loadInitialData();
    }

    async validateToken(token) {
        try {
            // Implement token validation logic
            const isValid = true; // Placeholder
            if (isValid) {
                this.updateUIForAuthenticatedUser();
            } else {
                this.handleInvalidToken();
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            this.handleInvalidToken();
        }
    }

    updateUIForAuthenticatedUser() {
        document.querySelectorAll('[data-auth-required]').forEach(el => {
            el.style.display = 'block';
        });
        document.querySelectorAll('[data-auth-anonymous]').forEach(el => {
            el.style.display = 'none';
        });
    }

    updateUIForAnonymousUser() {
        document.querySelectorAll('[data-auth-required]').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('[data-auth-anonymous]').forEach(el => {
            el.style.display = 'block';
        });
    }

    handleInvalidToken() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
        this.updateUIForAnonymousUser();
    }

    handleThemeChange(theme) {
        document.body.setAttribute('data-theme', theme);
        document.getElementById('theme-stylesheet').href = `css/themes/${theme}.css`;
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
    }

    showLoadingState() {
        document.querySelectorAll('[data-loading]').forEach(el => {
            el.classList.add('skeleton-loading');
        });
    }

    hideLoadingState() {
        document.querySelectorAll('.skeleton-loading').forEach(el => {
            el.classList.remove('skeleton-loading');
        });
    }

    showErrorState(error) {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.textContent = 'Failed to load data. Please try again later.';
            errorContainer.style.display = 'block';
        }
    }

    async fetchMarketOverview() {
        // Implement market overview data fetching
        return {};
    }

    updateMarketOverview(data) {
        // Update UI with market overview data
        // This is a placeholder for the actual implementation
    }
}

// Initialize the application
const app = new App(); 