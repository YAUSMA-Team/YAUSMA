/**
 * YAUSMA Stocks Page JavaScript
 * Coinbase-inspired stock market dashboard functionality
 */

class StocksDashboard {
    constructor() {
        this.stocksData = [];
        this.watchlist = new Set();
        this.currentTab = 'allStocks';
        this.searchResults = [];
        this.displayedStocks = 20;
        this.charts = new Map();
        
        this.init();
    }

    init() {
        this.loadMockData();
        this.bindEvents();
        this.loadWatchlist();
        this.updateMarketIndices();
        this.startRealTimeUpdates();
    }

    // Mock Data Generation
    loadMockData() {
        this.stocksData = this.generateMockStocks();
        this.renderCurrentTab();
    }

    generateMockStocks() {
        const stocks = [
            // Technology Sector
            { symbol: 'AAPL', name: 'Apple Inc.', sector: 'technology', marketCap: 'large' },
            { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'technology', marketCap: 'large' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'technology', marketCap: 'large' },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'technology', marketCap: 'large' },
            { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'technology', marketCap: 'large' },
            { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'technology', marketCap: 'large' },
            { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'technology', marketCap: 'large' },
            { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'technology', marketCap: 'large' },
            { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'technology', marketCap: 'large' },
            { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'technology', marketCap: 'large' },
            
            // Healthcare Sector
            { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'healthcare', marketCap: 'large' },
            { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'healthcare', marketCap: 'large' },
            { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'healthcare', marketCap: 'large' },
            { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'healthcare', marketCap: 'large' },
            { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'healthcare', marketCap: 'large' },
            
            // Finance Sector
            { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'finance', marketCap: 'large' },
            { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'finance', marketCap: 'large' },
            { symbol: 'WFC', name: 'Wells Fargo & Company', sector: 'finance', marketCap: 'large' },
            { symbol: 'GS', name: 'Goldman Sachs Group Inc.', sector: 'finance', marketCap: 'large' },
            { symbol: 'MS', name: 'Morgan Stanley', sector: 'finance', marketCap: 'large' },
            
            // Energy Sector
            { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'energy', marketCap: 'large' },
            { symbol: 'CVX', name: 'Chevron Corporation', sector: 'energy', marketCap: 'large' },
            { symbol: 'COP', name: 'ConocoPhillips', sector: 'energy', marketCap: 'large' },
            
            // Consumer Sector
            { symbol: 'WMT', name: 'Walmart Inc.', sector: 'consumer', marketCap: 'large' },
            { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'consumer', marketCap: 'large' },
            { symbol: 'KO', name: 'Coca-Cola Company', sector: 'consumer', marketCap: 'large' },
            { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'consumer', marketCap: 'large' },
            
            // Industrial Sector
            { symbol: 'BA', name: 'Boeing Company', sector: 'industrial', marketCap: 'large' },
            { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'industrial', marketCap: 'large' },
            { symbol: 'GE', name: 'General Electric Company', sector: 'industrial', marketCap: 'large' },
            
            // Materials Sector
            { symbol: 'DD', name: 'DuPont de Nemours Inc.', sector: 'materials', marketCap: 'large' },
            
            // Utilities Sector
            { symbol: 'NEE', name: 'NextEra Energy Inc.', sector: 'utilities', marketCap: 'large' }
        ];

        return stocks.map(stock => ({
            ...stock,
            price: this.generateRandomPrice(50, 500),
            change: this.generateRandomChange(),
            volume: this.generateRandomVolume(),
            marketCapValue: this.generateMarketCap(stock.marketCap),
            chartData: this.generateChartData(),
            high52w: 0,
            low52w: 0,
            peRatio: this.generateRandomFloat(10, 50, 2),
            dividend: this.generateRandomFloat(0, 5, 2),
            beta: this.generateRandomFloat(0.5, 2.5, 2)
        })).map(stock => ({
            ...stock,
            high52w: stock.price * this.generateRandomFloat(1.2, 1.8, 2),
            low52w: stock.price * this.generateRandomFloat(0.6, 0.9, 2)
        }));
    }

    generateRandomPrice(min, max) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }

    generateRandomChange() {
        const changePercent = (Math.random() - 0.5) * 10;
        const changeAmount = changePercent * 5;
        return {
            percent: parseFloat(changePercent.toFixed(2)),
            amount: parseFloat(changeAmount.toFixed(2))
        };
    }

    generateRandomVolume() {
        return Math.floor(Math.random() * 10000000) + 1000000;
    }

    generateMarketCap(size) {
        switch (size) {
            case 'large':
                return Math.floor(Math.random() * 2000) + 100; // 100B - 2.1T
            case 'mid':
                return Math.floor(Math.random() * 8) + 2; // 2B - 10B
            case 'small':
                return Math.random() * 2; // 0 - 2B
            default:
                return Math.floor(Math.random() * 100) + 10;
        }
    }

    generateRandomFloat(min, max, decimals) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    }

    generateChartData() {
        const data = [];
        let price = 100 + Math.random() * 400;
        
        for (let i = 0; i < 30; i++) {
            price += (Math.random() - 0.5) * 10;
            data.push(Math.max(0, price));
        }
        
        return data;
    }

    // Event Binding
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('stockSearch');
        const searchSuggestions = document.getElementById('searchSuggestions');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));

            searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim()) {
                    searchSuggestions.classList.add('show');
                }
            });

            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                    searchSuggestions.classList.remove('show');
                }
            });
        }

        // Filter controls
        const sectorFilter = document.getElementById('sectorFilter');
        const marketCapFilter = document.getElementById('marketCapFilter');
        const sortFilter = document.getElementById('sortFilter');

        [sectorFilter, marketCapFilter, sortFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });

        // Tab switching
        const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
        tabButtons.forEach(button => {
            button.addEventListener('shown.bs.tab', (e) => {
                this.currentTab = e.target.getAttribute('data-bs-target').substring(1);
                this.renderCurrentTab();
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreStocks');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.displayedStocks += 20;
                this.renderCurrentTab();
            });
        }

        // Modal events
        const stockModal = document.getElementById('stockDetailModal');
        const addToWatchlistBtn = document.getElementById('addToWatchlistBtn');
        
        if (stockModal) {
            stockModal.addEventListener('hidden.bs.modal', () => {
                this.clearModalCharts();
            });
        }

        if (addToWatchlistBtn) {
            addToWatchlistBtn.addEventListener('click', (e) => {
                const symbol = e.target.dataset.symbol;
                if (symbol) {
                    this.toggleWatchlist(symbol);
                    this.updateWatchlistButton(symbol);
                }
            });
        }
    }

    // Search functionality
    handleSearch(query) {
        const searchSuggestions = document.getElementById('searchSuggestions');
        
        if (!query.trim()) {
            searchSuggestions.classList.remove('show');
            return;
        }

        const results = this.stocksData.filter(stock => 
            stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
            stock.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        this.renderSearchSuggestions(results);
        searchSuggestions.classList.add('show');
    }

    renderSearchSuggestions(results) {
        const searchSuggestions = document.getElementById('searchSuggestions');
        
        if (results.length === 0) {
            searchSuggestions.innerHTML = '<div class="suggestion-item">No stocks found</div>';
            return;
        }

        searchSuggestions.innerHTML = results.map(stock => {
            const changeClass = stock.change.percent >= 0 ? 'positive' : 'negative';
            const changeIcon = stock.change.percent >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
            
            return `
                <div class="suggestion-item" onclick="stocksDashboard.selectStock('${stock.symbol}')">
                    <div class="suggestion-main">
                        <div class="suggestion-symbol">${stock.symbol}</div>
                        <div class="suggestion-name">${stock.name}</div>
                    </div>
                    <div class="suggestion-metrics">
                        <div class="suggestion-price">$${stock.price.toFixed(2)}</div>
                        <div class="suggestion-change ${changeClass}">
                            <i class="bi ${changeIcon}"></i>
                            ${Math.abs(stock.change.percent).toFixed(2)}%
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    selectStock(symbol) {
        const stock = this.stocksData.find(s => s.symbol === symbol);
        if (stock) {
            this.showStockDetail(stock);
        }
        
        const searchSuggestions = document.getElementById('searchSuggestions');
        searchSuggestions.classList.remove('show');
    }

    // Filter functionality
    applyFilters() {
        this.renderCurrentTab();
    }

    getFilteredStocks() {
        const sectorFilter = document.getElementById('sectorFilter')?.value || '';
        const marketCapFilter = document.getElementById('marketCapFilter')?.value || '';
        const sortFilter = document.getElementById('sortFilter')?.value || 'symbol';

        let filtered = [...this.stocksData];

        if (sectorFilter) {
            filtered = filtered.filter(stock => stock.sector === sectorFilter);
        }

        if (marketCapFilter) {
            filtered = filtered.filter(stock => stock.marketCap === marketCapFilter);
        }

        // Sort stocks
        filtered.sort((a, b) => {
            switch (sortFilter) {
                case 'price':
                    return b.price - a.price;
                case 'change':
                    return b.change.percent - a.change.percent;
                case 'volume':
                    return b.volume - a.volume;
                case 'marketCap':
                    return b.marketCapValue - a.marketCapValue;
                default:
                    return a.symbol.localeCompare(b.symbol);
            }
        });

        return filtered;
    }

    // Tab rendering
    renderCurrentTab() {
        switch (this.currentTab) {
            case 'allStocks':
                this.renderAllStocks();
                break;
            case 'watchlist':
                this.renderWatchlist();
                break;
            case 'topGainers':
                this.renderTopGainers();
                break;
            case 'topLosers':
                this.renderTopLosers();
                break;
            case 'mostActive':
                this.renderMostActive();
                break;
            case 'sectors':
                this.renderSectors();
                break;
        }
    }

    renderAllStocks() {
        const filtered = this.getFilteredStocks();
        const container = document.getElementById('stocksGrid');
        const loadMoreBtn = document.getElementById('loadMoreStocks');
        
        if (!container) return;

        const stocksToShow = filtered.slice(0, this.displayedStocks);
        container.innerHTML = stocksToShow.map(stock => this.createStockCard(stock)).join('');
        
        // Show/hide load more button
        if (loadMoreBtn) {
            loadMoreBtn.style.display = filtered.length > this.displayedStocks ? 'block' : 'none';
        }

        this.renderStockCharts(stocksToShow);
    }

    renderWatchlist() {
        const container = document.getElementById('watchlistGrid');
        const emptyState = document.getElementById('watchlistEmpty');
        
        if (!container || !emptyState) return;

        const watchlistStocks = this.stocksData.filter(stock => this.watchlist.has(stock.symbol));
        
        if (watchlistStocks.length === 0) {
            emptyState.style.display = 'block';
            container.innerHTML = '';
        } else {
            emptyState.style.display = 'none';
            container.innerHTML = watchlistStocks.map(stock => this.createStockCard(stock)).join('');
            this.renderStockCharts(watchlistStocks);
        }
    }

    renderTopGainers() {
        const container = document.getElementById('gainersGrid');
        if (!container) return;

        const gainers = [...this.stocksData]
            .filter(stock => stock.change.percent > 0)
            .sort((a, b) => b.change.percent - a.change.percent)
            .slice(0, 20);

        container.innerHTML = gainers.map(stock => this.createStockCard(stock)).join('');
        this.renderStockCharts(gainers);
    }

    renderTopLosers() {
        const container = document.getElementById('losersGrid');
        if (!container) return;

        const losers = [...this.stocksData]
            .filter(stock => stock.change.percent < 0)
            .sort((a, b) => a.change.percent - b.change.percent)
            .slice(0, 20);

        container.innerHTML = losers.map(stock => this.createStockCard(stock)).join('');
        this.renderStockCharts(losers);
    }

    renderMostActive() {
        const container = document.getElementById('activeGrid');
        if (!container) return;

        const mostActive = [...this.stocksData]
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 20);

        container.innerHTML = mostActive.map(stock => this.createStockCard(stock)).join('');
        this.renderStockCharts(mostActive);
    }

    renderSectors() {
        const container = document.getElementById('sectorsGrid');
        if (!container) return;

        const sectors = this.groupBySector();
        container.innerHTML = Object.keys(sectors).map(sectorName => 
            this.createSectorCard(sectorName, sectors[sectorName])
        ).join('');
    }

    groupBySector() {
        const sectors = {};
        
        this.stocksData.forEach(stock => {
            if (!sectors[stock.sector]) {
                sectors[stock.sector] = [];
            }
            sectors[stock.sector].push(stock);
        });

        return sectors;
    }

    // Card creation
    createStockCard(stock) {
        const changeClass = stock.change.percent >= 0 ? 'positive' : 'negative';
        const changeIcon = stock.change.percent >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
        const watchlistClass = this.watchlist.has(stock.symbol) ? 'active' : '';
        
        // Calculate 52W range percentage
        const rangePercent = ((stock.price - stock.low52w) / (stock.high52w - stock.low52w)) * 100;
        
        return `
            <div class="stock-card" onclick="stocksDashboard.navigateToStockDetail('${stock.symbol}')">
                <div class="stock-card-header">
                    <div class="stock-info">
                        <div class="stock-symbol">${stock.symbol}</div>
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-sector">${this.formatSectorName(stock.sector)}</div>
                    </div>
                    <div class="stock-actions">
                        <button class="btn-watchlist ${watchlistClass}" onclick="event.stopPropagation(); stocksDashboard.toggleWatchlist('${stock.symbol}')" title="${this.watchlist.has(stock.symbol) ? 'Remove from' : 'Add to'} watchlist">
                            <i class="bi bi-bookmark${this.watchlist.has(stock.symbol) ? '-fill' : ''}"></i>
                        </button>
                        <button class="btn-trade" onclick="event.stopPropagation(); stocksDashboard.showQuickTrade('${stock.symbol}')" title="Quick trade">
                            <i class="bi bi-lightning-fill"></i>
                        </button>
                    </div>
                </div>
                
                <div class="stock-price-section">
                    <div class="stock-price">$${stock.price.toFixed(2)}</div>
                    <div class="stock-change ${changeClass}">
                        <i class="bi ${changeIcon}"></i>
                        $${Math.abs(stock.change.amount).toFixed(2)} (${Math.abs(stock.change.percent).toFixed(2)}%)
                    </div>
                </div>
                
                <div class="stock-chart">
                    <canvas id="chart-${stock.symbol}" width="300" height="80"></canvas>
                </div>
                
                <div class="stock-metadata">
                    <div class="metadata-item">
                        <span class="metadata-label">Volume</span>
                        <span class="metadata-value">${this.formatNumber(stock.volume)}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Market Cap</span>
                        <span class="metadata-value">${this.formatMarketCap(stock.marketCapValue)}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">P/E Ratio</span>
                        <span class="metadata-value">${stock.peRatio}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">52W Range</span>
                        <span class="metadata-value">
                            <div class="range-bar">
                                <div class="range-fill" style="width: ${rangePercent}%"></div>
                                <div class="range-indicator" style="left: ${rangePercent}%"></div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    createSectorCard(sectorName, stocks) {
        const avgChange = stocks.reduce((sum, stock) => sum + stock.change.percent, 0) / stocks.length;
        const changeClass = avgChange >= 0 ? 'positive' : 'negative';
        const topStocks = stocks.sort((a, b) => b.change.percent - a.change.percent).slice(0, 5);
        
        return `
            <div class="sector-card" onclick="stocksDashboard.filterBySector('${sectorName}')">
                <div class="sector-header">
                    <div class="sector-name">${this.formatSectorName(sectorName)}</div>
                    <div class="sector-change ${changeClass}">${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%</div>
                </div>
                <div class="sector-stocks">
                    ${topStocks.map(stock => `
                        <div class="sector-stock-item">
                            <span class="sector-stock-symbol">${stock.symbol}</span>
                            <span class="sector-stock-change ${stock.change.percent >= 0 ? 'positive' : 'negative'}">
                                ${stock.change.percent >= 0 ? '+' : ''}${stock.change.percent.toFixed(2)}%
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Chart rendering
    renderStockCharts(stocks) {
        // Wait for DOM to be ready
        setTimeout(() => {
            stocks.forEach(stock => {
                const canvas = document.getElementById(`chart-${stock.symbol}`);
                if (canvas && !this.charts.has(stock.symbol)) {
                    this.createStockChart(canvas, stock);
                }
            });
        }, 100);
    }

    createStockChart(canvas, stock) {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 80);
        
        const isPositive = stock.change.percent >= 0;
        const color = isPositive ? 
            'rgba(0, 211, 149, 0.8)' : 
            'rgba(249, 35, 100, 0.8)';
        const bgColor = isPositive ? 
            'rgba(0, 211, 149, 0.1)' : 
            'rgba(249, 35, 100, 0.1)';
        
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, bgColor);

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: stock.chartData.length}, (_, i) => i),
                datasets: [{
                    data: stock.chartData,
                    borderColor: color,
                    backgroundColor: gradient,
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
                interaction: {
                    intersect: false
                }
            }
        });

        this.charts.set(stock.symbol, chart);
    }

    // Stock detail modal
    showStockDetail(stock) {
        const modal = new bootstrap.Modal(document.getElementById('stockDetailModal'));
        const modalTitle = document.getElementById('stockDetailModalLabel');
        const modalContent = document.getElementById('stockDetailContent');
        const addToWatchlistBtn = document.getElementById('addToWatchlistBtn');

        modalTitle.textContent = `${stock.symbol} - ${stock.name}`;
        modalContent.innerHTML = this.createStockDetailContent(stock);
        
        addToWatchlistBtn.dataset.symbol = stock.symbol;
        addToWatchlistBtn.textContent = this.watchlist.has(stock.symbol) ? 
            'Remove from Watchlist' : 'Add to Watchlist';

        modal.show();

        // Create detailed chart
        setTimeout(() => {
            this.createDetailChart(stock);
        }, 300);
    }

    createStockDetailContent(stock) {
        const changeClass = stock.change.percent >= 0 ? 'positive' : 'negative';
        const changeIcon = stock.change.percent >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
        
        return `
            <div class="stock-detail-header">
                <div class="stock-detail-info">
                    <h2>${stock.symbol}</h2>
                    <p>${stock.name}</p>
                    <p><strong>Sector:</strong> ${this.formatSectorName(stock.sector)}</p>
                </div>
                <div class="stock-detail-price">
                    <div class="stock-price">$${stock.price.toFixed(2)}</div>
                    <div class="stock-change ${changeClass}">
                        <i class="bi ${changeIcon}"></i>
                        $${Math.abs(stock.change.amount).toFixed(2)} (${Math.abs(stock.change.percent).toFixed(2)}%)
                    </div>
                </div>
            </div>
            
            <div class="stock-detail-chart">
                <canvas id="detailChart" width="600" height="300"></canvas>
            </div>
            
            <div class="stock-detail-metrics">
                <div class="metric-card">
                    <div class="metric-label">Market Cap</div>
                    <div class="metric-value">${this.formatMarketCap(stock.marketCapValue)}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Volume</div>
                    <div class="metric-value">${this.formatNumber(stock.volume)}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">52W High</div>
                    <div class="metric-value">$${stock.high52w.toFixed(2)}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">52W Low</div>
                    <div class="metric-value">$${stock.low52w.toFixed(2)}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">P/E Ratio</div>
                    <div class="metric-value">${stock.peRatio}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Dividend Yield</div>
                    <div class="metric-value">${stock.dividend}%</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Beta</div>
                    <div class="metric-value">${stock.beta}</div>
                </div>
            </div>
        `;
    }

    createDetailChart(stock) {
        const canvas = document.getElementById('detailChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        
        const isPositive = stock.change.percent >= 0;
        const color = isPositive ? 
            'rgba(0, 211, 149, 1)' : 
            'rgba(249, 35, 100, 1)';
        const bgColor = isPositive ? 
            'rgba(0, 211, 149, 0.1)' : 
            'rgba(249, 35, 100, 0.1)';
        
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, bgColor);

        // Generate more detailed chart data
        const detailedData = this.generateDetailedChartData(stock.chartData);

        this.detailChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: detailedData.labels,
                datasets: [{
                    label: stock.symbol,
                    data: detailedData.data,
                    borderColor: color,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        grid: { display: false }
                    },
                    y: {
                        display: true,
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: color,
                        borderWidth: 1
                    }
                }
            }
        });
    }

    generateDetailedChartData(baseData) {
        const labels = [];
        const data = [];
        
        // Generate last 30 days of data
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            data.push(baseData[Math.floor(Math.random() * baseData.length)]);
        }
        
        return { labels, data };
    }

    clearModalCharts() {
        if (this.detailChart) {
            this.detailChart.destroy();
            this.detailChart = null;
        }
    }

    // Watchlist functionality
    toggleWatchlist(symbol) {
        if (this.watchlist.has(symbol)) {
            this.watchlist.delete(symbol);
        } else {
            this.watchlist.add(symbol);
        }
        
        this.saveWatchlist();
        this.updateWatchlistButtons();
        
        if (this.currentTab === 'watchlist') {
            this.renderWatchlist();
        }
    }

    updateWatchlistButtons() {
        document.querySelectorAll('.btn-watchlist').forEach(btn => {
            const symbol = btn.onclick.toString().match(/'([^']+)'/)?.[1];
            if (symbol) {
                const isInWatchlist = this.watchlist.has(symbol);
                btn.classList.toggle('active', isInWatchlist);
                btn.querySelector('i').className = `bi bi-bookmark${isInWatchlist ? '-fill' : ''}`;
            }
        });
    }

    updateWatchlistButton(symbol) {
        const addToWatchlistBtn = document.getElementById('addToWatchlistBtn');
        if (addToWatchlistBtn && addToWatchlistBtn.dataset.symbol === symbol) {
            addToWatchlistBtn.textContent = this.watchlist.has(symbol) ? 
                'Remove from Watchlist' : 'Add to Watchlist';
        }
        this.updateWatchlistButtons();
    }

    loadWatchlist() {
        const saved = localStorage.getItem('yausma_watchlist');
        if (saved) {
            this.watchlist = new Set(JSON.parse(saved));
        }
    }

    saveWatchlist() {
        localStorage.setItem('yausma_watchlist', JSON.stringify([...this.watchlist]));
    }

    // Market indices updates
    updateMarketIndices() {
        const indices = [
            { id: 'spyIndex', symbol: 'SPY', value: 4567.89, change: 1.2 },
            { id: 'nasdaqIndex', symbol: 'QQQ', value: 14234.56, change: 0.8 },
            { id: 'dowIndex', symbol: 'DIA', value: 34789.12, change: -0.3 }
        ];

        indices.forEach(index => {
            const element = document.getElementById(index.id);
            if (element) {
                const changeEl = element.querySelector('.index-change');
                changeEl.className = `index-change ${index.change >= 0 ? 'positive' : 'negative'}`;
                changeEl.textContent = `${index.change >= 0 ? '+' : ''}${index.change}%`;
            }
        });
    }

    // Real-time updates simulation
    startRealTimeUpdates() {
        setInterval(() => {
            this.updateStockPrices();
        }, 10000); // Update every 10 seconds
    }

    updateStockPrices() {
        this.stocksData.forEach(stock => {
            // Store previous price for animation
            const previousPrice = stock.price;
            
            // Small random price movement (0.1% to 0.5%)
            const changePercent = (Math.random() - 0.5) * 1;
            const change = (stock.price * changePercent) / 100;
            stock.price = Math.max(1, stock.price + change);
            
            // Update change values from previous close
            const newChangePercent = ((stock.price - stock.previousClose) / stock.previousClose) * 100;
            stock.change.percent = newChangePercent;
            stock.change.amount = stock.price - stock.previousClose;
            
            // Update volume with realistic fluctuation
            const volumeChange = (Math.random() - 0.5) * 0.2; // ±10%
            stock.volume = Math.max(100000, stock.volume * (1 + volumeChange));
            
            // Animate price change in UI
            this.animatePriceChange(stock.symbol, previousPrice, stock.price);
        });

        // Update market indices
        this.updateMarketIndices();
        
        // Re-render current tab if not sectors
        if (this.currentTab !== 'sectors') {
            this.renderCurrentTab();
        }
    }

    animatePriceChange(symbol, oldPrice, newPrice) {
        const priceElement = document.querySelector(`[onclick*="${symbol}"] .stock-price`);
        if (!priceElement) return;
        
        priceElement.classList.remove('price-flash-up', 'price-flash-down');
        
        if (newPrice > oldPrice) {
            priceElement.classList.add('price-flash-up');
        } else if (newPrice < oldPrice) {
            priceElement.classList.add('price-flash-down');
        }
        
        setTimeout(() => {
            priceElement.classList.remove('price-flash-up', 'price-flash-down');
        }, 1000);
    }

    // Navigation functions
    navigateToStockDetail(symbol) {
        // In a real application, this would navigate to stock detail page
        window.location.href = `stock-detail.html?symbol=${symbol}`;
    }

    showQuickTrade(symbol) {
        const stock = this.stocksData.find(s => s.symbol === symbol);
        if (!stock) return;

        // Create quick trade modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Quick Trade - ${stock.symbol}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="trade-summary">
                            <div class="trade-symbol">${stock.symbol}</div>
                            <div class="trade-price">$${stock.price.toFixed(2)}</div>
                            <div class="trade-change ${stock.change.percent >= 0 ? 'positive' : 'negative'}">
                                ${stock.change.percent >= 0 ? '+' : ''}${stock.change.percent.toFixed(2)}%
                            </div>
                        </div>
                        <div class="trade-actions mt-4">
                            <button class="btn btn-success btn-lg me-2" onclick="stocksDashboard.executeTrade('${stock.symbol}', 'buy')">
                                <i class="bi bi-plus-circle me-2"></i>Buy
                            </button>
                            <button class="btn btn-danger btn-lg" onclick="stocksDashboard.executeTrade('${stock.symbol}', 'sell')">
                                <i class="bi bi-dash-circle me-2"></i>Sell
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    executeTrade(symbol, action) {
        // Simulate trade execution
        const stock = this.stocksData.find(s => s.symbol === symbol);
        const actionText = action === 'buy' ? 'purchased' : 'sold';
        
        // Close the modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }
        
        // Show success notification
        this.showTradeNotification(`Successfully ${actionText} ${stock.symbol} at $${stock.price.toFixed(2)}`, 'success');
    }

    showTradeNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show trade-notification`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('fade');
                setTimeout(() => notification.remove(), 150);
            }
        }, 4000);
    }

    // Utility functions
    filterBySector(sector) {
        document.getElementById('sectorFilter').value = sector;
        
        // Switch to all stocks tab
        const allStocksTab = document.querySelector('[data-bs-target="#allStocks"]');
        if (allStocksTab) {
            const tab = new bootstrap.Tab(allStocksTab);
            tab.show();
        }
        
        this.applyFilters();
    }

    formatNumber(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toString();
    }

    formatMarketCap(cap) {
        if (cap >= 1000) return (cap / 1000).toFixed(1) + 'T';
        if (cap >= 1) return cap.toFixed(1) + 'B';
        return (cap * 1000).toFixed(0) + 'M';
    }

    formatSectorName(sector) {
        return sector.charAt(0).toUpperCase() + sector.slice(1);
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
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stocksDashboard = new StocksDashboard();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StocksDashboard;
}