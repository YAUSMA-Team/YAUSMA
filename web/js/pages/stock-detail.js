/**
 * YAUSMA Stock Detail Page JavaScript
 * Handles individual stock data display, charts, and interactions
 */

// Stock detail page state
var StockDetailManager = {
    initialized: false,
    currentSymbol: null,
    stockData: null,
    priceChart: null,
    volumeChart: null,
    currentChartType: 'price',
    currentTimePeriod: '1M',
    
    // Enhanced stock data with mock information
    enhancedData: {
        'AAPL': {
            description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets.',
            headquarters: 'Cupertino, CA',
            founded: '1976',
            employees: '164,000',
            industry: 'Consumer Electronics',
            marketCap: 3000000000000,
            peRatio: 28.5,
            eps: 6.16,
            dividendYield: 0.44,
            beta: 1.26,
            week52High: 199.62,
            week52Low: 164.08,
            avgVolume: 57500000
        },
        'MSFT': {
            description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.',
            headquarters: 'Redmond, WA',
            founded: '1975',
            employees: '221,000',
            industry: 'Software Infrastructure',
            marketCap: 2800000000000,
            peRatio: 32.1,
            eps: 11.86,
            dividendYield: 0.72,
            beta: 0.91,
            week52High: 384.30,
            week52Low: 309.45,
            avgVolume: 28500000
        },
        'GOOGL': {
            description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.',
            headquarters: 'Mountain View, CA',
            founded: '1998',
            employees: '174,014',
            industry: 'Internet Content & Information',
            marketCap: 1800000000000,
            peRatio: 25.4,
            eps: 5.80,
            dividendYield: 0.00,
            beta: 1.05,
            week52High: 152.75,
            week52Low: 121.46,
            avgVolume: 25400000
        },
        'TSLA': {
            description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
            headquarters: 'Austin, TX',
            founded: '2003',
            employees: '127,855',
            industry: 'Auto Manufacturers',
            marketCap: 800000000000,
            peRatio: 65.2,
            eps: 3.62,
            dividendYield: 0.00,
            beta: 2.34,
            week52High: 299.29,
            week52Low: 152.37,
            avgVolume: 75200000
        }
    }
};

// Initialize stock detail page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('stock-detail.html')) {
        initStockDetailPage();
    }
});

// Main initialization function
function initStockDetailPage() {
    if (StockDetailManager.initialized) {
        return;
    }
    
    try {
        // Parse URL parameters
        var urlParams = new URLSearchParams(window.location.search);
        var symbol = urlParams.get('symbol');
        
        if (!symbol) {
            showErrorState('No stock symbol provided');
            return;
        }
        
        StockDetailManager.currentSymbol = symbol.toUpperCase();
        
        // Initialize components
        initChartControls();
        initActionButtons();
        initPriceChart();
        initAnimations();
        
        // Load stock data
        loadStockData(StockDetailManager.currentSymbol);
        
        StockDetailManager.initialized = true;
        
        if (YAUSMA.debug) {
            console.log('Stock detail page initialized for:', StockDetailManager.currentSymbol);
        }
        
    } catch (error) {
        console.error('Failed to initialize stock detail page:', error);
        showErrorState('Failed to initialize page');
    }
}

// Initialize chart controls
function initChartControls() {
    // Time range selector
    var timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            timeButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update chart data
            var period = this.getAttribute('data-period');
            StockDetailManager.currentTimePeriod = period;
            updateChartData();
        });
    });
    
    // Chart type selector
    var chartTypeButtons = document.querySelectorAll('.chart-type-btn');
    chartTypeButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            chartTypeButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update chart type
            var type = this.getAttribute('data-type');
            StockDetailManager.currentChartType = type;
            switchChartType(type);
        });
    });
}

// Initialize action buttons
function initActionButtons() {
    var actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(function() {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Initialize price chart
function initPriceChart() {
    var ctx = document.getElementById('stockChart');
    if (!ctx) return;
    
    StockDetailManager.priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Price',
                data: [],
                borderColor: 'var(--interactive-blue)',
                backgroundColor: 'rgba(52, 74, 251, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'var(--interactive-blue)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'var(--interactive-blue)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            var label = StockDetailManager.currentChartType === 'price' ? 'Price: ' : 'Volume: ';
                            if (StockDetailManager.currentChartType === 'price') {
                                return label + formatCurrency(context.parsed.y);
                            } else {
                                return label + formatNumber(context.parsed.y);
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'var(--border-light)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'var(--text-secondary)',
                        font: {
                            size: 12
                        },
                        maxTicksLimit: 8
                    }
                },
                y: {
                    grid: {
                        color: 'var(--border-light)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'var(--text-secondary)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            if (StockDetailManager.currentChartType === 'price') {
                                return formatCurrency(value);
                            } else {
                                return formatNumber(value);
                            }
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 800,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Initialize animations
function initAnimations() {
    // Add hover animations to overview cards
    var overviewCards = document.querySelectorAll('.overview-card');
    overviewCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click animations to news items
    document.addEventListener('click', function(e) {
        if (e.target.closest('.news-item')) {
            var newsItem = e.target.closest('.news-item');
            newsItem.style.transform = 'scale(0.98)';
            setTimeout(function() {
                newsItem.style.transform = 'scale(1)';
            }, 100);
        }
        
        if (e.target.closest('.similar-stock-item')) {
            var stockItem = e.target.closest('.similar-stock-item');
            stockItem.style.transform = 'scale(0.98)';
            setTimeout(function() {
                stockItem.style.transform = 'scale(1)';
            }, 100);
        }
    });
}

// Load stock data
function loadStockData(symbol) {
    showLoadingOverlay();
    
    // Try to load from API first
    if (window.dataApi) {
        loadFromAPI(symbol);
    } else {
        // Fallback to mock data
        console.warn('API not available, using mock data');
        setTimeout(function() {
            loadMockStockData(symbol);
        }, 1000);
    }
}

// Load data from API
function loadFromAPI(symbol) {
    window.dataApi.getMarketOverview(function(error, data, response) {
        hideLoadingOverlay();
        
        if (error) {
            console.error('API error loading stock data:', error);
            loadMockStockData(symbol);
            return;
        }
        
        // Find the requested stock in the response
        var stockData = null;
        if (data && Array.isArray(data)) {
            stockData = data.find(function(stock) {
                return stock.symbol === symbol;
            });
        }
        
        if (stockData) {
            StockDetailManager.stockData = stockData;
            updateStockDisplay(stockData);
            loadRelatedNews(symbol);
            loadSimilarStocks(stockData.sector);
        } else {
            console.warn('Stock not found in API response, using mock data');
            loadMockStockData(symbol);
        }
    });
}

// Load mock stock data
function loadMockStockData(symbol) {
    hideLoadingOverlay();
    
    var enhancedData = StockDetailManager.enhancedData[symbol];
    if (!enhancedData) {
        showErrorState('Stock data not available');
        return;
    }
    
    // Create mock stock data based on enhanced data
    var currentPrice = 150 + Math.random() * 100; // Random price between 150-250
    var change = (Math.random() - 0.5) * 10; // Random change between -5 to +5
    
    var mockStockData = {
        symbol: symbol,
        name: getCompanyName(symbol),
        sector: enhancedData.industry,
        current_price: currentPrice.toFixed(2),
        change: (change / currentPrice * 100).toFixed(2), // Convert to percentage
        high: (currentPrice + Math.random() * 5).toFixed(2),
        low: (currentPrice - Math.random() * 5).toFixed(2),
        volume: Math.floor(enhancedData.avgVolume * (0.8 + Math.random() * 0.4)),
        news_article: {
            title: `${getCompanyName(symbol)} reports strong quarterly results`,
            publisher: 'Financial News',
            date: Math.floor(Date.now() / 1000).toString()
        }
    };
    
    StockDetailManager.stockData = mockStockData;
    updateStockDisplay(mockStockData);
    loadMockNews(symbol);
    loadMockSimilarStocks(enhancedData.industry);
}

// Update stock display
function updateStockDisplay(stockData) {
    // Update page title and breadcrumb
    document.getElementById('pageTitle').textContent = `${stockData.symbol} - ${stockData.name} - YAUSMA`;
    document.getElementById('breadcrumbStock').textContent = stockData.symbol;
    
    // Update stock header
    document.getElementById('stockSymbol').textContent = stockData.symbol;
    document.getElementById('stockName').textContent = stockData.name;
    document.getElementById('sectorBadge').textContent = stockData.sector;
    
    // Update price information
    var currentPrice = parseFloat(stockData.current_price.replace('$', ''));
    var changePercent = parseFloat(stockData.change);
    var changeAmount = currentPrice * (changePercent / 100);
    
    document.getElementById('currentPrice').textContent = formatCurrency(currentPrice);
    
    var priceChangeElement = document.getElementById('priceChange');
    var changeClass = changePercent >= 0 ? 'positive' : 'negative';
    var changeIcon = changePercent >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
    var changeSign = changePercent >= 0 ? '+' : '';
    
    priceChangeElement.className = 'price-change ' + changeClass;
    priceChangeElement.innerHTML = 
        `<i class="bi ${changeIcon}"></i>` +
        `<span>${changeSign}${formatCurrency(changeAmount)} (${changeSign}${changePercent}%)</span>`;
    
    // Update overview cards
    updateOverviewCards(stockData);
    
    // Update company information
    updateCompanyInfo(stockData);
    
    // Update chart
    updateChartData();
    
    // Animate price update
    animatePriceUpdate();
}

// Update overview cards
function updateOverviewCards(stockData) {
    var high = parseFloat(stockData.high);
    var low = parseFloat(stockData.low);
    var current = parseFloat(stockData.current_price.replace('$', ''));
    
    document.getElementById('todayHigh').textContent = formatCurrency(high);
    document.getElementById('todayLow').textContent = formatCurrency(low);
    document.getElementById('stockVolume').textContent = formatNumber(stockData.volume);
    
    // Update range bar
    var rangePercent = ((current - low) / (high - low)) * 100;
    document.getElementById('rangeProgress').style.width = rangePercent + '%';
    document.getElementById('currentPosition').style.left = rangePercent + '%';
    
    // Update enhanced metrics
    var enhancedData = StockDetailManager.enhancedData[stockData.symbol];
    if (enhancedData) {
        document.getElementById('marketCap').textContent = formatCurrency(enhancedData.marketCap);
        document.getElementById('peRatio').textContent = enhancedData.peRatio.toFixed(1);
        
        // Update key metrics
        document.getElementById('week52High').textContent = formatCurrency(enhancedData.week52High);
        document.getElementById('week52Low').textContent = formatCurrency(enhancedData.week52Low);
        document.getElementById('avgVolume').textContent = formatNumber(enhancedData.avgVolume);
        document.getElementById('eps').textContent = formatCurrency(enhancedData.eps);
        document.getElementById('dividendYield').textContent = enhancedData.dividendYield.toFixed(2) + '%';
        document.getElementById('beta').textContent = enhancedData.beta.toFixed(2);
    }
}

// Update company information
function updateCompanyInfo(stockData) {
    var enhancedData = StockDetailManager.enhancedData[stockData.symbol];
    if (enhancedData) {
        document.getElementById('companyNameAbout').textContent = stockData.name;
        document.getElementById('companyDescription').textContent = enhancedData.description;
        document.getElementById('companyHQ').textContent = enhancedData.headquarters;
        document.getElementById('companyFounded').textContent = enhancedData.founded;
        document.getElementById('companyEmployees').textContent = formatNumber(enhancedData.employees);
        document.getElementById('companyIndustry').textContent = enhancedData.industry;
    }
}

// Update chart data
function updateChartData() {
    if (!StockDetailManager.priceChart || !StockDetailManager.stockData) return;
    
    var chartData = generateChartData(
        StockDetailManager.currentTimePeriod,
        StockDetailManager.currentChartType
    );
    
    StockDetailManager.priceChart.data.labels = chartData.labels;
    StockDetailManager.priceChart.data.datasets[0].data = chartData.values;
    StockDetailManager.priceChart.data.datasets[0].label = 
        StockDetailManager.currentChartType === 'price' ? 'Price' : 'Volume';
    
    // Update chart colors based on type
    if (StockDetailManager.currentChartType === 'volume') {
        StockDetailManager.priceChart.data.datasets[0].borderColor = 'var(--warning-yellow)';
        StockDetailManager.priceChart.data.datasets[0].backgroundColor = 'rgba(255, 201, 71, 0.1)';
    } else {
        StockDetailManager.priceChart.data.datasets[0].borderColor = 'var(--interactive-blue)';
        StockDetailManager.priceChart.data.datasets[0].backgroundColor = 'rgba(52, 74, 251, 0.1)';
    }
    
    StockDetailManager.priceChart.update();
    
    // Update chart title
    var chartTitle = document.getElementById('chartTitle');
    if (chartTitle) {
        chartTitle.textContent = StockDetailManager.currentChartType === 'price' ? 
            `${StockDetailManager.currentSymbol} Price` : 
            `${StockDetailManager.currentSymbol} Volume`;
    }
}

// Generate chart data
function generateChartData(period, type) {
    var labels = [];
    var values = [];
    var currentDate = new Date();
    var baseValue = parseFloat(StockDetailManager.stockData.current_price.replace('$', ''));
    var days;
    
    switch (period) {
        case '1D':
            days = 1;
            // Generate hourly data for 1 day
            for (var i = 23; i >= 0; i--) {
                var date = new Date(currentDate);
                date.setHours(date.getHours() - i);
                labels.push(date.toLocaleTimeString('en-US', { hour: 'numeric' }));
                
                if (type === 'price') {
                    values.push(baseValue + (Math.random() - 0.5) * baseValue * 0.02);
                } else {
                    values.push(Math.floor(Math.random() * 1000000));
                }
            }
            break;
        case '1W':
            days = 7;
            break;
        case '3M':
            days = 90;
            break;
        case '1Y':
            days = 365;
            break;
        case '5Y':
            days = 1825;
            break;
        default:
            days = 30; // 1M
    }
    
    if (period !== '1D') {
        for (var i = days - 1; i >= 0; i--) {
            var date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            
            if (days <= 7) {
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            } else if (days <= 90) {
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            } else {
                labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
            }
            
            if (type === 'price') {
                var variation = (Math.random() - 0.5) * baseValue * 0.05;
                var trend = (days - i) * 0.02; // Slight upward trend
                values.push(baseValue + variation + trend);
            } else {
                var avgVolume = StockDetailManager.enhancedData[StockDetailManager.currentSymbol]?.avgVolume || 50000000;
                values.push(Math.floor(avgVolume * (0.5 + Math.random())));
            }
        }
    }
    
    return { labels: labels, values: values };
}

// Switch chart type
function switchChartType(type) {
    StockDetailManager.currentChartType = type;
    updateChartData();
}

// Load related news
function loadRelatedNews(symbol) {
    var newsGrid = document.getElementById('relatedNewsGrid');
    var newsLoading = document.getElementById('newsLoading');
    var newsEmpty = document.getElementById('newsEmpty');
    
    if (!newsGrid) return;
    
    // Show loading state
    newsLoading.classList.remove('d-none');
    newsEmpty.classList.add('d-none');
    newsGrid.innerHTML = '';
    
    if (window.dataApi) {
        // Try to load news from API
        window.dataApi.getNews(symbol, function(error, data, response) {
            newsLoading.classList.add('d-none');
            
            if (error || !data || data.length === 0) {
                loadMockNews(symbol);
                return;
            }
            
            renderNewsItems(data.slice(0, 3)); // Show only first 3 news items
        });
    } else {
        // Load mock news
        setTimeout(function() {
            newsLoading.classList.add('d-none');
            loadMockNews(symbol);
        }, 1000);
    }
}

// Load mock news
function loadMockNews(symbol) {
    var companyName = getCompanyName(symbol);
    var mockNews = [
        {
            title: `${companyName} reports strong quarterly earnings, beats estimates`,
            publisher: 'Financial Times',
            date: Math.floor(Date.now() / 1000).toString()
        },
        {
            title: `Analysts upgrade ${symbol} price target following positive outlook`,
            publisher: 'MarketWatch',
            date: Math.floor((Date.now() - 86400000) / 1000).toString()
        },
        {
            title: `${companyName} announces new strategic initiative for growth`,
            publisher: 'Reuters',
            date: Math.floor((Date.now() - 172800000) / 1000).toString()
        }
    ];
    
    renderNewsItems(mockNews);
}

// Render news items
function renderNewsItems(newsItems) {
    var newsGrid = document.getElementById('relatedNewsGrid');
    var newsEmpty = document.getElementById('newsEmpty');
    
    if (!newsItems || newsItems.length === 0) {
        newsEmpty.classList.remove('d-none');
        return;
    }
    
    newsGrid.innerHTML = '';
    
    newsItems.forEach(function(news) {
        var newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        var newsDate = new Date(parseInt(news.date) * 1000);
        var formattedDate = newsDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        newsItem.innerHTML = `
            <div class="news-title">${escapeHtml(news.title)}</div>
            <div class="news-meta">
                <span class="news-publisher">${escapeHtml(news.publisher)}</span>
                <span class="news-date">${formattedDate}</span>
            </div>
        `;
        
        newsGrid.appendChild(newsItem);
    });
}

// Load similar stocks
function loadSimilarStocks(sector) {
    var similarGrid = document.getElementById('similarStocksGrid');
    if (!similarGrid) return;
    
    // For demo, load mock similar stocks
    loadMockSimilarStocks(sector);
}

// Load mock similar stocks
function loadMockSimilarStocks(sector) {
    var allStocks = ['AAPL', 'MSFT', 'GOOGL', 'TSLA'];
    var currentSymbol = StockDetailManager.currentSymbol;
    var similarStocks = allStocks.filter(function(symbol) {
        return symbol !== currentSymbol;
    }).slice(0, 3);
    
    var similarGrid = document.getElementById('similarStocksGrid');
    similarGrid.innerHTML = '';
    
    similarStocks.forEach(function(symbol) {
        var price = 150 + Math.random() * 100;
        var change = (Math.random() - 0.5) * 10;
        var changeClass = change >= 0 ? 'positive' : 'negative';
        
        var stockItem = document.createElement('a');
        stockItem.className = 'similar-stock-item';
        stockItem.href = `stock-detail.html?symbol=${symbol}`;
        
        stockItem.innerHTML = `
            <div class="similar-stock-symbol">${symbol}</div>
            <div class="similar-stock-name">${getCompanyName(symbol)}</div>
            <div class="similar-stock-price ${changeClass}">${formatCurrency(price)}</div>
        `;
        
        similarGrid.appendChild(stockItem);
    });
}

// Animate price update
function animatePriceUpdate() {
    var priceElement = document.getElementById('currentPrice');
    if (priceElement) {
        priceElement.style.transform = 'scale(1.05)';
        priceElement.style.transition = 'transform 0.3s ease';
        
        setTimeout(function() {
            priceElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// Show loading overlay
function showLoadingOverlay() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('d-none');
    }
}

// Hide loading overlay
function hideLoadingOverlay() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('d-none');
    }
}

// Show error state
function showErrorState(message) {
    hideLoadingOverlay();
    
    var errorState = document.getElementById('errorState');
    if (errorState) {
        errorState.classList.remove('d-none');
        
        var errorContent = errorState.querySelector('.error-content p');
        if (errorContent) {
            errorContent.textContent = message || 'The requested stock could not be found or is not available.';
        }
    }
    
    // Hide main content
    var sections = ['stock-header-section', 'stock-overview-section', 'stock-chart-section', 
                   'company-info-section', 'related-news-section', 'similar-stocks-section'];
    
    sections.forEach(function(sectionClass) {
        var section = document.querySelector('.' + sectionClass);
        if (section) {
            section.style.display = 'none';
        }
    });
}

// Retry loading stock
function retryLoadStock() {
    if (StockDetailManager.currentSymbol) {
        // Show loading overlay and retry
        showLoadingOverlay();
        
        // Reset sections visibility
        var sections = ['stock-header-section', 'stock-overview-section', 'stock-chart-section', 
                       'company-info-section', 'related-news-section', 'similar-stocks-section'];
        
        sections.forEach(function(sectionClass) {
            var section = document.querySelector('.' + sectionClass);
            if (section) {
                section.style.display = 'block';
            }
        });
        
        // Hide error state
        var errorState = document.getElementById('errorState');
        if (errorState) {
            errorState.classList.add('d-none');
        }
        
        // Retry loading
        setTimeout(function() {
            loadStockData(StockDetailManager.currentSymbol);
        }, 500);
    }
}

// Helper function to get company name
function getCompanyName(symbol) {
    var names = {
        'AAPL': 'Apple Inc.',
        'MSFT': 'Microsoft Corporation',
        'GOOGL': 'Alphabet Inc.',
        'TSLA': 'Tesla, Inc.',
        'AMZN': 'Amazon.com Inc.',
        'NVDA': 'NVIDIA Corporation',
        'META': 'Meta Platforms Inc.',
        'BRK.B': 'Berkshire Hathaway Inc.'
    };
    
    return names[symbol] || symbol + ' Corporation';
}

// Helper function to escape HTML
function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export manager for global access
window.StockDetailManager = StockDetailManager;
window.retryLoadStock = retryLoadStock;