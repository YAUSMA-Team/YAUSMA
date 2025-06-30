// Complete News Page Implementation
class NewsPage {
    constructor() {
        this.currentPage = 1;
        this.currentCategory = 'all';
        this.currentSearchQuery = '';
        this.isLoading = false;
        this.newsData = [];
        this.hasMoreData = true;
        this.useRealAPI = false;
        this.refreshInterval = null;
        this.marketUpdateInterval = null;
        
        this.init();
    }

    async init() {
        console.log('Initializing News Page...');
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Load initial data
        await this.loadNews();
        await this.loadTrendingNews();
        await this.loadMarketSummary();
        
        // Update auth-specific content
        this.updateAuthContent();
        
        // Show breaking news for registered users
        this.showBreakingNews();
        
        // Start auto-refresh for real-time updates
        this.startAutoRefresh();
        
        console.log('News page initialized successfully');
    }

    initializeEventListeners() {
        // Filter category clicks
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCategoryFilter(e.target);
            });
        });

        // Search functionality with debouncing
        const searchInput = document.getElementById('newsSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 500);
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreNews();
            });
        }

        // API testing toggle
        const apiToggle = document.getElementById('use-real-api');
        if (apiToggle) {
            apiToggle.addEventListener('change', (e) => {
                this.toggleAPIMode(e.target.checked);
            });
        }

        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('news-card')) {
                e.target.click();
            }
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoRefresh();
            } else {
                this.resumeAutoRefresh();
            }
        });
    }

    async loadNews(category = 'all', page = 1, append = false, searchQuery = '') {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const container = document.getElementById('news-container');
        const loadMoreBtn = document.getElementById('load-more-btn');
        
        // Update button state
        if (loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Loading...';
        }
        
        if (!append) {
            this.showLoadingSkeletons();
        }

        try {
            let newsData;
            
            if (this.useRealAPI) {
                newsData = await this.fetchRealNews(category, page, searchQuery);
            } else {
                newsData = await this.fetchMockNews(category, page, searchQuery);
            }
            
            if (!append) {
                container.innerHTML = '';
                this.newsData = newsData;
            } else {
                this.newsData = [...this.newsData, ...newsData];
            }
            
            this.renderNews(newsData, append);
            this.hasMoreData = newsData.length > 0;
            
        } catch (error) {
            console.error('Error loading news:', error);
            this.showError('Failed to load news articles. Please try again.');
        } finally {
            this.isLoading = false;
            
            // Reset button state
            if (loadMoreBtn) {
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="bi bi-arrow-down-circle me-2"></i>Load More Articles';
                
                if (!this.hasMoreData) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'block';
                }
            }
        }
    }

    async fetchRealNews(category, page, searchQuery = '') {
        try {
            // Placeholder for real API integration
            // You would implement actual API calls here
            const apiKey = 'YOUR_NEWS_API_KEY';
            const baseUrl = 'https://newsapi.org/v2/everything';
            
            const params = new URLSearchParams({
                apiKey: apiKey,
                q: searchQuery || 'finance stock market',
                category: category === 'all' ? 'business' : category,
                pageSize: 6,
                page: page,
                sortBy: 'publishedAt'
            });
            
            const response = await fetch(`${baseUrl}?${params}`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            return data.articles.map(item => ({
                id: this.hashCode(item.url),
                title: item.title,
                excerpt: item.description || 'No description available.',
                category: this.categorizeNews(item.title + ' ' + item.description),
                source: item.source.name,
                image: item.urlToImage || `https://via.placeholder.com/400x200/007bff/ffffff?text=News`,
                publishedAt: new Date(item.publishedAt),
                url: item.url
            }));
            
        } catch (error) {
            console.error('Error fetching real news:', error);
            this.updateAPIStatus('error', 'Failed to fetch from API');
            // Fallback to mock data
            return this.fetchMockNews(category, page, searchQuery);
        }
    }

    async fetchMockNews(category, page, searchQuery = '') {
        const allMockData = [
            {
                id: 1,
                title: "Tech Stocks Rally as AI Breakthrough Drives Market Optimism",
                excerpt: "Major technology companies saw significant gains following announcements of breakthrough AI developments that could reshape multiple industries.",
                category: "stocks",
                source: "Financial Times",
                image: "https://via.placeholder.com/400x200/007bff/ffffff?text=Tech+News",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                url: "#"
            },
            {
                id: 2,
                title: "Federal Reserve Signals Potential Rate Changes in Next Quarter",
                excerpt: "Central bank officials hint at monetary policy adjustments as inflation data shows mixed signals across different sectors.",
                category: "economics",
                source: "Reuters",
                image: "https://via.placeholder.com/400x200/28a745/ffffff?text=Economics",
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
                url: "#"
            },
            {
                id: 3,
                title: "Cryptocurrency Market Sees Mixed Performance Amid Regulatory Updates",
                excerpt: "Bitcoin and Ethereum show divergent trends as new regulatory frameworks take effect in major markets worldwide.",
                category: "crypto",
                source: "CoinDesk",
                image: "https://via.placeholder.com/400x200/ffc107/ffffff?text=Crypto",
                publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                url: "#"
            },
            {
                id: 4,
                title: "Quarterly Earnings Beat Expectations for Major Retail Chains",
                excerpt: "Consumer spending resilience drives strong performance across retail sector despite economic headwinds and supply chain challenges.",
                category: "earnings",
                source: "Bloomberg",
                image: "https://via.placeholder.com/400x200/dc3545/ffffff?text=Earnings",
                publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
                url: "#"
            },
            {
                id: 5,
                title: "Global Markets React to Geopolitical Developments",
                excerpt: "International trade agreements and diplomatic developments create volatility across emerging and developed market indices.",
                category: "markets",
                source: "Wall Street Journal",
                image: "https://via.placeholder.com/400x200/6f42c1/ffffff?text=Markets",
                publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
                url: "#"
            },
            {
                id: 6,
                title: "Expert Analysis: Is the Current Bull Market Sustainable?",
                excerpt: "Financial analysts debate whether current market conditions can continue given economic indicators and historical patterns.",
                category: "analysis",
                source: "MarketWatch",
                image: "https://via.placeholder.com/400x200/20c997/ffffff?text=Analysis",
                publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
                url: "#"
            },
            {
                id: 7,
                title: "European Central Bank Maintains Dovish Stance on Interest Rates",
                excerpt: "ECB officials emphasize commitment to supporting economic recovery while monitoring inflation trends across eurozone countries.",
                category: "economics",
                source: "Financial Times",
                image: "https://via.placeholder.com/400x200/17a2b8/ffffff?text=ECB+News",
                publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
                url: "#"
            },
            {
                id: 8,
                title: "Energy Stocks Surge on New Oil Discovery Announcements",
                excerpt: "Major oil companies report significant new reserves discovered in offshore drilling operations, boosting sector confidence.",
                category: "stocks",
                source: "Energy Today",
                image: "https://via.placeholder.com/400x200/fd7e14/ffffff?text=Energy",
                publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
                url: "#"
            }
        ];

        // Filter by category
        let filteredData = category === 'all' ? allMockData : allMockData.filter(item => item.category === category);
        
        // Filter by search query
        if (searchQuery && searchQuery.length > 2) {
            filteredData = filteredData.filter(item => 
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.source.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Simulate pagination
        const itemsPerPage = 6;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return filteredData.slice(start, end);
    }

    renderNews(newsItems, append = false) {
        const container = document.getElementById('news-container');
        
        if (newsItems.length === 0 && !append) {
            this.showNoResults();
            return;
        }
        
        newsItems.forEach(item => {
            const newsCard = this.createNewsCard(item);
            container.appendChild(newsCard);
        });
        
        // Add animations
        this.animateNewsCards();
    }

    createNewsCard(item) {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-4';
        
        col.innerHTML = `
            <article class="news-card" onclick="this.openArticle('${item.url}')" tabindex="0" role="button" aria-label="Read article: ${item.title}">
                <img src="${item.image}" alt="${item.title}" class="news-image" loading="lazy" onerror="this.handleImageError(this)">
                <div class="news-content">
                    <span class="news-category ${item.category}">${this.formatCategory(item.category)}</span>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <div class="news-meta">
                        <div class="news-date">
                            <i class="bi bi-clock"></i>
                            <span>${this.formatDate(item.publishedAt)}</span>
                        </div>
                        <div class="news-source">${item.source}</div>
                    </div>
                </div>
            </article>
        `;
        
        // Add click handler
        const newsCard = col.querySelector('.news-card');
        newsCard.openArticle = (url) => {
            this.trackEvent('news_article_click', { 
                title: item.title, 
                category: item.category,
                source: item.source 
            });
            
            if (url === '#') {
                this.showComingSoon();
            } else {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        };
        
        newsCard.handleImageError = (img) => {
            img.src = `https://via.placeholder.com/400x200/6c757d/ffffff?text=${encodeURIComponent(item.category.toUpperCase())}`;
        };
        
        return col;
    }

    showLoadingSkeletons() {
        const container = document.getElementById('news-container');
        container.innerHTML = '';
        
        for (let i = 0; i < 6; i++) {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-4';
            col.innerHTML = `
                <div class="news-card">
                    <div class="loading-skeleton" style="height: 200px;"></div>
                    <div class="news-content">
                        <div class="loading-skeleton" style="height: 20px; width: 80px; margin-bottom: 1rem;"></div>
                        <div class="loading-skeleton" style="height: 24px; margin-bottom: 0.75rem;"></div>
                        <div class="loading-skeleton" style="height: 60px; margin-bottom: 1rem;"></div>
                        <div style="display: flex; justify-content: space-between;">
                            <div class="loading-skeleton" style="height: 16px; width: 100px;"></div>
                            <div class="loading-skeleton" style="height: 16px; width: 80px;"></div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        }
    }

    showNoResults() {
        const container = document.getElementById('news-container');
        container.innerHTML = `
            <div class="col-12">
                <div class="no-results">
                    <i class="bi bi-search"></i>
                    <h4>No articles found</h4>
                    <p>Try adjusting your search terms or category filter.</p>
                    <button class="btn btn-primary" onclick="location.reload()">Reset Filters</button>
                </div>
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('news-container');
        container.innerHTML = `
            <div class="col-12">
                <div class="error-message">
                    <i class="bi bi-exclamation-triangle"></i>
                    <h4>Error Loading News</h4>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
                </div>
            </div>
        `;
    }

    async loadTrendingNews() {
        const container = document.getElementById('trending-container');
        
        try {
            // Mock trending data
            const trendingItems = [
                "Market volatility reaches new highs amid uncertainty",
                "Tech giants report record quarterly revenues",
                "Central bank policy changes expected next month",
                "Energy sector shows strong recovery signals",
                "Emerging markets attract increased investment"
            ];
            
            container.innerHTML = '';
            trendingItems.forEach((item, index) => {
                const trendingElement = document.createElement('a');
                trendingElement.href = '#';
                trendingElement.className = 'trending-item';
                trendingElement.setAttribute('role', 'button');
                trendingElement.setAttribute('tabindex', '0');
                trendingElement.innerHTML = `
                    <div class="trending-number">${index + 1}</div>
                    <div class="trending-text">${item}</div>
                `;
                
                trendingElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.trackEvent('trending_click', { item: item, position: index + 1 });
                    this.showComingSoon();
                });
                
                container.appendChild(trendingElement);
            });
        } catch (error) {
            console.error('Error loading trending news:', error);
        }
    }

    async loadMarketSummary() {
        const container = document.getElementById('market-summary');
        
        try {
            let marketData;
            
            if (this.useRealAPI) {
                marketData = await this.fetchRealMarketData();
            } else {
                // Mock market data
                marketData = [
                    { name: 'S&P 500', value: '4,567.89', change: '+1.23%', positive: true },
                    { name: 'NASDAQ', value: '14,234.56', change: '-0.67%', positive: false },
                    { name: 'DOW', value: '34,567.12', change: '+0.89%', positive: true },
                    { name: 'FTSE 100', value: '7,456.78', change: '+0.45%', positive: true }
                ];
            }
            
            container.innerHTML = '';
            marketData.forEach(item => {
                const marketItem = document.createElement('div');
                marketItem.className = 'market-summary-item';
                marketItem.innerHTML = `
                    <div>
                        <div class="market-name">${item.name}</div>
                        <div class="market-value">${item.value}</div>
                    </div>
                    <div class="market-change ${item.positive ? 'positive' : 'negative'}">
                        ${item.change}
                    </div>
                `;
                container.appendChild(marketItem);
            });
        } catch (error) {
            console.error('Error loading market summary:', error);
        }
    }

    async fetchRealMarketData() {
        try {
            // Placeholder for real market data API
            const symbols = ['SPY', 'QQQ', 'DIA', 'VTI'];
            
            const promises = symbols.map(async (symbol) => {
                // Mock API response
                const price = (Math.random() * 500 + 100).toFixed(2);
                const change = ((Math.random() - 0.5) * 10).toFixed(2);
                
                return {
                    name: symbol,
                    value: price,
                    change: `${change >= 0 ? '+' : ''}${change}%`,
                    positive: change >= 0
                };
            });
            
            return await Promise.all(promises);
            
        } catch (error) {
            console.error('Error fetching real market data:', error);
            throw error;
        }
    }

    handleCategoryFilter(target) {
        // Update active state
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        target.classList.add('active');
        
        // Get category and load news
        this.currentCategory = target.dataset.category;
        this.currentPage = 1;
        this.hasMoreData = true;
        
        // Track filter usage
        this.trackEvent('category_filter', { category: this.currentCategory });
        
        this.loadNews(this.currentCategory, this.currentPage, false, this.currentSearchQuery);
    }

    handleSearch(query) {
        this.currentSearchQuery = query;
        this.currentPage = 1;
        this.hasMoreData = true;
        
        if (query.length > 2) {
            this.trackEvent('news_search', { query: query });
            this.loadNews(this.currentCategory, this.currentPage, false, query);
        } else if (query.length === 0) {
            this.loadNews(this.currentCategory, this.currentPage, false, '');
        }
    }

    loadMoreNews() {
        this.currentPage++;
        this.loadNews(this.currentCategory, this.currentPage, true, this.currentSearchQuery);
    }

    toggleAPIMode(useReal) {
        this.useRealAPI = useReal;
        
        if (useReal) {
            this.updateAPIStatus('loading', 'Switching to real APIs...');
            
            // Test API connection
            this.testAPIConnection().then(success => {
                if (success) {
                    this.updateAPIStatus('success', 'Connected to real APIs');
                    this.loadNews(this.currentCategory, 1, false, this.currentSearchQuery);
                    this.loadMarketSummary();
                } else {
                    this.updateAPIStatus('error', 'API connection failed - using mock data');
                    this.useRealAPI = false;
                    document.getElementById('use-real-api').checked = false;
                }
            });
        } else {
            this.updateAPIStatus('', 'Currently using mock data');
            this.loadNews(this.currentCategory, 1, false, this.currentSearchQuery);
            this.loadMarketSummary();
        }
    }

    async testAPIConnection() {
        try {
            // Test with a simple API call
            const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
            return response.ok;
        } catch (error) {
            console.error('API test failed:', error);
            return false;
        }
    }

    updateAPIStatus(type, message) {
        const statusElement = document.getElementById('api-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `small api-status ${type}`;
        }
    }

    updateAuthContent() {
        const isAuthenticated = !!localStorage.getItem('yausma_user_token');
        
        // Show/hide auth-specific elements
        document.querySelectorAll('[data-auth-required]').forEach(el => {
            el.style.display = isAuthenticated ? 'block' : 'none';
        });
        
        document.querySelectorAll('[data-auth-anonymous]').forEach(el => {
            el.style.display = isAuthenticated ? 'none' : 'block';
        });
        
        // Update navigation
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const portfolioLink = document.getElementById('portfolio-link');
        
        if (isAuthenticated) {
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (portfolioLink) portfolioLink.style.display = 'block';
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            if (portfolioLink) portfolioLink.style.display = 'none';
        }
    }

    showBreakingNews() {
        const isAuthenticated = !!localStorage.getItem('yausma_user_token');
        if (isAuthenticated) {
            const breakingAlert = document.getElementById('breaking-news-alert');
            if (breakingAlert) {
                breakingAlert.style.display = 'block';
                
                // Simulate random alert count
                const alertCount = Math.floor(Math.random() * 5) + 1;
                const alertCountEl = document.getElementById('alert-count');
                if (alertCountEl) {
                    alertCountEl.textContent = alertCount;
                }
            }
        }
    }

    animateNewsCards() {
        // Add entrance animations
        const cards = document.querySelectorAll('.news-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    startAutoRefresh() {
        const isAuthenticated = !!localStorage.getItem('yausma_user_token');
        
        if (isAuthenticated) {
            this.refreshInterval = setInterval(() => {
                this.refreshBreakingNews();
            }, 5 * 60 * 1000); // Refresh every 5 minutes
            
            this.marketUpdateInterval = setInterval(() => {
                this.loadMarketSummary();
            }, 30 * 1000); // Update market data every 30 seconds
        }
    }

    pauseAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        if (this.marketUpdateInterval) {
            clearInterval(this.marketUpdateInterval);
        }
    }

    resumeAutoRefresh() {
        this.startAutoRefresh();
    }

    async refreshBreakingNews() {
        try {
            const hasNewAlerts = Math.random() > 0.7; // 30% chance of new alerts
            
            if (hasNewAlerts) {
                const alertCount = Math.floor(Math.random() * 3) + 1;
                const alertElement = document.getElementById('alert-count');
                if (alertElement) {
                    alertElement.textContent = alertCount;
                    
                    // Add a subtle animation to indicate new alerts
                    const alertContainer = document.getElementById('breaking-news-alert');
                    if (alertContainer) {
                        alertContainer.style.animation = 'pulse 0.5s ease-in-out';
                        setTimeout(() => {
                            alertContainer.style.animation = '';
                        }, 500);
                    }
                }
            }
        } catch (error) {
            console.error('Error refreshing breaking news:', error);
        }
    }

    // Utility methods
    formatDate(date) {
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    categorizeNews(text) {
        const categories = {
            'crypto': ['bitcoin', 'ethereum', 'cryptocurrency', 'blockchain'],
            'stocks': ['stock', 'share', 'equity', 'dividend'],
            'economics': ['federal reserve', 'inflation', 'gdp', 'economic'],
            'earnings': ['earnings', 'revenue', 'profit', 'quarterly'],
            'markets': ['market', 'trading', 'index', 'dow', 'nasdaq', 's&p']
        };
        
        const lowerText = text.toLowerCase();
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                return category;
            }
        }
        
        return 'analysis';
    }

    hashCode(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    showComingSoon() {
        alert('This feature is coming soon! Stay tuned for updates.');
    }

    showSuccessMessage(message) {
        const container = document.getElementById('error-container');
        if (container) {
            container.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
            container.textContent = message;
            container.style.display = 'block';
            container.style.zIndex = '9999';
            
            setTimeout(() => {
                container.style.display = 'none';
            }, 3000);
        }
    }

    showErrorMessage(message) {
        const container = document.getElementById('error-container');
        if (container) {
            container.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
            container.textContent = message;
            container.style.display = 'block';
            container.style.zIndex = '9999';
            
            setTimeout(() => {
                container.style.display = 'none';
            }, 3000);
        }
    }

    trackEvent(eventName, properties = {}) {
        // Analytics tracking
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
        this.pauseAutoRefresh();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        
        console.log('News page destroyed');
    }
}

// Initialize news page when DOM is ready
let newsPageInstance;

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Load saved theme
        const savedTheme = localStorage.getItem('yausma_theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            themeStylesheet.href = `../css/themes/${savedTheme}.css`;
        }
        
        // Initialize news page
        newsPageInstance = new NewsPage();
        
    } catch (error) {
        console.error('Failed to initialize news page:', error);
        
        // Fallback error display
        const container = document.getElementById('news-container');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <h4>Error Loading News</h4>
                        <p>We're having trouble loading the news feed. Please refresh the page to try again.</p>
                        <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                    </div>
                </div>
            `;
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (newsPageInstance) {
        newsPageInstance.destroy();
    }
});

// Global logout handler
window.handleLogout = () => {
    localStorage.removeItem('yausma_user_token');
    localStorage.removeItem('yausma_user_data');
    
    // Update UI
    if (newsPageInstance) {
        newsPageInstance.updateAuthContent();
    }
    
    // Redirect to home page
    window.location.href = '../index.html';
};

// Enhanced search functionality with suggestions
class NewsSearchEnhancer {
    constructor(newsPage) {
        this.newsPage = newsPage;
        this.searchInput = document.getElementById('newsSearch');
        this.suggestions = [
            'Federal Reserve', 'Stock Market', 'Cryptocurrency', 'Tech Earnings',
            'Oil Prices', 'Interest Rates', 'Market Volatility', 'Economic Indicators',
            'Bitcoin', 'Ethereum', 'Apple', 'Tesla', 'Amazon', 'Google', 'Microsoft'
        ];
        this.initializeSearchEnhancements();
    }

    initializeSearchEnhancements() {
        if (!this.searchInput) return;

        // Create suggestions dropdown
        this.createSuggestionsDropdown();
        
        // Enhanced search with autocomplete
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    createSuggestionsDropdown() {
        const wrapper = document.createElement('div');
        wrapper.className = 'position-relative';
        this.searchInput.parentNode.insertBefore(wrapper, this.searchInput);
        wrapper.appendChild(this.searchInput);

        this.suggestionsDropdown = document.createElement('div');
        this.suggestionsDropdown.className = 'search-suggestions position-absolute w-100 bg-white border rounded shadow-sm';
        this.suggestionsDropdown.style.display = 'none';
        this.suggestionsDropdown.style.zIndex = '1000';
        this.suggestionsDropdown.style.top = '100%';
        wrapper.appendChild(this.suggestionsDropdown);
    }

    handleSearchInput(query) {
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        const matchingSuggestions = this.suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (matchingSuggestions.length > 0) {
            this.showSuggestions(matchingSuggestions, query);
        } else {
            this.hideSuggestions();
        }
    }

    showSuggestions(suggestions, query) {
        this.suggestionsDropdown.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'search-suggestion-item p-2 cursor-pointer';
            item.style.cursor = 'pointer';
            
            // Highlight matching text
            const highlightedText = suggestion.replace(
                new RegExp(query, 'gi'),
                `<mark>    } catch (error) {
        console.error('Faile</mark>`
            );
            item.innerHTML = highlightedText;
            
            item.addEventListener('click', () => {
                this.searchInput.value = suggestion;
                this.newsPage.handleSearch(suggestion);
                this.hideSuggestions();
            });
            
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f8f9fa';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });
            
            this.suggestionsDropdown.appendChild(item);
        });
        
        this.suggestionsDropdown.style.display = 'block';
    }

    hideSuggestions() {
        this.suggestionsDropdown.style.display = 'none';
    }
}

// Enhanced bookmark functionality
class NewsBookmarkManager {
    constructor() {
        this.bookmarks = JSON.parse(localStorage.getItem('yausma_bookmarks') || '[]');
        this.initializeBookmarkSystem();
    }

    initializeBookmarkSystem() {
        // Add bookmark buttons to news cards
        this.addBookmarkButtons();
        
        // Listen for new news cards being added
        const observer = new MutationObserver(() => {
            this.addBookmarkButtons();
        });
        
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            observer.observe(newsContainer, { childList: true, subtree: true });
        }
    }

    addBookmarkButtons() {
        const newsCards = document.querySelectorAll('.news-card:not([data-bookmark-added])');
        
        newsCards.forEach(card => {
            const newsContent = card.querySelector('.news-content');
            if (newsContent) {
                const bookmarkBtn = document.createElement('button');
                bookmarkBtn.className = 'btn btn-outline-secondary btn-sm bookmark-btn position-absolute top-0 end-0 m-2';
                bookmarkBtn.style.zIndex = '10';
                bookmarkBtn.innerHTML = '<i class="bi bi-bookmark"></i>';
                bookmarkBtn.title = 'Bookmark this article';
                
                // Get article ID from title (simple hash)
                const title = card.querySelector('.news-title')?.textContent;
                const articleId = this.hashCode(title || '');
                bookmarkBtn.dataset.articleId = articleId;
                
                // Check if already bookmarked
                if (this.bookmarks.includes(articleId)) {
                    bookmarkBtn.innerHTML = '<i class="bi bi-bookmark-fill"></i>';
                    bookmarkBtn.classList.add('bookmarked');
                }
                
                bookmarkBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleBookmark(articleId, bookmarkBtn);
                });
                
                card.style.position = 'relative';
                card.appendChild(bookmarkBtn);
                card.setAttribute('data-bookmark-added', 'true');
            }
        });
    }

    toggleBookmark(articleId, button) {
        const isAuthenticated = !!localStorage.getItem('yausma_user_token');
        
        if (!isAuthenticated) {
            alert('Please sign in to bookmark articles.');
            return;
        }
        
        const isBookmarked = this.bookmarks.includes(articleId);
        
        if (isBookmarked) {
            this.bookmarks = this.bookmarks.filter(id => id !== articleId);
            button.innerHTML = '<i class="bi bi-bookmark"></i>';
            button.classList.remove('bookmarked');
            this.showMessage('Article removed from bookmarks');
        } else {
            this.bookmarks.push(articleId);
            button.innerHTML = '<i class="bi bi-bookmark-fill"></i>';
            button.classList.add('bookmarked');
            this.showMessage('Article bookmarked!');
        }
        
        localStorage.setItem('yausma_bookmarks', JSON.stringify(this.bookmarks));
    }

    hashCode(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    showMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'toast position-fixed bottom-0 end-0 m-3';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove toast
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Advanced filtering system
class NewsFilterManager {
    constructor(newsPage) {
        this.newsPage = newsPage;
        this.activeFilters = {
            category: 'all',
            dateRange: 'all',
            source: 'all'
        };
        this.initializeAdvancedFilters();
    }

    initializeAdvancedFilters() {
        this.createAdvancedFilterPanel();
        this.initializeFilterControls();
    }

    createAdvancedFilterPanel() {
        const filterContainer = document.querySelector('.filter-chips').parentElement;
        
        const advancedPanel = document.createElement('div');
        advancedPanel.className = 'advanced-filters bg-light p-3 rounded mb-4';
        advancedPanel.style.display = 'none';
        advancedPanel.innerHTML = `
            <div class="row g-3">
                <div class="col-md-4">
                    <label class="form-label">Date Range</label>
                    <select class="form-select" id="date-filter">
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Source</label>
                    <select class="form-select" id="source-filter">
                        <option value="all">All Sources</option>
                        <option value="reuters">Reuters</option>
                        <option value="bloomberg">Bloomberg</option>
                        <option value="wsj">Wall Street Journal</option>
                        <option value="ft">Financial Times</option>
                    </select>
                </div>
                <div class="col-md-4 d-flex align-items-end">
                    <button class="btn btn-primary me-2" id="apply-filters">Apply</button>
                    <button class="btn btn-outline-secondary" id="reset-filters">Reset</button>
                </div>
            </div>
        `;
        
        filterContainer.appendChild(advancedPanel);
        
        // Add toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn btn-outline-primary btn-sm mb-3';
        toggleBtn.innerHTML = '<i class="bi bi-funnel"></i> Advanced Filters';
        toggleBtn.addEventListener('click', () => {
            const isVisible = advancedPanel.style.display !== 'none';
            advancedPanel.style.display = isVisible ? 'none' : 'block';
            toggleBtn.innerHTML = `<i class="bi bi-funnel"></i> ${isVisible ? 'Advanced' : 'Hide'} Filters`;
        });
        
        filterContainer.insertBefore(toggleBtn, advancedPanel);
    }

    initializeFilterControls() {
        const applyBtn = document.getElementById('apply-filters');
        const resetBtn = document.getElementById('reset-filters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyAdvancedFilters();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    applyAdvancedFilters() {
        const dateFilter = document.getElementById('date-filter')?.value || 'all';
        const sourceFilter = document.getElementById('source-filter')?.value || 'all';
        
        this.activeFilters.dateRange = dateFilter;
        this.activeFilters.source = sourceFilter;
        
        // Apply filters to news page
        this.newsPage.currentPage = 1;
        this.newsPage.hasMoreData = true;
        this.newsPage.loadNews(this.newsPage.currentCategory, 1, false, this.newsPage.currentSearchQuery);
        
        // Track filter usage
        this.newsPage.trackEvent('advanced_filter_applied', this.activeFilters);
    }

    resetFilters() {
        this.activeFilters = {
            category: 'all',
            dateRange: 'all',
            source: 'all'
        };
        
        // Reset UI
        document.getElementById('date-filter').value = 'all';
        document.getElementById('source-filter').value = 'all';
        
        // Reset category chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector('.filter-chip[data-category="all"]')?.classList.add('active');
        
        // Reload news
        this.newsPage.currentCategory = 'all';
        this.newsPage.currentPage = 1;
        this.newsPage.hasMoreData = true;
        this.newsPage.loadNews('all', 1, false, '');
    }
}

// News sharing functionality
class NewsShareManager {
    static shareArticle(article) {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt,
                url: article.url
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback to clipboard
            const shareText = `${article.title}\n\n${article.excerpt}\n\nRead more: ${article.url}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Article link copied to clipboard!');
            }).catch(() => {
                alert('Failed to copy article link.');
            });
        }
    }

    static addShareButtons() {
        const newsCards = document.querySelectorAll('.news-card:not([data-share-added])');
        
        newsCards.forEach(card => {
            const meta = card.querySelector('.news-meta');
            if (meta) {
                const shareBtn = document.createElement('button');
                shareBtn.className = 'btn btn-link btn-sm p-0 text-muted';
                shareBtn.innerHTML = '<i class="bi bi-share"></i>';
                shareBtn.title = 'Share this article';
                
                shareBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    const article = {
                        title: card.querySelector('.news-title')?.textContent,
                        excerpt: card.querySelector('.news-excerpt')?.textContent,
                        url: window.location.href
                    };
                    
                    NewsShareManager.shareArticle(article);
                });
                
                meta.appendChild(shareBtn);
                card.setAttribute('data-share-added', 'true');
            }
        });
    }
}

// Initialize enhanced features after news page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (newsPageInstance) {
            // Initialize search enhancer
            new NewsSearchEnhancer(newsPageInstance);
            
            // Initialize bookmark manager
            new NewsBookmarkManager();
            
            // Initialize filter manager
            new NewsFilterManager(newsPageInstance);
            
            // Add share buttons
            NewsShareManager.addShareButtons();
            
            // Re-add share buttons when new content loads
            const observer = new MutationObserver(() => {
                NewsShareManager.addShareButtons();
            });
            
            const newsContainer = document.getElementById('news-container');
            if (newsContainer) {
                observer.observe(newsContainer, { childList: true, subtree: true });
            }
        }
    }, 1000);
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NewsPage, NewsSearchEnhancer, NewsBookmarkManager, NewsFilterManager, NewsShareManager };
}