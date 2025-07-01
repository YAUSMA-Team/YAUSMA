/**
 * YAUSMA Pro Page JavaScript
 * Handles interactive features for the Pro features and pricing page
 */

class ProPage {
  constructor() {
    this.pricingToggle = null;
    this.monthlyPrices = { pro: 29 };
    this.annualPrices = { pro: 23 };
    this.animationObserver = null;
    
    this.init();
  }

  /**
   * Initialize the Pro page functionality
   */
  init() {
    this.setupPricingToggle();
    this.setupScrollAnimations();
    this.setupSmoothScrolling();
    this.setupFormHandling();
    this.setupMetricsAnimation();
    this.setupTechnicalChart();
    this.setupTrialButtons();
    this.setupComparisonTableHighlight();
    
    console.log('ProPage initialized');
  }

  /**
   * Setup pricing toggle functionality (Monthly/Annual)
   */
  setupPricingToggle() {
    this.pricingToggle = document.getElementById('pricingToggle');
    
    if (!this.pricingToggle) return;

    this.pricingToggle.addEventListener('change', (e) => {
      this.handlePricingToggle(e.target.checked);
    });

    // Set initial state
    this.updatePricingDisplay(false);
  }

  /**
   * Handle pricing toggle between monthly and annual
   * @param {boolean} isAnnual - Whether annual pricing is selected
   */
  handlePricingToggle(isAnnual) {
    this.updatePricingDisplay(isAnnual);
    
    // Add animation effect
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = 'scale(1)';
      }, 150);
    });
  }

  /**
   * Update pricing display based on toggle state
   * @param {boolean} isAnnual - Whether to show annual pricing
   */
  updatePricingDisplay(isAnnual) {
    const monthlyPriceElements = document.querySelectorAll('.monthly-price');
    const annualPriceElements = document.querySelectorAll('.annual-price');
    const annualSavingsElements = document.querySelectorAll('.annual-savings');

    if (isAnnual) {
      monthlyPriceElements.forEach(el => el.classList.add('d-none'));
      annualPriceElements.forEach(el => el.classList.remove('d-none'));
      annualSavingsElements.forEach(el => el.classList.remove('d-none'));
    } else {
      monthlyPriceElements.forEach(el => el.classList.remove('d-none'));
      annualPriceElements.forEach(el => el.classList.add('d-none'));
      annualSavingsElements.forEach(el => el.classList.add('d-none'));
    }
  }

  /**
   * Setup scroll-triggered animations
   */
  setupScrollAnimations() {
    // Create intersection observer for animation triggers
    this.animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.feature-showcase, .pricing-card, .testimonial-card, .hero-visual'
    );
    
    animatedElements.forEach(el => {
      el.classList.add('fade-in');
      this.animationObserver.observe(el);
    });
  }

  /**
   * Setup smooth scrolling for navigation links
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Setup form handling for contact form
   */
  setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactForm(e.target);
    });
  }

  /**
   * Handle contact form submission
   * @param {HTMLFormElement} form - The contact form element
   */
  handleContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      // Show success message
      this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      
      // Reset form
      form.reset();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }

  /**
   * Setup metrics animation for hero section
   */
  setupMetricsAnimation() {
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateMetrics();
            metricsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const heroSection = document.querySelector('.pro-hero-section');
    if (heroSection) {
      metricsObserver.observe(heroSection);
    }
  }

  /**
   * Animate numerical metrics in hero section
   */
  animateMetrics() {
    const animateNumber = (element, finalNumber, duration = 2000) => {
      const startTime = performance.now();
      const startNumber = 0;
      
      const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentNumber = Math.round(startNumber + (finalNumber - startNumber) * easeOutQuart);
        
        element.textContent = this.formatNumber(currentNumber);
        
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      };
      
      requestAnimationFrame(updateNumber);
    };

    // Animate trust stats
    const stats = [
      { selector: '.trust-stats .stat:nth-child(1) strong', value: 10000, suffix: '+' },
      { selector: '.trust-stats .stat:nth-child(2) strong', value: 500, prefix: '$', suffix: 'M+' },
      { selector: '.trust-stats .stat:nth-child(3) strong', value: 99.9, suffix: '%' }
    ];

    stats.forEach(stat => {
      const element = document.querySelector(stat.selector);
      if (element) {
        if (stat.value === 99.9) {
          // Special handling for percentage
          setTimeout(() => {
            element.textContent = '99.9%';
          }, 1500);
        } else {
          animateNumber(element, stat.value);
          // Add prefix/suffix after animation
          setTimeout(() => {
            const prefix = stat.prefix || '';
            const suffix = stat.suffix || '';
            element.textContent = prefix + this.formatNumber(stat.value) + suffix;
          }, 2000);
        }
      }
    });
  }

  /**
   * Format numbers with appropriate separators
   * @param {number} num - Number to format
   * @returns {string} - Formatted number
   */
  formatNumber(num) {
    return num.toLocaleString();
  }

  /**
   * Setup technical chart visualization
   */
  setupTechnicalChart() {
    const canvas = document.getElementById('technicalChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Simple candlestick-like chart
    this.drawTechnicalChart(ctx, width, height);
    
    // Setup indicator switching
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
        indicators.forEach(ind => ind.classList.remove('active'));
        indicator.classList.add('active');
        this.drawTechnicalChart(ctx, width, height, indicator.textContent);
      });
    });
  }

  /**
   * Draw technical chart on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {string} indicator - Active indicator
   */
  drawTechnicalChart(ctx, width, height, indicator = 'RSI') {
    ctx.clearRect(0, 0, width, height);
    
    // Set styles based on theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const lineColor = isDark ? '#5470ff' : '#344afb';
    const gridColor = isDark ? '#2d3139' : '#f0f2f5';
    const textColor = isDark ? '#9ca0a6' : '#5b616e';

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const points = this.generateChartData(width, height);
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.stroke();

    // Draw indicator-specific overlays
    if (indicator === 'MACD') {
      this.drawMACDOverlay(ctx, width, height);
    } else if (indicator === 'Bollinger Bands') {
      this.drawBollingerBands(ctx, width, height, points);
    } else if (indicator === 'Fibonacci') {
      this.drawFibonacciRetracements(ctx, width, height);
    }
  }

  /**
   * Generate sample chart data points
   * @param {number} width - Chart width
   * @param {number} height - Chart height
   * @returns {Array} - Array of {x, y} points
   */
  generateChartData(width, height) {
    const points = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const x = (width / segments) * i;
      const baseY = height * 0.7;
      const amplitude = height * 0.3;
      const y = baseY - amplitude * Math.sin((i / segments) * Math.PI * 2 + Math.random() * 0.5);
      
      points.push({ x, y });
    }
    
    return points;
  }

  /**
   * Draw MACD histogram overlay
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  drawMACDOverlay(ctx, width, height) {
    ctx.fillStyle = 'rgba(0, 211, 149, 0.3)';
    const bars = 15;
    const barWidth = width / bars;
    
    for (let i = 0; i < bars; i++) {
      const x = i * barWidth;
      const barHeight = Math.random() * height * 0.2;
      const y = height - barHeight;
      
      ctx.fillRect(x, y, barWidth - 2, barHeight);
    }
  }

  /**
   * Draw Bollinger Bands
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {Array} centerLine - Center line points
   */
  drawBollingerBands(ctx, width, height, centerLine) {
    ctx.strokeStyle = 'rgba(249, 35, 100, 0.5)';
    ctx.lineWidth = 1;
    
    // Upper band
    ctx.beginPath();
    centerLine.forEach((point, index) => {
      const y = point.y - 20;
      if (index === 0) {
        ctx.moveTo(point.x, y);
      } else {
        ctx.lineTo(point.x, y);
      }
    });
    ctx.stroke();
    
    // Lower band
    ctx.beginPath();
    centerLine.forEach((point, index) => {
      const y = point.y + 20;
      if (index === 0) {
        ctx.moveTo(point.x, y);
      } else {
        ctx.lineTo(point.x, y);
      }
    });
    ctx.stroke();
  }

  /**
   * Draw Fibonacci retracement levels
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  drawFibonacciRetracements(ctx, width, height) {
    const levels = [0.236, 0.382, 0.5, 0.618, 0.786];
    ctx.strokeStyle = 'rgba(255, 201, 71, 0.7)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    levels.forEach(level => {
      const y = height * level;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    });
    
    ctx.setLineDash([]);
  }

  /**
   * Setup trial button interactions
   */
  setupTrialButtons() {
    const trialButtons = document.querySelectorAll('#startTrialBtn, #ctaTrialBtn');
    
    trialButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleTrialStart();
      });
    });
  }

  /**
   * Handle trial start action
   */
  handleTrialStart() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
      // User is logged in, start trial
      this.startTrial();
    } else {
      // Redirect to signup with trial parameter
      window.location.href = '../auth.html?mode=signup&trial=pro';
    }
  }

  /**
   * Start Pro trial for logged-in user
   */
  startTrial() {
    // Show loading state
    this.showNotification('Starting your Pro trial...', 'info');
    
    // Simulate trial activation
    setTimeout(() => {
      localStorage.setItem('proTrial', 'true');
      localStorage.setItem('proTrialStart', Date.now().toString());
      
      this.showNotification(
        'Congratulations! Your 14-day Pro trial has started. Enjoy all Pro features!',
        'success'
      );
      
      // Optionally redirect to dashboard
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000);
    }, 1500);
  }

  /**
   * Setup comparison table row highlighting
   */
  setupComparisonTableHighlight() {
    const tableRows = document.querySelectorAll('.comparison-table tbody tr');
    
    tableRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = 'var(--hover-background)';
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = '';
      });
    });
  }

  /**
   * Show notification to user
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} notification-toast`;
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas fa-${this.getNotificationIcon(type)} me-2"></i>
        <span>${message}</span>
        <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
    `;
    
    // Style notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '100px',
      right: '20px',
      zIndex: '9999',
      minWidth: '300px',
      maxWidth: '500px',
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 'var(--radius-md)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger entrance animation
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }

  /**
   * Get icon for notification type
   * @param {string} type - Notification type
   * @returns {string} - Font Awesome icon class
   */
  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      info: 'info-circle',
      warning: 'exclamation-triangle'
    };
    return icons[type] || icons.info;
  }

  /**
   * Handle theme changes
   */
  handleThemeChange() {
    // Redraw technical chart with new theme colors
    const canvas = document.getElementById('technicalChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      this.drawTechnicalChart(ctx, canvas.width, canvas.height);
    }
  }

  /**
   * Cleanup event listeners and observers
   */
  destroy() {
    if (this.animationObserver) {
      this.animationObserver.disconnect();
    }
    
    // Remove event listeners
    if (this.pricingToggle) {
      this.pricingToggle.removeEventListener('change', this.handlePricingToggle);
    }
  }
}

// Initialize Pro page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.proPage = new ProPage();
});

// Listen for theme changes
document.addEventListener('themeChanged', () => {
  if (window.proPage) {
    window.proPage.handleThemeChange();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.proPage) {
    window.proPage.destroy();
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProPage;
}