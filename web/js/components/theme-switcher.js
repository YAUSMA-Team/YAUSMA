// YAUSMA Theme Switcher Component - Coinbase-Inspired Theme Toggle
// Professional theme switching with smooth animations and state management

class ThemeSwitcher {
    constructor(element) {
        this.element = element || document.getElementById('themeToggle');
        this.isTransitioning = false;
        this.animations = new Map();
        
        if (this.element) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.updateButton();
        this.addRippleEffect();
        
        console.log('<¨ Theme Switcher component initialized');
    }

    setupEventListeners() {
        if (!this.element) return;
        
        // Main click handler
        this.element.addEventListener('click', this.handleThemeToggle.bind(this));
        
        // Keyboard accessibility
        this.element.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Listen for global theme changes
        window.addEventListener('themeChanged', this.handleThemeChange.bind(this));
        
        // Hover effects
        this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        // Focus effects
        this.element.addEventListener('focus', this.handleFocus.bind(this));
        this.element.addEventListener('blur', this.handleBlur.bind(this));
    }

    handleThemeToggle(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (this.isTransitioning) {
            return;
        }
        
        // Create ripple effect
        this.createRipple(event);
        
        // Animate button
        this.animateToggle();
        
        // Trigger global theme change
        if (window.globalThemeManager) {
            window.globalThemeManager.toggleTheme();
        } else if (window.app) {
            window.app.handleThemeToggle();
        }
        
        // Track interaction
        this.trackToggle();
    }

    handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleThemeToggle(event);
        }
    }

    handleThemeChange(event) {
        const newTheme = event.detail?.theme;
        if (newTheme) {
            this.updateButton(newTheme);
        }
    }

    handleMouseEnter() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        this.element.style.transform = 'scale(1.1) rotate(10deg)';
        this.addGlow();
    }

    handleMouseLeave() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        this.element.style.transform = '';
        this.removeGlow();
    }

    handleFocus() {
        this.element.classList.add('theme-toggle-focused');
        this.addGlow();
    }

    handleBlur() {
        this.element.classList.remove('theme-toggle-focused');
        this.removeGlow();
    }

    updateButton(theme) {
        if (!this.element) return;
        
        const currentTheme = theme || this.getCurrentTheme();
        const lightIcon = this.element.querySelector('.theme-icon-light');
        const darkIcon = this.element.querySelector('.theme-icon-dark');
        
        if (lightIcon && darkIcon) {
            if (currentTheme === 'dark') {
                // Show light icon (to switch to light)
                lightIcon.style.display = 'inline-block';
                darkIcon.style.display = 'none';
                lightIcon.style.opacity = '1';
                darkIcon.style.opacity = '0';
            } else {
                // Show dark icon (to switch to dark)
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'inline-block';
                lightIcon.style.opacity = '0';
                darkIcon.style.opacity = '1';
            }
        }
        
        // Update aria-label
        const label = currentTheme === 'dark' 
            ? 'Switch to light mode' 
            : 'Switch to dark mode';
        this.element.setAttribute('aria-label', label);
        
        // Update title
        this.element.setAttribute('title', label);
        
        // Update data attribute
        this.element.setAttribute('data-current-theme', currentTheme);
    }

    animateToggle() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        this.isTransitioning = true;
        
        // Create toggle animation
        const animation = this.element.animate([
            { transform: 'scale(1) rotate(0deg)' },
            { transform: 'scale(0.8) rotate(180deg)' },
            { transform: 'scale(1.1) rotate(360deg)' },
            { transform: 'scale(1) rotate(360deg)' }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        animation.addEventListener('finish', () => {
            this.isTransitioning = false;
        });
        
        // Animate icons
        this.animateIcons();
    }

    animateIcons() {
        const lightIcon = this.element.querySelector('.theme-icon-light');
        const darkIcon = this.element.querySelector('.theme-icon-dark');
        
        if (lightIcon && darkIcon) {
            const currentTheme = this.getCurrentTheme();
            const showingLight = lightIcon.style.display !== 'none';
            
            if (currentTheme === 'dark' && !showingLight) {
                // Switching to dark, show light icon
                this.crossFadeIcons(darkIcon, lightIcon);
            } else if (currentTheme === 'light' && showingLight) {
                // Switching to light, show dark icon
                this.crossFadeIcons(lightIcon, darkIcon);
            }
        }
    }

    crossFadeIcons(fadeOut, fadeIn) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            fadeOut.style.display = 'none';
            fadeIn.style.display = 'inline-block';
            return;
        }
        
        // Fade out current icon
        fadeOut.animate([
            { opacity: 1, transform: 'scale(1) rotate(0deg)' },
            { opacity: 0, transform: 'scale(0.5) rotate(90deg)' }
        ], {
            duration: 200,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            fadeOut.style.display = 'none';
            fadeIn.style.display = 'inline-block';
            
            // Fade in new icon
            fadeIn.animate([
                { opacity: 0, transform: 'scale(0.5) rotate(-90deg)' },
                { opacity: 1, transform: 'scale(1) rotate(0deg)' }
            ], {
                duration: 200,
                easing: 'ease-out'
            });
        });
    }

    createRipple(event) {
        if (!this.element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const rect = this.element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.className = 'theme-toggle-ripple';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: currentColor;
            border-radius: 50%;
            opacity: 0.3;
            transform: scale(0);
            pointer-events: none;
            z-index: 1;
        `;
        
        // Ensure button has relative positioning
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';
        
        this.element.appendChild(ripple);
        
        // Animate ripple
        ripple.animate([
            { transform: 'scale(0)', opacity: 0.3 },
            { transform: 'scale(2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            ripple.remove();
        });
    }

    addRippleEffect() {
        if (!this.element) return;
        
        // Add CSS for ripple container
        if (!document.getElementById('theme-toggle-ripple-styles')) {
            const styles = document.createElement('style');
            styles.id = 'theme-toggle-ripple-styles';
            styles.textContent = `
                .theme-toggle-ripple {
                    animation: ripple-expand 0.6s ease-out;
                }
                
                @keyframes ripple-expand {
                    from {
                        transform: scale(0);
                        opacity: 0.3;
                    }
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                
                .theme-toggle-focused {
                    outline: 2px solid var(--interactive-blue);
                    outline-offset: 2px;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    addGlow() {
        if (!this.element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        this.element.style.boxShadow = '0 0 20px rgba(52, 74, 251, 0.4)';
        this.element.style.transition = 'all 0.3s ease';
    }

    removeGlow() {
        if (!this.element) return;
        
        this.element.style.boxShadow = '';
    }

    getCurrentTheme() {
        if (window.globalThemeManager) {
            return window.globalThemeManager.getCurrentTheme();
        } else if (window.app) {
            return window.app.getState('currentTheme') || 'light';
        } else {
            return document.documentElement.getAttribute('data-theme') || 'light';
        }
    }

    trackToggle() {
        if (window.app && typeof window.app.trackEvent === 'function') {
            window.app.trackEvent('theme_toggle_button', {
                component: 'theme-switcher',
                method: 'click'
            });
        }
    }

    // Accessibility methods
    setTabIndex(index) {
        if (this.element) {
            this.element.setAttribute('tabindex', index);
        }
    }

    focus() {
        if (this.element) {
            this.element.focus();
        }
    }

    blur() {
        if (this.element) {
            this.element.blur();
        }
    }

    // State methods
    disable() {
        if (this.element) {
            this.element.disabled = true;
            this.element.setAttribute('aria-disabled', 'true');
        }
    }

    enable() {
        if (this.element) {
            this.element.disabled = false;
            this.element.setAttribute('aria-disabled', 'false');
        }
    }

    isDisabled() {
        return this.element ? this.element.disabled : false;
    }

    // Theme state
    getThemeState() {
        return {
            current: this.getCurrentTheme(),
            isTransitioning: this.isTransitioning,
            isDisabled: this.isDisabled()
        };
    }

    // Refresh the component
    refresh() {
        this.updateButton();
    }

    // Destroy the component
    destroy() {
        if (this.element) {
            // Remove event listeners
            this.element.removeEventListener('click', this.handleThemeToggle);
            this.element.removeEventListener('keydown', this.handleKeydown);
            this.element.removeEventListener('mouseenter', this.handleMouseEnter);
            this.element.removeEventListener('mouseleave', this.handleMouseLeave);
            this.element.removeEventListener('focus', this.handleFocus);
            this.element.removeEventListener('blur', this.handleBlur);
        }
        
        window.removeEventListener('themeChanged', this.handleThemeChange);
        
        // Clear animations
        this.animations.clear();
        
        console.log('<¨ Theme Switcher component destroyed');
    }
}

// Auto-initialize theme switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        window.themeSwitcher = new ThemeSwitcher(themeToggle);
    }
});

// Make ThemeSwitcher globally available
if (typeof window !== 'undefined') {
    window.ThemeSwitcher = ThemeSwitcher;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}