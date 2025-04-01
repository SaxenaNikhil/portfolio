/**
 * Blog JavaScript
 * Handles blog-specific functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize theme selector
    initThemeSelector();
    
    // Initialize fade-in animations
    initFadeInElements();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize email form submission (if exists)
    initEmailSubscription();
});

/**
 * Initialize mobile navigation toggle functionality
 */
function initMobileNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    
    if (!menuToggle || !mobileNav || !mobileNavOverlay || !mobileClose) return;
    
    function openMobileNav() {
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileNav() {
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    menuToggle.addEventListener('click', openMobileNav);
    mobileClose.addEventListener('click', closeMobileNav);
    mobileNavOverlay.addEventListener('click', closeMobileNav);
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });
}

/**
 * Initialize theme selector to switch between frontend and cloud themes
 */
function initThemeSelector() {
    const themeLinks = document.querySelectorAll('.theme-link');
    const mobileThemeLinks = document.querySelectorAll('.mobile-theme-selector .theme-link');
    
    if (themeLinks.length === 0) return;
    
    // Get current theme from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const currentTheme = urlParams.get('theme') || 'frontend';
    
    // Update active theme link
    function updateThemeLinks(theme) {
        themeLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(theme));
        });
        
        if (mobileThemeLinks.length > 0) {
            mobileThemeLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href').includes(theme));
            });
        }
    }
    
    // Initial update
    updateThemeLinks(currentTheme);
    
    // Add click event to theme links
    themeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default to allow URL parameter change
            const targetTheme = this.getAttribute('href').split('=')[1];
            
            // If we're on a blog post page, we want to keep the current post
            if (document.body.classList.contains('blog-post-page')) {
                const currentPath = window.location.pathname;
                e.preventDefault();
                
                // Change only the theme parameter
                urlParams.set('theme', targetTheme);
                window.location.search = urlParams.toString();
            }
        });
    });
    
    if (mobileThemeLinks.length > 0) {
        mobileThemeLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't prevent default to allow URL parameter change
                const targetTheme = this.getAttribute('href').split('=')[1];
                
                // If we're on a blog post page, we want to keep the current post
                if (document.body.classList.contains('blog-post-page')) {
                    const currentPath = window.location.pathname;
                    e.preventDefault();
                    
                    // Change only the theme parameter
                    urlParams.set('theme', targetTheme);
                    window.location.search = urlParams.toString();
                }
            });
        });
    }
}

/**
 * Initialize fade-in animations for elements with the 'fade-in' class
 */
function initFadeInElements() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Initialize email subscription form handling
 */
function initEmailSubscription() {
    const form = document.querySelector('.cta-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // In a real application, you would send this data to a server
        // For now, let's just show a success message
        alert(`Thank you for subscribing with ${email}! You'll receive updates on new blog posts.`);
        emailInput.value = '';
    });
} 