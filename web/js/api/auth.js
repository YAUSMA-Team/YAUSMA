// Authentication API Integration
class AuthAPI {
    constructor() {
        this.client = new APIClient();
        this.crypto = window.crypto.subtle;
    }

    // Hash password using SHA-256
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await this.crypto.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Login user
    async login(username, password) {
        try {
            const username_sha = await this.hashPassword(username);
            const password_sha = await this.hashPassword(password);

            const response = await this.client.login({
                username_sha,
                password_sha
            });

            if (response.token) {
                this._handleSuccessfulAuth(response);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed. Please check your credentials and try again.');
        }
    }

    // Register new user
    async signup(username, password, email) {
        try {
            const username_sha = await this.hashPassword(username);
            const password_sha = await this.hashPassword(password);

            const response = await this.client.signup({
                username_sha,
                password_sha,
                email
            });

            if (response.token) {
                this._handleSuccessfulAuth(response);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Signup failed:', error);
            throw new Error('Registration failed. Please try again.');
        }
    }

    // Delete user account
    async deleteAccount() {
        try {
            await this.client.deleteAccount();
            this.logout();
            return true;
        } catch (error) {
            console.error('Account deletion failed:', error);
            throw new Error('Failed to delete account. Please try again.');
        }
    }

    // Logout user
    logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
        this._clearUserData();
        window.dispatchEvent(new Event('auth:logout'));
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    }

    // Handle successful authentication
    _handleSuccessfulAuth(response) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_TOKEN, response.token);
        if (response.user) {
            this._saveUserData(response.user);
        }
        window.dispatchEvent(new Event('auth:login'));
    }

    // Save user data
    _saveUserData(userData) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }

    // Clear user data
    _clearUserData() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
    }

    // Get user data
    getUserData() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }
} 