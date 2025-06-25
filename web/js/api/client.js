// API Client Wrapper
class APIClient {
    constructor() {
        this.baseURL = CONFIG.API.BASE_URL;
        this.defaultTimeout = CONFIG.REQUEST.TIMEOUT;
        this.retryAttempts = CONFIG.REQUEST.RETRY_ATTEMPTS;
        this.retryDelay = CONFIG.REQUEST.RETRY_DELAY;
    }

    // Generic request method with retry logic
    async request(endpoint, options = {}) {
        let lastError;
        
        for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
            try {
                const response = await this._fetch(endpoint, options);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error);
                }
                
                return data;
            } catch (error) {
                lastError = error;
                
                if (attempt < this.retryAttempts - 1) {
                    await this._delay(this.retryDelay * Math.pow(2, attempt));
                    continue;
                }
                
                throw error;
            }
        }
        
        throw lastError;
    }

    // GET request
    async get(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        return this.request(url.toString(), {
            method: 'GET',
            headers: this._getHeaders()
        });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: this._getHeaders(),
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: this._getHeaders()
        });
    }

    // Helper method to get headers
    _getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Helper method to implement fetch with timeout
    async _fetch(url, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    // Helper method to implement delay
    async _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Authentication methods
    async login(credentials) {
        const response = await this.post('/login', {
            username_sha: credentials.username_sha,
            password_sha: credentials.password_sha
        });
        
        if (response.token) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER_TOKEN, response.token);
        }
        
        return response;
    }

    async signup(userData) {
        return this.post('/signup', userData);
    }

    async deleteAccount() {
        const response = await this.delete('/user/delete');
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
        return response;
    }

    // Stock data methods
    async getChartData(symbol, period) {
        return this.get('/get/charts', { symbol, period });
    }

    // News methods
    async getNews(params = {}) {
        return this.get('/get/news', params);
    }
} 