// Navbar Toggler - Improved Mobile Menu
const navbarToggler = document.getElementById('navbarToggle');
const navbarContent = document.getElementById('navbarContent');
const body = document.body;

if (navbarToggler && navbarContent) {
    navbarToggler.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Toggle collapsed class on button
        navbarToggler.classList.toggle('collapsed');
        
        // Toggle collapse class on content
        navbarContent.classList.toggle('collapse');
        
        // Update aria-expanded
        const isExpanded = !navbarToggler.classList.contains('collapsed');
        navbarToggler.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open on mobile
        if (window.innerWidth <= 768) {
            if (isExpanded) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        }
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navbarToggler.classList.add('collapsed');
                navbarContent.classList.add('collapse');
                navbarToggler.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInsideNav = navbarContent.contains(e.target) || navbarToggler.contains(e.target);
            const isExpanded = !navbarToggler.classList.contains('collapsed');
            
            if (!isClickInsideNav && isExpanded) {
                navbarToggler.classList.add('collapsed');
                navbarContent.classList.add('collapse');
                navbarToggler.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                body.style.overflow = '';
                navbarToggler.classList.add('collapsed');
                navbarContent.classList.add('collapse');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');

if (darkModeToggle) {
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Save preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Language Toggle
const langToggle = document.getElementById('langToggle');
const html = document.documentElement;
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update HTML lang and dir attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update button text
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = lang === 'en' ? 'AR' : 'EN';
        }
    }
    
    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
}

if (langToggle) {
    // Check for saved language preference
    if (localStorage.getItem('language') === 'ar') {
        switchLanguage('ar');
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        switchLanguage(currentLang);
        localStorage.setItem('language', currentLang);
    });
}

// FAQ Toggle Functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const wasActive = item.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!wasActive) {
            item.classList.add('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const nav = document.querySelector('nav');
            const navHeight = nav ? nav.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Indicator with Circle Animation
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const navbarNav = document.querySelector('.navbar-nav');
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    if (!navbarNav) return;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        
        if (href === currentSection) {
            link.classList.add('active');
            
            // Move the circle indicator (only on desktop)
            if (window.innerWidth > 768) {
                const linkRect = link.getBoundingClientRect();
                const navRect = navbarNav.getBoundingClientRect();
                const leftPosition = linkRect.left - navRect.left + (linkRect.width / 2) - 45;
                
                navbarNav.style.setProperty('--indicator-left', `${leftPosition}px`);
            }
        }
    });
}

// Set CSS variable for indicator position
if (navbarNav) {
    navbarNav.style.setProperty('--indicator-left', '0px');

    // Add CSS for the indicator movement
    const style = document.createElement('style');
    style.textContent = `
        .navbar-nav::before {
            left: var(--indicator-left) !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
window.addEventListener('load', () => {
    updateActiveLink();
});

// Update on scroll
let scrollTimer;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        updateActiveLink();
    }, 50);
});

// Update on click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(updateActiveLink, 100);
    });
});

// Navbar Color Change on Scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const pricingSection = document.getElementById('pricing');
    const currentScroll = window.scrollY;
    
    if (!nav) return;
    
    // Add/remove scrolled class for navbar background
    if (pricingSection) {
        const pricingTop = pricingSection.offsetTop;
        const pricingBottom = pricingTop + pricingSection.clientHeight;
        const scrollPos = currentScroll + 100;
        
        // Check if we're in the pricing section
        if (scrollPos >= pricingTop && scrollPos < pricingBottom) {
            nav.classList.remove('scrolled');
        } else if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    } else {
        // Fallback to original behavior
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    lastScroll = currentScroll;
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close menu on Escape key
    if (e.key === 'Escape' && navbarToggler && !navbarToggler.classList.contains('collapsed')) {
        navbarToggler.click();
    }
});

// Plan Selection - Save to localStorage and redirect to payment
document.querySelectorAll('.plan-select-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the plan from parent pricing card
        const pricingCard = this.closest('.pricing-card');
        const planType = pricingCard ? pricingCard.getAttribute('data-plan') : null;
        
        if (planType) {
            // Save selected plan to localStorage
            localStorage.setItem('selectedPlan', planType);
            
            // Redirect to language-specific payment page
            const pageLang = document.documentElement.lang || 'en';
            const paymentPage = pageLang.toLowerCase().startsWith('ar')
                ? '/payment/payment-ar.html'
                : '/payment/payment-en.html';
            window.location.href = paymentPage;
        }
    });
});

// Navbar Hide on Scroll Down, Show on Scroll Up
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');
const scrollThreshold = 100; // Start hiding after 100px

if (navbar) {
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                navbar.classList.add('nav-hidden');
            } else {
                // Scrolling up
                navbar.classList.remove('nav-hidden');
            }
        } else {
            // At top of page
            navbar.classList.remove('nav-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
}

// ===== TRANSFORMATIONS SLIDER =====
let currentTransSlide = 0;
const transSlider = document.getElementById('transformationsSlider');
const transSlides = document.querySelectorAll('.transformation-slide');
const transLeftBtn = document.getElementById('transLeft');
const transRightBtn = document.getElementById('transRight');
const transDots = document.querySelectorAll('#transDots .dot');

if (transSlider && transSlides.length > 0) {
    function showTransSlide(index) {
        if (index >= transSlides.length) {
            currentTransSlide = 0;
        } else if (index < 0) {
            currentTransSlide = transSlides.length - 1;
        } else {
            currentTransSlide = index;
        }

        const offset = -currentTransSlide * 100;
        transSlider.style.transform = `translateX(${offset}%)`;

        transDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentTransSlide);
        });

        transSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentTransSlide);
        });
    }

    if (transRightBtn) {
        transRightBtn.addEventListener('click', () => {
            showTransSlide(currentTransSlide + 1);
        });
    }

    if (transLeftBtn) {
        transLeftBtn.addEventListener('click', () => {
            showTransSlide(currentTransSlide - 1);
        });
    }

    transDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTransSlide(index);
        });
    });

    // Touch/Swipe for transformations
    let transStartX = 0;
    let transEndX = 0;

    transSlider.addEventListener('touchstart', (e) => {
        transStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    transSlider.addEventListener('touchend', (e) => {
        transEndX = e.changedTouches[0].screenX;
        if (transEndX < transStartX - 50) {
            showTransSlide(currentTransSlide + 1);
        }
        if (transEndX > transStartX + 50) {
            showTransSlide(currentTransSlide - 1);
        }
    }, { passive: true });

    // Auto-play transformations
    let transAutoplay = setInterval(() => {
        showTransSlide(currentTransSlide + 1);
    }, 5000);

    const transContainer = document.querySelector('.transformations-slider-container');
    if (transContainer) {
        transContainer.addEventListener('mouseenter', () => {
            clearInterval(transAutoplay);
        });

        transContainer.addEventListener('mouseleave', () => {
            transAutoplay = setInterval(() => {
                showTransSlide(currentTransSlide + 1);
            }, 5000);
        });
    }
}

// ===== REVIEWS SLIDER =====
let currentReviewSlide = 0;
const reviewSlider = document.getElementById('reviewsSlider');
const reviewSlides = document.querySelectorAll('.review-card-photo');
const reviewLeftBtn = document.getElementById('reviewLeft');
const reviewRightBtn = document.getElementById('reviewRight');
const reviewDots = document.querySelectorAll('#reviewDots .dot');

if (reviewSlider && reviewSlides.length > 0) {
    function showReviewSlide(index) {
        if (index >= reviewSlides.length) {
            currentReviewSlide = 0;
        } else if (index < 0) {
            currentReviewSlide = reviewSlides.length - 1;
        } else {
            currentReviewSlide = index;
        }

        const offset = -currentReviewSlide * 100;
        reviewSlider.style.transform = `translateX(${offset}%)`;

        reviewDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentReviewSlide);
        });

        reviewSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentReviewSlide);
        });
    }

    if (reviewRightBtn) {
        reviewRightBtn.addEventListener('click', () => {
            showReviewSlide(currentReviewSlide + 1);
        });
    }

    if (reviewLeftBtn) {
        reviewLeftBtn.addEventListener('click', () => {
            showReviewSlide(currentReviewSlide - 1);
        });
    }

    reviewDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showReviewSlide(index);
        });
    });

    // Touch/Swipe for reviews
    let reviewStartX = 0;
    let reviewEndX = 0;

    reviewSlider.addEventListener('touchstart', (e) => {
        reviewStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    reviewSlider.addEventListener('touchend', (e) => {
        reviewEndX = e.changedTouches[0].screenX;
        if (reviewEndX < reviewStartX - 50) {
            showReviewSlide(currentReviewSlide + 1);
        }
        if (reviewEndX > reviewStartX + 50) {
            showReviewSlide(currentReviewSlide - 1);
        }
    }, { passive: true });

    // Auto-play reviews
    let reviewAutoplay = setInterval(() => {
        showReviewSlide(currentReviewSlide + 1);
    }, 4000);

    const reviewContainer = document.querySelector('.reviews-slider-container');
    if (reviewContainer) {
        reviewContainer.addEventListener('mouseenter', () => {
            clearInterval(reviewAutoplay);
        });

        reviewContainer.addEventListener('mouseleave', () => {
            reviewAutoplay = setInterval(() => {
                showReviewSlide(currentReviewSlide + 1);
            }, 4000);
        });
    }
}

// ===== HM CHAMPIONS SLIDERS =====
(function initHmChampionsSliders() {
    const sections = document.querySelectorAll('.hm-champions');

    sections.forEach((section) => {
        const slides = section.querySelectorAll('.hm-champion-slide');
        const dots = section.querySelectorAll('.hm-champions-dot');
        const prevBtn = section.querySelector('.hm-champions-prev');
        const nextBtn = section.querySelector('.hm-champions-next');
        const slider = section.querySelector('.hm-champions-slider');

        if (!slides.length) {
            return;
        }

        let current = 0;
        let autoTimer = null;
        let startX = 0;

        function goToSlide(index, userAction = false) {
            slides[current].classList.remove('hm-champion-active');
            if (dots[current]) {
                dots[current].classList.remove('hm-champions-dot-active');
            }

            current = (index + slides.length) % slides.length;

            slides[current].classList.add('hm-champion-active');
            if (dots[current]) {
                dots[current].classList.add('hm-champions-dot-active');
            }

            if (userAction) {
                restartAuto();
            }
        }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => {
                goToSlide(current + 1, false);
            }, 5000);
        }

        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        function restartAuto() {
            startAuto();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(current - 1, true));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(current + 1, true));
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index, true));
        });

        if (slider) {
            slider.addEventListener('mouseenter', stopAuto);
            slider.addEventListener('mouseleave', startAuto);
            slider.addEventListener('touchstart', (e) => {
                startX = e.changedTouches[0].screenX;
            }, { passive: true });

            slider.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].screenX;
                if (endX < startX - 50) {
                    goToSlide(current + 1, true);
                }
                if (endX > startX + 50) {
                    goToSlide(current - 1, true);
                }
            }, { passive: true });
        }

        goToSlide(0, false);
        startAuto();
    });
})();
