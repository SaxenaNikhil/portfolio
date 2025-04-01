/**
 * Frontend Theme JavaScript
 * Handles theme-specific functionality and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Remove preloader once page is loaded
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }, 1000);

    // Initialize fade-in animations
    initFadeInElements();

    // Initialize scroll events
    initScrollEvents();

    // Initialize mobile navigation
    initMobileNavigation();

    // Initialize experience tabs
    initExperienceTabs();

    // Initialize project filtering
    initProjectFiltering();

    // Initialize theme switch
    initThemeSwitch();
});

/**
 * Initialize fade-in animations for elements with the 'fade-in' class
 */
function initFadeInElements() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
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
 * Initialize scroll events for header shrinking and active nav links
 */
function initScrollEvents() {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        // Header shrink effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        lastScrollY = window.scrollY;
    });
}

/**
 * Initialize mobile navigation toggle functionality
 */
function initMobileNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    
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
 * Initialize experience tabs functionality
 */
function initExperienceTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const jobContents = document.querySelectorAll('.job-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active content
            jobContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Initialize project filtering functionality
 */
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('[data-category]');
    
    // Initialize with "All" filter active
    filterProjects('frontend_all');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('disabled')) return;
            
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            filterProjects(filter);
        });
    });
    
    function filterProjects(filter) {
        projects.forEach(project => {
            const category = project.getAttribute('data-category');
            
            if (filter === 'frontend_all') {
                // Show all except cloud
                if (category === 'cloud') {
                    project.style.display = 'none';
                } else {
                    project.style.display = '';
                    project.style.opacity = '1';
                }
            } else {
                // Show only matching category
                if (category === filter) {
                    project.style.display = '';
                    project.style.opacity = '1';
                } else {
                    project.style.display = 'none';
                }
            }
        });
    }
}

/**
 * Initialize theme switch functionality
 */
function initThemeSwitch() {
    const themeSwitch = document.getElementById('theme-switch');
    const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
    
    // Desktop theme switch
    themeSwitch.addEventListener('click', () => {
        // Redirect to cloud theme
        window.location.href = '../cloud/index.html';
    });
    
    // Mobile theme switch
    if (mobileThemeSwitch) {
        mobileThemeSwitch.addEventListener('click', () => {
            // Redirect to cloud theme
            window.location.href = '../cloud/index.html';
        });
    }
}

/**
 * Smooth scroll functionality for anchor links
 */
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