// Authentication Page Logic
class AuthPage {
    constructor() {
        this.authAPI = new AuthAPI();
        this.initializeEventListeners();
        this.checkAuthStatus();
    }

    initializeEventListeners() {
        // Initialize forms
        this.loginForm = document.getElementById('login');
        this.registerForm = document.getElementById('register');

        // Add form submit handlers
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Initialize Bootstrap components
        document.addEventListener('DOMContentLoaded', () => {
            BootstrapInitializer.init();
        });
    }

    async handleLogin(event) {
        event.preventDefault();
        
        if (!this.validateForm(this.loginForm)) {
            return;
        }

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            this.showLoading('Signing in...');
            const success = await this.authAPI.login(username, password);
            
            if (success) {
                this.showSuccess('Successfully signed in. Redirecting...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                this.showError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        if (!this.validateForm(this.registerForm)) {
            return;
        }

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (password !== confirmPassword) {
            this.showError('Passwords do not match.');
            return;
        }

        try {
            this.showLoading('Creating account...');
            const success = await this.authAPI.signup(username, password, email);
            
            if (success) {
                this.showSuccess('Account created successfully. Redirecting...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                this.showError('Failed to create account. Please try again.');
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    validateForm(form) {
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return false;
        }
        return true;
    }

    checkAuthStatus() {
        if (this.authAPI.isAuthenticated()) {
            window.location.href = '/';
        }
    }

    showLoading(message) {
        const alert = document.querySelector('.alert');
        alert.className = 'alert mt-3 alert-info';
        alert.textContent = message;
        alert.style.display = 'block';
    }

    showSuccess(message) {
        const alert = document.querySelector('.alert');
        alert.className = 'alert mt-3 alert-success';
        alert.textContent = message;
        alert.style.display = 'block';
    }

    showError(message) {
        const alert = document.querySelector('.alert');
        alert.className = 'alert mt-3 alert-danger';
        alert.textContent = message;
        alert.style.display = 'block';
    }
}

// Initialize the auth page
const authPage = new AuthPage(); 