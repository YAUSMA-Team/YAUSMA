/**
 * YAUSMA Auth Page JavaScript
 * Form validation, API integration, and user interactions
 */

// Auth page state
var AuthPage = {
    initialized: false,
    currentTab: 'signin',
    isLoading: false
};

// Initialize auth page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('auth.html')) {
        initAuthPage();
    }
});

// Main auth page initialization
function initAuthPage() {
    if (AuthPage.initialized) {
        return;
    }
    
    try {
        initTabSwitching();
        initFormValidation();
        initPasswordToggles();
        initFormSubmissions();
        initThemeIntegration();
        
        AuthPage.initialized = true;
        
        if (YAUSMA.debug) {
            console.log('Auth page initialized successfully');
        }
        
    } catch (error) {
        console.error('Failed to initialize auth page:', error);
    }
}

// Initialize tab switching functionality
function initTabSwitching() {
    var signinTab = document.getElementById('signinTab');
    var signupTab = document.getElementById('signupTab');
    var signinForm = document.getElementById('signinForm');
    var signupForm = document.getElementById('signupForm');
    var authTitle = document.querySelector('.auth-title');
    var authSubtitle = document.querySelector('.auth-subtitle');
    var switchText = document.getElementById('switchText');
    var switchBtn = document.getElementById('switchBtn');
    
    // Tab click handlers
    signinTab.addEventListener('click', function() {
        switchToTab('signin');
    });
    
    signupTab.addEventListener('click', function() {
        switchToTab('signup');
    });
    
    // Switch button handler
    switchBtn.addEventListener('click', function() {
        var targetTab = AuthPage.currentTab === 'signin' ? 'signup' : 'signin';
        switchToTab(targetTab);
    });
    
    function switchToTab(tab) {
        if (AuthPage.isLoading) return;
        
        AuthPage.currentTab = tab;
        
        // Update tab buttons
        signinTab.classList.toggle('active', tab === 'signin');
        signupTab.classList.toggle('active', tab === 'signup');
        
        // Update form containers
        signinForm.classList.toggle('d-none', tab !== 'signin');
        signupForm.classList.toggle('d-none', tab !== 'signup');
        
        // Update header text
        if (tab === 'signin') {
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Sign in to access your account';
            switchText.textContent = "Don't have an account?";
            switchBtn.textContent = 'Sign up';
        } else {
            authTitle.textContent = 'Create Account';
            authSubtitle.textContent = 'Join YAUSMA to start trading';
            switchText.textContent = 'Already have an account?';
            switchBtn.textContent = 'Sign in';
        }
        
        // Clear any previous errors/messages
        clearFormMessages();
        clearFormErrors();
        
        // Focus first input
        setTimeout(function() {
            var firstInput = tab === 'signin' 
                ? document.getElementById('signinEmail')
                : document.getElementById('signupEmail');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
}

// Initialize form validation
function initFormValidation() {
    var inputs = document.querySelectorAll('.auth-input');
    
    inputs.forEach(function(input) {
        // Real-time validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear errors on input
        input.addEventListener('input', function() {
            clearFieldError(this);
            
            // Special handling for password strength
            if (this.id === 'signupPassword') {
                updatePasswordStrength(this.value);
            }
            
            // Special handling for password confirmation
            if (this.id === 'confirmPassword') {
                validatePasswordMatch();
            }
        });
    });
    
}

// Validate individual field
function validateField(field) {
    var isValid = true;
    var value = field.value.trim();
    var fieldType = field.type;
    var fieldId = field.id;
    
    // Email validation
    if (fieldType === 'email' || fieldId.includes('Email')) {
        if (!value) {
            showFieldError(field, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Password validation
    if (fieldType === 'password' && fieldId.includes('Password') && !fieldId.includes('confirm')) {
        if (!value) {
            showFieldError(field, 'Password is required');
            isValid = false;
        } else if (fieldId.includes('signup') && !isStrongPassword(value)) {
            showFieldError(field, 'Password must be at least 8 characters with uppercase, lowercase, and number');
            isValid = false;
        } else if (fieldId.includes('signin') && value.length < 1) {
            showFieldError(field, 'Password is required');
            isValid = false;
        }
    }
    
    // Confirm password validation
    if (fieldId === 'confirmPassword') {
        var password = document.getElementById('signupPassword').value;
        if (!value) {
            showFieldError(field, 'Please confirm your password');
            isValid = false;
        } else if (value !== password) {
            showFieldError(field, 'Passwords do not match');
            isValid = false;
        }
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password strength validation
function isStrongPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    var strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
}

// Update password strength meter
function updatePasswordStrength(password) {
    var strengthBar = document.getElementById('strengthBar');
    var strengthText = document.getElementById('strengthText');
    
    if (!strengthBar || !strengthText) return;
    
    var strength = calculatePasswordStrength(password);
    
    // Remove all strength classes
    strengthBar.className = 'strength-bar';
    
    if (password.length === 0) {
        strengthText.textContent = 'Choose a strong password';
        return;
    }
    
    switch (strength) {
        case 1:
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak password';
            break;
        case 2:
            strengthBar.classList.add('fair');
            strengthText.textContent = 'Fair password';
            break;
        case 3:
            strengthBar.classList.add('good');
            strengthText.textContent = 'Good password';
            break;
        case 4:
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong password';
            break;
        default:
            strengthText.textContent = 'Very weak password';
    }
}

// Calculate password strength (1-4 scale)
function calculatePasswordStrength(password) {
    var score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return Math.min(score, 4);
}

// Validate password match
function validatePasswordMatch() {
    var password = document.getElementById('signupPassword');
    var confirmPassword = document.getElementById('confirmPassword');
    
    if (confirmPassword.value && password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, 'Passwords do not match');
        return false;
    } else {
        clearFieldError(confirmPassword);
        return true;
    }
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    var errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    var errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Clear all form errors
function clearFormErrors() {
    var inputs = document.querySelectorAll('.auth-input');
    inputs.forEach(function(input) {
        clearFieldError(input);
    });
    
    var checkboxes = document.querySelectorAll('.custom-checkbox');
    checkboxes.forEach(function(checkbox) {
        clearFieldError(checkbox);
    });
}

// Initialize password toggle functionality
function initPasswordToggles() {
    var toggles = document.querySelectorAll('.password-toggle');
    
    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var inputId = this.id.replace('Toggle', '');
            var input = document.getElementById(inputId);
            var icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'bi bi-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'bi bi-eye';
            }
        });
    });
}

// Initialize form submissions
function initFormSubmissions() {
    var signinForm = document.getElementById('signinFormElement');
    var signupForm = document.getElementById('signupFormElement');
    
    if (signinForm) {
        signinForm.addEventListener('submit', handleSigninSubmit);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
}

// Handle sign in form submission
function handleSigninSubmit(e) {
    e.preventDefault();
    
    if (AuthPage.isLoading) return;
    
    var email = document.getElementById('signinEmail').value.trim();
    var password = document.getElementById('signinPassword').value;
    
    // Clear previous messages
    clearFormMessages();
    
    // Simple validation
    if (!email || !password) {
        showFormError('Please fill in all fields.', 'signin');
        return;
    }
    
    // Show loading state
    setFormLoading(true, 'signin');
    
    // Simple test credentials validation
    setTimeout(function() {
        if (email === 'test@test' && password === 'test') {
            // Login successful
            if (window.authManager) {
                if (window.authManager.login(email, password)) {
                    handleSigninSuccess(email);
                } else {
                    setFormLoading(false, 'signin');
                    showFormError('Login failed. Please try again.', 'signin');
                }
            } else {
                setFormLoading(false, 'signin');
                showFormError('Authentication system not available.', 'signin');
            }
        } else {
            // Login failed
            setFormLoading(false, 'signin');
            showFormError('Invalid credentials. Use "test" for both username and password.', 'signin');
        }
    }, 500); // Small delay to show loading state
}

// Handle sign up form submission
function handleSignupSubmit(e) {
    e.preventDefault();
    
    if (AuthPage.isLoading) return;
    
    var email = document.getElementById('signupEmail').value.trim();
    var password = document.getElementById('signupPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    
    // Clear previous messages
    clearFormMessages();
    
    // Validate form
    var emailValid = validateField(document.getElementById('signupEmail'));
    var passwordValid = validateField(document.getElementById('signupPassword'));
    var confirmValid = validateField(document.getElementById('confirmPassword'));
    
    if (!emailValid || !passwordValid || !confirmValid) {
        return;
    }
    
    // Show loading state
    setFormLoading(true, 'signup');
    
    // Hash password and make API call
    hashPassword(password).then(function(hashedPassword) {
        var credentials = new UserCredentials(email, hashedPassword);
        
        window.userApi.signup(credentials, function(error, data, response) {
            setFormLoading(false, 'signup');
            
            if (error) {
                handleApiError(error, 'signup');
            } else {
                handleSignupSuccess(email);
            }
        });
    }).catch(function(error) {
        setFormLoading(false, 'signup');
        showFormError('Failed to process password. Please try again.', 'signup');
    });
}

// Hash password using Web Crypto API
function hashPassword(password) {
    return new Promise(function(resolve, reject) {
        if (!window.crypto || !window.crypto.subtle) {
            // Fallback for older browsers - just encode as base64
            resolve(btoa(password));
            return;
        }
        
        var encoder = new TextEncoder();
        var data = encoder.encode(password);
        
        window.crypto.subtle.digest('SHA-256', data).then(function(hashBuffer) {
            var hashArray = Array.from(new Uint8Array(hashBuffer));
            var hashHex = hashArray.map(function(b) {
                return b.toString(16).padStart(2, '0');
            }).join('');
            resolve(hashHex);
        }).catch(reject);
    });
}

// Handle API errors
function handleApiError(error, formType) {
    var message = 'An error occurred. Please try again.';
    
    if (error.status === 409) {
        message = 'This email is already registered. Please use a different email or sign in.';
    } else if (error.status === 404) {
        message = formType === 'signin' 
            ? 'Invalid email or password. Please check your credentials.'
            : 'Invalid request. Please try again.';
    } else if (error.status === 500) {
        message = 'Server error. Please try again later.';
    }
    
    showFormError(message, formType);
}

// Handle successful sign in
function handleSigninSuccess(email) {
    showFormSuccess('Sign in successful! Redirecting...', 'signin');
    
    // Store user session (in real app, this would be handled by backend)
    localStorage.setItem('yausma_user_email', email);
    
    // Check if there's a return URL from page protection
    var returnUrl = sessionStorage.getItem('yausma_return_url');
    if (returnUrl) {
        sessionStorage.removeItem('yausma_return_url');
        // Redirect after delay
        setTimeout(function() {
            window.location.href = returnUrl;
        }, 1500);
    } else {
        // Redirect to homepage after delay
        setTimeout(function() {
            window.location.href = '../index.html';
        }, 1500);
    }
}

// Handle successful sign up
function handleSignupSuccess(email) {
    showFormSuccess('Account created successfully! You can now sign in.', 'signup');
    
    // Switch to sign in tab after delay
    setTimeout(function() {
        switchToTab('signin');
        // Pre-fill email
        document.getElementById('signinEmail').value = email;
    }, 2000);
}

// Set form loading state
function setFormLoading(loading, formType) {
    AuthPage.isLoading = loading;
    
    var form = document.getElementById(formType + 'FormElement');
    var submitBtn = document.getElementById(formType + 'SubmitBtn');
    var btnText = submitBtn.querySelector('.btn-text');
    var btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    if (loading) {
        form.classList.add('loading');
        submitBtn.disabled = true;
        btnText.classList.add('d-none');
        btnSpinner.classList.remove('d-none');
    } else {
        form.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.classList.remove('d-none');
        btnSpinner.classList.add('d-none');
    }
}

// Show form error message
function showFormError(message, formType) {
    var errorElement = document.getElementById(formType + 'FormError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Show form success message
function showFormSuccess(message, formType) {
    var successElement = document.getElementById(formType + 'FormSuccess');
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
    }
}

// Clear form messages
function clearFormMessages() {
    var messages = document.querySelectorAll('.auth-error, .auth-success');
    messages.forEach(function(message) {
        message.classList.remove('show');
    });
}

// Initialize theme integration
function initThemeIntegration() {
    // Listen for theme changes
    document.addEventListener('themeChanged', function(e) {
        handleThemeChange(e.detail.theme);
    });
    
    // Apply theme-specific adjustments on load
    var currentTheme = document.body.getAttribute('data-theme') || 'light';
    handleThemeChange(currentTheme);
}

// Handle theme changes
function handleThemeChange(theme) {
    var authCard = document.querySelector('.auth-card');
    var inputs = document.querySelectorAll('.auth-input');
    
    // Smooth transition for theme changes
    [authCard, ...inputs].forEach(function(element) {
        if (element) {
            element.style.transition = 'all 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
        }
    });
}

// Utility function to switch tabs programmatically
function switchToTab(tab) {
    var event = new CustomEvent('tabSwitch', { detail: { tab: tab } });
    document.dispatchEvent(event);
    
    // Manual trigger since we're calling this directly
    var signinTab = document.getElementById('signinTab');
    var signupTab = document.getElementById('signupTab');
    
    if (tab === 'signin' && signinTab) {
        signinTab.click();
    } else if (tab === 'signup' && signupTab) {
        signupTab.click();
    }
}

// Handle Enter key submissions
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        var activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('auth-input')) {
            var form = activeElement.closest('.auth-form');
            if (form) {
                var submitBtn = form.querySelector('.auth-submit-btn');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }
        }
    }
});

// Export for global use
window.AuthPage = AuthPage;

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    AuthPage.initialized = false;
});