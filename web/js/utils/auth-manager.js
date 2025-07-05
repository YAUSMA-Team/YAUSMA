/**
 * YAUSMA Authentication Manager
 * Simple authentication utilities for cookie-based login/logout
 */

class AuthManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Listen for page load to update navigation
        document.addEventListener('DOMContentLoaded', () => {
            this.updateNavigation();
        });
        
        // Listen for cookie changes from other tabs
        window.addEventListener('cookiechange', (event) => {
            if (event.detail.name === 'yausma_isLoggedIn') {
                console.log('[AuthManager] Login state changed in another tab');
                this.updateNavigation();
            }
        });
        
        console.log('[AuthManager] Authentication manager initialized');
    }
    
    /**
     * Check if user is currently logged in
     * @returns {boolean} Login status
     */
    isLoggedIn() {
        if (!window.cookieManager) {
            console.warn('[AuthManager] Cookie manager not available');
            return false;
        }
        
        return window.cookieManager.isLoggedIn();
    }
    
    /**
     * Simple login function (for now just sets cookie)
     * @param {string} username - Username (for future API integration)
     * @param {string} password - Password (for future API integration)
     * @returns {boolean} Login success
     */
    login(username, password) {
        console.log('[AuthManager] Attempting login...');
        
        // Simple test credentials for now
        if (username === 'test@test' && password === 'test') {
            if (window.cookieManager) {
                const success = window.cookieManager.setLoggedIn(true);
                if (success) {
                    console.log('[AuthManager] Login successful');
                    this.updateNavigation();
                    return true;
                }
            }
        }
        
        console.log('[AuthManager] Login failed');
        return false;
    }
    
    /**
     * Logout user
     */
    logout() {
        console.log('[AuthManager] Logging out user...');
        
        if (window.cookieManager) {
            window.cookieManager.logout();
        }
        
        // Refresh the page to reset state
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }
    
    /**
     * Require authentication for current page
     * Redirects to auth page if not logged in
     * @returns {boolean} Whether user is authenticated
     */
    requireAuth() {
        if (!this.isLoggedIn()) {
            console.log('[AuthManager] Authentication required, redirecting to auth page');
            this.redirectToAuth();
            return false;
        }
        
        return true;
    }
    
    /**
     * Redirect to authentication page
     * @param {string} returnUrl - URL to return to after login (optional)
     */
    redirectToAuth(returnUrl = null) {
        // Store current page for redirect after login
        if (!returnUrl) {
            returnUrl = window.location.pathname;
        }
        
        // Don't store auth.html or index.html as return URLs
        if (!returnUrl.includes('auth.html') && !returnUrl.endsWith('index.html') && returnUrl !== '/') {
            sessionStorage.setItem('yausma_returnUrl', returnUrl);
        }
        
        // Determine auth page path based on current location
        const isInPagesDir = window.location.pathname.includes('/pages/');
        const authUrl = isInPagesDir ? 'auth.html' : 'pages/auth.html';
        
        console.log(`[AuthManager] Redirecting to: ${authUrl}`);
        window.location.href = authUrl;
    }
    
    /**
     * Redirect after successful login
     */
    redirectAfterLogin() {
        // Check for stored return URL
        const returnUrl = sessionStorage.getItem('yausma_returnUrl');
        
        if (returnUrl) {
            sessionStorage.removeItem('yausma_returnUrl');
            console.log(`[AuthManager] Redirecting to stored URL: ${returnUrl}`);
            window.location.href = returnUrl;
        } else {
            // Default redirect to stocks page
            const isInPagesDir = window.location.pathname.includes('/pages/');
            const defaultUrl = isInPagesDir ? 'stocks.html' : 'pages/stocks.html';
            console.log(`[AuthManager] Redirecting to default: ${defaultUrl}`);
            window.location.href = defaultUrl;
        }
    }
    
    /**
     * Update navigation based on login state
     */
    updateNavigation() {
        const isLoggedIn = this.isLoggedIn();

        
        // Update main navigation items - hide individual items, not the container
        const mainNav = document.getElementById('mainNavigation') || document.querySelector('.navbar-nav');
        if (mainNav) {
            const navItems = mainNav.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                if (isLoggedIn) {
                    item.classList.remove('d-none');
                } else {
                    item.classList.add('d-none');
                }
            });
        }
        
        // Update auth buttons
        this.updateAuthButtons(isLoggedIn);
    }
    
    /**
     * Update authentication buttons in navigation
     * @param {boolean} isLoggedIn - Current login state
     */
    updateAuthButtons(isLoggedIn) {
        const authButtonsContainer = document.querySelector('.navbar-actions');
        if (!authButtonsContainer) return;
        
        // Find existing auth buttons - use more specific selectors
        const signInBtn = authButtonsContainer.querySelector('a[href*="auth.html"].btn-outline-secondary');
        const getStartedBtn = authButtonsContainer.querySelector('a[href*="auth.html"].btn-primary');
        
        if (isLoggedIn) {
            // Hide sign in and get started buttons
            if (signInBtn) signInBtn.classList.add('d-none');
            if (getStartedBtn) getStartedBtn.classList.add('d-none');
            
            // Add sign out button if it doesn't exist
            let signOutBtn = authButtonsContainer.querySelector('.btn-signout');
            if (!signOutBtn) {
                signOutBtn = document.createElement('button');
                signOutBtn.className = 'btn btn-outline-secondary btn-signout';
                signOutBtn.innerHTML = 'Sign Out';
                signOutBtn.addEventListener('click', () => this.logout());
                
                // Insert after theme toggle button
                const themeToggle = authButtonsContainer.querySelector('.btn-theme-toggle');
                if (themeToggle) {
                    themeToggle.insertAdjacentElement('afterend', signOutBtn);
                } else {
                    authButtonsContainer.appendChild(signOutBtn);
                }
            }
            signOutBtn.classList.remove('d-none');
            
        } else {
            // Show sign in and get started buttons
            if (signInBtn) signInBtn.classList.remove('d-none');
            if (getStartedBtn) getStartedBtn.classList.remove('d-none');
            
            // Hide sign out button
            const signOutBtn = authButtonsContainer.querySelector('.btn-signout');
            if (signOutBtn) {
                signOutBtn.classList.add('d-none');
            }
        }
    }
    
    /**
     * Protect a page (call this on protected pages)
     * @returns {boolean} Whether user has access
     */
    protectPage() {
        return this.requireAuth();
    }
    
    /**
     * Get authentication status for debugging
     * @returns {object} Auth status information
     */
    getStatus() {
        return {
            isLoggedIn: this.isLoggedIn(),
            currentPage: window.location.pathname,
            cookieManagerAvailable: !!window.cookieManager,
            returnUrl: sessionStorage.getItem('yausma_returnUrl')
        };
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Make auth manager globally available
if (typeof window !== 'undefined') {
    window.authManager = authManager;
    window.AuthManager = AuthManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { authManager, AuthManager };
}

console.log('[AuthManager] Auth manager available globally');