/**
 * YAUSMA Portfolio Page JavaScript
 * Handles portfolio functionality, charts, and interactions
 */

// Portfolio data management
var PortfolioManager = {
    initialized: false,
    chart: null,
    holdings: [],
    currentSort: { column: null, direction: 'asc' },
    
    // Sample portfolio data
    sampleData: {
        totalValue: 157832.45,
        totalChange: 2847.32,
        totalChangePercent: 1.84,
        dailyPnL: 1243.76,
        dailyPnLPercent: 0.79,
        allocation: {
            stocks: 78.5,
            etfs: 15.2,
            cash: 6.3
        },
        holdings: [
            {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                shares: 125,
                price: 182.52,
                value: 22815.00,
                dayChange: 247.50,
                dayChangePercent: 1.10,
                totalPnL: 3247.50,
                totalPnLPercent: 16.60
            },
            {
                symbol: 'MSFT',
                name: 'Microsoft Corporation',
                shares: 75,
                price: 378.85,
                value: 28413.75,
                dayChange: -156.25,
                dayChangePercent: -0.55,
                totalPnL: 1847.25,
                totalPnLPercent: 6.95
            },
            {
                symbol: 'GOOGL',
                name: 'Alphabet Inc.',
                shares: 45,
                price: 142.38,
                value: 6407.10,
                dayChange: 89.55,
                dayChangePercent: 1.42,
                totalPnL: -234.90,
                totalPnLPercent: -3.53
            },
            {
                symbol: 'TSLA',
                name: 'Tesla, Inc.',
                shares: 80,
                price: 248.42,
                value: 19873.60,
                dayChange: 496.80,
                dayChangePercent: 2.56,
                totalPnL: 2173.60,
                totalPnLPercent: 12.27
            },
            {
                symbol: 'AMZN',
                name: 'Amazon.com Inc.',
                shares: 35,
                price: 145.86,
                value: 5105.10,
                dayChange: -72.45,
                dayChangePercent: -1.40,
                totalPnL: 455.10,
                totalPnLPercent: 9.80
            },
            {
                symbol: 'NVDA',
                name: 'NVIDIA Corporation',
                shares: 60,
                price: 875.28,
                value: 52516.80,
                dayChange: 788.40,
                dayChangePercent: 1.52,
                totalPnL: 15216.80,
                totalPnLPercent: 40.78
            }
        ],
        recentActivity: [
            {
                type: 'buy',
                symbol: 'NVDA',
                shares: 10,
                price: 862.15,
                date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                amount: 8621.50
            },
            {
                type: 'sell',
                symbol: 'AMZN',
                shares: 15,
                price: 149.32,
                date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                amount: 2239.80
            },
            {
                type: 'buy',
                symbol: 'AAPL',
                shares: 25,
                price: 179.88,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                amount: 4497.00
            }
        ]
    }
};

// Initialize portfolio page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('portfolioChart')) {
        initPortfolioPage();
    }
});

// Main initialization function
function initPortfolioPage() {
    if (PortfolioManager.initialized) {
        return;
    }
    
    try {
        // Initialize components
        initPortfolioChart();
        initHoldingsTable();
        initActivityFeed();
        initInteractions();
        loadPortfolioData();
        
        PortfolioManager.initialized = true;
        
        if (YAUSMA.debug) {
            console.log('Portfolio page initialized successfully');
        }
        
    } catch (error) {
        console.error('Failed to initialize portfolio page:', error);
        showEmptyState();
    }
}

// Initialize portfolio performance chart
function initPortfolioChart() {
    var ctx = document.getElementById('portfolioChart');
    if (!ctx) return;
    
    // Generate sample chart data
    var chartData = generateChartData();
    
    PortfolioManager.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Portfolio Value',
                data: chartData.values,
                borderColor: 'var(--interactive-blue)',
                backgroundColor: 'rgba(52, 74, 251, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'var(--interactive-blue)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
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
                            return 'Portfolio Value: ' + formatCurrency(context.parsed.y);
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
                        }
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
                            return formatCurrency(value);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    // Initialize time range selector
    initTimeRangeSelector();
}

// Generate sample chart data
function generateChartData() {
    var labels = [];
    var values = [];
    var baseValue = 150000;
    var currentDate = new Date();
    
    // Generate 30 days of data
    for (var i = 29; i >= 0; i--) {
        var date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Generate realistic portfolio value fluctuations
        var variation = (Math.random() - 0.5) * 5000;
        var trendGrowth = i * 200; // Slight upward trend
        values.push(baseValue + variation + trendGrowth);
    }
    
    return { labels: labels, values: values };
}

// Initialize time range selector
function initTimeRangeSelector() {
    var timeButtons = document.querySelectorAll('.time-btn');
    
    timeButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            timeButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update chart data based on selection
            var period = this.getAttribute('data-period');
            updateChartData(period);
        });
    });
}

// Update chart data based on time period
function updateChartData(period) {
    if (!PortfolioManager.chart) return;
    
    // Show loading animation
    PortfolioManager.chart.options.animation.duration = 500;
    
    var newData = generateChartDataForPeriod(period);
    PortfolioManager.chart.data.labels = newData.labels;
    PortfolioManager.chart.data.datasets[0].data = newData.values;
    PortfolioManager.chart.update();
}

// Generate chart data for specific period
function generateChartDataForPeriod(period) {
    var labels = [];
    var values = [];
    var baseValue = 150000;
    var currentDate = new Date();
    var days;
    
    switch (period) {
        case '1D':
            days = 1;
            // Generate hourly data for 1 day
            for (var i = 23; i >= 0; i--) {
                var date = new Date(currentDate);
                date.setHours(date.getHours() - i);
                labels.push(date.toLocaleTimeString('en-US', { hour: 'numeric' }));
                values.push(baseValue + (Math.random() - 0.5) * 1000);
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
        case 'ALL':
            days = 730; // 2 years
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
            
            var variation = (Math.random() - 0.5) * 5000;
            var trendGrowth = (days - i) * 50;
            values.push(baseValue + variation + trendGrowth);
        }
    }
    
    return { labels: labels, values: values };
}

// Initialize holdings table
function initHoldingsTable() {
    var table = document.getElementById('holdingsTable');
    if (!table) return;
    
    // Initialize sorting
    var sortableHeaders = table.querySelectorAll('.sortable');
    sortableHeaders.forEach(function(header) {
        header.addEventListener('click', function() {
            var column = this.getAttribute('data-sort');
            sortHoldings(column);
        });
    });
}

// Sort holdings table
function sortHoldings(column) {
    var direction = 'asc';
    
    if (PortfolioManager.currentSort.column === column) {
        direction = PortfolioManager.currentSort.direction === 'asc' ? 'desc' : 'asc';
    }
    
    PortfolioManager.currentSort = { column: column, direction: direction };
    
    // Sort the holdings data
    PortfolioManager.holdings.sort(function(a, b) {
        var aValue = a[column];
        var bValue = b[column];
        
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (direction === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });
    
    // Update table display
    renderHoldingsTable();
    updateSortIndicators(column, direction);
}

// Update sort indicators
function updateSortIndicators(column, direction) {
    var headers = document.querySelectorAll('.sortable .sort-icon');
    headers.forEach(function(icon) {
        icon.className = 'bi bi-arrow-up-down sort-icon';
    });
    
    var activeHeader = document.querySelector('[data-sort="' + column + '"] .sort-icon');
    if (activeHeader) {
        activeHeader.className = direction === 'asc' ? 
            'bi bi-arrow-up sort-icon' : 
            'bi bi-arrow-down sort-icon';
    }
}

// Render holdings table
function renderHoldingsTable() {
    var tbody = document.getElementById('holdingsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    PortfolioManager.holdings.forEach(function(holding) {
        var row = createHoldingRow(holding);
        tbody.appendChild(row);
    });
}

// Create holding table row
function createHoldingRow(holding) {
    var row = document.createElement('tr');
    
    // Symbol and name
    var symbolCell = document.createElement('td');
    symbolCell.innerHTML = 
        '<div class="stock-symbol">' + holding.symbol + '</div>' +
        '<div class="stock-name">' + holding.name + '</div>';
    row.appendChild(symbolCell);
    
    // Company name (hidden on mobile)
    var nameCell = document.createElement('td');
    nameCell.textContent = holding.name;
    nameCell.className = 'd-none d-md-table-cell';
    row.appendChild(nameCell);
    
    // Shares
    var sharesCell = document.createElement('td');
    sharesCell.className = 'text-right financial-data';
    sharesCell.textContent = formatNumber(holding.shares);
    row.appendChild(sharesCell);
    
    // Price
    var priceCell = document.createElement('td');
    priceCell.className = 'text-right financial-data';
    priceCell.textContent = formatCurrency(holding.price);
    row.appendChild(priceCell);
    
    // Market value
    var valueCell = document.createElement('td');
    valueCell.className = 'text-right financial-data';
    valueCell.textContent = formatCurrency(holding.value);
    row.appendChild(valueCell);
    
    // Day change
    var changeCell = document.createElement('td');
    changeCell.className = 'text-right change-cell';
    var changeClass = holding.dayChange >= 0 ? 'positive' : 'negative';
    changeCell.innerHTML = 
        '<div class="change-amount ' + changeClass + '">' + formatCurrency(holding.dayChange) + '</div>' +
        '<div class="change-percentage ' + changeClass + '">' + formatPercentage(holding.dayChangePercent) + '</div>';
    row.appendChild(changeCell);
    
    // Total P&L
    var pnlCell = document.createElement('td');
    pnlCell.className = 'text-right change-cell';
    var pnlClass = holding.totalPnL >= 0 ? 'positive' : 'negative';
    pnlCell.innerHTML = 
        '<div class="change-amount ' + pnlClass + '">' + formatCurrency(holding.totalPnL) + '</div>' +
        '<div class="change-percentage ' + pnlClass + '">' + formatPercentage(holding.totalPnLPercent) + '</div>';
    row.appendChild(pnlCell);
    
    // Actions
    var actionsCell = document.createElement('td');
    actionsCell.className = 'text-center';
    actionsCell.innerHTML = 
        '<div class="action-buttons">' +
            '<button class="action-btn-small buy-btn" data-symbol="' + holding.symbol + '">Buy</button>' +
            '<button class="action-btn-small sell-btn" data-symbol="' + holding.symbol + '">Sell</button>' +
        '</div>';
    row.appendChild(actionsCell);
    
    return row;
}

// Initialize activity feed
function initActivityFeed() {
    renderActivityFeed();
}

// Render activity feed
function renderActivityFeed() {
    var activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    PortfolioManager.sampleData.recentActivity.forEach(function(activity) {
        var item = createActivityItem(activity);
        activityList.appendChild(item);
    });
}

// Create activity item
function createActivityItem(activity) {
    var item = document.createElement('div');
    item.className = 'activity-item';
    
    var iconClass = activity.type === 'buy' ? 'bi-plus' : 'bi-dash';
    var iconBg = activity.type === 'buy' ? 'buy' : 'sell';
    var actionText = activity.type === 'buy' ? 'Bought' : 'Sold';
    
    item.innerHTML = 
        '<div class="activity-icon ' + iconBg + '">' +
            '<i class="bi ' + iconClass + '"></i>' +
        '</div>' +
        '<div class="activity-content">' +
            '<div class="activity-description">' +
                actionText + ' ' + activity.shares + ' shares of ' + activity.symbol +
            '</div>' +
            '<div class="activity-time">' + formatTimeAgo(activity.date) + '</div>' +
        '</div>' +
        '<div class="activity-amount">' + formatCurrency(activity.amount) + '</div>';
    
    return item;
}

// Format time ago helper
function formatTimeAgo(date) {
    var now = new Date();
    var diffMs = now - date;
    var diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
        return diffDays + (diffDays === 1 ? ' day ago' : ' days ago');
    } else if (diffHours > 0) {
        return diffHours + (diffHours === 1 ? ' hour ago' : ' hours ago');
    } else {
        return 'Just now';
    }
}

// Initialize interactions
function initInteractions() {
    // Quick action buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.action-btn, .action-btn *')) {
            handleQuickAction(e);
        }
        
        if (e.target.matches('.action-btn-small, .action-btn-small *')) {
            handleTableAction(e);
        }
    });
    
    // Add hover animations to cards
    var summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Handle quick action button clicks
function handleQuickAction(e) {
    e.preventDefault();
    
    var button = e.target.closest('.action-btn');
    if (!button) return;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(function() {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Handle table action button clicks
function handleTableAction(e) {
    e.preventDefault();
    
    var button = e.target.closest('.action-btn-small');
    if (!button) return;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(function() {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Load portfolio data
function loadPortfolioData() {
    // In a real app, this would load from API
    // For demo, use sample data
    PortfolioManager.holdings = PortfolioManager.sampleData.holdings;
    
    // Update summary cards with animation
    updateSummaryCards();
    
    // Render holdings table
    renderHoldingsTable();
    
    // Add loading animation
    setTimeout(function() {
        hideLoadingStates();
    }, 1000);
}

// Update summary cards
function updateSummaryCards() {
    var data = PortfolioManager.sampleData;
    
    // Animate number changes
    animateValue('totalValue', 0, data.totalValue, 1000, formatCurrency);
    
    // Update change indicators
    setTimeout(function() {
        var changeElement = document.getElementById('totalChange');
        if (changeElement) {
            var changeClass = data.totalChange >= 0 ? 'positive' : 'negative';
            var changeIcon = data.totalChange >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
            changeElement.className = 'value-change ' + changeClass;
            changeElement.innerHTML = 
                '<i class="bi ' + changeIcon + '"></i>' +
                '<span>' + formatCurrency(data.totalChange) + ' (' + formatPercentage(data.totalChangePercent) + ')</span>';
        }
        
        var pnlElement = document.getElementById('dailyPnL');
        if (pnlElement) {
            var pnlClass = data.dailyPnL >= 0 ? 'positive' : 'negative';
            pnlElement.className = 'daily-pnl ' + pnlClass;
            pnlElement.textContent = (data.dailyPnL >= 0 ? '+' : '') + formatCurrency(data.dailyPnL);
        }
    }, 500);
}

// Animate number value
function animateValue(elementId, start, end, duration, formatter) {
    var element = document.getElementById(elementId);
    if (!element) return;
    
    var startTime = null;
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        var progress = Math.min((currentTime - startTime) / duration, 1);
        var current = start + (end - start) * easeOutQuart(progress);
        
        element.textContent = formatter ? formatter(current) : current.toFixed(0);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Easing function
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Hide loading states
function hideLoadingStates() {
    var loadingStates = document.querySelectorAll('.loading-state');
    loadingStates.forEach(function(state) {
        state.classList.add('d-none');
    });
}

// Show empty state (fallback)
function showEmptyState() {
    var emptyStates = document.querySelectorAll('.empty-state');
    emptyStates.forEach(function(state) {
        state.classList.remove('d-none');
    });
    
    hideLoadingStates();
}

// Export portfolio manager for global access
window.PortfolioManager = PortfolioManager;