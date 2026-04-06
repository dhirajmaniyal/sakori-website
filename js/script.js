document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('page-loader');
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scroll-top');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('reset-form');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const testimonialsSlider = document.getElementById('testimonials-slider');
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-btn.prev');
    const nextBtn = document.querySelector('.testimonial-btn.next');
    const dotsContainer = document.getElementById('testimonials-dots');

    let currentSlide = 0;
    let slidesPerView = 3;
    let galleryImages = [];
    let currentImageIndex = 0;

    setTimeout(() => {
        loader.classList.add('hidden');
    }, 800);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            scrollTopBtn.hidden = false;
        } else {
            navbar.classList.remove('scrolled');
            scrollTopBtn.hidden = true;
        }

        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', data);
        
        contactForm.style.display = 'none';
        formSuccess.hidden = false;
        
        setTimeout(() => {
            contactForm.reset();
        }, 100);
    });

    resetFormBtn.addEventListener('click', () => {
        formSuccess.hidden = true;
        contactForm.style.display = 'block';
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const category = item.querySelector('.gallery-category').textContent;
            const title = item.querySelector('.gallery-info h4').textContent;

            const visibleItems = Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));
            currentImageIndex = visibleItems.indexOf(item);

            galleryImages = visibleItems.map(i => ({
                src: i.querySelector('img').src,
                category: i.querySelector('.gallery-category').textContent,
                title: i.querySelector('.gallery-info h4').textContent
            }));

            openLightbox(img.src, category, title);
        });
    });

    function openLightbox(src, category, title) {
        lightboxImg.src = src;
        lightboxCategory.textContent = category;
        lightboxTitle.textContent = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const image = galleryImages[currentImageIndex];
        lightboxImg.src = image.src;
        lightboxCategory.textContent = image.category;
        lightboxTitle.textContent = image.title;
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });

    function updateSlidesPerView() {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        updateSlider();
    }

    function updateSlider() {
        const maxSlide = Math.max(0, testimonialCards.length - slidesPerView);
        if (currentSlide > maxSlide) {
            currentSlide = maxSlide;
        }

        const cardWidth = testimonialCards[0].offsetWidth + 30;
        const offset = currentSlide * cardWidth;
        testimonialsTrack.style.transform = `translateX(-${offset}px)`;

        updateDots();
    }

    function createDots() {
        const numDots = Math.ceil(testimonialCards.length / slidesPerView);
        dotsContainer.innerHTML = '';

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i * slidesPerView));
            dotsContainer.appendChild(dot);
        }

        updateDots();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        const activeDotIndex = Math.floor(currentSlide / slidesPerView);

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }

    function goToSlide(index) {
        const maxSlide = Math.max(0, testimonialCards.length - slidesPerView);
        currentSlide = Math.max(0, Math.min(index, maxSlide));
        updateSlider();
    }

    function nextSlide() {
        const maxSlide = Math.max(0, testimonialCards.length - slidesPerView);
        currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
        updateSlider();
    }

    function prevSlide() {
        const maxSlide = Math.max(0, testimonialCards.length - slidesPerView);
        currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
        updateSlider();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    let touchStartX = 0;
    let touchEndX = 0;

    if (testimonialsSlider) {
        testimonialsSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        testimonialsSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (diff > swipeThreshold) {
            nextSlide();
        } else if (diff < -swipeThreshold) {
            prevSlide();
        }
    }

    window.addEventListener('resize', () => {
        updateSlidesPerView();
        createDots();
    });

    updateSlidesPerView();
    createDots();

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-header, .collection-card, .about-features, .feature-item').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const animatedElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-tagline, .hero-description, .hero-cta, .hero-stats');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
    });
});
