/**
 * YAUSMA Pro Page JavaScript
 * Simple functionality for the pro/upgrade page
 */

// Pro page state
var ProPage = {
    initialized: false
};

// Initialize pro page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('pro.html')) {
        initProPage();
    }
});

// Main pro page initialization
function initProPage() {
    if (ProPage.initialized) {
        return;
    }
    
    try {
        initSmoothScrolling();
        initPricingCards();
        initThemeIntegration();
        
        ProPage.initialized = true;
        
        if (YAUSMA.debug) {
            console.log('Pro page initialized successfully');
        }
        
    } catch (error) {
        console.error('Failed to initialize pro page:', error);
    }
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            var targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                var navbarHeight = 80;
                var targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize pricing card interactions
function initPricingCards() {
    var pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(function(card) {
        // Add smooth hover transitions
        card.style.transition = 'all 0.3s ease, transform 0.3s ease';
        
        // Track pricing card clicks for analytics (placeholder)
        card.addEventListener('click', function() {
            var planName = this.querySelector('.plan-name')?.textContent || 'Unknown';
            trackPricingClick(planName);
        });
    });
    
    // Initialize CTA buttons
    var ctaButtons = document.querySelectorAll('.btn-primary, .btn-outline-primary');
    
    ctaButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            var buttonText = this.textContent.trim();
            
            // Track button clicks for analytics (placeholder)
            trackCTAClick(buttonText);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Initialize theme integration
function initThemeIntegration() {
    // Listen for theme changes
    document.addEventListener('themeChanged', function(e) {
        handleThemeChange(e.detail.theme);
    });
    
    // Apply theme-specific adjustments on load
    var currentTheme = document.body.getAttribute('data-theme') || 'light';
    handleThemeChange(currentTheme);
}

// Handle theme changes
function handleThemeChange(theme) {
    var heroSection = document.querySelector('.pro-hero-section');
    var pricingCards = document.querySelectorAll('.pricing-card');
    var benefitCards = document.querySelectorAll('.benefit-card');
    
    // Smooth transition for theme changes
    [heroSection, ...pricingCards, ...benefitCards].forEach(function(element) {
        if (element) {
            element.style.transition = 'all 0.3s ease, background-color 0.3s ease, color 0.3s ease';
        }
    });
}

// Track pricing card interactions (placeholder for analytics)
function trackPricingClick(planName) {
    if (YAUSMA.debug) {
        console.log('Pricing card clicked:', planName);
    }
    
    // Here you would integrate with your analytics service
    // Example: gtag('event', 'pricing_card_click', { plan: planName });
}

// Track CTA button clicks (placeholder for analytics)
function trackCTAClick(buttonText) {
    if (YAUSMA.debug) {
        console.log('CTA button clicked:', buttonText);
    }
    
    // Here you would integrate with your analytics service
    // Example: gtag('event', 'cta_click', { button: buttonText });
}

// Initialize FAQ toggle (if needed in future)
function initFAQToggle() {
    var faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                var isOpen = item.classList.contains('open');
                
                // Close all other FAQ items
                faqItems.forEach(function(otherItem) {
                    otherItem.classList.remove('open');
                });
                
                // Toggle current item
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        }
    });
}

// Handle form submissions (for future contact forms)
function handleFormSubmission(formElement, formType) {
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var submitButton = formElement.querySelector('button[type="submit"]');
        var originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
        
        // Simulate form processing
        setTimeout(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Show success message
            showMessage('Thank you! We\'ll be in touch soon.', 'success');
            
            // Track form submission
            if (YAUSMA.debug) {
                console.log('Form submitted:', formType);
            }
        }, 2000);
    });
}

// Add scroll-based animations (simple fade-in)
function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('.benefit-card, .pricing-card');
    
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(function(element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// Initialize scroll animations on load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('pro.html')) {
        setTimeout(initScrollAnimations, 100);
    }
});

// Export for global use
window.ProPage = ProPage;

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    ProPage.initialized = false;
});