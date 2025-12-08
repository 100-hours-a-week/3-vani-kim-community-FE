document.addEventListener('DOMContentLoaded', () => {
    // --- Landing Header Transformation ---
    const landingHeader = document.querySelector('.landing-header');
    if (landingHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                landingHeader.classList.add('scrolled');
            } else {
                landingHeader.classList.remove('scrolled');
            }
        });
    }

    // Initial call to render icons
    lucide.createIcons();

    // --- Navbar Transformation ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Hero Section Scatter/Gather Animation ---
    const polaroids = document.querySelectorAll('.polaroid');
    let animationFrameId = null;

    // Don't run animation on mobile where polaroids are hidden
    if (window.innerWidth <= 768) {
        return;
    }

    // Store initial and target transform states for each polaroid
    const polaroidStates = Array.from(polaroids).map((polaroid, i) => {
        // Get initial transform from computed style
        const computedStyle = window.getComputedStyle(polaroid);
        const matrix = new DOMMatrix(computedStyle.transform);
        const initialX = matrix.m41;
        const initialY = matrix.m42;
        const initialRot = Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI);
        
        // Define target state (gathered)
        const targetX = -polaroid.offsetWidth / 2 + (Math.random() - 0.5) * 20;
        const targetY = window.innerHeight * 0.20 - (polaroid.offsetHeight / 2) + (Math.random() - 0.5) * 20;
        const targetRot = (Math.random() - 0.5) * 15;

        return { polaroid, initialX, initialY, initialRot, targetX, targetY, targetRot };
    });

    function animatePolaroids() {
        const scrollY = window.scrollY;
        // Animate over the first 60% of the viewport height
        const animationEndScroll = window.innerHeight * 0.6;
        const progress = Math.min(scrollY / animationEndScroll, 1);

        polaroidStates.forEach(state => {
            // Linear interpolation (lerp)
            const currentX = state.initialX + (state.targetX - state.initialX) * progress;
            const currentY = state.initialY + (state.targetY - state.initialY) * progress;
            const currentRot = state.initialRot + (state.targetRot - state.initialRot) * progress;

            state.polaroid.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRot}deg)`;
        });
        
        animationFrameId = null;
    }

    function onScroll() {
        if (animationFrameId === null) {
            animationFrameId = requestAnimationFrame(animatePolaroids);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial call to set position correctly on load
    requestAnimationFrame(animatePolaroids);

    // --- Hero Content Fade on Scroll ---
    const heroContent = document.querySelector('.hero-content');
    const ctaButton = document.querySelector('.cta-button');

    function fadeOnScroll() {
        const scrollY = window.scrollY;
        const fadeEndScroll = window.innerHeight * 0.5;
        const progress = Math.min(scrollY / fadeEndScroll, 1);
        const opacity = 1 - progress;
        const isHidden = progress >= 1;

        if (heroContent) {
            heroContent.style.opacity = opacity;
            heroContent.style.visibility = isHidden ? 'hidden' : 'visible';
        }
        if (ctaButton) {
            ctaButton.style.opacity = opacity;
            ctaButton.style.visibility = isHidden ? 'hidden' : 'visible';
            ctaButton.style.pointerEvents = isHidden ? 'none' : 'auto';
        }
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(fadeOnScroll);
    }, { passive: true });



    // --- General Scroll Reveal Animation (for other sections) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
});