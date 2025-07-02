// YAUSMA Portfolio Page - Professional Portfolio Management System
// Institutional-grade features with Coinbase-level sophistication

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
            sectorAllocation: {},
            benchmarkData: [],
            riskMetrics: {},
            dividendHistory: [],
            alerts: []
        };
        
        this.charts = {
            portfolioChart: null,
            allocationChart: null,
            sectorChart: null
        };
        
        this.config = {
            updateInterval: 30000, // 30 seconds
            chartColors: {
                primary: '#344afb',
                success: '#00d395',
                danger: '#f92364',
                warning: '#ffc947',
                info: '#17a2b8',
                secondary: '#6c757d'
            },
            benchmarkSymbol: 'SPY' // S&P 500 benchmark
        };
        
        this.updateTimer = null;
        this.filteredHoldings = [];
        this.sortDirection = 'desc';
        this.currentPeriod = '1M';
        
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
        this.calculateAdvancedMetrics();
        this.startRealTimeUpdates();
        this.setupKeyboardShortcuts();
        this.initializeTooltips();
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
        this.generateBenchmarkData();
        this.calculateRiskMetrics();
        this.generateDividendHistory();
    }

    generatePerformanceHistory() {
        const periods = {
            '1D': 1,
            '1W': 7,
            '1M': 30,
            '3M': 90,
            '1Y': 365,
            'ALL': 730
        };
        
        const days = periods[this.currentPeriod] || 30;
        const baseValue = this.portfolioData.totalValue * 0.95;
        const history = [];
        
        let cumulativeReturn = 0;
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // More realistic price movement simulation
            const dailyReturn = this.generateRealisticReturn();
            cumulativeReturn += dailyReturn;
            
            const value = baseValue * (1 + cumulativeReturn);
            
            history.push({
                date: date.toISOString().split('T')[0],
                value: value,
                dailyReturn: dailyReturn,
                cumulativeReturn: cumulativeReturn
            });
        }
        
        this.portfolioData.performanceHistory = history;
    }
    
    generateRealisticReturn() {
        // Simulate realistic stock market returns with volatility clustering
        const mean = 0.0008; // ~20% annual return
        const volatility = 0.015; // ~24% annual volatility
        
        // Box-Muller transformation for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        return mean + volatility * z;
    }
    
    generateBenchmarkData() {
        const history = this.portfolioData.performanceHistory;
        const benchmarkData = [];
        
        let baseValue = 100; // Start at $100 for percentage comparison
        let cumulativeReturn = 0;
        
        history.forEach((point, index) => {
            // S&P 500 typically has lower volatility than individual portfolios
            const benchmarkReturn = this.generateRealisticReturn() * 0.8;
            cumulativeReturn += benchmarkReturn;
            
            benchmarkData.push({
                date: point.date,
                value: baseValue * (1 + cumulativeReturn),
                dailyReturn: benchmarkReturn,
                cumulativeReturn: cumulativeReturn
            });
        });
        
        this.portfolioData.benchmarkData = benchmarkData;
    }
    
    calculateRiskMetrics() {
        const returns = this.portfolioData.performanceHistory.map(p => p.dailyReturn || 0);
        const benchmarkReturns = this.portfolioData.benchmarkData.map(b => b.dailyReturn || 0);
        
        // Calculate various risk metrics
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const benchmarkAvgReturn = benchmarkReturns.reduce((a, b) => a + b, 0) / benchmarkReturns.length;
        
        // Standard deviation (volatility)
        const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
        const volatility = Math.sqrt(variance) * Math.sqrt(252); // Annualized
        
        // Beta calculation
        const covariance = returns.reduce((sum, ret, i) => {
            return sum + (ret - avgReturn) * (benchmarkReturns[i] - benchmarkAvgReturn);
        }, 0) / returns.length;
        
        const benchmarkVariance = benchmarkReturns.reduce((sum, ret) => {
            return sum + Math.pow(ret - benchmarkAvgReturn, 2);
        }, 0) / benchmarkReturns.length;
        
        const beta = covariance / benchmarkVariance;
        
        // Alpha calculation (Jensen's Alpha)
        const riskFreeRate = 0.02 / 252; // 2% annual risk-free rate, daily
        const portfolioReturn = avgReturn * 252; // Annualized
        const benchmarkReturn = benchmarkAvgReturn * 252; // Annualized
        const alpha = portfolioReturn - (0.02 + beta * (benchmarkReturn - 0.02));
        
        // Sharpe Ratio
        const sharpeRatio = (portfolioReturn - 0.02) / volatility;
        
        // Maximum Drawdown
        let maxDrawdown = 0;
        let peak = this.portfolioData.performanceHistory[0]?.value || 0;
        
        this.portfolioData.performanceHistory.forEach(point => {
            if (point.value > peak) {
                peak = point.value;
            }
            const drawdown = (peak - point.value) / peak;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        });
        
        this.portfolioData.riskMetrics = {
            volatility: volatility * 100,
            beta: beta,
            alpha: alpha * 100,
            sharpeRatio: sharpeRatio,
            maxDrawdown: maxDrawdown * 100,
            sortino: this.calculateSortino(returns),
            informationRatio: this.calculateInformationRatio(returns, benchmarkReturns),
            calmarRatio: (portfolioReturn * 100) / (maxDrawdown * 100)
        };
    }
    
    calculateSortino(returns) {
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const downSideReturns = returns.filter(r => r < 0);
        
        if (downSideReturns.length === 0) return Infinity;
        
        const downSideVariance = downSideReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / downSideReturns.length;
        const downSideDeviation = Math.sqrt(downSideVariance) * Math.sqrt(252);
        
        return (avgReturn * 252 - 0.02) / downSideDeviation;
    }
    
    calculateInformationRatio(portfolioReturns, benchmarkReturns) {
        const excessReturns = portfolioReturns.map((ret, i) => ret - benchmarkReturns[i]);
        const avgExcessReturn = excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length;
        
        const trackingError = Math.sqrt(
            excessReturns.reduce((sum, ret) => sum + Math.pow(ret - avgExcessReturn, 2), 0) / excessReturns.length
        ) * Math.sqrt(252);
        
        return trackingError > 0 ? (avgExcessReturn * 252) / trackingError : 0;
    }
    
    generateDividendHistory() {
        const dividendHistory = [];
        const currentDate = new Date();
        
        // Generate quarterly dividend payments for the past year
        for (let i = 0; i < 4; i++) {
            const quarterDate = new Date(currentDate);
            quarterDate.setMonth(quarterDate.getMonth() - (i * 3));
            
            let quarterlyDividend = 0;
            this.portfolioData.holdings.forEach(holding => {
                if (holding.dividendYield > 0) {
                    const annualDividend = holding.marketValue * (holding.dividendYield / 100);
                    quarterlyDividend += annualDividend / 4;
                }
            });
            
            if (quarterlyDividend > 0) {
                dividendHistory.unshift({
                    date: quarterDate.toISOString().split('T')[0],
                    amount: quarterlyDividend,
                    quarter: `Q${Math.floor((quarterDate.getMonth() / 3)) + 1} ${quarterDate.getFullYear()}`
                });
            }
        }
        
        this.portfolioData.dividendHistory = dividendHistory;
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
        
        // Export functionality
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'e':
                        e.preventDefault();
                        this.exportPortfolioData();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refreshPortfolio();
                        break;
                }
            }
        });
    }
    
    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        this.updateTimer = setInterval(() => {
            this.simulateMarketUpdates();
        }, this.config.updateInterval);
    }
    
    simulateMarketUpdates() {
        // Simulate price updates for holdings
        this.portfolioData.holdings.forEach(holding => {
            const priceChange = holding.currentPrice * (Math.random() * 0.02 - 0.01); // ±1% random change
            holding.currentPrice = Math.max(0.01, holding.currentPrice + priceChange);
            holding.marketValue = holding.shares * holding.currentPrice;
            holding.gainLoss = holding.marketValue - (holding.shares * holding.avgCost);
            holding.gainLossPercent = (holding.gainLoss / (holding.shares * holding.avgCost)) * 100;
        });
        
        // Recalculate portfolio metrics
        this.calculatePortfolioMetrics();
        
        // Update UI elements
        this.renderPortfolioSummary();
        this.renderHoldingsTable();
        
        // Add visual indicator for updates
        this.showUpdateIndicator();
    }
    
    showUpdateIndicator() {
        const refreshBtn = document.getElementById('refreshPortfolio');
        if (refreshBtn) {
            refreshBtn.classList.add('btn-pulse');
            setTimeout(() => {
                refreshBtn.classList.remove('btn-pulse');
            }, 1000);
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only activate shortcuts when not in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case 'a':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.showAddHoldingModal();
                    }
                    break;
                case 'f':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        document.getElementById('holdingsSearch')?.focus();
                    }
                    break;
                case 'Escape':
                    // Close any open modals
                    document.querySelectorAll('.modal.show').forEach(modal => {
                        bootstrap.Modal.getInstance(modal)?.hide();
                    });
                    break;
            }
        });
    }
    
    initializeTooltips() {
        // Initialize Bootstrap tooltips for help text
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
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

        const portfolioData = this.portfolioData.performanceHistory;
        const benchmarkData = this.portfolioData.benchmarkData;
        
        const labels = portfolioData.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const portfolioValues = portfolioData.map(d => d.value);
        const benchmarkValues = benchmarkData.map(d => d.value);
        
        // Normalize benchmark to start at same value as portfolio for comparison
        const portfolioStart = portfolioValues[0];
        const benchmarkStart = benchmarkValues[0];
        const normalizedBenchmark = benchmarkValues.map(v => (v / benchmarkStart) * portfolioStart);

        this.charts.portfolioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Portfolio',
                        data: portfolioValues,
                        borderColor: this.config.chartColors.primary,
                        backgroundColor: `${this.config.chartColors.primary}20`,
                        borderWidth: 3,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBorderWidth: 3
                    },
                    {
                        label: 'S&P 500 Benchmark',
                        data: normalizedBenchmark,
                        borderColor: this.config.chartColors.secondary,
                        backgroundColor: `${this.config.chartColors.secondary}10`,
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.config.chartColors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            title: (context) => {
                                return `Date: ${context[0].label}`;
                            },
                            label: (context) => {
                                const value = context.raw;
                                const datasetLabel = context.dataset.label;
                                
                                if (datasetLabel === 'Portfolio') {
                                    const dataPoint = portfolioData[context.dataIndex];
                                    const dailyReturn = (dataPoint.dailyReturn * 100).toFixed(2);
                                    return `${datasetLabel}: ${this.formatCurrency(value)} (${dailyReturn > 0 ? '+' : ''}${dailyReturn}%)`;
                                } else {
                                    return `${datasetLabel}: ${this.formatCurrency(value)}`;
                                }
                            },
                            afterBody: (context) => {
                                const portfolioValue = context[0].raw;
                                const benchmarkValue = context[1]?.raw;
                                
                                if (portfolioValue && benchmarkValue) {
                                    const outperformance = ((portfolioValue - benchmarkValue) / benchmarkValue * 100).toFixed(2);
                                    return `\nOutperformance: ${outperformance > 0 ? '+' : ''}${outperformance}%`;
                                }
                                return '';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 8,
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        display: true,
                        position: 'left',
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-light').trim(),
                            drawBorder: false
                        },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, false),
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                hover: {
                    animationDuration: 200
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
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
        const metrics = this.portfolioData.riskMetrics;
        
        // Calculate current dividend yield
        const totalDividends = this.portfolioData.holdings.reduce((sum, holding) => {
            return sum + (holding.marketValue * (holding.dividendYield / 100));
        }, 0);
        const portfolioDividendYield = (totalDividends / this.portfolioData.totalValue) * 100;
        
        const displayMetrics = {
            sharpeRatio: metrics.sharpeRatio || 1.24,
            beta: metrics.beta || 1.05,
            alpha: metrics.alpha || 2.3,
            volatility: metrics.volatility || 18.5,
            maxDrawdown: -(Math.abs(metrics.maxDrawdown) || 12.3),
            dividendYield: portfolioDividendYield || 2.1
        };

        Object.entries(displayMetrics).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'alpha' || key === 'volatility' || key === 'dividendYield' || key === 'maxDrawdown') {
                    element.textContent = value.toFixed(2) + '%';
                    
                    // Add color coding
                    if (key === 'alpha' && value > 0) {
                        element.classList.add('positive');
                    } else if (key === 'maxDrawdown') {
                        element.classList.add('negative');
                    }
                } else {
                    element.textContent = value.toFixed(2);
                }
            }
        });
    }
    
    calculateAdvancedMetrics() {
        // Calculate additional portfolio analytics
        const metrics = {
            concentration: this.calculateConcentrationRisk(),
            correlation: this.calculatePortfolioCorrelation(),
            efficiency: this.calculatePortfolioEfficiency(),
            diversificationRatio: this.calculateDiversificationRatio()
        };
        
        this.portfolioData.advancedMetrics = metrics;
    }
    
    calculateConcentrationRisk() {
        // Herfindahl-Hirschman Index for concentration
        const totalValue = this.portfolioData.totalValue;
        let hhi = 0;
        
        this.portfolioData.holdings.forEach(holding => {
            const weight = holding.marketValue / totalValue;
            hhi += weight * weight;
        });
        
        return hhi * 10000; // Scale to 0-10000
    }
    
    calculatePortfolioCorrelation() {
        // Simplified correlation calculation (would need actual price data)
        const sectors = Object.keys(this.portfolioData.sectorAllocation);
        return sectors.length > 3 ? 0.65 : 0.85; // Mock correlation based on diversification
    }
    
    calculatePortfolioEfficiency() {
        // Risk-adjusted return efficiency
        const totalReturn = (this.portfolioData.totalGainLoss / (this.portfolioData.totalValue - this.portfolioData.totalGainLoss)) * 100;
        const volatility = this.portfolioData.riskMetrics.volatility || 20;
        
        return totalReturn / volatility;
    }
    
    calculateDiversificationRatio() {
        // Weighted average volatility / Portfolio volatility
        const weights = this.portfolioData.holdings.map(h => h.marketValue / this.portfolioData.totalValue);
        const avgIndividualVol = 0.25; // Assume 25% individual stock volatility
        const portfolioVol = (this.portfolioData.riskMetrics.volatility || 20) / 100;
        
        return (weights.reduce((sum, w) => sum + w * avgIndividualVol, 0)) / portfolioVol;
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
        this.currentPeriod = period;
        
        // Regenerate data for the selected period
        this.generatePerformanceHistory();
        this.generateBenchmarkData();
        
        // Update the chart
        if (this.charts.portfolioChart) {
            this.charts.portfolioChart.destroy();
        }
        
        this.renderPerformanceChart();
        
        // Update period-specific metrics display
        this.updatePeriodMetrics(period);
    }
    
    updatePeriodMetrics(period) {
        const history = this.portfolioData.performanceHistory;
        if (history.length === 0) return;
        
        const startValue = history[0].value;
        const endValue = history[history.length - 1].value;
        const totalReturn = ((endValue - startValue) / startValue) * 100;
        
        // Display period return in a tooltip or status area
        const periodInfo = document.createElement('div');
        periodInfo.className = 'period-return-info';
        periodInfo.innerHTML = `
            <small class="text-muted">
                ${period} Return: 
                <span class="${totalReturn >= 0 ? 'text-success' : 'text-danger'}">
                    ${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%
                </span>
            </small>
        `;
        
        // Update or add to chart header
        const chartHeader = document.querySelector('.chart-card-header');
        const existingInfo = chartHeader?.querySelector('.period-return-info');
        if (existingInfo) {
            existingInfo.replaceWith(periodInfo);
        } else {
            chartHeader?.appendChild(periodInfo);
        }
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
        // Create and show modal with all transactions
        this.createTransactionModal();
    }
    
    createTransactionModal() {
        const modalHtml = `
            <div class="modal fade" id="allTransactionsModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">All Transactions</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="transaction-filters">
                                    <select class="form-select form-select-sm me-2" id="transactionTypeFilter">
                                        <option value="all">All Types</option>
                                        <option value="BUY">Buy Orders</option>
                                        <option value="SELL">Sell Orders</option>
                                    </select>
                                    <input type="date" class="form-control form-control-sm me-2" id="transactionDateFrom" placeholder="From Date">
                                    <input type="date" class="form-control form-control-sm" id="transactionDateTo" placeholder="To Date">
                                </div>
                                <button class="btn btn-coinbase-secondary btn-sm" onclick="portfolioManager.exportTransactions()">
                                    <i class="bi bi-download me-1"></i>Export CSV
                                </button>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover" id="allTransactionsTable">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Symbol</th>
                                            <th>Type</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                            <th>Fees</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM if it doesn't exist
        if (!document.getElementById('allTransactionsModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.populateAllTransactionsTable();
            this.setupTransactionFilters();
        }
        
        const modal = new bootstrap.Modal(document.getElementById('allTransactionsModal'));
        modal.show();
    }
    
    populateAllTransactionsTable() {
        const tbody = document.querySelector('#allTransactionsTable tbody');
        if (!tbody) return;
        
        // Extended transaction data
        const allTransactions = [...this.portfolioData.transactions, 
            ...this.generateAdditionalTransactions()
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        tbody.innerHTML = allTransactions.map(transaction => {
            const fees = transaction.total * 0.001; // 0.1% fee simulation
            return `
                <tr>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td><span class="stock-symbol">${transaction.symbol}</span></td>
                    <td><span class="transaction-type ${transaction.type.toLowerCase()}">${transaction.type}</span></td>
                    <td class="financial-value">${transaction.quantity}</td>
                    <td class="financial-value">${this.formatCurrency(transaction.price)}</td>
                    <td class="financial-value">${this.formatCurrency(transaction.total)}</td>
                    <td class="financial-value">${this.formatCurrency(fees)}</td>
                    <td><span class="transaction-status ${transaction.status.toLowerCase()}">${transaction.status}</span></td>
                </tr>
            `;
        }).join('');
    }
    
    generateAdditionalTransactions() {
        const additionalTransactions = [];
        const symbols = ['NVDA', 'META', 'NFLX', 'ADBE', 'CRM', 'PYPL', 'INTC', 'AMD'];
        
        for (let i = 0; i < 15; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.random() * 180);
            
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const type = Math.random() > 0.7 ? 'SELL' : 'BUY';
            const quantity = Math.floor(Math.random() * 50) + 1;
            const price = Math.random() * 300 + 50;
            
            additionalTransactions.push({
                date: date.toISOString().split('T')[0],
                symbol: symbol,
                type: type,
                quantity: quantity,
                price: price,
                total: quantity * price,
                status: Math.random() > 0.1 ? 'COMPLETED' : 'PENDING'
            });
        }
        
        return additionalTransactions;
    }
    
    setupTransactionFilters() {
        const typeFilter = document.getElementById('transactionTypeFilter');
        const dateFromFilter = document.getElementById('transactionDateFrom');
        const dateToFilter = document.getElementById('transactionDateTo');
        
        const applyFilters = () => {
            const rows = document.querySelectorAll('#allTransactionsTable tbody tr');
            const selectedType = typeFilter.value;
            const fromDate = dateFromFilter.value ? new Date(dateFromFilter.value) : null;
            const toDate = dateToFilter.value ? new Date(dateToFilter.value) : null;
            
            rows.forEach(row => {
                const type = row.querySelector('.transaction-type').textContent;
                const dateStr = row.cells[0].textContent;
                const date = new Date(dateStr);
                
                let show = true;
                
                if (selectedType !== 'all' && type !== selectedType) {
                    show = false;
                }
                
                if (fromDate && date < fromDate) {
                    show = false;
                }
                
                if (toDate && date > toDate) {
                    show = false;
                }
                
                row.style.display = show ? '' : 'none';
            });
        };
        
        typeFilter?.addEventListener('change', applyFilters);
        dateFromFilter?.addEventListener('change', applyFilters);
        dateToFilter?.addEventListener('change', applyFilters);
    }
    
    exportPortfolioData() {
        const data = {
            summary: {
                totalValue: this.portfolioData.totalValue,
                totalGainLoss: this.portfolioData.totalGainLoss,
                todayGainLoss: this.portfolioData.todayGainLoss,
                buyingPower: this.portfolioData.buyingPower
            },
            holdings: this.portfolioData.holdings,
            performance: this.portfolioData.riskMetrics,
            exportDate: new Date().toISOString()
        };
        
        this.downloadJSON(data, `YAUSMA_Portfolio_${new Date().toISOString().split('T')[0]}.json`);
    }
    
    exportTransactions() {
        const transactions = [...this.portfolioData.transactions, ...this.generateAdditionalTransactions()];
        const csvContent = this.convertToCSV(transactions);
        this.downloadCSV(csvContent, `YAUSMA_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    }
    
    convertToCSV(data) {
        const headers = ['Date', 'Symbol', 'Type', 'Quantity', 'Price', 'Total', 'Status'];
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = [
                row.date,
                row.symbol,
                row.type,
                row.quantity,
                row.price.toFixed(2),
                row.total.toFixed(2),
                row.status
            ];
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }
    
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    downloadJSON(data, filename) {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.portfolioManager && window.portfolioManager.updateTimer) {
        clearInterval(window.portfolioManager.updateTimer);
    }
});

// Add CSS for additional animations
const additionalStyles = `
    .btn-pulse {
        animation: pulse 1s ease-in-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .period-return-info {
        margin-left: auto;
        display: flex;
        align-items: center;
    }
    
    .loading-overlay.show {
        display: flex !important;
    }
    
    .transaction-filters {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    @media (max-width: 768px) {
        .transaction-filters {
            flex-direction: column;
            align-items: stretch;
        }
    }
`;

// Add styles to document
if (!document.getElementById('portfolioAdditionalStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'portfolioAdditionalStyles';
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}