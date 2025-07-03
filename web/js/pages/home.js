/**
 * YAUSMA Home Page - Simple JavaScript
 * Basic interactions for the landing page
 */

// Home page state
var HomePage = {
    watchlist: [],
    featuredStocks: [],
    isLoading: false
};

// Mock featured stocks data matching API structure
var mockFeaturedStocks = [
    {
        "name": "Apple Inc.",
        "short": "AAPL",
        "sector": "EQUITY",
        "current_price": "$175.43",
        "change": 1.66,
        "high": 178.21,
        "low": 173.52,
        "symbol": "AAPL",
        "volume": 89542103,
        "news_article": {
            "id": "apple-news-1",
            "title": "Apple's Q3 Earnings Beat Expectations with Strong iPhone Sales",
            "publisher": "MarketWatch",
            "source": "https://www.marketwatch.com/story/apple-earnings-q3-2025",
            "date": "1751550000"
        }
    },
    {
        "name": "Microsoft Corporation",
        "short": "MSFT",
        "sector": "EQUITY",
        "current_price": "$387.92",
        "change": 1.19,
        "high": 392.45,
        "low": 384.15,
        "symbol": "MSFT",
        "volume": 25847302,
        "news_article": {
            "id": "msft-news-1",
            "title": "Microsoft Azure Growth Accelerates as AI Demand Surges",
            "publisher": "Reuters",
            "source": "https://www.reuters.com/technology/microsoft-azure-ai-growth-2025",
            "date": "1751548000"
        }
    },
    {
        "name": "Alphabet Inc.",
        "short": "GOOGL",
        "sector": "EQUITY",
        "current_price": "$142.56",
        "change": -0.85,
        "high": 145.32,
        "low": 141.23,
        "symbol": "GOOGL",
        "volume": 34521890,
        "news_article": {
            "id": "googl-news-1",
            "title": "Google's AI Investments Show Strong Returns in Latest Quarter",
            "publisher": "TechCrunch",
            "source": "https://techcrunch.com/google-ai-investments-q3-2025",
            "date": "1751547000"
        }
    },
    {
        "name": "Tesla, Inc.",
        "short": "TSLA",
        "sector": "EQUITY",
        "current_price": "$248.50",
        "change": 2.33,
        "high": 255.78,
        "low": 243.12,
        "symbol": "TSLA",
        "volume": 156732891,
        "news_article": {
            "id": "tsla-news-1",
            "title": "Tesla Deliveries Exceed Expectations Despite Production Challenges",
            "publisher": "Bloomberg",
            "source": "https://www.bloomberg.com/news/tesla-deliveries-q2-2025",
            "date": "1751546000"
        }
    }
];

// Initialize page when loaded
document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

// Initialize the page
function initPage() {
    loadWatchlist();
    loadFeaturedStocks();
    startPriceUpdates();
    animateStats();
    createHeroChart();
}

// Load featured stocks data
function loadFeaturedStocks() {
    try {
        HomePage.isLoading = true;
        
        // Simulate API delay
        setTimeout(function() {
            HomePage.featuredStocks = mockFeaturedStocks;
            updateFeaturedStocksDisplay();
            HomePage.isLoading = false;
        }, 400);
        
    } catch (error) {
        console.error('Error loading featured stocks:', error);
        HomePage.isLoading = false;
    }
}

// Update featured stocks display with real data
function updateFeaturedStocksDisplay() {
    HomePage.featuredStocks.forEach(function(stock, index) {
        // Update price
        var priceElement = document.getElementById(stock.symbol.toLowerCase() + 'Price');
        if (priceElement) {
            priceElement.textContent = stock.current_price;
        }
        
        // Update change
        var changeElement = document.getElementById(stock.symbol.toLowerCase() + 'Change');
        if (changeElement) {
            var changePercent = stock.change.toFixed(2);
            var changeClass = stock.change >= 0 ? 'positive' : 'negative';
            var changeIcon = stock.change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
            var changeSign = stock.change >= 0 ? '+' : '';
            
            changeElement.className = `price-change ${changeClass}`;
            changeElement.innerHTML = `
                <i class="bi ${changeIcon}"></i>
                ${changeSign}$${Math.abs(stock.change * parseFloat(stock.current_price.replace('$', '')) / 100).toFixed(2)} (${changeSign}${changePercent}%)
            `;
        }
        
        // Add click handler to stock card
        var stockCard = changeElement ? changeElement.closest('.stock-card') : null;
        if (stockCard) {
            stockCard.setAttribute('data-symbol', stock.symbol);
            stockCard.style.cursor = 'pointer';
            stockCard.addEventListener('click', function() {
                goToStock(stock.symbol);
            });
        }
    });
}

// Theme toggle function - now handled by global theme manager
function toggleTheme() {
    // Call global theme manager
    if (window.themeManager) {
        return window.themeManager.toggleTheme();
    }
}

// Go to stock detail page
function goToStock(symbol) {
    window.location.href = 'pages/stock-detail.html?symbol=' + symbol;
}

// Toggle watchlist for a stock
function toggleWatchlist(symbol) {
    var index = HomePage.watchlist.indexOf(symbol);
    
    if (index > -1) {
        // Remove from watchlist
        HomePage.watchlist.splice(index, 1);
        console.log('Removed', symbol, 'from watchlist');
    } else {
        // Add to watchlist
        HomePage.watchlist.push(symbol);
        console.log('Added', symbol, 'to watchlist');
    }
    
    // Update UI
    updateWatchlistUI(symbol);
    
    // Save to localStorage
    saveWatchlist();
}

// Update watchlist UI
function updateWatchlistUI(symbol) {
    var watchlistButtons = document.querySelectorAll(`[onclick*="${symbol}"]`);
    var isInWatchlist = HomePage.watchlist.indexOf(symbol) > -1;
    
    watchlistButtons.forEach(function(button) {
        var icon = button.querySelector('i');
        if (icon) {
            if (isInWatchlist) {
                icon.className = 'bi bi-bookmark-fill';
                button.classList.add('active');
            } else {
                icon.className = 'bi bi-bookmark';
                button.classList.remove('active');
            }
        }
    });
}

// Load watchlist from localStorage
function loadWatchlist() {
    try {
        var saved = localStorage.getItem('yausma-watchlist');
        if (saved) {
            HomePage.watchlist = JSON.parse(saved);
        }
        
        // Update UI for all saved symbols
        HomePage.watchlist.forEach(function(symbol) {
            updateWatchlistUI(symbol);
        });
        
    } catch (error) {
        console.error('Error loading watchlist:', error);
        HomePage.watchlist = [];
    }
}

// Save watchlist to localStorage
function saveWatchlist() {
    try {
        localStorage.setItem('yausma-watchlist', JSON.stringify(HomePage.watchlist));
    } catch (error) {
        console.error('Error saving watchlist:', error);
    }
}







// Start updating stock prices
function startPriceUpdates() {
    updatePrices();
    // Update prices every 30 seconds
    setInterval(updatePrices, 30000);
}

// Update stock prices with simple animation
function updatePrices() {
    var stocks = [
        { id: 'aaplPrice', basePrice: 175.43 },
        { id: 'msftPrice', basePrice: 387.92 },
        { id: 'googlPrice', basePrice: 142.56 },
        { id: 'tslaPrice', basePrice: 248.50 },
        { id: 'spyPrice', basePrice: 4567.89 },
        { id: 'nasdaqPrice', basePrice: 14234.56 },
        { id: 'dowPrice', basePrice: 34789.12 }
    ];
    
    stocks.forEach(function(stock) {
        var element = document.getElementById(stock.id);
        if (element) {
            // Generate small random price change
            var change = (Math.random() - 0.5) * 0.02; // �1% change
            var newPrice = stock.basePrice * (1 + change);
            
            // Update price display
            if (stock.id.includes('Price')) {
                if (stock.basePrice > 1000) {
                    element.textContent = newPrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                } else {
                    element.textContent = '$' + newPrice.toFixed(2);
                }
            }
            
            // Add flash animation
            element.classList.add('price-flash');
            setTimeout(function() {
                element.classList.remove('price-flash');
            }, 1000);
        }
    });
}



// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Simple responsive adjustments
    var width = window.innerWidth;
    var heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle) {
        if (width < 768) {
            heroTitle.style.fontSize = '2rem';
        } else {
            heroTitle.style.fontSize = '';
        }
    }
});

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')) {
        var href = e.target.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// Simple animations on scroll
window.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset;
    var navbar = document.querySelector('.navbar');
    
    if (navbar) {
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Animate hero statistics counter
function animateStats() {
    var statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(function(stat) {
        var target = parseInt(stat.getAttribute('data-target'));
        var current = 0;
        var increment = target / 100;
        var duration = 2000; // 2 seconds
        var stepTime = duration / 100;
        
        var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target >= 1000) {
                stat.textContent = Math.floor(current).toLocaleString();
            } else {
                stat.textContent = Math.floor(current);
            }
        }, stepTime);
    });
}

// Create hero chart
function createHeroChart() {
    var canvas = document.getElementById('heroChart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    
    // Generate sample data points
    var data = [];
    var labels = [];
    var baseValue = 4500;
    
    for (var i = 0; i < 20; i++) {
        var change = (Math.random() - 0.5) * 100;
        baseValue += change;
        data.push(Math.max(baseValue, 4000));
        labels.push('');
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                borderColor: '#00d395',
                backgroundColor: 'rgba(0, 211, 149, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0
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
            elements: {
                point: { radius: 0 }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Enhanced price updates with animations
function updatePrices() {
    var stocks = [
        { id: 'aaplPrice', basePrice: 175.43 },
        { id: 'msftPrice', basePrice: 387.92 },
        { id: 'googlPrice', basePrice: 142.56 },
        { id: 'tslaPrice', basePrice: 248.50 },
        { id: 'spyPrice', basePrice: 4567.89 },
        { id: 'nasdaqPrice', basePrice: 14234.56 },
        { id: 'dowPrice', basePrice: 34789.12 }
    ];
    
    stocks.forEach(function(stock) {
        var element = document.getElementById(stock.id);
        if (element) {
            // Generate small random price change
            var change = (Math.random() - 0.5) * 0.02; // ±1% change
            var newPrice = stock.basePrice * (1 + change);
            
            // Animate price change
            animatePriceChange(element, newPrice, stock.basePrice > 1000);
        }
    });
}

// Animate individual price changes
function animatePriceChange(element, newPrice, isLargeNumber) {
    var currentValue = parseFloat(element.textContent.replace(/[,$]/g, ''));
    var startValue = currentValue;
    var duration = 1000;
    var startTime = Date.now();
    
    function animate() {
        var elapsed = Date.now() - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        var currentAnimatedValue = startValue + (newPrice - startValue) * easeProgress;
        
        if (isLargeNumber) {
            element.textContent = currentAnimatedValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            element.textContent = '$' + currentAnimatedValue.toFixed(2);
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Add flash animation class
            element.classList.add('price-flash');
            setTimeout(function() {
                element.classList.remove('price-flash');
            }, 1000);
        }
    }
    
    animate();
}

// Enhanced scroll animations
window.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset;
    var rate = scrolled * -0.5;
    
    // Parallax effect for floating shapes
    var shapes = document.querySelectorAll('.shape');
    shapes.forEach(function(shape, index) {
        var speed = (index + 1) * 0.5;
        shape.style.transform = 'translateY(' + (rate * speed) + 'px)';
    });
    
    // Navbar scroll effect
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Add smooth reveal animations for elements coming into view
function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScrollAnimations() {
    var elements = document.querySelectorAll('.stock-card, .feature-card');
    
    elements.forEach(function(element) {
        if (isElementInViewport(element) && !element.classList.contains('animate-in')) {
            element.classList.add('animate-in');
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}

// Throttled scroll handler
var scrollTimeout;
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            handleScrollAnimations();
            scrollTimeout = null;
        }, 100);
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme: toggleTheme,
        goToStock: goToStock,
        toggleWatchlist: toggleWatchlist,
        updatePrices: updatePrices,
        animateStats: animateStats,
        createHeroChart: createHeroChart
    };
}