/**
 * YAUSMA Stock Detail Page JavaScript
 * Handles interactive features for individual stock analysis
 */

class StockDetailPage {
    constructor() {
        this.symbol = this.getSymbolFromURL() || 'AAPL';
        this.currentTimeRange = '1D';
        this.priceChart = null;
        this.websocket = null;
        this.priceUpdateInterval = null;
        this.isWatchlisted = false;
        
        // Enhanced mock stock data for demonstration
        this.stockData = {
            'AAPL': {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                price: 175.43,
                change: 2.87,
                changePercent: 1.66,
                volume: 47200000,
                marketCap: '2.74T',
                peRatio: 28.67,
                high52w: 199.62,
                low52w: 124.17,
                avgVolume: 52100000,
                dividendYield: 0.50,
                eps: 6.13,
                beta: 1.24,
                previousClose: 172.56,
                open: 173.80,
                dayLow: 172.40,
                dayHigh: 176.25,
                sector: 'Technology',
                industry: 'Consumer Electronics',
                employees: 161000,
                ceo: 'Timothy D. Cook',
                founded: 'April 1, 1976',
                headquarters: 'Cupertino, CA',
                analyst: {
                    rating: 'Strong Buy',
                    targetPrice: 195.00,
                    highTarget: 225.00,
                    lowTarget: 165.00,
                    recommendations: {
                        strongBuy: 20,
                        buy: 8,
                        hold: 4,
                        sell: 0,
                        strongSell: 0
                    }
                },
                peers: [
                    { symbol: 'MSFT', name: 'Microsoft', price: 387.92, change: 1.19 },
                    { symbol: 'GOOGL', name: 'Alphabet', price: 142.56, change: -0.85 },
                    { symbol: 'AMZN', name: 'Amazon', price: 167.89, change: 2.34 },
                    { symbol: 'META', name: 'Meta', price: 501.23, change: -1.45 }
                ],
                financials: {
                    revenue: { '2023': '383.3B', '2022': '394.3B', '2021': '365.8B' },
                    netIncome: { '2023': '97.0B', '2022': '99.8B', '2021': '94.7B' },
                    grossMargin: { '2023': '44.1%', '2022': '43.3%', '2021': '41.8%' },
                    operatingMargin: { '2023': '29.8%', '2022': '30.3%', '2021': '29.8%' }
                }
            },
            'MSFT': {
                symbol: 'MSFT',
                name: 'Microsoft Corporation',
                price: 387.92,
                change: 4.62,
                changePercent: 1.19,
                volume: 23400000,
                marketCap: '2.88T',
                peRatio: 32.45,
                high52w: 420.82,
                low52w: 284.91,
                avgVolume: 28100000,
                dividendYield: 0.68,
                eps: 11.95,
                beta: 0.89,
                previousClose: 383.30,
                open: 385.20,
                dayLow: 384.15,
                dayHigh: 389.50,
                sector: 'Technology',
                industry: 'Software',
                employees: 221000,
                ceo: 'Satya Nadella',
                founded: 'April 4, 1975',
                headquarters: 'Redmond, WA'
            },
            'GOOGL': {
                symbol: 'GOOGL',
                name: 'Alphabet Inc.',
                price: 142.56,
                change: -1.21,
                changePercent: -0.85,
                volume: 31200000,
                marketCap: '1.80T',
                peRatio: 25.34,
                high52w: 153.78,
                low52w: 101.88,
                avgVolume: 32500000,
                dividendYield: 0.00,
                eps: 5.63,
                beta: 1.05,
                previousClose: 143.77,
                open: 143.20,
                dayLow: 141.89,
                dayHigh: 144.25,
                sector: 'Technology',
                industry: 'Internet Services',
                employees: 182000,
                ceo: 'Sundar Pichai',
                founded: 'September 4, 1998',
                headquarters: 'Mountain View, CA'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadStockData();
        this.initializeChart();
        this.loadRelatedNews();
        this.startPriceUpdates();
        this.updateLastUpdateTime();
        
        // Add animations
        this.animateElements();
    }
    
    getSymbolFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('symbol') || params.get('s');
    }
    
    setupEventListeners() {
        // Time range buttons
        const timeRangeButtons = document.querySelectorAll('input[name="timeRange"]');
        timeRangeButtons.forEach(button => {
            button.addEventListener('change', (e) => {
                this.currentTimeRange = e.target.id;
                this.updateChart();
                this.updateTimeRangeUI(e.target.id);
            });
        });
        
        // Buy/Sell buttons
        const buyBtn = document.getElementById('buyBtn');
        const sellBtn = document.getElementById('sellBtn');
        const watchlistBtn = document.getElementById('watchlistBtn');
        
        if (buyBtn) {
            buyBtn.addEventListener('click', () => this.handleBuy());
        }
        
        if (sellBtn) {
            sellBtn.addEventListener('click', () => this.handleSell());
        }
        
        if (watchlistBtn) {
            watchlistBtn.addEventListener('click', () => this.toggleWatchlist());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'b':
                        e.preventDefault();
                        this.handleBuy();
                        break;
                    case 's':
                        e.preventDefault();
                        this.handleSell();
                        break;
                    case 'w':
                        e.preventDefault();
                        this.toggleWatchlist();
                        break;
                }
            }
        });
        
        // News items
        this.setupNewsEventListeners();
        
        // Peer items
        this.setupPeerEventListeners();
        
        // Tab switching
        this.setupTabEventListeners();
        
        // Chart interaction
        this.setupChartEventListeners();
    }
    
    loadStockData() {
        const stock = this.stockData[this.symbol];
        if (!stock) return;
        
        // Update page title
        document.title = `${stock.name} (${stock.symbol}) Stock Analysis - YAUSMA`;
        
        // Update stock header
        this.updateStockHeader(stock);
        
        // Update financial metrics
        this.updateFinancialMetrics(stock);
        
        // Update key statistics
        this.updateKeyStatistics(stock);
        
        // Update company information
        this.updateCompanyInfo(stock);
    }
    
    updateStockHeader(stock) {
        // Update symbol and name
        const symbolElement = document.querySelector('.stock-symbol');
        const nameElement = document.querySelector('.stock-company-name');
        
        if (symbolElement) symbolElement.textContent = stock.symbol;
        if (nameElement) nameElement.textContent = stock.name;
        
        // Update price and change
        this.updatePriceDisplay(stock.price, stock.change, stock.changePercent);
        
        // Update market status
        this.updateMarketStatus();
    }
    
    updatePriceDisplay(price, change, changePercent, animate = false) {
        const priceElement = document.getElementById('currentPrice');
        const changeElement = document.getElementById('priceChange');
        
        if (priceElement) {
            const oldPrice = parseFloat(priceElement.textContent.replace('$', ''));
            priceElement.textContent = `$${price.toFixed(2)}`;
            
            if (animate && oldPrice !== price) {
                priceElement.classList.remove('price-up', 'price-down');
                if (price > oldPrice) {
                    priceElement.classList.add('price-up');
                } else if (price < oldPrice) {
                    priceElement.classList.add('price-down');
                }
            }
        }
        
        if (changeElement) {
            const isPositive = change >= 0;
            changeElement.className = `price-change ${isPositive ? 'positive' : 'negative'}`;
            
            const changeAmountElement = changeElement.querySelector('.change-amount');
            const changePercentElement = changeElement.querySelector('.change-percent');
            
            if (changeAmountElement) {
                changeAmountElement.textContent = `${isPositive ? '+' : ''}$${Math.abs(change).toFixed(2)}`;
            }
            
            if (changePercentElement) {
                changePercentElement.textContent = `(${isPositive ? '+' : ''}${changePercent.toFixed(2)}%)`;
            }
        }
    }
    
    updateMarketStatus() {
        const now = new Date();
        const marketOpen = now.getHours() >= 9 && now.getHours() < 16;
        const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
        
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (statusDot && statusText) {
            if (marketOpen && isWeekday) {
                statusDot.className = 'status-dot open';
                statusText.textContent = 'Market Open';
            } else {
                statusDot.className = 'status-dot closed';
                statusText.textContent = 'Market Closed';
            }
        }
    }
    
    updateFinancialMetrics(stock) {
        const metrics = {
            'Market Cap': stock.marketCap,
            'P/E Ratio': stock.peRatio.toFixed(2),
            'Volume': this.formatNumber(stock.volume),
            '52W High': `$${stock.high52w.toFixed(2)}`,
            '52W Low': `$${stock.low52w.toFixed(2)}`,
            'Avg Volume': this.formatNumber(stock.avgVolume),
            'Dividend Yield': `${stock.dividendYield.toFixed(2)}%`,
            'EPS': `$${stock.eps.toFixed(2)}`,
            'Beta': stock.beta.toFixed(2)
        };
        
        // Update metric values with enhanced animation
        Object.keys(metrics).forEach(key => {
            const metricItems = document.querySelectorAll('.metric-item');
            metricItems.forEach(item => {
                const labelElement = item.querySelector('.metric-label');
                if (labelElement && labelElement.textContent.includes(key)) {
                    const valueElement = item.querySelector('.metric-value');
                    if (valueElement) {
                        const oldValue = valueElement.textContent;
                        const newValue = metrics[key];
                        
                        if (oldValue !== newValue) {
                            valueElement.style.transform = 'scale(1.05)';
                            valueElement.style.color = 'var(--interactive-blue)';
                            
                            setTimeout(() => {
                                valueElement.textContent = newValue;
                                valueElement.style.transform = 'scale(1)';
                                valueElement.style.color = '';
                            }, 200);
                        } else {
                            valueElement.textContent = newValue;
                        }
                    }
                }
            });
        });
        
        // Update analyst recommendations if available
        if (stock.analyst) {
            this.updateAnalystRecommendations(stock.analyst);
        }
        
        // Update peer comparison if available
        if (stock.peers) {
            this.updatePeerComparison(stock.peers);
        }
    }
    
    updateKeyStatistics(stock) {
        const stats = {
            'Previous Close': `$${stock.previousClose.toFixed(2)}`,
            'Open': `$${stock.open.toFixed(2)}`,
            'Day\'s Range': `$${stock.dayLow.toFixed(2)} - $${stock.dayHigh.toFixed(2)}`,
            '52W Range': `$${stock.low52w.toFixed(2)} - $${stock.high52w.toFixed(2)}`,
            'Volume': this.formatNumber(stock.volume),
            'Avg Volume': this.formatNumber(stock.avgVolume)
        };
        
        const statRows = document.querySelectorAll('.stat-row');
        statRows.forEach(row => {
            const label = row.querySelector('.stat-label').textContent;
            const valueElement = row.querySelector('.stat-value');
            if (stats[label] && valueElement) {
                valueElement.textContent = stats[label];
            }
        });
    }
    
    updateCompanyInfo(stock) {
        const companyText = document.querySelector('.company-info-section .body-text');
        if (companyText) {
            companyText.textContent = `${stock.name} designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services.`;
        }
        
        const details = {
            'CEO:': stock.ceo,
            'Founded:': stock.founded,
            'Employees:': this.formatNumber(stock.employees),
            'Sector:': stock.sector,
            'Industry:': stock.industry,
            'Headquarters:': stock.headquarters
        };
        
        const detailItems = document.querySelectorAll('.detail-item');
        detailItems.forEach(item => {
            const label = item.querySelector('.detail-label').textContent;
            const valueElement = item.querySelector('.detail-value');
            if (details[label] && valueElement) {
                valueElement.textContent = details[label];
            }
        });
    }
    
    initializeChart() {
        const canvas = document.getElementById('priceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Generate mock price data
        const data = this.generatePriceData(this.currentTimeRange);
        
        // Determine chart color based on performance
        const stock = this.stockData[this.symbol];
        const isPositive = stock.changePercent >= 0;
        const chartColor = isPositive ? 'rgb(0, 211, 149)' : 'rgb(249, 35, 100)';
        const chartBgColor = isPositive ? 'rgba(0, 211, 149, 0.1)' : 'rgba(249, 35, 100, 0.1)';
        
        this.priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Price',
                    data: data.prices,
                    borderColor: chartColor,
                    backgroundColor: chartBgColor,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: chartColor,
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: chartColor,
                        borderWidth: 2,
                        cornerRadius: 8,
                        displayColors: false,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 16,
                            family: "'SF Mono', monospace",
                            weight: 'bold'
                        },
                        padding: 12,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `$${context.parsed.y.toFixed(2)}`;
                            },
                            afterLabel: function(context) {
                                const currentPrice = stock.price;
                                const pointPrice = context.parsed.y;
                                const change = pointPrice - currentPrice;
                                const changePercent = (change / currentPrice) * 100;
                                const sign = change >= 0 ? '+' : '';
                                return `${sign}$${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
                            }
                        }
                    },
                    crosshair: {
                        line: {
                            color: chartColor,
                            width: 1,
                            dashPattern: [5, 5]
                        },
                        sync: {
                            enabled: false
                        },
                        zoom: {
                            enabled: false
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            color: 'rgba(216, 220, 224, 0.2)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#5b616e',
                            font: {
                                size: 12,
                                family: "'Inter', sans-serif"
                            },
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        display: true,
                        position: 'right',
                        grid: {
                            color: 'rgba(216, 220, 224, 0.2)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#5b616e',
                            font: {
                                size: 12,
                                family: "'SF Mono', monospace"
                            },
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            },
                            maxTicksLimit: 6
                        }
                    }
                },
                onHover: (event, activeElements) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'crosshair' : 'default';
                }
            }
        });
        
        // Add chart annotations for support/resistance levels
        this.addChartAnnotations();
    }
    
    generatePriceData(timeRange) {
        const basePrice = this.stockData[this.symbol].price;
        const labels = [];
        const prices = [];
        
        let points, dateFormat;
        
        switch (timeRange) {
            case '1D':
                points = 78; // 5-minute intervals for market hours
                dateFormat = 'time';
                break;
            case '5D':
                points = 5 * 78;
                dateFormat = 'time';
                break;
            case '1M':
                points = 30;
                dateFormat = 'date';
                break;
            case '3M':
                points = 90;
                dateFormat = 'date';
                break;
            case '1Y':
                points = 252; // Trading days
                dateFormat = 'date';
                break;
            case '5Y':
                points = 252 * 5;
                dateFormat = 'month';
                break;
            default:
                points = 78;
                dateFormat = 'time';
        }
        
        // Generate mock data
        let currentPrice = basePrice - (Math.random() * 10 - 5);
        for (let i = 0; i < points; i++) {
            // Generate realistic price movement
            const change = (Math.random() - 0.5) * 2;
            currentPrice += change;
            currentPrice = Math.max(currentPrice, basePrice * 0.8); // Prevent unrealistic drops
            currentPrice = Math.min(currentPrice, basePrice * 1.3); // Prevent unrealistic gains
            
            prices.push(currentPrice);
            
            // Generate appropriate labels
            if (dateFormat === 'time') {
                const date = new Date();
                date.setMinutes(date.getMinutes() - (points - i) * 5);
                labels.push(date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                }));
            } else if (dateFormat === 'date') {
                const date = new Date();
                date.setDate(date.getDate() - (points - i));
                labels.push(date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                }));
            } else {
                const date = new Date();
                date.setMonth(date.getMonth() - (points - i));
                labels.push(date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                }));
            }
        }
        
        return { labels, prices };
    }
    
    updateChart() {
        if (!this.priceChart) return;
        
        const data = this.generatePriceData(this.currentTimeRange);
        this.priceChart.data.labels = data.labels;
        this.priceChart.data.datasets[0].data = data.prices;
        this.priceChart.update('none');
    }
    
    loadRelatedNews() {
        const newsContainer = document.getElementById('relatedNews');
        if (!newsContainer) return;
        
        // Mock news data
        const news = [
            {
                title: `${this.stockData[this.symbol].name} Reports Strong Q4 Earnings`,
                summary: `${this.stockData[this.symbol].name} reported better-than-expected quarterly earnings, driven by strong iPhone sales and services revenue growth.`,
                source: 'Reuters',
                time: '2 hours ago',
                url: '#'
            },
            {
                title: 'New iPhone Models Drive Sales',
                summary: 'The latest iPhone 15 series continues to show strong demand across global markets, boosting Apple\'s market position.',
                source: 'Bloomberg',
                time: '4 hours ago',
                url: '#'
            },
            {
                title: `${this.stockData[this.symbol].name} Invests in AI Technology`,
                summary: `${this.stockData[this.symbol].name} announces significant investments in artificial intelligence capabilities for future product development.`,
                source: 'TechCrunch',
                time: '6 hours ago',
                url: '#'
            }
        ];
        
        newsContainer.innerHTML = '';
        
        news.forEach(item => {
            const newsElement = document.createElement('div');
            newsElement.className = 'news-item fade-in';
            newsElement.innerHTML = `
                <h4 class="news-title">${item.title}</h4>
                <p class="news-summary ui-text">${item.summary}</p>
                <div class="news-meta">
                    <span class="news-source ui-text">${item.source}</span>
                    <span class="news-time ui-text">${item.time}</span>
                </div>
            `;
            
            newsElement.addEventListener('click', () => {
                // In a real app, this would navigate to the news article
                console.log('Navigate to news article:', item.url);
            });
            
            newsContainer.appendChild(newsElement);
        });
    }
    
    setupNewsEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.news-item')) {
                const newsItem = e.target.closest('.news-item');
                newsItem.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    newsItem.style.transform = '';
                }, 150);
            }
        });
    }
    
    setupPeerEventListeners() {
        const peerItems = document.querySelectorAll('.peer-item');
        peerItems.forEach(item => {
            item.addEventListener('click', () => {
                const symbol = item.querySelector('.peer-symbol').textContent;
                // In a real app, this would navigate to the peer stock page
                window.location.href = `stock-detail.html?symbol=${symbol}`;
            });
        });
    }
    
    setupTabEventListeners() {
        const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Add animation to tab content
                const targetId = button.getAttribute('data-bs-target');
                const targetPane = document.querySelector(targetId);
                if (targetPane) {
                    targetPane.classList.add('fade-in');
                    setTimeout(() => {
                        targetPane.classList.remove('fade-in');
                    }, 300);
                }
            });
        });
    }
    
    handleBuy() {
        // Show loading state
        const buyBtn = document.getElementById('buyBtn');
        const originalText = buyBtn.innerHTML;
        buyBtn.innerHTML = '<i class="bi bi-spinner-border spinner-border-sm me-2"></i>Processing...';
        buyBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            buyBtn.innerHTML = originalText;
            buyBtn.disabled = false;
            
            // In a real app, this would open a buy modal or redirect to trading interface
            this.showNotification('Buy order placed successfully!', 'success');
        }, 1500);
    }
    
    handleSell() {
        // Show loading state
        const sellBtn = document.getElementById('sellBtn');
        const originalText = sellBtn.innerHTML;
        sellBtn.innerHTML = '<i class="bi bi-spinner-border spinner-border-sm me-2"></i>Processing...';
        sellBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            sellBtn.innerHTML = originalText;
            sellBtn.disabled = false;
            
            // In a real app, this would open a sell modal or redirect to trading interface
            this.showNotification('Sell order placed successfully!', 'success');
        }, 1500);
    }
    
    toggleWatchlist() {
        const watchlistBtn = document.getElementById('watchlistBtn');
        const icon = watchlistBtn.querySelector('i');
        
        this.isWatchlisted = !this.isWatchlisted;
        
        if (this.isWatchlisted) {
            icon.className = 'bi bi-heart-fill me-2';
            watchlistBtn.classList.remove('btn-outline-secondary');
            watchlistBtn.classList.add('btn-success');
            this.showNotification('Added to watchlist!', 'success');
        } else {
            icon.className = 'bi bi-heart me-2';
            watchlistBtn.classList.remove('btn-success');
            watchlistBtn.classList.add('btn-outline-secondary');
            this.showNotification('Removed from watchlist!', 'info');
        }
        
        // Save to localStorage
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        if (this.isWatchlisted) {
            if (!watchlist.includes(this.symbol)) {
                watchlist.push(this.symbol);
            }
        } else {
            const index = watchlist.indexOf(this.symbol);
            if (index > -1) {
                watchlist.splice(index, 1);
            }
        }
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
    
    startPriceUpdates() {
        // Simulate real-time price updates
        this.priceUpdateInterval = setInterval(() => {
            const stock = this.stockData[this.symbol];
            const priceChange = (Math.random() - 0.5) * 0.5; // Small random changes
            const newPrice = stock.price + priceChange;
            const newChange = newPrice - stock.previousClose;
            const newChangePercent = (newChange / stock.previousClose) * 100;
            
            // Update stock data
            stock.price = newPrice;
            stock.change = newChange;
            stock.changePercent = newChangePercent;
            
            // Update display with animation
            this.updatePriceDisplay(newPrice, newChange, newChangePercent, true);
            
            // Update chart with new data point
            if (this.priceChart && this.currentTimeRange === '1D') {
                const chart = this.priceChart;
                const now = new Date();
                const timeLabel = now.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                
                chart.data.labels.push(timeLabel);
                chart.data.datasets[0].data.push(newPrice);
                
                // Keep only last 78 points for 1D view
                if (chart.data.labels.length > 78) {
                    chart.data.labels.shift();
                    chart.data.datasets[0].data.shift();
                }
                
                chart.update('none');
            }
        }, 5000); // Update every 5 seconds
    }
    
    updateLastUpdateTime() {
        const updateElement = document.getElementById('lastUpdate');
        if (!updateElement) return;
        
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short'
            });
            updateElement.textContent = `Last updated: ${timeString}`;
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    animateElements() {
        // Add staggered animations to metric items
        const metricItems = document.querySelectorAll('.metric-item');
        metricItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in');
        });
        
        // Add animations to news items
        const newsItems = document.querySelectorAll('.news-item');
        newsItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            item.classList.add('slide-up');
        });
        
        // Add animations to peer items
        const peerItems = document.querySelectorAll('.peer-item');
        peerItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.15}s`;
            item.classList.add('fade-in');
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('fade');
                setTimeout(() => {
                    notification.remove();
                }, 150);
            }
        }, 3000);
    }
    
    // New methods for enhanced functionality
    updateTimeRangeUI(selectedRange) {
        // Add visual feedback for selected time range
        const rangeButtons = document.querySelectorAll('input[name="timeRange"]');
        rangeButtons.forEach(button => {
            const label = button.nextElementSibling;
            if (button.id === selectedRange) {
                label.style.background = 'var(--interactive-blue)';
                label.style.color = 'white';
            } else {
                label.style.background = '';
                label.style.color = '';
            }
        });
    }

    setupChartEventListeners() {
        // Add chart zoom and pan functionality
        const canvas = document.getElementById('priceChart');
        if (!canvas) return;

        let isDrawing = false;
        let startX = 0;
        let startY = 0;

        canvas.addEventListener('mousedown', (e) => {
            if (e.shiftKey) {
                isDrawing = true;
                const rect = canvas.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing && e.shiftKey) {
                // Drawing trend lines would go here
                e.preventDefault();
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        // Mouse wheel zoom
        canvas.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                // Zoom functionality would go here
            }
        });
    }

    addChartAnnotations() {
        if (!this.priceChart) return;

        const stock = this.stockData[this.symbol];
        const currentPrice = stock.price;
        
        // Add support and resistance lines based on 52-week range
        const supportLevel = stock.low52w * 1.05; // 5% above 52-week low
        const resistanceLevel = stock.high52w * 0.95; // 5% below 52-week high
        
        // This would integrate with Chart.js annotation plugin in a real implementation
        console.log(`Support level: $${supportLevel.toFixed(2)}, Resistance level: $${resistanceLevel.toFixed(2)}`);
    }

    updateAnalystRecommendations(analyst) {
        // Update analyst recommendation section
        const scoreElement = document.querySelector('.score-value');
        const recommendationElement = document.querySelector('.recommendation-text strong');
        
        if (scoreElement) {
            const totalRecommendations = Object.values(analyst.recommendations).reduce((a, b) => a + b, 0);
            const weightedScore = (
                analyst.recommendations.strongBuy * 5 +
                analyst.recommendations.buy * 4 +
                analyst.recommendations.hold * 3 +
                analyst.recommendations.sell * 2 +
                analyst.recommendations.strongSell * 1
            ) / totalRecommendations;
            
            scoreElement.textContent = weightedScore.toFixed(1);
        }
        
        if (recommendationElement) {
            recommendationElement.textContent = analyst.rating;
        }
        
        // Update recommendation breakdown bars
        Object.keys(analyst.recommendations).forEach(key => {
            const barElement = document.querySelector(`.breakdown-item:has(.breakdown-label:contains("${key.replace(/([A-Z])/g, ' $1').trim()}")) .breakdown-fill`);
            if (barElement) {
                const total = Object.values(analyst.recommendations).reduce((a, b) => a + b, 0);
                const percentage = (analyst.recommendations[key] / total) * 100;
                barElement.style.width = `${percentage}%`;
            }
        });
    }

    updatePeerComparison(peers) {
        const peersList = document.querySelector('.peers-list');
        if (!peersList) return;
        
        peersList.innerHTML = peers.map(peer => {
            const changeClass = peer.change >= 0 ? 'positive' : 'negative';
            return `
                <div class="peer-item" onclick="window.location.href='stock-detail.html?symbol=${peer.symbol}'">
                    <div class="peer-info">
                        <span class="peer-symbol financial-data">${peer.symbol}</span>
                        <span class="peer-name ui-text">${peer.name}</span>
                    </div>
                    <div class="peer-metrics">
                        <span class="peer-price financial-data">$${peer.price.toFixed(2)}</span>
                        <span class="peer-change ${changeClass}">${peer.change >= 0 ? '+' : ''}${peer.change.toFixed(2)}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    formatNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    destroy() {
        // Clean up intervals and event listeners
        if (this.priceUpdateInterval) {
            clearInterval(this.priceUpdateInterval);
        }
        
        if (this.websocket) {
            this.websocket.close();
        }
        
        if (this.priceChart) {
            this.priceChart.destroy();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.stockDetailPage = new StockDetailPage();
});

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
    if (window.stockDetailPage) {
        window.stockDetailPage.destroy();
    }
});

// Add CSS for slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Helper function for jQuery-like text content selection
Element.prototype.textContains = function(text) {
    return this.textContent.includes(text);
};

// Custom querySelector for text content
document.querySelector = function(originalQuerySelector) {
    return function(selector) {
        if (selector.includes(':contains(')) {
            const match = selector.match(/(.+):contains\("(.+)"\)/);
            if (match) {
                const baseSelector = match[1];
                const text = match[2];
                const elements = document.querySelectorAll(baseSelector);
                for (let element of elements) {
                    if (element.textContent.includes(text)) {
                        return element;
                    }
                }
                return null;
            }
        }
        return originalQuerySelector.call(this, selector);
    };
}(document.querySelector);

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StockDetailPage;
}