/**
 * YAUSMA Home Page - Simple JavaScript
 * Basic interactions for the landing page
 */

// Simple variables
var watchlist = [];

// Initialize page when loaded
document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

// Initialize the page
function initPage() {
    loadWatchlist();
    startPriceUpdates();
    animateStats();
    createHeroChart();
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