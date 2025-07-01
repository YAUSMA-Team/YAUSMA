// YAUSMA Portfolio Page - Interactive Features and Data Management

class PortfolioManager {
    constructor() {
        this.portfolioData = {
            totalValue: 0,
            todayGainLoss: 0,
            totalGainLoss: 0,
            buyingPower: 25000,
            holdings: [],
            transactions: [],
            performanceHistory: [],
            sectorAllocation: {}
        };
        
        this.charts = {
            portfolioChart: null,
            allocationChart: null,
            sectorChart: null
        };
        
        this.init();
    }

    init() {
        this.loadMockData();
        this.initializeEventListeners();
        this.renderPortfolioSummary();
        this.renderCharts();
        this.renderHoldingsTable();
        this.renderTransactionsTable();
        this.setupPerformanceMetrics();
    }

    loadMockData() {
        // Mock holdings data
        this.portfolioData.holdings = [
            {
                symbol: 'AAPL',
                company: 'Apple Inc.',
                shares: 150,
                avgCost: 165.50,
                currentPrice: 175.43,
                sector: 'Technology',
                marketValue: 26314.50,
                gainLoss: 1489.50,
                gainLossPercent: 6.00,
                dividendYield: 0.52
            },
            {
                symbol: 'MSFT',
                company: 'Microsoft Corporation',
                shares: 75,
                avgCost: 380.00,
                currentPrice: 387.92,
                sector: 'Technology',
                marketValue: 29094.00,
                gainLoss: 594.00,
                gainLossPercent: 2.08,
                dividendYield: 0.68
            },
            {
                symbol: 'GOOGL',
                company: 'Alphabet Inc.',
                shares: 50,
                avgCost: 2650.00,
                currentPrice: 2721.35,
                sector: 'Technology',
                marketValue: 136067.50,
                gainLoss: 3567.50,
                gainLossPercent: 2.69,
                dividendYield: 0.00
            },
            {
                symbol: 'TSLA',
                company: 'Tesla Inc.',
                shares: 100,
                avgCost: 245.00,
                currentPrice: 234.56,
                sector: 'Consumer Discretionary',
                marketValue: 23456.00,
                gainLoss: -1044.00,
                gainLossPercent: -4.26,
                dividendYield: 0.00
            },
            {
                symbol: 'AMZN',
                company: 'Amazon.com Inc.',
                shares: 25,
                avgCost: 3200.00,
                currentPrice: 3289.47,
                sector: 'Consumer Discretionary',
                marketValue: 82236.75,
                gainLoss: 2236.75,
                gainLossPercent: 2.79,
                dividendYield: 0.00
            },
            {
                symbol: 'JPM',
                company: 'JPMorgan Chase & Co.',
                shares: 200,
                avgCost: 145.00,
                currentPrice: 152.83,
                sector: 'Financial Services',
                marketValue: 30566.00,
                gainLoss: 1566.00,
                gainLossPercent: 5.40,
                dividendYield: 2.47
            },
            {
                symbol: 'JNJ',
                company: 'Johnson & Johnson',
                shares: 100,
                avgCost: 162.00,
                currentPrice: 158.94,
                sector: 'Healthcare',
                marketValue: 15894.00,
                gainLoss: -306.00,
                gainLossPercent: -1.89,
                dividendYield: 2.91
            },
            {
                symbol: 'V',
                company: 'Visa Inc.',
                shares: 80,
                avgCost: 225.00,
                currentPrice: 241.67,
                sector: 'Financial Services',
                marketValue: 19333.60,
                gainLoss: 1333.60,
                gainLossPercent: 7.41,
                dividendYield: 0.71
            }
        ];

        // Mock transactions data
        this.portfolioData.transactions = [
            {
                date: '2024-06-28',
                symbol: 'AAPL',
                type: 'BUY',
                quantity: 50,
                price: 175.43,
                total: 8771.50,
                status: 'COMPLETED'
            },
            {
                date: '2024-06-25',
                symbol: 'MSFT',
                type: 'BUY',
                quantity: 25,
                price: 387.92,
                total: 9698.00,
                status: 'COMPLETED'
            },
            {
                date: '2024-06-20',
                symbol: 'TSLA',
                type: 'SELL',
                quantity: 25,
                price: 234.56,
                total: 5864.00,
                status: 'COMPLETED'
            },
            {
                date: '2024-06-18',
                symbol: 'GOOGL',
                type: 'BUY',
                quantity: 10,
                price: 2721.35,
                total: 27213.50,
                status: 'COMPLETED'
            },
            {
                date: '2024-06-15',
                symbol: 'V',
                type: 'BUY',
                quantity: 40,
                price: 241.67,
                total: 9666.80,
                status: 'COMPLETED'
            }
        ];

        // Calculate portfolio totals
        this.calculatePortfolioMetrics();
    }

    calculatePortfolioMetrics() {
        let totalValue = 0;
        let totalCost = 0;
        let todayGain = 0;
        let sectorAllocation = {};

        this.portfolioData.holdings.forEach(holding => {
            totalValue += holding.marketValue;
            totalCost += holding.shares * holding.avgCost;
            
            // Calculate today's gain (assuming 1% daily change for demo)
            const dailyChange = holding.marketValue * (Math.random() * 0.04 - 0.02);
            todayGain += dailyChange;

            // Sector allocation
            if (!sectorAllocation[holding.sector]) {
                sectorAllocation[holding.sector] = 0;
            }
            sectorAllocation[holding.sector] += holding.marketValue;
        });

        this.portfolioData.totalValue = totalValue;
        this.portfolioData.totalGainLoss = totalValue - totalCost;
        this.portfolioData.todayGainLoss = todayGain;
        this.portfolioData.sectorAllocation = sectorAllocation;

        // Generate performance history (mock data)
        this.generatePerformanceHistory();
    }

    generatePerformanceHistory() {
        const days = 30;
        const baseValue = this.portfolioData.totalValue * 0.95;
        const history = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const randomChange = (Math.random() - 0.5) * 0.02;
            const value = baseValue * (1 + randomChange * (days - i) / days + Math.random() * 0.01);
            
            history.push({
                date: date.toISOString().split('T')[0],
                value: value
            });
        }
        
        this.portfolioData.performanceHistory = history;
    }

    initializeEventListeners() {
        // Refresh portfolio button
        document.getElementById('refreshPortfolio')?.addEventListener('click', () => {
            this.refreshPortfolio();
        });

        // Add holding button
        document.getElementById('addHolding')?.addEventListener('click', () => {
            this.showAddHoldingModal();
        });

        // Save holding button
        document.getElementById('saveHolding')?.addEventListener('click', () => {
            this.saveNewHolding();
        });

        // Performance period buttons
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updatePerformanceChart(e.target.dataset.period);
            });
        });

        // Holdings search
        document.getElementById('holdingsSearch')?.addEventListener('input', (e) => {
            this.filterHoldings(e.target.value);
        });

        // Holdings sort
        document.getElementById('holdingsSort')?.addEventListener('change', (e) => {
            this.sortHoldings(e.target.value);
        });

        // View all transactions
        document.getElementById('viewAllTransactions')?.addEventListener('click', () => {
            this.showAllTransactions();
        });
    }

    renderPortfolioSummary() {
        // Update summary cards
        document.getElementById('totalValue').textContent = this.formatCurrency(this.portfolioData.totalValue);
        
        const totalChange = this.portfolioData.totalGainLoss;
        const totalChangePercent = (totalChange / (this.portfolioData.totalValue - totalChange)) * 100;
        
        const totalChangeElement = document.getElementById('totalValueChange');
        totalChangeElement.textContent = `${this.formatCurrency(totalChange)} (${totalChangePercent.toFixed(2)}%)`;
        totalChangeElement.className = `value-change ${totalChange >= 0 ? 'positive' : 'negative'}`;

        const todayGainLossElement = document.getElementById('todayGainLoss');
        const todayPercent = (this.portfolioData.todayGainLoss / this.portfolioData.totalValue) * 100;
        todayGainLossElement.textContent = this.formatCurrency(this.portfolioData.todayGainLoss);
        
        const todayPercentElement = document.getElementById('todayGainLossPercent');
        todayPercentElement.textContent = `${todayPercent.toFixed(2)}%`;
        todayPercentElement.className = `value-change ${this.portfolioData.todayGainLoss >= 0 ? 'positive' : 'negative'}`;

        const totalGainLossElement = document.getElementById('totalGainLoss');
        totalGainLossElement.textContent = this.formatCurrency(totalChange);
        
        const totalGainLossPercentElement = document.getElementById('totalGainLossPercent');
        totalGainLossPercentElement.textContent = `${totalChangePercent.toFixed(2)}%`;
        totalGainLossPercentElement.className = `value-change ${totalChange >= 0 ? 'positive' : 'negative'}`;

        document.getElementById('buyingPower').textContent = this.formatCurrency(this.portfolioData.buyingPower);
    }

    renderCharts() {
        this.renderPerformanceChart();
        this.renderAllocationChart();
        this.renderSectorChart();
    }

    renderPerformanceChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) return;

        const data = this.portfolioData.performanceHistory;
        const labels = data.map(d => new Date(d.date).toLocaleDateString());
        const values = data.map(d => d.value);

        this.charts.portfolioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Portfolio Value',
                    data: values,
                    borderColor: 'var(--interactive-blue)',
                    backgroundColor: 'rgba(52, 74, 251, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5
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
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `Portfolio Value: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, false)
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    renderAllocationChart() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) return;

        const holdings = this.portfolioData.holdings.slice(0, 5); // Top 5 holdings
        const others = this.portfolioData.holdings.slice(5);
        const othersValue = others.reduce((sum, h) => sum + h.marketValue, 0);

        const labels = holdings.map(h => h.symbol);
        const data = holdings.map(h => h.marketValue);
        const colors = [
            '#344afb', '#00d395', '#f92364', '#ffc947', '#8a2be2'
        ];

        if (othersValue > 0) {
            labels.push('Others');
            data.push(othersValue);
            colors.push('#6c757d');
        }

        this.charts.allocationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0,
                    cutout: '70%'
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
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Render allocation legend
        this.renderAllocationLegend(labels, data, colors);
    }

    renderAllocationLegend(labels, data, colors) {
        const legendContainer = document.getElementById('allocationLegend');
        if (!legendContainer) return;

        const total = data.reduce((a, b) => a + b, 0);
        
        legendContainer.innerHTML = labels.map((label, index) => {
            const value = data[index];
            const percentage = ((value / total) * 100).toFixed(1);
            
            return `
                <div class="legend-item">
                    <div class="legend-left">
                        <div class="legend-color" style="background-color: ${colors[index]}"></div>
                        <span class="legend-label">${label}</span>
                    </div>
                    <span class="legend-value">${percentage}%</span>
                </div>
            `;
        }).join('');
    }

    renderSectorChart() {
        const ctx = document.getElementById('sectorChart');
        if (!ctx) return;

        const sectors = Object.keys(this.portfolioData.sectorAllocation);
        const values = Object.values(this.portfolioData.sectorAllocation);
        const colors = ['#344afb', '#00d395', '#f92364', '#ffc947', '#8a2be2', '#17a2b8'];

        this.charts.sectorChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: sectors,
                datasets: [{
                    data: values,
                    backgroundColor: colors.slice(0, sectors.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderHoldingsTable() {
        const tbody = document.getElementById('holdingsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.portfolioData.holdings.map(holding => {
            const gainLossClass = holding.gainLoss >= 0 ? 'positive' : 'negative';
            
            return `
                <tr>
                    <td>
                        <div class="stock-symbol">${holding.symbol}</div>
                    </td>
                    <td>
                        <div class="company-name">${holding.company}</div>
                    </td>
                    <td class="financial-value">${holding.shares}</td>
                    <td class="financial-value">${this.formatCurrency(holding.avgCost)}</td>
                    <td class="financial-value">${this.formatCurrency(holding.currentPrice)}</td>
                    <td class="financial-value">${this.formatCurrency(holding.marketValue)}</td>
                    <td class="gain-loss ${gainLossClass}">
                        ${this.formatCurrency(holding.gainLoss)}<br>
                        <small>${holding.gainLossPercent.toFixed(2)}%</small>
                    </td>
                    <td class="financial-value">
                        ${((holding.marketValue / this.portfolioData.totalValue) * 100).toFixed(1)}%
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-coinbase-primary btn-sm" onclick="portfolioManager.buyMore('${holding.symbol}')">
                                <i class="bi bi-plus"></i>
                            </button>
                            <button class="btn btn-coinbase-secondary btn-sm" onclick="portfolioManager.sellHolding('${holding.symbol}')">
                                <i class="bi bi-dash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderTransactionsTable() {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.portfolioData.transactions.map(transaction => {
            return `
                <tr>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td class="stock-symbol">${transaction.symbol}</td>
                    <td>
                        <span class="transaction-type ${transaction.type.toLowerCase()}">${transaction.type}</span>
                    </td>
                    <td class="financial-value">${transaction.quantity}</td>
                    <td class="financial-value">${this.formatCurrency(transaction.price)}</td>
                    <td class="financial-value">${this.formatCurrency(transaction.total)}</td>
                    <td>
                        <span class="transaction-status ${transaction.status.toLowerCase()}">${transaction.status}</span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    setupPerformanceMetrics() {
        // These would typically be calculated from historical data
        const metrics = {
            sharpeRatio: 1.24,
            beta: 1.05,
            alpha: 2.3,
            volatility: 18.5,
            maxDrawdown: -12.3,
            dividendYield: 2.1
        };

        Object.entries(metrics).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'alpha' || key === 'volatility' || key === 'dividendYield' || key === 'maxDrawdown') {
                    element.textContent = value + '%';
                } else {
                    element.textContent = value.toString();
                }
            }
        });
    }

    // Utility methods
    formatCurrency(amount, showCents = true) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: showCents ? 2 : 0,
            maximumFractionDigits: showCents ? 2 : 0
        });
        return formatter.format(amount);
    }

    refreshPortfolio() {
        // Show loading state
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }

        // Simulate API call
        setTimeout(() => {
            this.loadMockData();
            this.renderPortfolioSummary();
            this.updateCharts();
            this.renderHoldingsTable();
            this.renderTransactionsTable();
            
            if (overlay) {
                overlay.classList.remove('show');
            }
        }, 1500);
    }

    updateCharts() {
        // Update existing charts with new data
        if (this.charts.portfolioChart) {
            this.charts.portfolioChart.destroy();
        }
        if (this.charts.allocationChart) {
            this.charts.allocationChart.destroy();
        }
        if (this.charts.sectorChart) {
            this.charts.sectorChart.destroy();
        }
        
        this.renderCharts();
    }

    updatePerformanceChart(period) {
        // This would filter the performance history based on the selected period
        console.log(`Updating chart for period: ${period}`);
        // For now, we'll just re-render the same chart
    }

    showAddHoldingModal() {
        const modal = new bootstrap.Modal(document.getElementById('addHoldingModal'));
        modal.show();
    }

    saveNewHolding() {
        const form = document.getElementById('addHoldingForm');
        const formData = new FormData(form);
        
        const newHolding = {
            symbol: document.getElementById('stockSymbol').value.toUpperCase(),
            company: `${document.getElementById('stockSymbol').value.toUpperCase()} Corp.`, // Mock company name
            shares: parseInt(document.getElementById('shares').value),
            avgCost: parseFloat(document.getElementById('avgCost').value),
            currentPrice: parseFloat(document.getElementById('avgCost').value) * (1 + (Math.random() * 0.1 - 0.05)), // Mock current price
            sector: 'Technology', // Mock sector
            marketValue: 0,
            gainLoss: 0,
            gainLossPercent: 0,
            dividendYield: Math.random() * 3
        };

        // Calculate derived values
        newHolding.marketValue = newHolding.shares * newHolding.currentPrice;
        newHolding.gainLoss = newHolding.marketValue - (newHolding.shares * newHolding.avgCost);
        newHolding.gainLossPercent = (newHolding.gainLoss / (newHolding.shares * newHolding.avgCost)) * 100;

        // Add to portfolio
        this.portfolioData.holdings.push(newHolding);
        
        // Recalculate metrics
        this.calculatePortfolioMetrics();
        
        // Update UI
        this.renderPortfolioSummary();
        this.renderHoldingsTable();
        this.updateCharts();

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addHoldingModal'));
        modal.hide();
        form.reset();
    }

    filterHoldings(searchTerm) {
        const rows = document.querySelectorAll('#holdingsTableBody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const symbol = row.querySelector('.stock-symbol').textContent.toLowerCase();
            const company = row.querySelector('.company-name').textContent.toLowerCase();
            
            if (symbol.includes(term) || company.includes(term)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    sortHoldings(sortBy) {
        let sortedHoldings = [...this.portfolioData.holdings];

        switch (sortBy) {
            case 'symbol':
                sortedHoldings.sort((a, b) => a.symbol.localeCompare(b.symbol));
                break;
            case 'value':
                sortedHoldings.sort((a, b) => b.marketValue - a.marketValue);
                break;
            case 'gainLoss':
                sortedHoldings.sort((a, b) => b.gainLoss - a.gainLoss);
                break;
            case 'percent':
                sortedHoldings.sort((a, b) => b.gainLossPercent - a.gainLossPercent);
                break;
        }

        this.portfolioData.holdings = sortedHoldings;
        this.renderHoldingsTable();
    }

    buyMore(symbol) {
        console.log(`Buy more ${symbol}`);
        // Implementation for buying more shares
    }

    sellHolding(symbol) {
        console.log(`Sell ${symbol}`);
        // Implementation for selling shares
    }

    showAllTransactions() {
        console.log('Show all transactions');
        // Implementation for showing all transactions
    }
}

// Initialize portfolio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the portfolio page
    if (document.getElementById('portfolioChart')) {
        window.portfolioManager = new PortfolioManager();
    }
});

// Handle theme changes for charts
document.addEventListener('themeChanged', (e) => {
    if (window.portfolioManager && window.portfolioManager.charts) {
        // Update chart colors based on theme
        setTimeout(() => {
            window.portfolioManager.updateCharts();
        }, 100);
    }
});

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}