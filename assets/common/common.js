/**
 * Common JavaScript
 * Shared functionality between themes
 */

// Prevent console errors in browsers that lack a console
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/**
 * Detect browser and OS for specific adjustments
 */
function detectBrowser() {
    // Opera 8.0+
    const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Firefox 1.0+
    const isFirefox = typeof InstallTrigger !== 'undefined';
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1 - 79
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // Edge (based on chromium)
    const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
    // Blink engine detection
    const isBlink = (isChrome || isOpera) && !!window.CSS;

    // Operating system detection
    const isWindows = navigator.platform.indexOf('Win') > -1;
    const isMac = navigator.platform.indexOf('Mac') > -1;
    const isLinux = navigator.platform.indexOf('Linux') > -1;
    
    // Add classes to body based on browser and OS
    const body = document.body;
    
    if (isOpera) body.classList.add('opera');
    if (isFirefox) body.classList.add('firefox');
    if (isSafari) body.classList.add('safari');
    if (isIE) body.classList.add('ie');
    if (isEdge) body.classList.add('edge');
    if (isChrome && !isEdgeChromium) body.classList.add('chrome');
    if (isEdgeChromium) body.classList.add('edge-chromium');
    if (isBlink) body.classList.add('blink');
    
    if (isWindows) body.classList.add('windows');
    if (isMac) body.classList.add('mac');
    if (isLinux) body.classList.add('linux');
    
    // Also detect touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
        body.classList.add('touch-device');
    } else {
        body.classList.add('no-touch');
    }
}

/**
 * Utility function to check if an element is in viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @param {boolean} immediate - Whether to trigger the function immediately
 * @returns {Function} - The debounced function
 */
function debounce(func, wait, immediate) {
    let timeout;
    
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

/**
 * Basic form validation utility
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    let valid = true;
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            valid = false;
            input.classList.add('invalid');
        } else if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                valid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        } else {
            input.classList.remove('invalid');
        }
    });
    
    return valid;
}

/**
 * Utility function to add copy-to-clipboard functionality
 * @param {HTMLElement} element - The element to copy from
 * @param {Function} [callback] - Optional callback for success
 */
function addCopyToClipboard(element, callback) {
    element.addEventListener('click', function() {
        const text = this.textContent || this.innerText;
        
        navigator.clipboard.writeText(text).then(function() {
            if (callback && typeof callback === 'function') {
                callback();
            }
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    });
}

/**
 * Initialize the blog slider
 */
function initBlogSlider() {
    const slider = document.querySelector('.blog-slider');
    const prevButton = document.querySelector('.blog-slider-prev');
    const nextButton = document.querySelector('.blog-slider-next');
    const dotsContainer = document.querySelector('.blog-slider-dots');
    
    if (!slider || !prevButton || !nextButton || !dotsContainer) return;
    
    const posts = slider.querySelectorAll('.blog-post');
    if (posts.length === 0) return;
    
    // Calculate visible posts based on screen width
    const getVisiblePosts = () => {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1000) return 2;
        return 3;
    };
    
    let visiblePosts = getVisiblePosts();
    let currentIndex = 0;
    let totalSlides = Math.ceil(posts.length / visiblePosts);
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('blog-slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Update dots
    const updateDots = () => {
        const dots = dotsContainer.querySelectorAll('.blog-slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };
    
    // Go to slide
    const goToSlide = (index) => {
        currentIndex = index;
        const slideWidth = posts[0].offsetWidth + parseInt(getComputedStyle(posts[0]).marginRight);
        slider.scrollLeft = index * slideWidth * visiblePosts;
        updateDots();
    };
    
    // Previous slide
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(totalSlides - 1); // Loop to last slide
        }
    });
    
    // Next slide
    nextButton.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0); // Loop to first slide
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newVisiblePosts = getVisiblePosts();
        if (newVisiblePosts !== visiblePosts) {
            visiblePosts = newVisiblePosts;
            totalSlides = Math.ceil(posts.length / visiblePosts);
            
            // Rebuild dots
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('blog-slider-dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
            
            // Adjust current index if needed
            if (currentIndex >= totalSlides) {
                currentIndex = totalSlides - 1;
            }
            
            goToSlide(currentIndex);
        }
    });
    
    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    const handleSwipe = () => {
        const minSwipeDistance = 50;
        if (touchEndX < touchStartX - minSwipeDistance) {
            // Swipe left
            if (currentIndex < totalSlides - 1) {
                goToSlide(currentIndex + 1);
            }
        } else if (touchEndX > touchStartX + minSwipeDistance) {
            // Swipe right
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            }
        }
    };
    
    // Initialize first slide
    goToSlide(0);
}

// Initialize browser detection when DOM is loaded
document.addEventListener('DOMContentLoaded', detectBrowser);

// Initialize common features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    // Initialize blog slider
    initBlogSlider();
});

// Export utility functions for use in theme-specific scripts
window.portfolioUtils = {
    isInViewport,
    debounce,
    validateForm,
    addCopyToClipboard
}; 