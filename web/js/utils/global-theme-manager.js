// Global Theme Manager - web/js/utils/global-theme-manager.js
class GlobalThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Load saved theme on page load
        this.loadSavedTheme();
        
        // Listen for theme change events
        window.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail.theme);
        });
        
        // Initialize theme on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyTheme());
        } else {
            this.applyTheme();
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('yausma_theme') || 'light';
        this.currentTheme = savedTheme;
        console.log('Loading saved theme:', savedTheme);
    }

    applyTheme(theme = this.currentTheme) {
        console.log('Applying theme:', theme);
        
        // Update body attribute
        document.body.setAttribute('data-theme', theme);
        
        // Update theme stylesheet
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            themeStylesheet.href = `css/themes/${theme}.css`;
        }
        
        // Update navbar classes
        this.updateNavbarTheme(theme);
        
        // Update theme toggle button
        this.updateThemeToggle(theme);
        
        // Store current theme
        this.currentTheme = theme;
    }

    updateNavbarTheme(theme) {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            // Remove all theme classes
            navbar.classList.remove('navbar-light', 'bg-light', 'navbar-dark', 'bg-dark', 'bg-white');
            
            if (theme === 'dark') {
                navbar.classList.add('navbar-dark', 'bg-dark');
            } else {
                navbar.classList.add('navbar-light', 'bg-white');
            }
        }
    }

    updateThemeToggle(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = `bi bi-${theme === 'light' ? 'moon' : 'sun'}-fill`;
            }
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        
        // Save to localStorage
        localStorage.setItem('yausma_theme', theme);
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));
        
        console.log('Theme changed to:', theme);
    }

    handleThemeChange(newTheme) {
        this.applyTheme(newTheme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.GlobalThemeManager = GlobalThemeManager;
}