/**
 * YAUSMA Authentication Page JavaScript
 * Handles form validation, toggle functionality, and UI interactions
 * Coinbase-inspired professional authentication experience
 */

class AuthManager {
    constructor() {
        this.currentForm = 'signin';
        this.isLoading = false;
        this.rememberMeData = null;
        this.lastValidEmail = '';
        this.focusTimeout = null;
        
        // Password strength configuration
        this.passwordStrengthRules = {
            minLength: 8,
            hasUpperCase: /[A-Z]/,
            hasLowerCase: /[a-z]/,
            hasNumbers: /\d/,
            hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/
        };
        
        // Form validation rules
        this.validationRules = {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            firstName: {
                pattern: /^[a-zA-Z\s]{2,30}$/,
                message: 'First name must be 2-30 characters, letters only'
            },
            lastName: {
                pattern: /^[a-zA-Z\s]{2,30}$/,
                message: 'Last name must be 2-30 characters, letters only'
            }
        };
        
        // Animation configuration
        this.animations = {
            formSwitch: 300,
            validation: 200,
            loading: 150
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initFormToggle();
        this.initPasswordToggles();
        this.initFormValidation();
        this.initRememberMe();
        this.initKeyboardNavigation();
        this.initAccessibilityFeatures();
        this.preloadFormData();
        console.log('🔐 AuthManager initialized - Coinbase-style authentication ready');
    }

    bindEvents() {
        // Form toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFormToggle(e));
        });

        // Form switch links
        document.querySelectorAll('.switch-form').forEach(link => {
            link.addEventListener('click', (e) => this.handleFormSwitch(e));
        });

        // Password toggles
        document.querySelectorAll('.btn-password-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });

        // Form submissions
        document.getElementById('signinForm')?.addEventListener('submit', (e) => this.handleSignInSubmit(e));
        document.getElementById('signupForm')?.addEventListener('submit', (e) => this.handleSignUpSubmit(e));

        // Password strength checking
        document.getElementById('signup-password')?.addEventListener('input', (e) => this.checkPasswordStrength(e));

        // Real-time validation
        this.initRealTimeValidation();

        // Social auth buttons
        document.querySelectorAll('.btn-social').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialAuth(e));
        });

        // Enhanced focus management
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('focus', (e) => this.handleInputFocus(e));
            input.addEventListener('blur', (e) => this.handleInputBlur(e));
        });

        // Remember me functionality
        document.getElementById('remember-me')?.addEventListener('change', (e) => this.handleRememberMeToggle(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window events for better UX
        window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
        
        // Theme integration for forms
        document.addEventListener('themeChanged', (e) => this.handleThemeChange(e));
    }

    initFormToggle() {
        // Set initial state
        this.showForm(this.currentForm);
    }

    initPasswordToggles() {
        document.querySelectorAll('.btn-password-toggle').forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.add('bi-eye');
            }
        });
    }

    initFormValidation() {
        // Add Bootstrap validation classes
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.add('needs-validation');
        });
    }

    initRealTimeValidation() {
        // Email validation with debouncing
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('blur', (e) => this.validateEmail(e.target));
            input.addEventListener('input', (e) => {
                this.clearValidation(e.target);
                this.debounceValidation(e.target, () => this.validateEmail(e.target));
            });
        });

        // Name field validation
        ['signup-firstname', 'signup-lastname'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('blur', (e) => this.validateName(e.target));
                input.addEventListener('input', (e) => {
                    this.clearValidation(e.target);
                    this.debounceValidation(e.target, () => this.validateName(e.target));
                });
            }
        });

        // Password validation
        document.querySelectorAll('input[type="password"]').forEach(input => {
            if (input.id === 'signup-password') {
                let debounceTimer;
                input.addEventListener('input', (e) => {
                    this.checkPasswordStrength(e);
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => this.validatePassword(e.target), 500);
                });
            }
            if (input.id === 'signup-confirm-password') {
                input.addEventListener('input', (e) => {
                    this.clearValidation(e.target);
                    this.debounceValidation(e.target, () => this.validatePasswordConfirm(e.target));
                });
            }
        });

        // Required field validation
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', (e) => this.validateRequired(e.target));
            input.addEventListener('input', (e) => this.clearValidation(e.target));
        });
    }

    handleFormToggle(e) {
        const target = e.target.dataset.target;
        if (target && target !== this.currentForm) {
            this.switchToForm(target);
        }
    }

    handleFormSwitch(e) {
        e.preventDefault();
        const target = e.target.dataset.target;
        if (target && target !== this.currentForm) {
            this.switchToForm(target);
        }
    }

    switchToForm(formType) {
        if (this.isLoading) return;

        const currentContainer = document.querySelector('.auth-form-container.active');
        const nextContainer = document.getElementById(`${formType}-form`);
        
        if (!nextContainer || nextContainer === currentContainer) return;

        // Add switching animation
        this.animateFormSwitch(currentContainer, nextContainer, () => {
            // Update toggle buttons
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.target === formType);
            });

            // Update form containers
            document.querySelectorAll('.auth-form-container').forEach(container => {
                container.classList.toggle('active', container.id === `${formType}-form`);
            });

            // Update footer
            document.querySelector('.signin-footer').classList.toggle('d-none', formType === 'signin');
            document.querySelector('.signup-footer').classList.toggle('d-none', formType === 'signup');

            this.currentForm = formType;
            this.clearAllErrors();
            this.resetAllForms();
            
            // Focus first input of new form
            this.focusFirstInput(nextContainer);
            
            // Announce form change for accessibility
            this.announceFormChange(formType);
        });
    }

    showForm(formType) {
        this.switchToForm(formType);
    }

    togglePasswordVisibility(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const input = button.closest('.input-group').querySelector('input');
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    }

    async handleSignInSubmit(e) {
        e.preventDefault();
        
        if (this.isLoading) return;

        const form = e.target;
        const formData = new FormData(form);
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        this.setLoadingState(form, true);
        this.clearError('signin-error');

        try {
            const authData = {
                email: formData.get('email'),
                password: formData.get('password'),
                remember: formData.get('remember') === 'on'
            };

            // Simulate API call
            await this.simulateAuth(authData, 'signin');

            // Handle remember me functionality
            if (authData.remember) {
                this.saveRememberedCredentials({ email: authData.email });
            } else {
                this.clearRememberedCredentials();
            }

            // Success - would redirect in real app
            this.showSuccess('Welcome back! Redirecting to your dashboard...');
            
            // Simulate redirect delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);

        } catch (error) {
            this.showError('signin-error', error.message);
            
            // Focus back to form for better UX
            setTimeout(() => {
                const firstInput = form.querySelector('.form-control:not([disabled])');
                if (firstInput) firstInput.focus();
            }, 100);
        } finally {
            this.setLoadingState(form, false);
        }
    }

    async handleSignUpSubmit(e) {
        e.preventDefault();
        
        if (this.isLoading) return;

        const form = e.target;
        const formData = new FormData(form);
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Check password confirmation
        if (formData.get('password') !== formData.get('confirmPassword')) {
            this.showError('signup-error', 'Passwords do not match');
            return;
        }

        this.setLoadingState(form, true);
        this.clearError('signup-error');

        try {
            const authData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password'),
                terms: formData.get('terms') === 'on',
                marketing: formData.get('marketing') === 'on'
            };

            // Simulate API call
            await this.simulateAuth(authData, 'signup');

            // Auto-save email for future sign-ins
            this.saveRememberedCredentials({ email: authData.email });

            // Success - would redirect in real app
            this.showSuccess('🎉 Account created successfully! Welcome to YAUSMA!');
            
            // Simulate redirect delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);

        } catch (error) {
            this.showError('signup-error', error.message);
            
            // Focus back to first error field for better UX
            setTimeout(() => {
                const errorField = form.querySelector('.form-control.is-invalid');
                const firstInput = errorField || form.querySelector('.form-control:not([disabled])');
                if (firstInput) firstInput.focus();
            }, 100);
        } finally {
            this.setLoadingState(form, false);
        }
    }

    async simulateAuth(data, type) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        // Simulate various error conditions for demo
        const random = Math.random();
        
        if (type === 'signin') {
            if (data.email === 'test@error.com') {
                throw new Error('Invalid email or password');
            }
            if (random < 0.1) {
                throw new Error('Account temporarily locked. Please try again later.');
            }
        } else {
            if (data.email === 'existing@user.com') {
                throw new Error('An account with this email already exists');
            }
            if (random < 0.1) {
                throw new Error('Unable to create account. Please try again.');
            }
        }

        // Success case
        console.log(`${type} successful:`, data);
        return { success: true, user: data };
    }

    async handleSocialAuth(e) {
        e.preventDefault();
        
        if (this.isLoading) return;

        const provider = e.currentTarget.classList.contains('btn-google') ? 'google' : 'apple';
        
        // In a real app, this would initiate OAuth flow
        this.showInfo(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication would be initiated here`);
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        
        // Clear previous validation
        this.clearValidation(input);

        // Check if required field is empty
        if (input.hasAttribute('required') && !value) {
            this.setFieldError(input, 'This field is required');
            return false;
        }

        // Type-specific validation
        if (input.type === 'email' && value) {
            return this.validateEmail(input);
        }

        if (input.type === 'password' && value) {
            if (input.id === 'signup-password') {
                return this.validatePassword(input);
            }
            if (input.id === 'signup-confirm-password') {
                return this.validatePasswordConfirm(input);
            }
        }

        if (input.type === 'checkbox' && input.hasAttribute('required')) {
            if (!input.checked) {
                this.setFieldError(input, 'You must agree to continue');
                return false;
            }
        }

        // If we get here, the field is valid
        this.setFieldValid(input);
        return true;
    }

    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            return true; // Empty is handled by required validation
        }

        if (!emailRegex.test(email)) {
            this.setFieldError(input, 'Please enter a valid email address');
            return false;
        }

        this.setFieldValid(input);
        return true;
    }

    validatePassword(input) {
        const password = input.value;
        const rules = this.passwordStrengthRules;
        const errors = [];

        if (password.length < rules.minLength) {
            errors.push(`At least ${rules.minLength} characters`);
        }
        if (!rules.hasUpperCase.test(password)) {
            errors.push('One uppercase letter');
        }
        if (!rules.hasLowerCase.test(password)) {
            errors.push('One lowercase letter');
        }
        if (!rules.hasNumbers.test(password)) {
            errors.push('One number');
        }

        if (errors.length > 0) {
            this.setFieldError(input, `Password must contain: ${errors.join(', ')}`);
            return false;
        }

        this.setFieldValid(input);
        return true;
    }

    validatePasswordConfirm(input) {
        const password = document.getElementById('signup-password').value;
        const confirmPassword = input.value;

        if (confirmPassword && password !== confirmPassword) {
            this.setFieldError(input, 'Passwords do not match');
            return false;
        }

        this.setFieldValid(input);
        return true;
    }

    validateRequired(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            this.setFieldError(input, 'This field is required');
            return false;
        }
        return true;
    }

    checkPasswordStrength(e) {
        const password = e.target.value;
        const strengthContainer = document.querySelector('.password-strength');
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText || !strengthContainer) return;

        // Show/hide strength indicator based on password content
        if (password.length > 0) {
            strengthContainer.classList.add('visible');
        } else {
            strengthContainer.classList.remove('visible');
            return;
        }

        const rules = this.passwordStrengthRules;
        let score = 0;
        let strength = 'weak';
        let strengthDescription = '';

        // Calculate score
        if (password.length >= rules.minLength) score++;
        if (rules.hasUpperCase.test(password)) score++;
        if (rules.hasLowerCase.test(password)) score++;
        if (rules.hasNumbers.test(password)) score++;
        if (rules.hasSpecialChars.test(password)) score++;

        // Determine strength level and description
        if (score === 0 || password.length < 4) {
            strength = 'weak';
            strengthDescription = 'Very weak';
        } else if (score <= 2) {
            strength = 'weak';
            strengthDescription = 'Weak';
        } else if (score === 3) {
            strength = 'fair';
            strengthDescription = 'Fair';
        } else if (score === 4) {
            strength = 'good';
            strengthDescription = 'Good';
        } else {
            strength = 'strong';
            strengthDescription = 'Strong';
        }

        // Update visual indicator with animation
        strengthBar.className = `strength-fill ${strength}`;
        strengthText.textContent = `Password strength: ${strengthDescription}`;

        // Add strength tips
        if (strength === 'weak' || strength === 'fair') {
            const tips = [];
            if (password.length < rules.minLength) tips.push('8+ characters');
            if (!rules.hasUpperCase.test(password)) tips.push('uppercase letter');
            if (!rules.hasLowerCase.test(password)) tips.push('lowercase letter');
            if (!rules.hasNumbers.test(password)) tips.push('number');
            if (!rules.hasSpecialChars.test(password)) tips.push('special character');
            
            if (tips.length > 0) {
                strengthText.textContent += ` (Add: ${tips.slice(0, 2).join(', ')})`;
            }
        }

        // Trigger visual feedback
        if (strength === 'strong') {
            strengthContainer.style.animation = 'none';
            setTimeout(() => {
                strengthContainer.style.animation = 'pulse 0.3s ease-in-out';
            }, 10);
        }
    }

    setFieldError(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        const feedback = input.closest('.form-group').querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }

    setFieldValid(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    clearValidation(input) {
        input.classList.remove('is-invalid', 'is-valid');
    }

    setLoadingState(form, loading) {
        this.isLoading = loading;
        const submitBtn = form.querySelector('.btn-auth-submit');
        const textSpan = submitBtn.querySelector('.btn-text');
        const loadingSpan = submitBtn.querySelector('.btn-loading');

        submitBtn.disabled = loading;
        submitBtn.classList.toggle('loading', loading);
        
        if (loading) {
            textSpan.classList.add('d-none');
            loadingSpan.classList.remove('d-none');
        } else {
            textSpan.classList.remove('d-none');
            loadingSpan.classList.add('d-none');
        }

        // Disable all form inputs during loading
        form.querySelectorAll('input, button').forEach(element => {
            if (!element.classList.contains('btn-auth-submit')) {
                element.disabled = loading;
            }
        });
    }

    showError(alertId, message) {
        const alert = document.getElementById(alertId);
        if (alert) {
            const messageSpan = alert.querySelector('.error-message');
            if (messageSpan) {
                messageSpan.textContent = message;
            }
            alert.classList.remove('d-none');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.clearError(alertId);
            }, 5000);
        }
    }

    clearError(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.classList.add('d-none');
        }
    }

    clearAllErrors() {
        document.querySelectorAll('.alert').forEach(alert => {
            alert.classList.add('d-none');
        });
    }

    showSuccess(message) {
        // Create temporary success message
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success';
        successAlert.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>
            ${message}
        `;
        
        const container = document.querySelector('.auth-forms');
        container.insertBefore(successAlert, container.firstChild);
        
        // Remove after delay
        setTimeout(() => {
            successAlert.remove();
        }, 3000);
    }

    showInfo(message) {
        // Create temporary info message
        const infoAlert = document.createElement('div');
        infoAlert.className = 'alert alert-info';
        infoAlert.innerHTML = `
            <i class="bi bi-info-circle-fill me-2"></i>
            ${message}
        `;
        
        const container = document.querySelector('.auth-forms');
        container.insertBefore(infoAlert, container.firstChild);
        
        // Remove after delay
        setTimeout(() => {
            infoAlert.remove();
        }, 3000);
    }

    resetAllForms() {
        document.querySelectorAll('.auth-form').forEach(form => {
            form.reset();
            form.querySelectorAll('.is-invalid, .is-valid').forEach(input => {
                input.classList.remove('is-invalid', 'is-valid');
            });
        });

        // Reset password strength indicator
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        if (strengthBar) {
            strengthBar.className = 'strength-fill';
        }
        if (strengthText) {
            strengthText.textContent = 'Password strength';
        }
    }

    // ============================================
    // NEW ENHANCED METHODS
    // ============================================

    /**
     * Initialize remember me functionality
     */
    initRememberMe() {
        // Load saved credentials if available
        const savedData = this.loadRememberedCredentials();
        if (savedData && savedData.email) {
            const emailInput = document.getElementById('signin-email');
            const rememberCheckbox = document.getElementById('remember-me');
            
            if (emailInput && rememberCheckbox) {
                emailInput.value = savedData.email;
                rememberCheckbox.checked = true;
                this.lastValidEmail = savedData.email;
            }
        }
    }

    /**
     * Initialize keyboard navigation
     */
    initKeyboardNavigation() {
        // Enable keyboard navigation for form elements
        document.querySelectorAll('.auth-form input, .auth-form button').forEach((element, index, elements) => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.type !== 'submit') {
                    e.preventDefault();
                    const nextElement = elements[index + 1];
                    if (nextElement) {
                        nextElement.focus();
                    }
                }
            });
        });
    }

    /**
     * Initialize accessibility features
     */
    initAccessibilityFeatures() {
        // Add ARIA labels and descriptions
        this.enhanceAccessibility();
        
        // Announce validation errors for screen readers
        this.setupScreenReaderAnnouncements();
    }

    /**
     * Preload form data from localStorage or URL params
     */
    preloadFormData() {
        // Check for URL parameters (e.g., email from referral)
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        
        if (emailParam) {
            const emailInput = document.getElementById('signin-email');
            if (emailInput) {
                emailInput.value = emailParam;
                this.validateEmail(emailInput);
            }
        }
    }

    /**
     * Enhanced form switching with smooth animations
     */
    animateFormSwitch(currentContainer, nextContainer, callback) {
        if (!currentContainer || !nextContainer) {
            callback();
            return;
        }

        // Fade out current form
        currentContainer.style.transition = `opacity ${this.animations.formSwitch}ms ease-out`;
        currentContainer.style.opacity = '0';

        setTimeout(() => {
            callback();
            
            // Fade in next form
            nextContainer.style.opacity = '0';
            nextContainer.style.transition = `opacity ${this.animations.formSwitch}ms ease-in`;
            
            setTimeout(() => {
                nextContainer.style.opacity = '1';
                setTimeout(() => {
                    nextContainer.style.transition = '';
                    nextContainer.style.opacity = '';
                    currentContainer.style.transition = '';
                    currentContainer.style.opacity = '';
                }, this.animations.formSwitch);
            }, 50);
        }, this.animations.formSwitch);
    }

    /**
     * Focus first visible input in a form container
     */
    focusFirstInput(container) {
        if (!container) return;
        
        const firstInput = container.querySelector('input:not([type="hidden"]):not(:disabled)');
        if (firstInput) {
            // Delayed focus to ensure form is visible
            setTimeout(() => {
                firstInput.focus();
            }, this.animations.formSwitch + 50);
        }
    }

    /**
     * Announce form changes for screen readers
     */
    announceFormChange(formType) {
        const announcement = formType === 'signin' ? 'Sign in form displayed' : 'Sign up form displayed';
        this.announceToScreenReader(announcement);
    }

    /**
     * Debounced validation to improve performance
     */
    debounceValidation(input, validationFunction, delay = 500) {
        if (input.validationTimeout) {
            clearTimeout(input.validationTimeout);
        }
        
        input.validationTimeout = setTimeout(() => {
            if (input.value.trim()) {
                validationFunction();
            }
        }, delay);
    }

    /**
     * Enhanced name validation
     */
    validateName(input) {
        const value = input.value.trim();
        const fieldName = input.id.includes('firstname') ? 'firstName' : 'lastName';
        const rule = this.validationRules[fieldName];
        
        if (!value) {
            return true; // Empty is handled by required validation
        }

        if (!rule.pattern.test(value)) {
            this.setFieldError(input, rule.message);
            return false;
        }

        this.setFieldValid(input);
        return true;
    }

    /**
     * Handle input focus with enhanced UX
     */
    handleInputFocus(e) {
        const input = e.target;
        const inputGroup = input.closest('.input-group');
        
        if (inputGroup) {
            inputGroup.classList.add('focused');
        }
        
        // Clear any previous validation on focus
        this.clearValidation(input);
    }

    /**
     * Handle input blur with validation
     */
    handleInputBlur(e) {
        const input = e.target;
        const inputGroup = input.closest('.input-group');
        
        if (inputGroup) {
            inputGroup.classList.remove('focused');
        }
        
        // Validate on blur if field has content
        if (input.value.trim()) {
            setTimeout(() => this.validateField(input), 100);
        }
    }

    /**
     * Handle remember me toggle
     */
    handleRememberMeToggle(e) {
        const isChecked = e.target.checked;
        const emailInput = document.getElementById('signin-email');
        
        if (isChecked && emailInput && emailInput.value) {
            this.saveRememberedCredentials({ email: emailInput.value });
        } else if (!isChecked) {
            this.clearRememberedCredentials();
        }
    }

    /**
     * Handle keyboard shortcuts for better UX
     */
    handleKeyboardShortcuts(e) {
        // Escape key clears current form
        if (e.key === 'Escape') {
            if (this.isLoading) {
                return; // Don't allow escape during loading
            }
            
            const activeForm = document.querySelector('.auth-form-container.active .auth-form');
            if (activeForm) {
                this.resetAllForms();
                this.clearAllErrors();
            }
        }
        
        // Ctrl/Cmd + Enter submits form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeForm = document.querySelector('.auth-form-container.active .auth-form');
            if (activeForm && !this.isLoading) {
                const submitButton = activeForm.querySelector('[type="submit"]');
                if (submitButton) {
                    submitButton.click();
                }
            }
        }
    }

    /**
     * Handle before unload to save form data
     */
    handleBeforeUnload(e) {
        if (this.isLoading) {
            e.preventDefault();
            e.returnValue = 'Authentication in progress. Are you sure you want to leave?';
            return e.returnValue;
        }
    }

    /**
     * Handle theme changes
     */
    handleThemeChange(e) {
        // Update form styling based on theme
        const isDark = e.detail?.theme === 'dark';
        this.updateFormTheme(isDark);
    }

    /**
     * Update form theme
     */
    updateFormTheme(isDark) {
        const authContainer = document.querySelector('.auth-container');
        if (authContainer) {
            authContainer.classList.toggle('dark-theme', isDark);
        }
    }

    /**
     * Remember me functionality - save credentials
     */
    saveRememberedCredentials(data) {
        try {
            const encryptedData = btoa(JSON.stringify(data)); // Basic encoding
            localStorage.setItem('yausma_remember_me', encryptedData);
        } catch (error) {
            console.warn('Could not save remembered credentials:', error);
        }
    }

    /**
     * Remember me functionality - load credentials
     */
    loadRememberedCredentials() {
        try {
            const encryptedData = localStorage.getItem('yausma_remember_me');
            if (encryptedData) {
                return JSON.parse(atob(encryptedData));
            }
        } catch (error) {
            console.warn('Could not load remembered credentials:', error);
            this.clearRememberedCredentials();
        }
        return null;
    }

    /**
     * Remember me functionality - clear credentials
     */
    clearRememberedCredentials() {
        try {
            localStorage.removeItem('yausma_remember_me');
        } catch (error) {
            console.warn('Could not clear remembered credentials:', error);
        }
    }

    /**
     * Enhanced accessibility support
     */
    enhanceAccessibility() {
        // Add live region for announcements
        if (!document.getElementById('auth-announcements')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'auth-announcements';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'visually-hidden';
            document.body.appendChild(liveRegion);
        }

        // Enhance form labels and descriptions
        document.querySelectorAll('.form-control').forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label && !input.getAttribute('aria-labelledby')) {
                input.setAttribute('aria-labelledby', label.id || `${input.id}-label`);
                if (!label.id) {
                    label.id = `${input.id}-label`;
                }
            }
        });
    }

    /**
     * Setup screen reader announcements
     */
    setupScreenReaderAnnouncements() {
        // Announce validation errors
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const element = mutation.target;
                    if (element.classList.contains('is-invalid')) {
                        const errorMessage = element.closest('.form-group')?.querySelector('.invalid-feedback')?.textContent;
                        if (errorMessage) {
                            this.announceToScreenReader(`Error: ${errorMessage}`);
                        }
                    }
                }
            });
        });

        document.querySelectorAll('.form-control').forEach(input => {
            observer.observe(input, { attributes: true });
        });
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('auth-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
}

// Enhanced form validation styles and animations
const ValidationStyles = {
    init() {
        // Add custom validation styles
        const style = document.createElement('style');
        style.textContent = `
            /* Custom validation feedback animations */
            .invalid-feedback {
                animation: shake 0.3s ease-in-out;
                transform-origin: center;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            /* Success state animation */
            .form-control.is-valid {
                animation: valid-pulse 0.3s ease-in-out;
            }
            
            @keyframes valid-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            
            /* Loading button animation */
            .btn-auth-submit.loading {
                pointer-events: none;
                position: relative;
                overflow: hidden;
            }
            
            .btn-auth-submit .spinner-border {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Enhanced input focus states */
            .input-group.focused {
                z-index: 2;
            }
            
            .input-group.focused .form-control {
                border-color: var(--interactive-blue);
                box-shadow: 0 0 0 3px rgba(52, 74, 251, 0.1);
            }
            
            .input-group.focused .input-icon {
                color: var(--interactive-blue);
            }
            
            /* Form switching animations */
            .auth-form-container {
                transform-origin: center;
            }
            
            .auth-form-container.switching-out {
                animation: slideOutLeft 0.3s ease-in-out;
            }
            
            .auth-form-container.switching-in {
                animation: slideInRight 0.3s ease-in-out;
            }
            
            @keyframes slideOutLeft {
                0% { transform: translateX(0); opacity: 1; }
                100% { transform: translateX(-20px); opacity: 0; }
            }
            
            @keyframes slideInRight {
                0% { transform: translateX(20px); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            
            /* Password strength indicator enhancements */
            .password-strength {
                transition: all 0.3s ease;
            }
            
            .strength-fill {
                transition: width 0.4s ease, background-color 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .strength-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: strength-shimmer 2s infinite;
            }
            
            .strength-fill.strong::after {
                animation: strength-shimmer 1s infinite;
            }
            
            @keyframes strength-shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced social button hover effects */
            .btn-social {
                position: relative;
                overflow: hidden;
                transition: all 0.2s ease;
            }
            
            .btn-social::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transition: left 0.5s ease;
            }
            
            .btn-social:hover::before {
                left: 100%;
            }
            
            /* Alert animations */
            .alert {
                animation: alertSlideIn 0.3s ease-out;
                transform-origin: top;
            }
            
            @keyframes alertSlideIn {
                0% { transform: translateY(-10px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            
            /* Dark theme form enhancements */
            .auth-container.dark-theme {
                background: var(--dark-bg-secondary);
                border-color: var(--dark-border);
            }
            
            .auth-container.dark-theme .form-control {
                background: var(--dark-bg-primary);
                border-color: var(--dark-border);
                color: var(--dark-text-primary);
            }
            
            .auth-container.dark-theme .form-control:focus {
                background: var(--dark-bg-primary);
                border-color: var(--interactive-blue);
                color: var(--dark-text-primary);
                box-shadow: 0 0 0 3px rgba(52, 74, 251, 0.2);
            }
            
            /* Accessibility improvements */
            .visually-hidden {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .form-control.is-valid {
                    border-width: 3px;
                }
                
                .form-control.is-invalid {
                    border-width: 3px;
                }
                
                .btn-auth-submit {
                    border: 2px solid;
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .invalid-feedback,
                .form-control.is-valid,
                .btn-auth-submit .spinner-border,
                .auth-form-container,
                .strength-fill,
                .btn-social,
                .alert {
                    animation: none !important;
                    transition: none !important;
                }
            }
            
            /* Touch device improvements */
            @media (hover: none) and (pointer: coarse) {
                .btn-social {
                    padding: 16px 24px;
                }
                
                .form-control {
                    padding: 16px;
                    font-size: 16px; /* Prevents zoom on iOS */
                }
                
                .btn-password-toggle {
                    padding: 12px;
                    min-width: 44px;
                    min-height: 44px;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ValidationStyles.init();
    window.authManager = new AuthManager();
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}