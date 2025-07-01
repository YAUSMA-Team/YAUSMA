// YAUSMA Bootstrap Initialization - Professional Bootstrap Component Setup
// Handles Bootstrap component initialization and custom enhancements

class BootstrapInitializer {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        // Wait for Bootstrap to be available
        await this.waitForBootstrap();
        
        // Initialize all Bootstrap components
        this.initializeTooltips();
        this.initializePopovers();
        this.initializeModals();
        this.initializeOffcanvas();
        this.initializeScrollspy();
        this.initializeToasts();
        this.initializeCarousels();
        this.initializeCollapses();
        this.initializeTabs();
        
        // Setup enhanced functionality
        this.setupEnhancedDropdowns();
        this.setupFormValidation();
        this.setupCustomComponents();
        
        this.isInitialized = true;
        console.log('=€ Bootstrap components initialized');
    }

    waitForBootstrap() {
        return new Promise((resolve) => {
            if (typeof bootstrap !== 'undefined') {
                resolve();
            } else {
                const checkBootstrap = () => {
                    if (typeof bootstrap !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkBootstrap, 100);
                    }
                };
                checkBootstrap();
            }
        });
    }

    initializeTooltips() {
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        
        const tooltips = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                boundary: 'viewport',
                placement: 'auto',
                trigger: 'hover focus',
                delay: { show: 500, hide: 100 }
            });
        });
        
        this.components.set('tooltips', tooltips);
        console.log(` ${tooltips.length} tooltips initialized`);
    }

    initializePopovers() {
        const popoverTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="popover"]')
        );
        
        const popovers = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl, {
                boundary: 'viewport',
                placement: 'auto',
                trigger: 'click',
                html: true
            });
        });
        
        this.components.set('popovers', popovers);
        console.log(` ${popovers.length} popovers initialized`);
    }

    initializeModals() {
        const modalElements = document.querySelectorAll('.modal');
        const modals = [];
        
        modalElements.forEach(modalElement => {
            const modal = new bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: true,
                focus: true
            });
            
            modals.push(modal);
            
            // Add custom event handlers
            modalElement.addEventListener('show.bs.modal', this.handleModalShow.bind(this));
            modalElement.addEventListener('shown.bs.modal', this.handleModalShown.bind(this));
            modalElement.addEventListener('hide.bs.modal', this.handleModalHide.bind(this));
            modalElement.addEventListener('hidden.bs.modal', this.handleModalHidden.bind(this));
        });
        
        this.components.set('modals', modals);
        console.log(` ${modals.length} modals initialized`);
    }

    initializeOffcanvas() {
        const offcanvasElements = document.querySelectorAll('.offcanvas');
        const offcanvases = [];
        
        offcanvasElements.forEach(offcanvasElement => {
            const offcanvas = new bootstrap.Offcanvas(offcanvasElement, {
                backdrop: true,
                keyboard: true,
                scroll: false
            });
            
            offcanvases.push(offcanvas);
            
            // Add custom event handlers
            offcanvasElement.addEventListener('show.bs.offcanvas', this.handleOffcanvasShow.bind(this));
            offcanvasElement.addEventListener('hidden.bs.offcanvas', this.handleOffcanvasHidden.bind(this));
        });
        
        this.components.set('offcanvases', offcanvases);
        console.log(` ${offcanvases.length} offcanvases initialized`);
    }

    initializeScrollspy() {
        const scrollspyElements = document.querySelectorAll('[data-bs-spy="scroll"]');
        const scrollspies = [];
        
        scrollspyElements.forEach(scrollspyElement => {
            const scrollspy = new bootstrap.ScrollSpy(document.body, {
                target: scrollspyElement,
                offset: 100,
                method: 'auto'
            });
            
            scrollspies.push(scrollspy);
        });
        
        this.components.set('scrollspies', scrollspies);
        console.log(` ${scrollspies.length} scrollspies initialized`);
    }

    initializeToasts() {
        const toastElements = document.querySelectorAll('.toast');
        const toasts = [];
        
        toastElements.forEach(toastElement => {
            const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: 5000
            });
            
            toasts.push(toast);
        });
        
        this.components.set('toasts', toasts);
        console.log(` ${toasts.length} toasts initialized`);
    }

    initializeCarousels() {
        const carouselElements = document.querySelectorAll('.carousel');
        const carousels = [];
        
        carouselElements.forEach(carouselElement => {
            const carousel = new bootstrap.Carousel(carouselElement, {
                interval: 5000,
                wrap: true,
                touch: true
            });
            
            carousels.push(carousel);
        });
        
        this.components.set('carousels', carousels);
        console.log(` ${carousels.length} carousels initialized`);
    }

    initializeCollapses() {
        const collapseElements = document.querySelectorAll('.collapse');
        const collapses = [];
        
        collapseElements.forEach(collapseElement => {
            const collapse = new bootstrap.Collapse(collapseElement, {
                toggle: false
            });
            
            collapses.push(collapse);
            
            // Add custom animation classes
            collapseElement.addEventListener('show.bs.collapse', (e) => {
                e.target.classList.add('collapsing-show');
            });
            
            collapseElement.addEventListener('shown.bs.collapse', (e) => {
                e.target.classList.remove('collapsing-show');
            });
            
            collapseElement.addEventListener('hide.bs.collapse', (e) => {
                e.target.classList.add('collapsing-hide');
            });
            
            collapseElement.addEventListener('hidden.bs.collapse', (e) => {
                e.target.classList.remove('collapsing-hide');
            });
        });
        
        this.components.set('collapses', collapses);
        console.log(` ${collapses.length} collapses initialized`);
    }

    initializeTabs() {
        const tabElements = document.querySelectorAll('[data-bs-toggle="tab"]');
        const tabs = [];
        
        tabElements.forEach(tabElement => {
            const tab = new bootstrap.Tab(tabElement);
            tabs.push(tab);
            
            // Add custom event handlers for smooth transitions
            tabElement.addEventListener('show.bs.tab', this.handleTabShow.bind(this));
            tabElement.addEventListener('shown.bs.tab', this.handleTabShown.bind(this));
        });
        
        this.components.set('tabs', tabs);
        console.log(` ${tabs.length} tabs initialized`);
    }

    setupEnhancedDropdowns() {
        const dropdownElements = document.querySelectorAll('.dropdown-toggle');
        
        dropdownElements.forEach(dropdown => {
            dropdown.addEventListener('show.bs.dropdown', (e) => {
                e.target.classList.add('dropdown-opening');
            });
            
            dropdown.addEventListener('shown.bs.dropdown', (e) => {
                e.target.classList.remove('dropdown-opening');
                e.target.classList.add('dropdown-open');
            });
            
            dropdown.addEventListener('hide.bs.dropdown', (e) => {
                e.target.classList.remove('dropdown-open');
                e.target.classList.add('dropdown-closing');
            });
            
            dropdown.addEventListener('hidden.bs.dropdown', (e) => {
                e.target.classList.remove('dropdown-closing');
            });
        });
        
        console.log(' Enhanced dropdowns setup complete');
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('.needs-validation');
        
        forms.forEach(form => {
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Add custom validation feedback
                    this.showValidationErrors(form);
                }
                
                form.classList.add('was-validated');
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('is-invalid')) {
                        this.validateField(input);
                    }
                });
            });
        });
        
        console.log(` Form validation setup for ${forms.length} forms`);
    }

    setupCustomComponents() {
        // Setup custom file upload components
        this.setupFileUploads();
        
        // Setup custom switch components
        this.setupCustomSwitches();
        
        // Setup loading buttons
        this.setupLoadingButtons();
        
        // Setup copy-to-clipboard functionality
        this.setupCopyButtons();
        
        console.log(' Custom components setup complete');
    }

    setupFileUploads() {
        const fileInputs = document.querySelectorAll('input[type="file"].custom-file-input');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const fileName = e.target.files[0]?.name || 'Choose file...';
                const label = e.target.nextElementSibling;
                if (label && label.classList.contains('custom-file-label')) {
                    label.textContent = fileName;
                }
            });
        });
    }

    setupCustomSwitches() {
        const switches = document.querySelectorAll('.form-switch input[type="checkbox"]');
        
        switches.forEach(switchElement => {
            switchElement.addEventListener('change', (e) => {
                const switchContainer = e.target.closest('.form-switch');
                if (switchContainer) {
                    switchContainer.classList.toggle('switch-on', e.target.checked);
                }
            });
        });
    }

    setupLoadingButtons() {
        const loadingButtons = document.querySelectorAll('[data-loading-text]');
        
        loadingButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setButtonLoading(button, true);
            });
        });
    }

    setupCopyButtons() {
        const copyButtons = document.querySelectorAll('[data-copy-target]');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const targetSelector = button.dataset.copyTarget;
                const targetElement = document.querySelector(targetSelector);
                
                if (targetElement) {
                    try {
                        const textToCopy = targetElement.textContent || targetElement.value;
                        await navigator.clipboard.writeText(textToCopy);
                        
                        // Show success feedback
                        this.showCopySuccess(button);
                    } catch (error) {
                        console.error('Copy failed:', error);
                        this.showCopyError(button);
                    }
                }
            });
        });
    }

    // Event handlers
    handleModalShow(event) {
        document.body.classList.add('modal-open-custom');
        
        // Track modal show
        if (window.app && window.app.trackEvent) {
            window.app.trackEvent('modal_show', {
                modalId: event.target.id
            });
        }
    }

    handleModalShown(event) {
        // Focus first input in modal
        const firstInput = event.target.querySelector('input, select, textarea, button');
        if (firstInput) {
            firstInput.focus();
        }
    }

    handleModalHide(event) {
        // Clean up any modal-specific state
    }

    handleModalHidden(event) {
        document.body.classList.remove('modal-open-custom');
        
        // Reset form if it exists
        const form = event.target.querySelector('form');
        if (form) {
            form.reset();
            form.classList.remove('was-validated');
        }
    }

    handleOffcanvasShow(event) {
        document.body.classList.add('offcanvas-open');
    }

    handleOffcanvasHidden(event) {
        document.body.classList.remove('offcanvas-open');
    }

    handleTabShow(event) {
        // Add loading state to new tab content
        const targetId = event.target.getAttribute('data-bs-target') || event.target.getAttribute('href');
        const targetPane = document.querySelector(targetId);
        
        if (targetPane) {
            targetPane.classList.add('tab-loading');
        }
    }

    handleTabShown(event) {
        // Remove loading state and trigger content load
        const targetId = event.target.getAttribute('data-bs-target') || event.target.getAttribute('href');
        const targetPane = document.querySelector(targetId);
        
        if (targetPane) {
            targetPane.classList.remove('tab-loading');
            
            // Trigger custom tab shown event
            const customEvent = new CustomEvent('tabContentShown', {
                detail: { tabId: targetId, tabElement: event.target }
            });
            window.dispatchEvent(customEvent);
        }
    }

    // Utility methods
    validateField(field) {
        if (field.checkValidity()) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }
    }

    showValidationErrors(form) {
        const invalidFields = form.querySelectorAll(':invalid');
        
        if (invalidFields.length > 0) {
            // Focus first invalid field
            invalidFields[0].focus();
            
            // Show notification
            if (window.app && window.app.showNotification) {
                window.app.showNotification(
                    'Please correct the highlighted fields and try again.',
                    'error'
                );
            }
        }
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.dataset.originalText = button.textContent;
            button.textContent = button.dataset.loadingText || 'Loading...';
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.textContent = button.dataset.originalText || button.textContent;
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copy-success');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copy-success');
        }, 2000);
    }

    showCopyError(button) {
        const originalText = button.textContent;
        button.textContent = 'Copy failed';
        button.classList.add('copy-error');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copy-error');
        }, 2000);
    }

    // Public API methods
    showModal(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.show();
        }
    }

    hideModal(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        }
    }

    showToast(toastId) {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
            toast.show();
        }
    }

    showOffcanvas(offcanvasId) {
        const offcanvasElement = document.getElementById(offcanvasId);
        if (offcanvasElement) {
            const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
            offcanvas.show();
        }
    }

    hideOffcanvas(offcanvasId) {
        const offcanvasElement = document.getElementById(offcanvasId);
        if (offcanvasElement) {
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
            if (offcanvas) {
                offcanvas.hide();
            }
        }
    }

    reinitializeComponents() {
        if (this.isInitialized) {
            this.destroyComponents();
            this.init();
        }
    }

    destroyComponents() {
        // Dispose of all Bootstrap components
        this.components.forEach((componentList, componentType) => {
            if (Array.isArray(componentList)) {
                componentList.forEach(component => {
                    if (component && typeof component.dispose === 'function') {
                        component.dispose();
                    }
                });
            }
        });
        
        this.components.clear();
        this.isInitialized = false;
    }

    getComponent(type) {
        return this.components.get(type);
    }

    getStats() {
        const stats = {};
        this.components.forEach((componentList, type) => {
            stats[type] = Array.isArray(componentList) ? componentList.length : 1;
        });
        return stats;
    }
}

// Create global Bootstrap initializer
const bootstrapInit = new BootstrapInitializer();

// Make Bootstrap initializer globally available
if (typeof window !== 'undefined') {
    window.bootstrapInit = bootstrapInit;
    window.BootstrapInitializer = BootstrapInitializer;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { bootstrapInit, BootstrapInitializer };
}