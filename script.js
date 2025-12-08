// Configuration for Google Sheets integration
const GOOGLE_SHEETS_CONFIG = {
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbytKCYjeuBObo-oqRcsRcFeuJppn3tUzyjfccDCck7N6OSQVtL6NdGmwPOLLgLU6bV2Bw/exec',
    FALLBACK_EMAIL: 'aksolutionsgroups@gmail.com'
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initLoadingAnimation();
    initNavigation();
    initScrollAnimations();
    initTestimonialSlider();
    initPortfolioModals();
    initFormHandling();
    initSmoothScrolling();
    initParallax();
    initTypingAnimation();
    initAnalytics();
    initWhatsAppIntegration();
    enhanceSEO();
    initCopyToClipboard();
    initNotificationSystem();
    initPerformanceOptimizations();
    initThemeToggle();
    initWhatsAppButton();
});

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    const body = document.body;

    // Load theme from localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Loading Animation
function initLoadingAnimation() {
    const loading = document.getElementById('loading');
    if (loading) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }, 1000);
        });

        // Fallback: hide loading if it takes too long
        setTimeout(() => {
            if (!loading.classList.contains('hidden')) {
                loading.classList.add('hidden');
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }
        }, 3000);
    }
}

// Navigation Functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    if (!hamburger || !navMenu) return;

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar background on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.click();
        }
    });
}

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.parentElement && entry.target.parentElement.classList.contains('benefits-grid')) {
                    const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 0.1;
                    entry.target.style.animationDelay = `${delay}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.benefit-card, .service-card, .pricing-card, .portfolio-item');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });

    // Hero section animation
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroContent) {
        heroContent.classList.add('fade-in-up');
    }
    if (heroVisual) {
        setTimeout(() => {
            heroVisual.classList.add('fade-in');
        }, 300);
    }
}

// Testimonial Slider
function initTestimonialSlider() {
    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let autoSlideInterval;

    if (testimonials.length === 0) return;

    function showSlide(n) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
        });

        currentSlide = (n + testimonials.length) % testimonials.length;

        testimonials[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });

        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showSlide(index);
                stopAutoSlide();
                startAutoSlide();
            }
        });
    });

    // Pause auto-slide on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', stopAutoSlide);
        testimonialSlider.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
    window.currentSlide = showSlide;
}

// Portfolio Modals
function initPortfolioModals() {
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.querySelector('.close');

    if (!modal || !modalContent) return;
    // Project data with enhanced information
    const projects = {
        cafe: {
            title: 'Modern Café Website',
            description: 'A beautiful, responsive website for a local café featuring online ordering, menu display, and reservation system. The project focused on creating an elegant user experience that reflects the café\'s warm atmosphere.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'],
            features: ['Online ordering system', 'Menu management', 'Reservation booking', 'Mobile responsive', 'SEO optimized', 'Payment integration'],
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            duration: '10 days',
            budget: '₹12,000',
            results: '40% increase in online orders'
        },
        coaching: {
            title: 'Online Coaching Institute Platform',
            description: 'A comprehensive learning management system with student portal, course management, and payment integration. Built to handle hundreds of students with real-time progress tracking.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io'],
            features: ['Student dashboard', 'Course management', 'Payment integration', 'Video streaming', 'Progress tracking', 'Live classes'],
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            duration: '21 days',
            budget: '₹35,000',
            results: '200+ students enrolled'
        },
        mobile: {
            title: 'Mobile App Landing Page',
            description: 'High-converting landing page designed to showcase mobile app features and drive downloads. Optimized for conversion with A/B testing and analytics integration.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Google Analytics'],
            features: ['Animated sections', 'App store integration', 'Feature showcase', 'Testimonials', 'Download tracking', 'A/B testing'],
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            duration: '7 days',
            budget: '₹8,500',
            results: '300% increase in downloads'
        },
        artisan: {
            title: 'Local Artisan E-commerce Store',
            description: 'Beautiful online store showcasing handmade products with secure payment processing and inventory management. Designed to highlight the unique craftsmanship of local artisans.',
            technologies: ['React', 'Node.js', 'Stripe', 'MongoDB', 'Cloudinary'],
            features: ['Product catalog', 'Shopping cart', 'Payment processing', 'Inventory management', 'Order tracking', 'Artisan profiles'],
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            duration: '14 days',
            budget: '₹22,000',
            results: '₹2.5L+ in sales'
        },
        service: {
            title: 'Service Business Lead Generation',
            description: 'Lead generation website optimized for converting visitors into qualified leads for service-based businesses. Includes advanced form handling and CRM integration.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
            features: ['Lead capture forms', 'Service showcase', 'Testimonials', 'Contact integration', 'Analytics tracking', 'CRM integration'],
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            duration: '8 days',
            budget: '₹9,500',
            results: '150+ qualified leads'
        },
        fitness: {
            title: 'Fitness Management Website',
            description: 'A modern and responsive Fitness Management Application built to streamline workouts, diet tracking, membership management, and progress monitoring. The goal of this project was to design a clean, intuitive UI that makes it easy for users to follow fitness plans while giving admins full control over members, trainers, and schedules.',
            technologies: ['Html', 'Css', 'JavaScript', 'java', 'Springboot', 'MySQL'],
            features: ['User Registration & Login', 'Membership System', 'Trainer Management', 'Progress Tracker (weight, BMI, workouts)', 'Progress tracking', 'SEO Optimized'],
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w==800&q=80',
            duration: '10 days',
            budget: '₹15,000',
            results: '40% increase in user engagement'
        }
    };
    // Open modal function
    window.openProject = function(projectId) {
            const project = projects[projectId];
            if (!project) return;

            modalContent.innerHTML = `
            <div class="project-details">
                <h2 style="color: #FFD700; margin-bottom: 1rem; font-size: 1.8rem;">${project.title}</h2>
                
                <div class="project-image" style="margin-bottom: 1.5rem;">
                    <img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                </div>
                
                <div class="project-info" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background: rgba(255,215,0,0.1); padding: 1rem; border-radius: 8px; border-left: 3px solid #FFD700;">
                        <strong style="color: #FFD700;">Duration:</strong><br>${project.duration}
                    </div>
                    <div style="background: rgba(255,215,0,0.1); padding: 1rem; border-radius: 8px; border-left: 3px solid #FFD700;">
                        <strong style="color: #FFD700;">Budget:</strong><br>${project.budget}
                    </div>
                    <div style="background: rgba(255,215,0,0.1); padding: 1rem; border-radius: 8px; border-left: 3px solid #FFD700;">
                        <strong style="color: #FFD700;">Results:</strong><br>${project.results}
                    </div>
                </div>
                
                <p style="margin-bottom: 1.5rem; line-height: 1.6; color: #00000;">${project.description}</p>
                
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="color: #FFD700; margin-bottom: 0.5rem;">Technologies Used</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">

                    </div>
                </div>
                
                <div>
                    <h3 style="color: #FFD700; margin-bottom: 0.5rem;">Key Features</h3>
                    <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem;">
                        ${project.features.map(feature => `<li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative; color: #cccccc;">
                            <span style="position: absolute; left: 0; color: #FFD700; font-weight: bold;">✓</span> ${feature}
                        </li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        closeBtn.focus();
    };

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        
        if (document.activeElement && document.activeElement.classList.contains('portfolio-item')) {
            document.activeElement.focus();
        }
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Form Handling
function initFormHandling() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    form.addEventListener('submit', submitForm);
}

function validateField(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (!errorElement) return;

    let isValid = true;
    let errorMessage = '';

    field.classList.remove('error');
    errorElement.textContent = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    if (!isValid) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        announceToScreenReader(errorMessage);
    }

    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
}

function submitForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Prepare form data
    const submissionData = {
        name: formData.get('name'),
        email: formData.get('email'),
        whatsapp: formData.get('whatsapp') || '',
        businessType: formData.get('businessType'),
        websiteType: formData.get('websiteType'),
        budget: formData.get('budget'),
        message: formData.get('message')
    };

    // Submit to Google Sheets
    submitToGoogleSheets(submissionData)
        .then(response => {
            if (response.success) {
                form.reset();
                showNotification(response.message || 'Thank you! Your quote request has been sent. We\'ll get back to you within 2 hours.', 'success');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'engagement',
                        'event_label': 'quote_request_success'
                    });
                }
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                showNotification(response.message || 'There was an error submitting your form. Please try again.', 'error');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit_error', {
                        'event_category': 'engagement',
                        'event_label': 'quote_request_failed'
                    });
                }
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showNotification('Unable to submit your form at this time. Please try again later or contact us directly.', 'error');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit_fatal_error', {
                    'event_category': 'engagement',
                    'event_label': 'quote_request_fatal_failed'
                });
            }
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

async function submitToGoogleSheets(data) {
    try {
        await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(data)
        });

        return { 
            success: true, 
            message: 'Thank you! Your quote request has been sent. We\'ll get back to you within 2 hours.' 
        };
    } catch (error) {
        console.error('Google Sheets submission failed:', error);
        throw error;
    }
}

// Notification System
function initNotificationSystem() {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.querySelector('.notification-close');

    if (!notification || !notificationMessage) return;

    window.showNotification = function(message, type = 'info') {
        notificationMessage.textContent = message;
        notification.className = `notification ${type}`;
        notification.setAttribute('aria-hidden', 'false');
        notification.classList.add('show');
        notificationClose.removeAttribute('tabindex');

        notification.setAttribute('aria-hidden','true');
        notificationClose.setAttribute('tabindex','-1');
        
        setTimeout(() => {
            hideNotification();
        }, 5000);
        
        announceToScreenReader(message);
    };

    function hideNotification() {
        notification.classList.remove('show');
        notification.setAttribute('aria-hidden', 'true');
    }

    if (notificationClose) {
        notificationClose.addEventListener('click', hideNotification);
    }
}

// Copy to Clipboard
function initCopyToClipboard() {
    window.copyToClipboard = function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copied to clipboard!', 'success');
            }).catch(() => {
                fallbackCopyToClipboard(text);
            });
        } else {
            fallbackCopyToClipboard(text);
        }
    };

    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy to clipboard', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Parallax Effect
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Typing Animation
function initTypingAnimation() {
    const codeLines = document.querySelectorAll('.code-line');
    if (codeLines.length === 0) return;

    const typeWriter = () => {
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, index * 500);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    });

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        observer.observe(heroVisual);
    }
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Analytics Integration
function initAnalytics() {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', debounce(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) {
                    gtag('event', 'scroll', {
                        'event_category': 'engagement',
                        'event_label': `${maxScroll}%`
                    });
                }
            }
        }, 1000));
    }
}

// WhatsApp Integration
function initWhatsAppIntegration() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'engagement',
                    'event_label': 'whatsapp_contact'
                });
            }
        });
    });
}

// SEO Enhancements
function enhanceSEO() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "AK Solutions",
        "url": window.location.origin,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    if (!document.querySelector('meta[name="description"]')) {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'Professional web development services in India. Custom websites, React apps, e-commerce solutions. Fast delivery in 7-14 days.';
        document.head.appendChild(meta);
    }
}

// WhatsApp Button
function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (!whatsappBtn) return;

    setTimeout(() => {
        whatsappBtn.style.opacity = '1';
        whatsappBtn.style.transform = 'scale(1)';
    }, 1000);
}

// Utility Functions
function debounce(func, wait) {
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

function announceToScreenReader(message) {
    let liveRegion = document.getElementById('sr-live-region');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'sr-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = message;
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 1000);
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        'name': 'load',
                        'value': Math.round(perfData.loadEventEnd - perfData.loadEventStart)
                    });
                }
            }
        }, 0);
    });
}
