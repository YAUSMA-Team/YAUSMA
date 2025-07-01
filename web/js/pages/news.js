/**
 * YAUSMA News Page JavaScript
 * Handles news article display, filtering, search, and interactions
 */

class NewsManager {
    constructor() {
        this.currentPage = 1;
        this.articlesPerPage = 5;
        this.currentCategory = 'all';
        this.currentSort = 'latest';
        this.searchQuery = '';
        this.allArticles = [];
        this.filteredArticles = [];
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.generateMockNewsData();
        this.bindEvents();
        this.loadNews();
        this.setupStickyFilters();
        this.setupInfiniteScroll();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('newsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterAndDisplayNews();
            }, 300));
        }

        // Category filters
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                this.setActiveCategory(e.target.dataset.category);
                this.filterAndDisplayNews();
            });
        });

        // Sort options
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveSort(e.target.dataset.sort);
                this.filterAndDisplayNews();
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
        }

        // Share buttons (event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('share-btn')) {
                this.handleShare(e);
            }
        });

        // Read more buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('read-more-btn')) {
                this.handleReadMore(e);
            }
        });
    }

    generateMockNewsData() {
        const categories = ['markets', 'stocks', 'crypto', 'earnings', 'economy', 'politics', 'tech'];
        const sources = [
            { name: 'Reuters', logo: '=ð' },
            { name: 'Bloomberg', logo: '=Ê' },
            { name: 'CNBC', logo: '=ú' },
            { name: 'Financial Times', logo: '=È' },
            { name: 'Wall Street Journal', logo: '=Ä' },
            { name: 'MarketWatch', logo: '' },
            { name: 'Yahoo Finance', logo: '=°' }
        ];

        const newsData = [
            {
                id: 1,
                title: "Federal Reserve Signals Potential Rate Cuts as Inflation Shows Signs of Cooling",
                excerpt: "Fed Chair Jerome Powell indicated that the central bank may consider lowering interest rates if inflation continues its downward trend, marking a significant shift in monetary policy stance.",
                category: "economy",
                source: sources[0],
                image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                readTime: 4,
                trending: true,
                featured: true
            },
            {
                id: 2,
                title: "S&P 500 Reaches New All-Time High Amid Strong Corporate Earnings",
                excerpt: "The benchmark index surged 1.2% to close at a record high, driven by better-than-expected quarterly results from major technology companies.",
                category: "markets",
                source: sources[1],
                image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                readTime: 3,
                trending: true,
                featured: true
            },
            {
                id: 3,
                title: "Tesla Stock Jumps 8% on Record Q4 Vehicle Deliveries",
                excerpt: "The electric vehicle manufacturer reported delivering 484,000 vehicles in the fourth quarter, beating analyst expectations and sending shares soaring in after-hours trading.",
                category: "stocks",
                source: sources[2],
                image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                readTime: 5,
                trending: true
            },
            {
                id: 4,
                title: "Bitcoin Surges Past $45,000 as Institutional Adoption Accelerates",
                excerpt: "The world's largest cryptocurrency gained 12% this week following announcements from major corporations about Bitcoin treasury adoptions and payment integrations.",
                category: "crypto",
                source: sources[3],
                image: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
                readTime: 4,
                trending: true
            },
            {
                id: 5,
                title: "Apple Reports Record Q4 Revenue Despite Supply Chain Challenges",
                excerpt: "The tech giant posted quarterly revenue of $123.9 billion, up 11% year-over-year, with strong iPhone sales offsetting production delays.",
                category: "earnings",
                source: sources[4],
                image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
                readTime: 6,
                trending: true
            },
            {
                id: 6,
                title: "AI Stocks Lead Technology Sector Rally Amid ChatGPT Success",
                excerpt: "Artificial intelligence companies saw significant gains as investors bet on the transformative potential of generative AI technologies across industries.",
                category: "tech",
                source: sources[5],
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
                readTime: 4
            },
            {
                id: 7,
                title: "Oil Prices Rise on OPEC+ Production Cut Announcement",
                excerpt: "Crude oil futures jumped 3.5% after OPEC+ announced plans to extend production cuts through the second quarter, supporting higher energy prices.",
                category: "markets",
                source: sources[6],
                image: "https://images.unsplash.com/photo-1615364937620-4853f5c82e5c?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
                readTime: 3
            },
            {
                id: 8,
                title: "Microsoft Beats Earnings Expectations with Cloud Revenue Growth",
                excerpt: "The software giant reported a 27% increase in Azure cloud revenue, demonstrating strong demand for enterprise cloud services and AI capabilities.",
                category: "earnings",
                source: sources[0],
                image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
                readTime: 5
            },
            {
                id: 9,
                title: "Gold Hits Six-Month High as Dollar Weakens",
                excerpt: "Precious metals rallied as the US dollar declined against major currencies, with gold futures reaching their highest level since July.",
                category: "markets",
                source: sources[1],
                image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
                readTime: 3
            },
            {
                id: 10,
                title: "European Central Bank Maintains Hawkish Stance on Inflation",
                excerpt: "ECB President Christine Lagarde emphasized the need for continued vigilance against inflation risks, suggesting rates may remain elevated longer than expected.",
                category: "politics",
                source: sources[2],
                image: "https://images.unsplash.com/photo-1586497019160-0b2b8b7a8f8c?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
                readTime: 4
            },
            {
                id: 11,
                title: "Nvidia Stock Soars on AI Chip Demand Surge",
                excerpt: "The semiconductor company's shares reached new highs as data center demand for AI processors continues to accelerate across the technology sector.",
                category: "stocks",
                source: sources[3],
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
                readTime: 4
            },
            {
                id: 12,
                title: "Ethereum Upgrade Promises Lower Transaction Fees",
                excerpt: "The blockchain network's latest protocol upgrade aims to reduce gas fees by up to 50%, potentially boosting adoption of decentralized applications.",
                category: "crypto",
                source: sources[4],
                image: "https://images.unsplash.com/photo-1639762681485-074bfd8d7ffc?w=600&h=300&fit=crop",
                publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                readTime: 5
            }
        ];

        this.allArticles = newsData;
        this.filteredArticles = [...this.allArticles];
    }

    setActiveCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        
        // Update UI
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
    }

    setActiveSort(sort) {
        this.currentSort = sort;
        this.currentPage = 1;
        
        // Update UI
        document.querySelectorAll('.sort-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-sort="${sort}"]`).classList.add('active');
    }

    filterAndDisplayNews() {
        // Filter by category
        let filtered = this.currentCategory === 'all' 
            ? [...this.allArticles]
            : this.allArticles.filter(article => article.category === this.currentCategory);

        // Filter by search query
        if (this.searchQuery) {
            filtered = filtered.filter(article => 
                article.title.toLowerCase().includes(this.searchQuery) ||
                article.excerpt.toLowerCase().includes(this.searchQuery) ||
                article.category.toLowerCase().includes(this.searchQuery)
            );
        }

        // Sort articles
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'latest':
                    return new Date(b.publishedAt) - new Date(a.publishedAt);
                case 'trending':
                    return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || 
                           new Date(b.publishedAt) - new Date(a.publishedAt);
                case 'popular':
                    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
                           new Date(b.publishedAt) - new Date(a.publishedAt);
                default:
                    return new Date(b.publishedAt) - new Date(a.publishedAt);
            }
        });

        this.filteredArticles = filtered;
        this.currentPage = 1;
        this.displayNews();
    }

    loadNews() {
        this.showLoading();
        
        // Simulate API call delay
        setTimeout(() => {
            this.hideLoading();
            this.filterAndDisplayNews();
        }, 1000);
    }

    displayNews() {
        const container = document.getElementById('newsContainer');
        if (!container) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

        container.innerHTML = '';

        if (articlesToShow.length === 0) {
            container.innerHTML = this.createNoResultsMessage();
            return;
        }

        articlesToShow.forEach((article, index) => {
            const articleElement = this.createNewsCard(article, index < 2);
            container.appendChild(articleElement);
        });

        // Update load more button visibility
        this.updateLoadMoreButton();
        
        // Animate new articles
        this.animateNewArticles();
    }

    createNewsCard(article, isFeatured = false) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `news-card ${!isFeatured ? 'compact' : ''} fade-in`;
        cardDiv.dataset.articleId = article.id;

        const timeAgo = this.getTimeAgo(article.publishedAt);
        const categoryCapitalized = article.category.charAt(0).toUpperCase() + article.category.slice(1);

        if (isFeatured) {
            cardDiv.innerHTML = `
                <div class="news-card-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    <div class="news-card-category">${categoryCapitalized}</div>
                </div>
                <div class="news-card-content">
                    <div class="news-card-header">
                        <h2 class="news-card-title">
                            <a href="#" data-article-id="${article.id}">${article.title}</a>
                        </h2>
                        <p class="news-card-excerpt">${article.excerpt}</p>
                    </div>
                    <div class="news-card-meta">
                        <div class="news-card-source">
                            <div class="source-logo">${article.source.logo}</div>
                            <span>${article.source.name}</span>
                        </div>
                        <div class="news-card-time">
                            <i class="bi bi-clock"></i>
                            <span>${timeAgo}</span>
                            <span class="read-time">" ${article.readTime} min read</span>
                        </div>
                    </div>
                    <div class="news-card-actions">
                        <button class="read-more-btn" data-article-id="${article.id}">
                            Read Full Article
                            <i class="bi bi-arrow-right"></i>
                        </button>
                        <div class="share-buttons">
                            <button class="share-btn" data-share="twitter" data-article-id="${article.id}" title="Share on Twitter">
                                <i class="bi bi-twitter"></i>
                            </button>
                            <button class="share-btn" data-share="linkedin" data-article-id="${article.id}" title="Share on LinkedIn">
                                <i class="bi bi-linkedin"></i>
                            </button>
                            <button class="share-btn" data-share="copy" data-article-id="${article.id}" title="Copy Link">
                                <i class="bi bi-link-45deg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            cardDiv.innerHTML = `
                <div class="news-card-content">
                    <div class="news-card-image">
                        <img src="${article.image}" alt="${article.title}" loading="lazy">
                    </div>
                    <div class="news-card-text">
                        <div class="news-card-category">${categoryCapitalized}</div>
                        <h3 class="news-card-title">
                            <a href="#" data-article-id="${article.id}">${article.title}</a>
                        </h3>
                        <p class="news-card-excerpt">${article.excerpt}</p>
                        <div class="news-card-meta">
                            <div class="news-card-source">
                                <div class="source-logo">${article.source.logo}</div>
                                <span>${article.source.name}</span>
                            </div>
                            <div class="news-card-time">
                                <i class="bi bi-clock"></i>
                                <span>${timeAgo}</span>
                                <span class="read-time">" ${article.readTime} min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        return cardDiv;
    }

    createNoResultsMessage() {
        return `
            <div class="no-results-message text-center py-5">
                <i class="bi bi-search display-1 text-muted mb-3"></i>
                <h3 class="section-heading">No articles found</h3>
                <p class="body-text text-muted">
                    ${this.searchQuery ? 
                        `No articles match your search for "${this.searchQuery}".` : 
                        'No articles found for the selected category.'
                    }
                </p>
                <button class="btn btn-coinbase-secondary mt-3" onclick="newsManager.clearFilters()">
                    <i class="bi bi-arrow-counterclockwise me-2"></i>Clear Filters
                </button>
            </div>
        `;
    }

    loadMoreArticles() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        // Update button state
        loadMoreBtn.innerHTML = `
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            Loading...
        `;
        loadMoreBtn.disabled = true;

        // Simulate loading delay
        setTimeout(() => {
            this.currentPage++;
            this.displayNews();
            this.isLoading = false;
            
            // Reset button
            loadMoreBtn.innerHTML = `
                <i class="bi bi-arrow-down-circle me-2"></i>Load More Articles
            `;
            loadMoreBtn.disabled = false;
        }, 800);
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const loadMoreContainer = document.querySelector('.load-more-container');
        
        if (!loadMoreBtn || !loadMoreContainer) return;

        const hasMoreArticles = this.currentPage * this.articlesPerPage < this.filteredArticles.length;
        loadMoreContainer.style.display = hasMoreArticles ? 'block' : 'none';
    }

    showLoading() {
        const loadingElement = document.getElementById('newsLoading');
        const containerElement = document.getElementById('newsContainer');
        
        if (loadingElement) loadingElement.style.display = 'block';
        if (containerElement) containerElement.style.display = 'none';
    }

    hideLoading() {
        const loadingElement = document.getElementById('newsLoading');
        const containerElement = document.getElementById('newsContainer');
        
        if (loadingElement) loadingElement.style.display = 'none';
        if (containerElement) containerElement.style.display = 'block';
    }

    animateNewArticles() {
        const newsCards = document.querySelectorAll('.news-card.fade-in');
        newsCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupStickyFilters() {
        const filtersSection = document.querySelector('.news-filters-section');
        if (!filtersSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    filtersSection.classList.remove('scrolled');
                } else {
                    filtersSection.classList.add('scrolled');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(document.querySelector('.news-header-section'));
    }

    setupInfiniteScroll() {
        // Optional: Enable infinite scroll on mobile
        if (window.innerWidth <= 768) {
            let isScrolling = false;
            
            window.addEventListener('scroll', () => {
                if (isScrolling || this.isLoading) return;
                
                const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
                
                if (scrollTop + clientHeight >= scrollHeight - 1000) {
                    isScrolling = true;
                    
                    if (this.currentPage * this.articlesPerPage < this.filteredArticles.length) {
                        this.loadMoreArticles();
                    }
                    
                    setTimeout(() => {
                        isScrolling = false;
                    }, 1000);
                }
            });
        }
    }

    handleShare(event) {
        event.preventDefault();
        const shareType = event.target.dataset.share || event.target.parentElement.dataset.share;
        const articleId = event.target.dataset.articleId || event.target.parentElement.dataset.articleId;
        const article = this.allArticles.find(a => a.id == articleId);
        
        if (!article) return;

        const url = `${window.location.origin}${window.location.pathname}#article-${articleId}`;
        const title = article.title;
        const text = article.excerpt;

        switch (shareType) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    this.showToast('Link copied to clipboard!');
                }).catch(() => {
                    this.showToast('Failed to copy link');
                });
                break;
        }
    }

    handleReadMore(event) {
        event.preventDefault();
        const articleId = event.target.dataset.articleId;
        
        // In a real app, this would navigate to the full article
        this.showToast('Full article would open here');
        
        // Track reading engagement
        this.trackArticleClick(articleId);
    }

    handleNewsletterSubmit(event) {
        event.preventDefault();
        const emailInput = event.target.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (!this.isValidEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = `
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            Subscribing...
        `;
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.showToast('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    clearFilters() {
        this.searchQuery = '';
        this.currentCategory = 'all';
        this.currentSort = 'latest';
        this.currentPage = 1;
        
        // Reset UI
        document.getElementById('newsSearch').value = '';
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.classList.remove('active');
        });
        document.querySelector('[data-category="all"]').classList.add('active');
        
        document.querySelectorAll('.sort-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('[data-sort="latest"]').classList.add('active');
        
        this.filterAndDisplayNews();
    }

    // Utility methods
    getTimeAgo(date) {
        const now = new Date();
        const diffInMs = now - new Date(date);
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return `${diffInMinutes} min ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add toast styles if not already present
        if (!document.querySelector('#toast-styles')) {
            const toastStyles = document.createElement('style');
            toastStyles.id = 'toast-styles';
            toastStyles.textContent = `
                .toast-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--card-background);
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                    padding: var(--space-md);
                    box-shadow: var(--shadow-lg);
                    z-index: var(--z-tooltip);
                    animation: slideInRight 0.3s ease-out;
                    min-width: 250px;
                }
                .toast-success { border-left: 4px solid var(--success-green); }
                .toast-error { border-left: 4px solid var(--error-red); }
                .toast-info { border-left: 4px solid var(--interactive-blue); }
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    color: var(--text-primary);
                    font-size: var(--font-size-sm);
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(toastStyles);
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    trackArticleClick(articleId) {
        // In a real app, this would send analytics data
        console.log(`Article ${articleId} clicked`);
    }
}

// CSS for initial fade-in animation
const style = document.createElement('style');
style.textContent = `
    .news-card.fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }
`;
document.head.appendChild(style);

// Initialize news manager when DOM is loaded
let newsManager;

document.addEventListener('DOMContentLoaded', () => {
    newsManager = new NewsManager();
});

// Export for global access
window.newsManager = newsManager;