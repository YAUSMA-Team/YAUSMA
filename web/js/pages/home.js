// YAUSMA Home Page JavaScript - Coinbase-Inspired Interactions

class HomePage {
    constructor() {
        this.charts = {};
        this.animations = new Map();
        this.isVisible = true;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.setupScrollAnimations();
        this.setupMarketTabs();
        this.startRealTimeSimulation();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.handleThemeToggle.bind(this));
        }

        // Mobile navigation
        this.setupMobileNavigation();

        // Market card hover effects
        this.setupMarketCardInteractions();

        // Feature card animations
        this.setupFeatureCardAnimations();

        // Smooth scrolling for CTA buttons
        this.setupSmoothScrolling();

        // Visibility change handling
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Window resize handling
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }

    handleThemeToggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class for smooth theme switching
        document.body.classList.add('theme-transitioning');
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        
        // Update theme stylesheet
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            themeStylesheet.href = `css/themes/${newTheme}.css`;
        }
        
        // Store theme preference
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, newTheme);
        
        // Update charts for new theme
        this.updateChartsTheme(newTheme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);

        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: newTheme }
        }));
    }

    setupMobileNavigation() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbarCollapse.contains(e.target) && 
                    !navbarToggler.contains(e.target) && 
                    navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });

            // Close mobile menu when clicking on nav links
            const navLinks = navbarCollapse.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        navbarCollapse.classList.remove('show');
                    }
                });
            });
        }
    }

    setupMarketCardInteractions() {
        const marketCards = document.querySelectorAll('.market-card, .market-item');
        
        marketCards.forEach(card => {
            // Add hover effect with micro-interaction
            card.addEventListener('mouseenter', (e) => {
                this.animateMarketCard(e.target, 'enter');
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.animateMarketCard(e.target, 'leave');
            });

            // Add click ripple effect
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e);
            });
        });
    }

    animateMarketCard(card, type) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const chart = card.querySelector('canvas');
        
        if (type === 'enter') {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            if (chart) {
                chart.style.opacity = '1';
                chart.style.transform = 'scale(1.05)';
            }
        } else {
            card.style.transform = '';
            if (chart) {
                chart.style.opacity = '0.8';
                chart.style.transform = '';
            }
        }
    }

    createRippleEffect(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(52, 74, 251, 0.2);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Add ripple animation CSS if not exists
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupFeatureCardAnimations() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    setupScrollAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Hero stats animation
        const heroStats = document.querySelectorAll('.stat-number');
        heroStats.forEach(stat => {
            this.animateCounter(stat);
        });

        // Parallax effect for hero background
        this.setupParallaxEffect();
    }

    animateCounter(element) {
        const target = element.textContent;
        const numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
        const suffix = target.replace(/[\d.,]/g, '');
        const duration = 2000;
        const increment = numericValue / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = current.toFixed(1);
            if (suffix.includes('K') || suffix.includes('T')) {
                displayValue = current.toFixed(1);
            } else if (suffix.includes('%')) {
                displayValue = current.toFixed(1);
            }
            
            element.textContent = displayValue + suffix;
        }, 16);

        this.animations.set(element, timer);
    }

    setupParallaxEffect() {
        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;

        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${parallax}px)`;
        }, 16));
    }

    setupMarketTabs() {
        const marketTabs = document.querySelectorAll('#marketTabs .nav-link');
        
        marketTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs
                marketTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding tab content
                const targetId = tab.getAttribute('data-bs-target');
                const tabPanes = document.querySelectorAll('.tab-pane');
                
                tabPanes.forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                
                const targetPane = document.querySelector(targetId);
                if (targetPane) {
                    targetPane.classList.add('show', 'active');
                    
                    // Animate market items
                    this.animateMarketItems(targetPane);
                }
            });
        });
    }

    animateMarketItems(container) {
        const items = container.querySelectorAll('.market-item');
        
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    initializeCharts() {
        // Initialize hero section mini charts
        this.initializeHeroCharts();
    }

    initializeHeroCharts() {
        const chartIds = ['heroChart1', 'heroChart2', 'heroChart3'];
        
        chartIds.forEach((id, index) => {
            const canvas = document.getElementById(id);
            if (canvas) {
                this.createMiniChart(canvas, this.generateMockData(index));
            }
        });
    }

    createMiniChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, skipping chart creation');
            return;
        }
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    borderColor: data.trend === 'up' ? '#00d395' : '#f92364',
                    backgroundColor: data.trend === 'up' 
                        ? 'rgba(0, 211, 149, 0.1)' 
                        : 'rgba(249, 35, 100, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });

        this.charts[canvas.id] = chart;
    }

    generateMockData(index) {
        const points = 20;
        const labels = Array.from({length: points}, (_, i) => i);
        const trend = index !== 2 ? 'up' : 'down'; // Make third chart go down
        
        let values = [];
        let current = 100 + (Math.random() * 50);
        
        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * 10;
            const trendInfluence = trend === 'up' ? 0.5 : -0.5;
            current += change + trendInfluence;
            values.push(current);
        }
        
        return { labels, values, trend };
    }

    updateChartsTheme(newTheme) {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.data && chart.data.datasets) {
                chart.update('none');
            }
        });
    }

    startRealTimeSimulation() {
        // Simulate real-time price updates
        setInterval(() => {
            if (!this.isVisible) return;
            
            this.updateMarketPrices();
            this.updateHeroCharts();
        }, 5000);
    }

    updateMarketPrices() {
        const priceElements = document.querySelectorAll('.market-price');
        const changeElements = document.querySelectorAll('.market-change');
        
        priceElements.forEach((element, index) => {
            const currentPrice = parseFloat(element.textContent.replace(/[^0-9.]/g, ''));
            const change = (Math.random() - 0.5) * 2;
            const newPrice = (currentPrice + change).toFixed(2);
            
            // Animate price change
            this.animatePriceChange(element, newPrice);
            
            // Update corresponding change element
            if (changeElements[index]) {
                const changePercent = ((change / currentPrice) * 100).toFixed(2);
                const changeText = `${change >= 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent}%)`;
                
                changeElements[index].textContent = changeText;
                changeElements[index].className = `market-change ${change >= 0 ? 'positive' : 'negative'}`;
            }
        });
    }

    animatePriceChange(element, newPrice) {
        element.style.transition = 'all 0.3s ease-out';
        element.style.transform = 'scale(1.05)';
        element.style.color = 'var(--interactive-blue)';
        
        setTimeout(() => {
            element.textContent = `$${newPrice}`;
            element.style.transform = '';
            element.style.color = '';
        }, 150);
    }

    updateHeroCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.data && chart.data.datasets[0]) {
                const dataset = chart.data.datasets[0];
                const newValue = dataset.data[dataset.data.length - 1] + (Math.random() - 0.5) * 5;
                
                // Remove first point and add new one
                dataset.data.shift();
                dataset.data.push(newValue);
                chart.update('none');
            }
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });

        // Observe market items
        document.querySelectorAll('.market-item').forEach(item => {
            observer.observe(item);
        });
    }

    animateElement(element) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    setupSmoothScrolling() {
        const ctaButtons = document.querySelectorAll('a[href^="#"]');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const href = button.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    handleVisibilityChange() {
        this.isVisible = !document.hidden;
        
        if (this.isVisible) {
            // Resume animations when page becomes visible
            this.startRealTimeSimulation();
        }
    }

    handleResize() {
        // Redraw charts on resize
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    // Utility functions
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public methods for external control
    updateTheme(newTheme) {
        this.handleThemeToggle();
    }

    pauseAnimations() {
        this.isVisible = false;
        this.animations.forEach(animation => {
            clearInterval(animation);
        });
    }

    resumeAnimations() {
        this.isVisible = true;
        this.startRealTimeSimulation();
    }

    destroy() {
        // Clean up event listeners and intervals
        this.pauseAnimations();
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        
        this.charts = {};
        this.animations.clear();
    }
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the home page
    if (window.location.pathname === '/' || 
        window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('/')) {
        
        window.homePage = new HomePage();
        
        // Global theme management
        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            themeStylesheet.href = `css/themes/${savedTheme}.css`;
        }
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.homePage) {
        window.homePage.destroy();
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomePage;
}