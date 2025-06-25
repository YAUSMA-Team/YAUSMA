// Enhanced Bootstrap Components Initialization Utility - web/js/utils/bootstrap-init.js
class BootstrapInitializer {
    static init() {
        console.log('Initializing Bootstrap components...');
        
        // Clean up existing instances first
        this.dispose();
        
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            this.initializeNavbar();
            this.initializeDropdowns();
            this.initializeModals();
            this.initializeTooltips();
            this.initializePopovers();
            this.initializeCollapses();
            console.log('Bootstrap components initialized successfully');
        }, 50);
    }

    static dispose() {
        // Dispose of existing Bootstrap instances to prevent conflicts
        this.disposeTooltips();
        this.disposePopovers();
        this.disposeDropdowns();
        this.disposeModals();
        this.disposeCollapses();
    }

    static initializeNavbar() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            // Remove existing event listeners by cloning the element
            const newToggler = navbarToggler.cloneNode(true);
            navbarToggler.parentNode.replaceChild(newToggler, navbarToggler);
            
            // Add fresh event listener
            newToggler.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = this.getAttribute('data-bs-target');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    
                    if (isExpanded) {
                        target.classList.remove('show');
                        this.setAttribute('aria-expanded', 'false');
                    } else {
                        target.classList.add('show');
                        this.setAttribute('aria-expanded', 'true');
                    }
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                const currentToggler = document.querySelector('.navbar-toggler');
                const currentCollapse = document.querySelector('.navbar-collapse');
                
                if (currentCollapse && currentToggler && 
                    !currentCollapse.contains(e.target) && 
                    !currentToggler.contains(e.target)) {
                    currentCollapse.classList.remove('show');
                    currentToggler.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    static initializeDropdowns() {
        document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(element => {
            try {
                new bootstrap.Dropdown(element);
            } catch (error) {
                console.warn('Error initializing dropdown:', error);
            }
        });
    }

    static initializeModals() {
        document.querySelectorAll('[data-bs-toggle="modal"]').forEach(element => {
            try {
                new bootstrap.Modal(element);
            } catch (error) {
                console.warn('Error initializing modal:', error);
            }
        });
    }

    static initializeTooltips() {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
            try {
                new bootstrap.Tooltip(element);
            } catch (error) {
                console.warn('Error initializing tooltip:', error);
            }
        });
    }

    static initializePopovers() {
        document.querySelectorAll('[data-bs-toggle="popover"]').forEach(element => {
            try {
                new bootstrap.Popover(element);
            } catch (error) {
                console.warn('Error initializing popover:', error);
            }
        });
    }

    static initializeCollapses() {
        document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(element => {
            try {
                new bootstrap.Collapse(element, {
                    toggle: false
                });
            } catch (error) {
                console.warn('Error initializing collapse:', error);
            }
        });
    }

    static disposeTooltips() {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
            const tooltip = bootstrap.Tooltip.getInstance(element);
            if (tooltip) {
                tooltip.dispose();
            }
        });
    }

    static disposePopovers() {
        document.querySelectorAll('[data-bs-toggle="popover"]').forEach(element => {
            const popover = bootstrap.Popover.getInstance(element);
            if (popover) {
                popover.dispose();
            }
        });
    }

    static disposeDropdowns() {
        document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(element => {
            const dropdown = bootstrap.Dropdown.getInstance(element);
            if (dropdown) {
                dropdown.dispose();
            }
        });
    }

    static disposeModals() {
        document.querySelectorAll('[data-bs-toggle="modal"]').forEach(element => {
            const modal = bootstrap.Modal.getInstance(element);
            if (modal) {
                modal.dispose();
            }
        });
    }

    static disposeCollapses() {
        document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(element => {
            const collapse = bootstrap.Collapse.getInstance(element);
            if (collapse) {
                collapse.dispose();
            }
        });
    }
}

// Alias for backward compatibility
window.EnhancedBootstrapInitializer = BootstrapInitializer;