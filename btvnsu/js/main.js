/* ================================================
   KHÁNG CHIẾN CHỐNG PHÁP — PHOTOGRAPHIC DOCUMENTARY
   Main JavaScript — All Interactions & Animations
   ================================================ */

'use strict';

/* ==================== AOS Init ==================== */
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 900,
        easing: 'ease-out-quart',
        once: true,
        offset: 80,
    });

    initNavigation();
    initParallax();
    initCounters();
    initPhotoTabs();
    initBeforeAfterSlider();
    initActiveNavLinks();
    initPageLoader();
    initCursorEffect();
});

/* ==================== Page Loader ==================== */
function initPageLoader() {
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

/* ==================== Navigation ==================== */
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    let lastScroll = 0;

    // Scroll behavior — add .scrolled class
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show nav on scroll direction
        if (currentScroll > lastScroll && currentScroll > 300) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
        });
    });

    // Hamburger animation
    const style = document.createElement('style');
    style.textContent = `
        .nav-toggle.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-toggle.active span:nth-child(2) { opacity: 0; transform: translateX(-10px); }
        .nav-toggle.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .main-nav { transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), padding 0.35s ease, background 0.35s ease; }
    `;
    document.head.appendChild(style);
}

/* ==================== Active Nav Links ==================== */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(section => observer.observe(section));
}

/* ==================== Parallax ==================== */
function initParallax() {
    const parallax = document.querySelector('.hero-parallax');
    if (!parallax) return;

    let ticking = false;

    const updateParallax = () => {
        const scrollY = window.pageYOffset;
        parallax.style.transform = `translateY(${scrollY * 0.4}px)`;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/* ==================== Animated Counters ==================== */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const startTime = performance.now();
        const startVal = 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = Math.round(startVal + (target - startVal) * eased);

            // Format large numbers
            if (target >= 1000) {
                el.textContent = current.toLocaleString('vi-VN');
            } else {
                el.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* ==================== Photo Essay Tabs ==================== */
function initPhotoTabs() {
    const tabs = document.querySelectorAll('.photo-tab');
    const galleries = document.querySelectorAll('.photo-gallery');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = `gallery-${tab.dataset.tab}`;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Switch gallery with fade
            galleries.forEach(g => {
                if (g.id === targetId) {
                    g.style.opacity = '0';
                    g.style.display = 'block';
                    requestAnimationFrame(() => {
                        g.style.transition = 'opacity 0.5s ease';
                        g.style.opacity = '1';
                        g.classList.add('active');
                    });

                    // Re-trigger AOS on newly visible items
                    setTimeout(() => {
                        AOS.refresh();
                    }, 100);
                } else {
                    g.style.opacity = '0';
                    setTimeout(() => {
                        g.style.display = 'none';
                        g.classList.remove('active');
                    }, 300);
                }
            });
        });
    });
}

/* ==================== Before / After Slider ==================== */
function initBeforeAfterSlider() {
    const slider = document.getElementById('baSlider');
    if (!slider) return;

    const handle = document.getElementById('baHandle');
    const beforeImg = slider.querySelector('.ba-before');
    const afterImg = slider.querySelector('.ba-after');

    let isDragging = false;
    let sliderPos = 50; // percent

    const updateSlider = (pos) => {
        sliderPos = Math.max(2, Math.min(98, pos));
        handle.style.left = `${sliderPos}%`;
        beforeImg.style.clipPath = `inset(0 ${100 - sliderPos}% 0 0)`;
    };

    // Init
    updateSlider(50);

    const getPercent = (clientX) => {
        const rect = slider.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
    };

    // Mouse events
    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(getPercent(e.clientX));
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events
    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(getPercent(e.touches[0].clientX));
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Click anywhere on slider
    slider.addEventListener('click', (e) => {
        if (e.target === handle || handle.contains(e.target)) return;
        updateSlider(getPercent(e.clientX));
    });
}

/* ==================== Smooth Scroll ==================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        const navHeight = document.querySelector('.main-nav')?.offsetHeight || 80;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
        });
    });
});

/* ==================== Custom Cursor ==================== */
function initCursorEffect() {
    // Only on desktop
    if (window.innerWidth < 1024) return;

    const cursor = document.createElement('div');
    const cursorDot = document.createElement('div');

    cursor.id = 'customCursor';
    cursorDot.id = 'customCursorDot';

    const cursorStyles = `
        #customCursor {
            position: fixed;
            width: 36px;
            height: 36px;
            border: 1px solid rgba(200, 164, 94, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease, opacity 0.3s ease, width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
            transform: translate(-50%, -50%);
            mix-blend-mode: normal;
        }
        #customCursorDot {
            position: fixed;
            width: 5px;
            height: 5px;
            background: #c8a45e;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: transform 0.05s ease;
        }
        body:has(a:hover, button:hover, .gallery-item:hover, .figure-card:hover) #customCursor {
            width: 60px;
            height: 60px;
            border-color: rgba(200, 164, 94, 0.3);
            background: rgba(200, 164, 94, 0.05);
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = cursorStyles;
    document.head.appendChild(styleEl);
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    const animateCursor = () => {
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        cursor.style.left = curX + 'px';
        cursor.style.top = curY + 'px';
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}

/* ==================== Gallery Item Lightbox ==================== */
(function initLightbox() {
    const overlay = document.createElement('div');
    overlay.id = 'lightboxOverlay';

    const styles = `
        #lightboxOverlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.95);
            z-index: 9000;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
        }
        #lightboxOverlay.open {
            display: flex;
            animation: fadeInScale 0.3s ease;
        }
        #lightboxImg {
            max-width: 90vw;
            max-height: 75vh;
            object-fit: contain;
            border-radius: 4px;
        }
        #lightboxCaption {
            text-align: center;
        }
        #lightboxCaption h4 {
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
            margin-bottom: 6px;
            color: #e8e0d4;
        }
        #lightboxCaption p {
            font-size: 0.85rem;
            color: #b8a99a;
        }
        #lightboxClose {
            position: fixed;
            top: 24px;
            right: 30px;
            font-size: 2rem;
            color: #c8a45e;
            background: none;
            border: none;
            cursor: pointer;
            line-height: 1;
            transition: transform 0.2s ease;
        }
        #lightboxClose:hover { transform: rotate(90deg); }
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `;

    const s = document.createElement('style');
    s.textContent = styles;
    document.head.appendChild(s);

    const closeBtn = document.createElement('button');
    closeBtn.id = 'lightboxClose';
    closeBtn.innerHTML = '&times;';

    const captionDiv = document.createElement('div');
    captionDiv.id = 'lightboxCaption';

    overlay.appendChild(closeBtn);
    overlay.appendChild(captionDiv);
    document.body.appendChild(overlay);

    // Open lightbox when clicking gallery items
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        const h4 = item.querySelector('.gallery-overlay h4')?.textContent || '';
        const p = item.querySelector('.gallery-overlay p')?.textContent || '';

        captionDiv.innerHTML = `<h4>${h4}</h4><p>${p}</p>`;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    const close = () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();

/* ==================== Scroll Progress Bar ==================== */
(function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scrollProgress';

    const barStyle = `
        #scrollProgress {
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            width: 0%;
            background: linear-gradient(to right, #c8a45e, #e0c88a, #c8a45e);
            z-index: 9999;
            transition: width 0.1s linear;
        }
    `;
    const s = document.createElement('style');
    s.textContent = barStyle;
    document.head.appendChild(s);
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${percent}%`;
    }, { passive: true });
})();

/* ==================== Reveal text animation ==================== */
(function initTextReveal() {
    const style = `
        .reveal-text {
            overflow: hidden;
        }
        .reveal-text-inner {
            display: block;
            transform: translateY(100%);
            transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .reveal-text.revealed .reveal-text-inner {
            transform: translateY(0);
        }
    `;
    const s = document.createElement('style');
    s.textContent = style;
    document.head.appendChild(s);
})();

/* ==================== Figure card hover tilt ==================== */
document.querySelectorAll('.figure-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
});

/* ==================== Timeline hover glow ==================== */
document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 10px 40px rgba(200, 164, 94, 0.1)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

console.log('🌟 Kháng Chiến Chống Pháp — Website Loaded!');