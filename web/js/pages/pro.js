/**
 * YAUSMA Pro Page JavaScript - Coinbase-Inspired Premium Experience
 * Handles interactive features for the Pro features and pricing page
 * Professional SaaS pricing page with enterprise-grade functionality
 */

class ProPageManager {
  constructor() {
    this.pricingToggle = null;
    this.monthlyPrices = { pro: 29 };
    this.annualPrices = { pro: 23 };
    this.animationObserver = null;
    this.testimonialsCarousel = null;
    this.activeTestimonial = 0;
    this.pricingCalculator = null;
    this.faqAccordion = null;
    this.demoChart = null;
    this.progressIndicator = null;
    this.featureHighlights = [];
    
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
    this.setupTestimonialsCarousel();
    this.setupFAQAccordion();
    this.setupPricingCalculator();
    this.setupFeatureHighlights();
    this.setupProgressIndicators();
    this.setupDemoAnimations();
    this.setupCTAInteractions();
    this.setupAdvancedChartDemo();
    this.setupKeyboardNavigation();
    this.setupPerformanceOptimizations();
    
    console.log('ProPageManager initialized with enterprise features');
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
   * Setup testimonials carousel/slider functionality
   */
  setupTestimonialsCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length <= 1) return;

    this.testimonialsCarousel = {
      cards: testimonialCards,
      currentIndex: 0,
      autoRotate: true,
      interval: null
    };

    // Create carousel controls
    this.createCarouselControls();
    
    // Setup auto-rotation
    this.startTestimonialRotation();
    
    // Pause on hover
    const testimonialSection = document.querySelector('.testimonials-section');
    if (testimonialSection) {
      testimonialSection.addEventListener('mouseenter', () => this.pauseTestimonialRotation());
      testimonialSection.addEventListener('mouseleave', () => this.startTestimonialRotation());
    }
  }

  /**
   * Create carousel navigation controls
   */
  createCarouselControls() {
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (!testimonialsGrid) return;

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'carousel-controls';
    controlsContainer.innerHTML = `
      <div class="carousel-indicators">
        ${Array.from(this.testimonialsCarousel.cards).map((_, index) => 
          `<button class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></button>`
        ).join('')}
      </div>
      <div class="carousel-nav">
        <button class="nav-btn prev-btn" aria-label="Previous testimonial">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="nav-btn next-btn" aria-label="Next testimonial">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;

    testimonialsGrid.parentNode.insertBefore(controlsContainer, testimonialsGrid.nextSibling);

    // Add event listeners
    controlsContainer.querySelectorAll('.indicator').forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToTestimonial(index));
    });

    controlsContainer.querySelector('.prev-btn').addEventListener('click', () => this.previousTestimonial());
    controlsContainer.querySelector('.next-btn').addEventListener('click', () => this.nextTestimonial());
  }

  /**
   * Navigate to specific testimonial
   */
  goToTestimonial(index) {
    const cards = this.testimonialsCarousel.cards;
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');

    // Update active states
    cards[this.testimonialsCarousel.currentIndex].classList.remove('active');
    indicators[this.testimonialsCarousel.currentIndex].classList.remove('active');

    this.testimonialsCarousel.currentIndex = index;

    cards[index].classList.add('active');
    indicators[index].classList.add('active');

    // Smooth scroll to testimonial
    cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Go to next testimonial
   */
  nextTestimonial() {
    const nextIndex = (this.testimonialsCarousel.currentIndex + 1) % this.testimonialsCarousel.cards.length;
    this.goToTestimonial(nextIndex);
  }

  /**
   * Go to previous testimonial
   */
  previousTestimonial() {
    const prevIndex = (this.testimonialsCarousel.currentIndex - 1 + this.testimonialsCarousel.cards.length) % this.testimonialsCarousel.cards.length;
    this.goToTestimonial(prevIndex);
  }

  /**
   * Start automatic testimonial rotation
   */
  startTestimonialRotation() {
    if (this.testimonialsCarousel?.autoRotate) {
      this.testimonialsCarousel.interval = setInterval(() => {
        this.nextTestimonial();
      }, 5000);
    }
  }

  /**
   * Pause automatic testimonial rotation
   */
  pauseTestimonialRotation() {
    if (this.testimonialsCarousel?.interval) {
      clearInterval(this.testimonialsCarousel.interval);
      this.testimonialsCarousel.interval = null;
    }
  }

  /**
   * Setup enhanced FAQ accordion functionality
   */
  setupFAQAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach((item, index) => {
      const button = item.querySelector('.accordion-button');
      const collapse = item.querySelector('.accordion-collapse');
      
      if (!button || !collapse) return;

      // Enhanced accordion behavior
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleAccordionItem(item, index);
      });

      // Add keyboard navigation
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleAccordionItem(item, index);
        }
      });
    });
  }

  /**
   * Toggle accordion item with animations
   */
  toggleAccordionItem(item, index) {
    const button = item.querySelector('.accordion-button');
    const collapse = item.querySelector('.accordion-collapse');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Close other accordion items
    document.querySelectorAll('.accordion-item').forEach((otherItem, otherIndex) => {
      if (otherIndex !== index) {
        const otherButton = otherItem.querySelector('.accordion-button');
        const otherCollapse = otherItem.querySelector('.accordion-collapse');
        
        otherButton.classList.add('collapsed');
        otherButton.setAttribute('aria-expanded', 'false');
        otherCollapse.classList.remove('show');
      }
    });

    // Toggle current item
    if (isExpanded) {
      button.classList.add('collapsed');
      button.setAttribute('aria-expanded', 'false');
      collapse.classList.remove('show');
    } else {
      button.classList.remove('collapsed');
      button.setAttribute('aria-expanded', 'true');
      collapse.classList.add('show');
    }
  }

  /**
   * Setup pricing calculator functionality
   */
  setupPricingCalculator() {
    const calculatorContainer = document.createElement('div');
    calculatorContainer.className = 'pricing-calculator';
    calculatorContainer.innerHTML = `
      <div class="calculator-header">
        <h4>Calculate Your Savings</h4>
        <p>See how much you can save with annual billing</p>
      </div>
      <div class="calculator-body">
        <div class="calculator-row">
          <label>Number of Users:</label>
          <input type="range" id="userCount" min="1" max="50" value="1" class="slider">
          <span id="userCountDisplay">1</span>
        </div>
        <div class="calculator-results">
          <div class="result-item">
            <span>Monthly Total:</span>
            <span id="monthlyTotal">$29</span>
          </div>
          <div class="result-item">
            <span>Annual Total:</span>
            <span id="annualTotal">$276</span>
          </div>
          <div class="result-item savings">
            <span>Annual Savings:</span>
            <span id="annualSavings">$72</span>
          </div>
        </div>
      </div>
    `;

    // Insert calculator after pricing section
    const pricingSection = document.querySelector('.pricing-section');
    if (pricingSection) {
      pricingSection.parentNode.insertBefore(calculatorContainer, pricingSection.nextSibling);
      
      // Setup calculator interactions
      const userCountSlider = calculatorContainer.querySelector('#userCount');
      const userCountDisplay = calculatorContainer.querySelector('#userCountDisplay');
      
      userCountSlider.addEventListener('input', (e) => {
        const userCount = parseInt(e.target.value);
        userCountDisplay.textContent = userCount;
        this.updatePricingCalculation(userCount);
      });
    }
  }

  /**
   * Update pricing calculation based on user count
   */
  updatePricingCalculation(userCount) {
    const monthlyPrice = 29;
    const annualPrice = 23;
    
    const monthlyTotal = monthlyPrice * userCount;
    const annualTotal = annualPrice * userCount * 12;
    const savings = (monthlyPrice * userCount * 12) - annualTotal;
    
    document.getElementById('monthlyTotal').textContent = `$${monthlyTotal.toLocaleString()}`;
    document.getElementById('annualTotal').textContent = `$${annualTotal.toLocaleString()}`;
    document.getElementById('annualSavings').textContent = `$${savings.toLocaleString()}`;
  }

  /**
   * Setup feature highlight animations
   */
  setupFeatureHighlights() {
    const featureItems = document.querySelectorAll('.feature-showcase');
    
    featureItems.forEach((feature, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                this.animateFeatureHighlight(entry.target);
              }, index * 200);
            }
          });
        },
        { threshold: 0.3 }
      );
      
      observer.observe(feature);
    });
  }

  /**
   * Animate individual feature highlight
   */
  animateFeatureHighlight(feature) {
    feature.classList.add('highlight-animation');
    
    // Animate feature benefits
    const benefits = feature.querySelectorAll('.feature-benefits li');
    benefits.forEach((benefit, index) => {
      setTimeout(() => {
        benefit.style.transform = 'translateX(0)';
        benefit.style.opacity = '1';
      }, index * 100);
    });
  }

  /**
   * Setup progress indicators for signup flow
   */
  setupProgressIndicators() {
    const trialButtons = document.querySelectorAll('#startTrialBtn, #ctaTrialBtn');
    
    trialButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showProgressFlow();
      });
    });
  }

  /**
   * Show progress flow for trial signup
   */
  showProgressFlow() {
    const progressModal = document.createElement('div');
    progressModal.className = 'progress-modal';
    progressModal.innerHTML = `
      <div class="progress-modal-content">
        <div class="progress-header">
          <h3>Start Your Pro Trial</h3>
          <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="progress-steps">
          <div class="step active">
            <div class="step-number">1</div>
            <div class="step-label">Account Setup</div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-label">Trial Activation</div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-label">Welcome</div>
          </div>
        </div>
        <div class="progress-content">
          <p>Setting up your 14-day Pro trial...</p>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(progressModal);
    this.animateProgressFlow(progressModal);
  }

  /**
   * Animate progress flow steps
   */
  animateProgressFlow(modal) {
    const steps = modal.querySelectorAll('.step');
    const progressFill = modal.querySelector('.progress-fill');
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      if (currentStep < steps.length) {
        steps[currentStep].classList.add('completed');
        progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
        
        if (currentStep + 1 < steps.length) {
          steps[currentStep + 1].classList.add('active');
        }
        
        currentStep++;
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          modal.remove();
          this.handleTrialStart();
        }, 1000);
      }
    }, 1500);
  }

  /**
   * Setup demo animations for advanced features
   */
  setupDemoAnimations() {
    this.setupAIInsightsDemo();
    this.setupPortfolioAnalyticsDemo();
    this.setupChartIndicatorsDemo();
  }

  /**
   * Setup AI insights demo animation
   */
  setupAIInsightsDemo() {
    const aiDemo = document.querySelector('.ai-insights-demo');
    if (!aiDemo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateAIInsights(aiDemo);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(aiDemo);
  }

  /**
   * Animate AI insights demo
   */
  animateAIInsights(demo) {
    const confidenceBar = demo.querySelector('.score-fill');
    const insightTitle = demo.querySelector('.insight-title');
    
    // Animate confidence score
    let currentWidth = 0;
    const targetWidth = 85;
    const animateConfidence = () => {
      if (currentWidth < targetWidth) {
        currentWidth += 2;
        confidenceBar.style.width = `${currentWidth}%`;
        requestAnimationFrame(animateConfidence);
      }
    };
    
    setTimeout(animateConfidence, 500);
    
    // Typewriter effect for insight
    if (insightTitle) {
      const text = insightTitle.textContent;
      insightTitle.textContent = '';
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          insightTitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        }
      };
      setTimeout(typeWriter, 1000);
    }
  }

  /**
   * Setup portfolio analytics demo
   */
  setupPortfolioAnalyticsDemo() {
    const portfolioDemo = document.querySelector('.portfolio-analytics-demo');
    if (!portfolioDemo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animatePortfolioMetrics(portfolioDemo);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(portfolioDemo);
  }

  /**
   * Animate portfolio metrics
   */
  animatePortfolioMetrics(demo) {
    const metricCards = demo.querySelectorAll('.metric-card');
    
    metricCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = '0 4px 20px rgba(52, 74, 251, 0.2)';
        
        setTimeout(() => {
          card.style.transform = 'scale(1)';
          card.style.boxShadow = 'none';
        }, 600);
      }, index * 300);
    });
  }

  /**
   * Setup chart indicators demo
   */
  setupChartIndicatorsDemo() {
    const indicators = document.querySelectorAll('.indicator');
    
    if (indicators.length === 0) return;

    // Auto-cycle through indicators
    let currentIndicator = 0;
    setInterval(() => {
      indicators[currentIndicator].classList.remove('active');
      currentIndicator = (currentIndicator + 1) % indicators.length;
      indicators[currentIndicator].classList.add('active');
      
      // Trigger chart redraw
      const canvas = document.getElementById('technicalChart');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        this.drawTechnicalChart(ctx, canvas.width, canvas.height, indicators[currentIndicator].textContent);
      }
    }, 3000);
  }

  /**
   * Setup enhanced CTA interactions
   */
  setupCTAInteractions() {
    const ctaButtons = document.querySelectorAll('.btn-coinbase-primary');
    
    ctaButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px) scale(1.02)';
        btn.style.boxShadow = '0 8px 25px rgba(52, 74, 251, 0.3)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
        btn.style.boxShadow = '0 2px 8px rgba(52, 74, 251, 0.2)';
      });
    });
  }

  /**
   * Setup advanced chart demo with real-time updates
   */
  setupAdvancedChartDemo() {
    const chartCanvas = document.getElementById('technicalChart');
    if (!chartCanvas) return;

    // Simulate real-time data updates
    setInterval(() => {
      const ctx = chartCanvas.getContext('2d');
      const activeIndicator = document.querySelector('.indicator.active')?.textContent || 'RSI';
      this.drawTechnicalChart(ctx, chartCanvas.width, chartCanvas.height, activeIndicator);
    }, 5000);
  }

  /**
   * Setup keyboard navigation for accessibility
   */
  setupKeyboardNavigation() {
    // Tab navigation for pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const ctaButton = card.querySelector('.btn');
          if (ctaButton) ctaButton.click();
        }
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'p':
            e.preventDefault();
            document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
            break;
          case 'f':
            e.preventDefault();
            document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
            break;
        }
      }
    });
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 16); // ~60fps
    });
  }

  /**
   * Handle optimized scroll events
   */
  handleScroll() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Update progress bar if it exists
    const totalHeight = document.documentElement.scrollHeight - windowHeight;
    const progress = (scrollTop / totalHeight) * 100;
    
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  /**
   * Enhanced trial start with progress tracking
   */
  handleTrialStart() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
      this.startEnhancedTrial();
    } else {
      // Show login modal instead of redirect
      this.showLoginModal();
    }
  }

  /**
   * Show login modal for trial
   */
  showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Sign In to Start Your Pro Trial</h3>
          <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Sign in to your account to start your 14-day Pro trial immediately.</p>
          <div class="modal-actions">
            <a href="../auth.html?mode=signin&trial=pro" class="btn btn-coinbase-primary">
              Sign In
            </a>
            <a href="../auth.html?mode=signup&trial=pro" class="btn btn-coinbase-secondary">
              Create Account
            </a>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  /**
   * Start enhanced trial with tracking
   */
  startEnhancedTrial() {
    this.showNotification('Initializing your Pro trial experience...', 'info');
    
    setTimeout(() => {
      // Set trial data
      const trialData = {
        active: true,
        startDate: Date.now(),
        endDate: Date.now() + (14 * 24 * 60 * 60 * 1000), // 14 days
        features: ['realtime-data', 'advanced-charts', 'ai-insights', 'unlimited-alerts'],
        userId: localStorage.getItem('userId') || 'demo-user'
      };
      
      localStorage.setItem('proTrial', JSON.stringify(trialData));
      
      this.showNotification(
        'Welcome to YAUSMA Pro! Your 14-day trial includes all premium features.',
        'success'
      );
      
      // Show trial dashboard
      setTimeout(() => {
        this.showTrialDashboard();
      }, 2000);
    }, 1500);
  }

  /**
   * Show trial dashboard modal
   */
  showTrialDashboard() {
    const dashboard = document.createElement('div');
    dashboard.className = 'trial-dashboard';
    dashboard.innerHTML = `
      <div class="dashboard-content">
        <div class="dashboard-header">
          <h3>Your Pro Trial Dashboard</h3>
          <div class="trial-timer">
            <span class="timer-label">Trial ends in:</span>
            <span class="timer-value">14 days</span>
          </div>
        </div>
        <div class="dashboard-features">
          <div class="feature-status">
            <i class="fas fa-check-circle text-success"></i>
            <span>Real-time market data activated</span>
          </div>
          <div class="feature-status">
            <i class="fas fa-check-circle text-success"></i>
            <span>Advanced charting tools unlocked</span>
          </div>
          <div class="feature-status">
            <i class="fas fa-check-circle text-success"></i>
            <span>AI insights enabled</span>
          </div>
          <div class="feature-status">
            <i class="fas fa-check-circle text-success"></i>
            <span>Priority support access granted</span>
          </div>
        </div>
        <div class="dashboard-actions">
          <button class="btn btn-coinbase-primary" onclick="window.location.href='../index.html'">
            Go to Dashboard
          </button>
          <button class="btn btn-coinbase-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
            Continue Exploring
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(dashboard);
  }

  /**
   * Cleanup event listeners and observers
   */
  destroy() {
    if (this.animationObserver) {
      this.animationObserver.disconnect();
    }
    
    // Cleanup testimonial carousel
    this.pauseTestimonialRotation();
    
    // Remove event listeners
    if (this.pricingToggle) {
      this.pricingToggle.removeEventListener('change', this.handlePricingToggle);
    }
    
    // Remove any created elements
    document.querySelectorAll('.pricing-calculator, .progress-modal, .login-modal, .trial-dashboard').forEach(el => {
      el.remove();
    });
  }
}

// Initialize Pro page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.proPageManager = new ProPageManager();
});

// Listen for theme changes
document.addEventListener('themeChanged', () => {
  if (window.proPageManager) {
    window.proPageManager.handleThemeChange();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.proPageManager) {
    window.proPageManager.destroy();
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProPageManager;
}