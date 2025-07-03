/**
 * YAUSMA - Main JavaScript Application
 * Core functionality and initialization
 */

// Global application object
var YAUSMA = {
    version: '1.0.0',
    initialized: false,
    debug: false
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
        if (href && (currentPath.endsWith(href) || (href === 'index.html' && currentPath === '/'))) {
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

// Simple localStorage wrapper with error handling
var Storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    },
    
    get: function(key, defaultValue) {
        try {
            var item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Failed to read from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Failed to remove from localStorage:', e);
            return false;
        }
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