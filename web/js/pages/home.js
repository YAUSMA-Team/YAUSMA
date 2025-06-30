// Enhanced Home Page Logic with Real-time Data and Interactivity
class HomePage {
    constructor() {
        this.apiClient = new APIClient();
        this.marketData = [];
        this.updateInterval = null;
        
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    async initialize() {
        console.log('Initializing YAUSMA Homepage...');
        
        // Initialize components
        this.initializeAnimations();
        this.initializeMarketData();
        this.initializeUserLocation();
        this.initializeEventListeners();
        
        // Load initial data
        await this.loadMarketOverview();
        
        // Start real-time updates
        this.startRealTimeUpdates();
        
        console.log('Homepage initialized successfully');
    }

    initializeAnimations() {
        // Add intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, observerOptions);

        // Observe sections for animation
        document.querySelectorAll('.feature-card, .product-card, .market-overview-card').forEach(el => {
            observer.observe(el);
        });
    }

    initializeEventListeners() {
        // Theme toggle functionality
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Market card click handlers
        document.addEventListener('click', (e) => {
            const marketCard = e.target.closest('.market-overview-card');
            if (marketCard) {
                this.handleMarketCardClick(marketCard);
            }
        });

        // CTA button tracking
        document.querySelectorAll('.btn[href*="auth.html"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackEvent('cta_click', { location: 'homepage', action: 'signup' });
            });
        });

        // Handle page visibility changes for data updates
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseRealTimeUpdates();
            } else {
                this.resumeRealTimeUpdates();
            }
        });
    }

    async initializeUserLocation() {
        try {
            // Get user's location for market personalization
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        this.personalizeMarketData();
                    },
                    (error) => {
                        console.warn('Geolocation access denied:', error);
                        this.useDefaultLocation();
                    }
                );
            } else {
                this.useDefaultLocation();
            }
        } catch (error) {
            console.error('Error initializing location:', error);
            this.useDefaultLocation();
        }
    }

    useDefaultLocation() {
        // Default to Berlin, Germany as per project requirements
        this.userLocation = { lat: 52.5200, lng: 13.4050, country: 'DE' };
        this.personalizeMarketData();
    }

    async personalizeMarketData() {
        // Customize market data based on user location
        const countryMarkets = {
            'US': ['S&P 500', 'NASDAQ', 'DOW'],
            'DE': ['DAX', 'MDAX', 'TecDAX'],
            'GB': ['FTSE 100', 'FTSE 250'],
            'FR': ['CAC 40'],
            'JP': ['Nikkei 225'],
            default: ['S&P 500', 'NASDAQ', 'DAX', 'FTSE 100']
        };

        const country = this.userLocation?.country || 'default';
        this.preferredMarkets = countryMarkets[country] || countryMarkets.default;
        
        await this.updateMarketOverview();
    }

    async initializeMarketData() {
        // Initialize with mock data that will be replaced by real data
        this.marketData = [
            { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2834.21, change: -31.75, changePercent: -1.12 },
            { symbol: 'MSFT', name: 'Microsoft Corp.', price: 338.11, change: 2.99, changePercent: 0.89 },
            { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.55, change: -5.12, changePercent: -2.02 },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3342.88, change: 15.67, changePercent: 0.47 }
        ];

        this.updateHeroMarketData();
    }

    updateHeroMarketData() {
        const heroMarketContainer = document.getElementById('hero-market-data');
        if (!heroMarketContainer) return;

        heroMarketContainer.innerHTML = '';

        // Show top 3 stocks in hero section
        this.marketData.slice(0, 3).forEach(stock => {
            const marketItem = document.createElement('div');
            marketItem.className = 'market-item';
            marketItem.innerHTML = `
                <div class="market-symbol">${stock.symbol}</div>
                <div class="market-price">$${stock.price.toFixed(2)}</div>
                <div class="market-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                    ${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%
                </div>
            `;
            
            // Add click handler
            marketItem.addEventListener('click', () => {
                window.location.href = `pages/stock-detail.html?symbol=${stock.symbol}`;
            });
            
            marketItem.style.cursor = 'pointer';
            heroMarketContainer.appendChild(marketItem);
        });
    }

    async loadMarketOverview() {
        try {
            // Simulate API call to get market indices
            const indices = await this.fetchMarketIndices();
            this.updateMarketOverviewCards(indices);
        } catch (error) {
            console.error('Error loading market overview:', error);
            this.showErrorMessage('Failed to load market data. Please try again later.');
        }
    }

    async fetchMarketIndices() {
        // Mock data - replace with real API calls
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { name: 'S&P 500', symbol: 'SPX', price: 4567.89, change: 1.23, country: 'US' },
                    { name: 'NASDAQ', symbol: 'IXIC', price: 14234.56, change: -0.67, country: 'US' },
                    { name: 'DAX', symbol: 'DAX', price: 15678.90, change: 0.45, country: 'DE' },
                    { name: 'FTSE 100', symbol: 'UKX', price: 7456.78, change: 0.89, country: 'GB' }
                ]);
            }, 1000);
        });
    }

    updateMarketOverviewCards(indices) {
        const container = document.getElementById('market-overview-cards');
        if (!container) return;

        // Remove loading states
        container.querySelectorAll('[data-loading]').forEach(el => {
            el.removeAttribute('data-loading');
        });

        // Update existing cards or create new ones
        const cards = container.querySelectorAll('.market-overview-card');
        
        indices.forEach((index, i) => {
            if (cards[i]) {
                this.updateMarketCard(cards[i], index);
            } else {
                this.createMarketCard(container, index);
            }
        });
    }

    updateMarketCard(card, data) {
        const titleEl = card.querySelector('.card-title');
        const priceEl = card.querySelector('.price');
        const changeEl = card.querySelector('.change');
        
        if (titleEl) titleEl.textContent = data.name;
        if (priceEl) priceEl.textContent = data.price.toLocaleString();
        
        if (changeEl) {
            changeEl.textContent = `${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}%`;
            changeEl.className = `change ${data.change >= 0 ? 'positive' : 'negative'}`;
        }

        // Add country flag or region indicator
        const subtitleEl = card.querySelector('.card-subtitle');
        if (subtitleEl) {
            const countryFlags = { 'US': '🇺🇸', 'DE': '🇩🇪', 'GB': '🇬🇧', 'FR': '🇫🇷' };
            subtitleEl.textContent = `${countryFlags[data.country] || ''} ${data.country}`;
        }
    }

    createMarketCard(container, data) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-lg-3 col-md-6';
        
        colDiv.innerHTML = `
            <div class="market-overview-card">
                <div class="card-header">
                    <h5 class="card-title">${data.name}</h5>
                    <span class="card-subtitle">${data.country}</span>
                </div>
                <div class="card-body">
                    <div class="price">${data.price.toLocaleString()}</div>
                    <div class="change ${data.change >= 0 ? 'positive' : 'negative'}">
                        ${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}%
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(colDiv);
    }

    handleMarketCardClick(card) {
        const title = card.querySelector('.card-title')?.textContent;
        if (title) {
            this.trackEvent('market_card_click', { market: title });
            // Navigate to detailed view
            window.location.href = `pages/stocks.html?market=${encodeURIComponent(title)}`;
        }
    }

    startRealTimeUpdates() {
        // Update market data every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateMarketData();
        }, 30000);
    }

    pauseRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    resumeRealTimeUpdates() {
        if (!this.updateInterval) {
            this.startRealTimeUpdates();
        }
    }

    async updateMarketData() {
        try {
            // Simulate real-time price updates
            this.marketData = this.marketData.map(stock => ({
                ...stock,
                price: stock.price + (Math.random() - 0.5) * 2,
                change: (Math.random() - 0.5) * 4,
                changePercent: (Math.random() - 0.5) * 3
            }));

            this.updateHeroMarketData();
            await this.loadMarketOverview();
            
        } catch (error) {
            console.error('Error updating market data:', error);
        }
    }

    async updateMarketOverview() {
        // Refresh market overview data
        await this.loadMarketOverview();
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        
        // Update theme stylesheet
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            themeStylesheet.href = `css/themes/${newTheme}.css`;
        }
        
        // Update theme toggle icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = `bi bi-${newTheme === 'light' ? 'moon' : 'sun'}-fill`;
            }
        }
        
        // Save theme preference
        localStorage.setItem('yausma_theme', newTheme);
        
        this.trackEvent('theme_toggle', { theme: newTheme });
    }

    showErrorMessage(message) {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        }
    }

    trackEvent(eventName, properties = {}) {
        // Analytics tracking - implement with your preferred analytics service
        console.log('Event tracked:', eventName, properties);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Example: Custom analytics
        if (window.analytics) {
            window.analytics.track(eventName, properties);
        }
    }

    // Cleanup when page unloads
    destroy() {
        this.pauseRealTimeUpdates();
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        console.log('Homepage destroyed');
    }
}

// Initialize homepage when DOM is ready
let homePage;

document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('yausma_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    const themeStylesheet = document.getElementById('theme-stylesheet');
    if (themeStylesheet) {
        themeStylesheet.href = `css/themes/${savedTheme}.css`;
    }
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = `bi bi-${savedTheme === 'light' ? 'moon' : 'sun'}-fill`;
        }
    }
    
    // Initialize homepage
    homePage = new HomePage();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (homePage) {
        homePage.destroy();
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomePage;
}