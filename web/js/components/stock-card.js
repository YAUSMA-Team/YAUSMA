// YAUSMA Stock Card Component - Financial Data Display
// Professional stock information cards with interactive features

class StockCard {
    constructor(element, stockData) {
        this.element = element;
        this.stockData = stockData;
        this.isWatched = false;
        
        if (this.element) {
            this.init();
        }
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.setupInteractions();
        
        console.log('=Ê Stock Card component initialized');
    }

    render() {
        if (!this.stockData) return;
        
        const { symbol, name, price, change, changePercent, volume } = this.stockData;
        const isPositive = change >= 0;
        const changeClass = isPositive ? 'positive' : 'negative';
        
        this.element.innerHTML = `
            <div class="stock-card card-coinbase" data-symbol="${symbol}">
                <div class="stock-card-header">
                    <div class="stock-info">
                        <h4 class="stock-symbol">${symbol}</h4>
                        <p class="stock-name">${name}</p>
                    </div>
                    <button class="btn btn-watch" data-action="toggle-watch">
                        <i class="bi bi-bookmark"></i>
                    </button>
                </div>
                <div class="stock-card-body">
                    <div class="stock-price financial-data">$${price}</div>
                    <div class="stock-change ${changeClass}">
                        ${isPositive ? '+' : ''}$${Math.abs(change).toFixed(2)} (${isPositive ? '+' : ''}${changePercent}%)
                    </div>
                    <div class="stock-volume">
                        Volume: ${this.formatVolume(volume)}
                    </div>
                </div>
                <div class="stock-card-chart">
                    <canvas class="mini-chart" width="200" height="60"></canvas>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const watchBtn = this.element.querySelector('[data-action="toggle-watch"]');
        if (watchBtn) {
            watchBtn.addEventListener('click', this.toggleWatch.bind(this));
        }
        
        this.element.addEventListener('click', this.handleCardClick.bind(this));
    }

    setupInteractions() {
        this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    handleCardClick(event) {
        if (event.target.closest('[data-action="toggle-watch"]')) {
            return; // Let watch button handle its own click
        }
        
        // Navigate to stock detail or show modal
        this.showStockDetail();
    }

    handleMouseEnter() {
        this.element.classList.add('stock-card-hover');
    }

    handleMouseLeave() {
        this.element.classList.remove('stock-card-hover');
    }

    toggleWatch() {
        this.isWatched = !this.isWatched;
        this.updateWatchButton();
        
        if (window.storage) {
            if (this.isWatched) {
                window.storage.addToWatchlist(this.stockData.symbol);
            } else {
                window.storage.removeFromWatchlist(this.stockData.symbol);
            }
        }
        
        // Show notification
        if (window.app) {
            const message = this.isWatched 
                ? `${this.stockData.symbol} added to watchlist`
                : `${this.stockData.symbol} removed from watchlist`;
            window.app.showNotification(message, 'success');
        }
    }

    updateWatchButton() {
        const watchBtn = this.element.querySelector('[data-action="toggle-watch"]');
        const icon = watchBtn?.querySelector('i');
        
        if (icon) {
            icon.className = this.isWatched ? 'bi bi-bookmark-fill' : 'bi bi-bookmark';
        }
        
        if (watchBtn) {
            watchBtn.classList.toggle('watched', this.isWatched);
        }
    }

    showStockDetail() {
        // Trigger stock detail modal or navigation
        if (window.app) {
            window.app.trackEvent('stock_card_click', {
                symbol: this.stockData.symbol
            });
        }
        
        console.log('Show stock detail for:', this.stockData.symbol);
    }

    formatVolume(volume) {
        if (volume >= 1000000) {
            return (volume / 1000000).toFixed(1) + 'M';
        } else if (volume >= 1000) {
            return (volume / 1000).toFixed(1) + 'K';
        }
        return volume.toString();
    }

    updateData(newData) {
        this.stockData = { ...this.stockData, ...newData };
        this.render();
    }

    destroy() {
        if (this.element) {
            this.element.innerHTML = '';
        }
        
        console.log('=Ê Stock Card component destroyed');
    }
}

// Factory function for creating stock cards
function createStockCard(container, stockData) {
    const cardElement = document.createElement('div');
    cardElement.className = 'col-lg-3 col-md-6 mb-3';
    container.appendChild(cardElement);
    
    return new StockCard(cardElement, stockData);
}

// Make StockCard globally available
if (typeof window !== 'undefined') {
    window.StockCard = StockCard;
    window.createStockCard = createStockCard;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StockCard, createStockCard };
}