// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Core application initialization
async function initializeApp() {
    // Initialize theme
    initializeTheme();
    
    // Initialize API client
    initializeAPIClient();
    
    // Check authentication status
    checkAuthStatus();
    
    // Load initial data
    loadInitialData();
}

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || CONFIG.THEME.LIGHT;
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-stylesheet').href = `css/themes/${savedTheme}.css`;
}

// API client initialization
function initializeAPIClient() {
    // Set up API interceptors for authentication
    setupAPIInterceptors();
    
    // Initialize WebSocket connection if needed
    // initializeWebSocket();
}

// Authentication check
function checkAuthStatus() {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    if (token) {
        // Validate token and update UI accordingly
        validateToken(token);
    } else {
        updateUIForAnonymousUser();
    }
}

// Initial data loading
async function loadInitialData() {
    try {
        // Show loading state
        showLoadingState();
        
        // Load market overview data
        const marketData = await fetchMarketOverview();
        updateMarketOverview(marketData);
        
        // Hide loading state
        hideLoadingState();
    } catch (error) {
        console.error('Failed to load initial data:', error);
        showErrorState(error);
    }
}

// UI State Management
function showLoadingState() {
    // Add skeleton loading classes to elements
    document.querySelectorAll('[data-loading]').forEach(el => {
        el.classList.add('skeleton-loading');
    });
}

function hideLoadingState() {
    // Remove skeleton loading classes
    document.querySelectorAll('.skeleton-loading').forEach(el => {
        el.classList.remove('skeleton-loading');
    });
}

function showErrorState(error) {
    // Show error message to user
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.textContent = 'Failed to load data. Please try again later.';
        errorContainer.style.display = 'block';
    }
}

// API Utilities
async function fetchMarketOverview() {
    // Implement market overview data fetching
    // This is a placeholder for the actual implementation
    return {};
}

function updateMarketOverview(data) {
    // Update UI with market overview data
    // This is a placeholder for the actual implementation
}

// Event Listeners
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh data when tab becomes visible
        loadInitialData();
    }
}); 