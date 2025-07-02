// YAUSMA Navbar Component - Professional Navigation Management
// Handles navigation state, mobile menu, and active link highlighting

class NavbarManager {
    constructor() {
        this.navbar = document.querySelector('.navbar-custom');
        this.mobileToggle = document.querySelector('.navbar-toggler');
        this.navbarCollapse = document.querySelector('.navbar-collapse');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isScrolled = false;
        
        if (this.navbar) {
            this.init();
        }
    }

    init() {
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupDropdowns();
        
        console.log('>í Navbar component initialized');
    }

    setupScrollEffects() {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const shouldBeScrolled = scrollTop > 20;
            
            if (shouldBeScrolled !== this.isScrolled) {
                this.isScrolled = shouldBeScrolled;
                
                if (this.isScrolled) {
                    this.navbar.classList.add('navbar-scrolled');
                } else {
                    this.navbar.classList.remove('navbar-scrolled');
                }
            }
        };
        
        window.addEventListener('scroll', this.throttle(handleScroll, 10));
        
        // Initial check
        handleScroll();
    }

    setupMobileMenu() {
        if (!this.mobileToggle || !this.navbarCollapse) return;
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbarCollapse.contains(e.target) && 
                !this.mobileToggle.contains(e.target) && 
                this.navbarCollapse.classList.contains('show')) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    this.closeMobileMenu();
                }
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navbarCollapse.classList.contains('show')) {
                this.closeMobileMenu();
            }
        });
    }

    setupActiveLinks() {
        this.updateActiveLink();
        
        // Update active link when navigating
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active from all links
                this.navLinks.forEach(l => l.classList.remove('active'));
                // Add active to clicked link
                link.classList.add('active');
            });
        });
    }

    setupDropdowns() {
        const dropdowns = this.navbar.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                // Add hover effects for desktop
                if (window.innerWidth >= 992) {
                    dropdown.addEventListener('mouseenter', () => {
                        toggle.classList.add('show');
                        menu.classList.add('show');
                    });
                    
                    dropdown.addEventListener('mouseleave', () => {
                        toggle.classList.remove('show');
                        menu.classList.remove('show');
                    });
                }
            }
        });
    }

    updateActiveLink() {
        const currentPath = window.location.pathname;
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href) {
                // Handle relative paths
                let linkPath = href;
                if (href.startsWith('../')) {
                    linkPath = href.substring(3);
                }
                
                // Check if current path matches or ends with the link href
                if (currentPath.endsWith(linkPath) || 
                    (linkPath === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
                    link.classList.add('active');
                }
            }
        });
    }

    closeMobileMenu() {
        if (this.navbarCollapse) {
            this.navbarCollapse.classList.remove('show');
        }
        
        if (this.mobileToggle) {
            this.mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }

    openMobileMenu() {
        if (this.navbarCollapse) {
            this.navbarCollapse.classList.add('show');
        }
        
        if (this.mobileToggle) {
            this.mobileToggle.setAttribute('aria-expanded', 'true');
        }
    }

    toggleMobileMenu() {
        if (this.navbarCollapse && this.navbarCollapse.classList.contains('show')) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    highlightActiveLink(href) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }

    showNavbar() {
        if (this.navbar) {
            this.navbar.style.transform = 'translateY(0)';
        }
    }

    hideNavbar() {
        if (this.navbar) {
            this.navbar.style.transform = 'translateY(-100%)';
        }
    }

    setScrolled(scrolled) {
        this.isScrolled = scrolled;
        if (scrolled) {
            this.navbar.classList.add('navbar-scrolled');
        } else {
            this.navbar.classList.remove('navbar-scrolled');
        }
    }

    // Utility function
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

    // Public API
    refresh() {
        this.updateActiveLink();
    }

    getActiveLink() {
        return document.querySelector('.nav-link.active');
    }

    isMobileMenuOpen() {
        return this.navbarCollapse && this.navbarCollapse.classList.contains('show');
    }

    destroy() {
        // Remove event listeners and clean up
        if (this.mobileToggle) {
            this.mobileToggle.removeEventListener('click', this.toggleMobileMenu);
        }
        
        console.log('>í Navbar component destroyed');
    }
}

// Auto-initialize navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navbarManager = new NavbarManager();
});

// Make NavbarManager globally available
if (typeof window !== 'undefined') {
    window.NavbarManager = NavbarManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavbarManager;
}