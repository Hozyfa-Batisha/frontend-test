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
const isRTL = (document.documentElement.getAttribute('dir') || '').toLowerCase() === 'rtl';

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

// ===== TRANSFORMATIONS + REVIEWS CAROUSELS =====
function initMediaCarousel(config) {
    const {
        trackId,
        slideSelector,
        leftBtnId,
        rightBtnId,
        dotsId,
        autoplayMs = 5000,
        slidesToScroll = 2
    } = config;

    const track = document.getElementById(trackId);
    if (!track) return;

    const slides = Array.from(track.querySelectorAll(slideSelector));
    if (slides.length === 0) return;

    const leftBtn = document.getElementById(leftBtnId);
    const rightBtn = document.getElementById(rightBtnId);
    const dotsContainer = document.getElementById(dotsId);

    let currentPage = 0;
    let autoplayTimer = null;
    let swipeStartX = 0;

    function getSlidesToShow() {
        if (window.innerWidth >= 1200) return 4;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function getPageStarts() {
        const show = getSlidesToShow();
        const maxStart = Math.max(0, slides.length - show);
        const starts = [0];

        while (starts[starts.length - 1] < maxStart) {
            const last = starts[starts.length - 1];
            const next = Math.min(last + slidesToScroll, maxStart);
            if (next === last) break;
            starts.push(next);
        }

        return starts;
    }

    function renderDots(pageCount) {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";

        for (let i = 0; i < pageCount; i += 1) {
            const dot = document.createElement('span');
            dot.className = `dot${i === currentPage ? ' active' : ''}`;
            dot.setAttribute('data-page', i);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('aria-label', `Go to slide group ${i + 1}`);

            dot.addEventListener('click', () => {
                goToPage(i, true);
            });

            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToPage(i, true);
                }
            });

            dotsContainer.appendChild(dot);
        }
    }

    function updateAria(startIndex, show) {
        slides.forEach((slide, idx) => {
            const visible = idx >= startIndex && idx < startIndex + show;
            slide.setAttribute('aria-hidden', visible ? 'false' : 'true');
        });
    }

    function goToPage(pageIndex, isInteraction = false) {
        const starts = getPageStarts();
        const pageCount = starts.length;
        if (pageCount === 0) return;

        if (pageIndex >= pageCount) {
            currentPage = 0;
        } else if (pageIndex < 0) {
            currentPage = pageCount - 1;
        } else {
            currentPage = pageIndex;
        }

        const show = getSlidesToShow();
        const startIndex = starts[currentPage] || 0;
        const offsetPercent = startIndex * (100 / show);
        const directionOffset = isRTL ? offsetPercent : -offsetPercent;

        track.style.setProperty('--slides-to-show', String(show));
        track.style.transform = `translateX(${directionOffset}%)`;

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentPage);
        });

        updateAria(startIndex, show);

        if (isInteraction) {
            restartAutoplay();
        }
    }

    function nextPage(isInteraction = false) {
        goToPage(currentPage + 1, isInteraction);
    }

    function prevPage(isInteraction = false) {
        goToPage(currentPage - 1, isInteraction);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            nextPage(false);
        }, autoplayMs);
    }

    function restartAutoplay() {
        startAutoplay();
    }

    if (rightBtn) {
        rightBtn.addEventListener('click', () => {
            if (isRTL) {
                prevPage(true);
            } else {
                nextPage(true);
            }
        });
    }

    if (leftBtn) {
        leftBtn.addEventListener('click', () => {
            if (isRTL) {
                nextPage(true);
            } else {
                prevPage(true);
            }
        });
    }

    track.addEventListener('touchstart', (e) => {
        swipeStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const swipeEndX = e.changedTouches[0].screenX;
        const deltaX = swipeEndX - swipeStartX;

        if (deltaX < -50) {
            if (isRTL) {
                prevPage(true);
            } else {
                nextPage(true);
            }
        } else if (deltaX > 50) {
            if (isRTL) {
                nextPage(true);
            } else {
                prevPage(true);
            }
        }
    }, { passive: true });

    const container = track.closest('.transformations-slider-container, .reviews-slider-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const pageCount = getPageStarts().length;
            if (currentPage >= pageCount) {
                currentPage = Math.max(0, pageCount - 1);
            }
            renderDots(pageCount);
            goToPage(currentPage, false);
        }, 120);
    });

    const initialPageCount = getPageStarts().length;
    renderDots(initialPageCount);
    goToPage(0, false);
    startAutoplay();
}

initMediaCarousel({
    trackId: 'transformationsSlider',
    slideSelector: '.transformation-slide',
    leftBtnId: 'transLeft',
    rightBtnId: 'transRight',
    dotsId: 'transDots',
    autoplayMs: 5000,
    slidesToScroll: 2
});

initMediaCarousel({
    trackId: 'reviewsSlider',
    slideSelector: '.review-card-photo',
    leftBtnId: 'reviewLeft',
    rightBtnId: 'reviewRight',
    dotsId: 'reviewDots',
    autoplayMs: 4000,
    slidesToScroll: 2
});

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
