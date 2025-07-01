/**
 * YAUSMA Authentication Page JavaScript
 * Handles form validation, toggle functionality, and UI interactions
 */

class AuthManager {
    constructor() {
        this.currentForm = 'signin';
        this.isLoading = false;
        this.passwordStrengthRules = {
            minLength: 8,
            hasUpperCase: /[A-Z]/,
            hasLowerCase: /[a-z]/,
            hasNumbers: /\d/,
            hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initFormToggle();
        this.initPasswordToggles();
        this.initFormValidation();
        console.log('AuthManager initialized');
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
        // Email validation
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('blur', (e) => this.validateEmail(e.target));
            input.addEventListener('input', (e) => this.clearValidation(e.target));
        });

        // Password validation
        document.querySelectorAll('input[type="password"]').forEach(input => {
            if (input.id === 'signup-password') {
                input.addEventListener('input', (e) => this.validatePassword(e.target));
            }
            if (input.id === 'signup-confirm-password') {
                input.addEventListener('input', (e) => this.validatePasswordConfirm(e.target));
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
            // Simulate API call
            await this.simulateAuth({
                email: formData.get('email'),
                password: formData.get('password'),
                remember: formData.get('remember') === 'on'
            }, 'signin');

            // Success - would redirect in real app
            this.showSuccess('Welcome back! Redirecting to your dashboard...');
            
            // Simulate redirect delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);

        } catch (error) {
            this.showError('signin-error', error.message);
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
            // Simulate API call
            await this.simulateAuth({
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password'),
                terms: formData.get('terms') === 'on',
                marketing: formData.get('marketing') === 'on'
            }, 'signup');

            // Success - would redirect in real app
            this.showSuccess('Account created successfully! Welcome to YAUSMA!');
            
            // Simulate redirect delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);

        } catch (error) {
            this.showError('signup-error', error.message);
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
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;

        const rules = this.passwordStrengthRules;
        let score = 0;
        let strength = 'weak';

        if (password.length >= rules.minLength) score++;
        if (rules.hasUpperCase.test(password)) score++;
        if (rules.hasLowerCase.test(password)) score++;
        if (rules.hasNumbers.test(password)) score++;
        if (rules.hasSpecialChars.test(password)) score++;

        // Determine strength
        if (score === 0) {
            strength = 'weak';
            strengthText.textContent = 'Password strength: Very weak';
        } else if (score <= 2) {
            strength = 'weak';
            strengthText.textContent = 'Password strength: Weak';
        } else if (score === 3) {
            strength = 'fair';
            strengthText.textContent = 'Password strength: Fair';
        } else if (score === 4) {
            strength = 'good';
            strengthText.textContent = 'Password strength: Good';
        } else {
            strength = 'strong';
            strengthText.textContent = 'Password strength: Strong';
        }

        // Update visual indicator
        strengthBar.className = `strength-fill ${strength}`;
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
}

// Enhanced form validation styles
const ValidationStyles = {
    init() {
        // Add custom validation styles
        const style = document.createElement('style');
        style.textContent = `
            /* Custom validation feedback animations */
            .invalid-feedback {
                animation: shake 0.3s ease-in-out;
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
            }
            
            .btn-auth-submit .spinner-border {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
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