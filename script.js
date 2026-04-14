

const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.9,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cursor = document.querySelector('.cursor');
const cursorText = document.querySelector('.cursor-text');
const magneticTargets = document.querySelectorAll('.magnetic-target, a, button');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let velocityX = 0;
let velocityY = 0;

if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        velocityX = dx;
        velocityY = dy;
        
        cursorX += dx * 0.18;
        cursorY += dy * 0.18;

        gsap.set(cursor, {
            x: cursorX,
            y: cursorY,
        });
    });
} else {
    gsap.set(cursor, { display: 'none' });
}

magneticTargets.forEach((target) => {
    if (!isTouchDevice) {
        target.addEventListener('mousemove', (e) => {
            if (!target.classList.contains('magnetic-target')) return;
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(target, {
                x: x * 0.25,
                y: y * 0.25,
                duration: 0.5,
                ease: 'power2.out',
            });
        });

        target.addEventListener('mouseleave', () => {
            if (target.classList.contains('magnetic-target')) {
                gsap.to(target, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)',
                });
            }
        });
    }

    target.addEventListener('mouseenter', () => {
        if (isTouchDevice) return;
        cursor.classList.add('hovering');
        const text = target.getAttribute('data-cursor');
        if (text) cursorText.textContent = text;
    });

    target.addEventListener('mouseleave', () => {
        if (isTouchDevice) return;
        cursor.classList.remove('hovering');
        cursorText.textContent = '';
    });
});

const sections = document.querySelectorAll('.section');
sections.forEach((section) => {
    const bg = section.getAttribute('data-bg');
    const text = section.getAttribute('data-text');

    ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () =>
            gsap.to('body', {
                backgroundColor: bg,
                color: text,
                duration: 0.4,
                ease: 'power3.inOut',
                overwrite: 'auto',
            }),
        onEnterBack: () =>
            gsap.to('body', {
                backgroundColor: bg,
                color: text,
                duration: 0.4,
                ease: 'power3.inOut',
                overwrite: 'auto',
            }),
    });
});

const masterTl = gsap.timeline({
    defaults: { ease: 'expo.out' },
});

masterTl
    .from('.hero-top > *', {
        y: 30,
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power4.out',
    })
    .from(
        '.hero-title .line',
        {
            yPercent: 115,
            rotation: 3,
            opacity: 0,
            duration: 1.6,
            stagger: 0.18,
            ease: 'expo.out',
        },
        '-=1.0'
    )
    .from(
        '.hero-desc > *',
        {
            y: 24,
            opacity: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: 'power3.out',
        },
        '-=1.2'
    )
    .from(
        '.hero-shape',
        {
            y: 80,
            opacity: 0,
            duration: 1.8,
            stagger: 0.15,
            ease: 'power4.out',
        },
        '-=1.3'
    )
    .from(
        '.header',
        {
            y: -20,
            opacity: 0,
            duration: 1.0,
            ease: 'power3.out',
        },
        '-=1.5'
    );

if (!isTouchDevice && !prefersReducedMotion) {
    gsap.from('.hero-geo', {
        scale: 0,
        opacity: 0,
        duration: 2,
        stagger: 0.2,
        ease: 'expo.out',
        delay: 0.8,
    });

    gsap.to('.hero-gradient-veil', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        },
    });
}

document.querySelectorAll('.divider-line').forEach((line) => {
    gsap.fromTo(
        line,
        { scaleX: 0 },
        {
            scaleX: 1,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: line,
                start: 'top 90%',
            },
        }
    );
});

gsap.to('.ticker-track', {
    xPercent: -50,
    ease: 'none',
    duration: 18,
    repeat: -1,
});

if (!prefersReducedMotion) {
    document.querySelectorAll('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed'));
        gsap.to(el, {
            y: () => -ScrollTrigger.maxScroll(window) * speed * 0.08,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
            },
        });
    });
}

const projects = document.querySelectorAll('.project-card');
projects.forEach((project, i) => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: project,
            start: 'top 88%',
        },
    });

    tl.from(project, {
        y: 120,
        scale: 0.92,
        rotationX: 6,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        clearProps: 'transform',
    }).from(
        project.querySelector('.card-info'),
        {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        },
        '-=0.6'
    );
});

document.fonts.ready.then(() => {
    const splitElements = document.querySelectorAll('[data-split]');
    splitElements.forEach((el) => {
        const type = el.getAttribute('data-split');
        const splitType = new SplitType(el, { types: type });

        if (type === 'chars') {
            gsap.from(splitType.chars, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                },
                y: 80,
                opacity: 0,
                rotationX: -60,
                duration: 1.0,
                stagger: 0.04,
                ease: 'expo.out',
            });
        } else if (type === 'words') {

            gsap.from(splitType.words, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                },
                y: 30,
                opacity: 0,
                duration: 1.0,
                stagger: 0.025,
                ease: 'power3.out',
            });
        }
    });
});

gsap.from('.massive-email', {
    scrollTrigger: {
        trigger: '.footer-dense',
        start: 'top 85%',
    },
    yPercent: 60,
    rotation: 1.5,
    duration: 1.6,
    ease: 'expo.out',
});

const scrollProgress = document.querySelector('.scroll-progress');
if (scrollProgress) {
    lenis.on('scroll', (e) => {
        const progress = Math.min(1, Math.max(0, e.scroll / e.limit));
        gsap.set(scrollProgress, { height: `${progress * 100}%` });
    });
}

const menuBtn = document.querySelector('.menu-btn');
const navOverlay = document.querySelector('.nav-overlay');
const navLinks = document.querySelectorAll('.nav-link');
let isNavOpen = false;

const navTl = gsap.timeline({ paused: true });
navTl
    .to(navOverlay, {
        visibility: 'visible',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.9,
        ease: 'expo.inOut',
    })
    .to(
        navLinks,
        {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'expo.out',
        },
        '-=0.35'
    );

menuBtn.addEventListener('click', () => {
    if (!isNavOpen) {
        navTl.timeScale(1).play();
        menuBtn.querySelector('span').textContent = 'Close';
        lenis.stop();
    } else {
        navTl.timeScale(1.6).reverse();
        menuBtn.querySelector('span').textContent = 'Menu';
        lenis.start();
    }
    isNavOpen = !isNavOpen;
});

const projectTriggers = document.querySelectorAll('.project-trigger');
const csOverlay = document.querySelector('#caseStudyOverlay');
const csClose = document.querySelector('.cs-close');

const csHeroImg = document.querySelector('#csHeroImg');
const csTitle = document.querySelector('#csTitle');
const csTags = document.querySelector('#csTags');
const csDesc = document.querySelector('#csDesc');
const csProcessImg = document.querySelector('#csProcessImg');
const csResultImg = document.querySelector('#csResultImg');

const csTl = gsap.timeline({ paused: true });
csTl.set(csOverlay, { backgroundColor: '#1A1A1A' })
    .to(csOverlay, {
        visibility: 'visible',
        duration: 0.01,
    })
    .fromTo(
        csOverlay,
        { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
        {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1.1,
            ease: 'expo.inOut',
        }
    )
    .to(
        csOverlay,
        {
            backgroundColor: '#FFF8F2',
            duration: 0.9,
            ease: 'power2.out',
        },
        '-=0.2'
    )
    .to(
        csClose,
        {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
        },
        '-=0.4'
    )
    .fromTo(
        '.cs-hero-img-wrapper',
        { scale: 1.15 },
        { scale: 1, duration: 1.1, ease: 'expo.out' },
        '-=0.9'
    )
    .fromTo(
        '.cs-hero-text',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' },
        '-=0.7'
    );

projectTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {

        csTitle.textContent = trigger.getAttribute('data-title');
        csTags.textContent = trigger.getAttribute('data-tags');
        csDesc.textContent = trigger.getAttribute('data-desc');
        csHeroImg.src = trigger.getAttribute('data-img');
        csProcessImg.src = trigger.getAttribute('data-process');
        csResultImg.src = trigger.getAttribute('data-result');

        cursor.classList.remove('hovering');
        cursorText.textContent = '';
        lenis.stop();
        csOverlay.scrollTo(0, 0);

        csTl.timeScale(1).play();
    });
});

csClose.addEventListener('click', () => {
    csTl.timeScale(1.6).reverse();
    lenis.start();
    cursor.classList.remove('hovering');
    cursorText.textContent = '';
});

document.querySelectorAll('.cs-section').forEach((section) => {
    gsap.from(section.querySelectorAll('.cs-grid, .cs-visual-wrapper'), {
        scrollTrigger: {
            trigger: section,
            scroller: '.case-study-overlay',
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power3.out',
    });
});

document.querySelectorAll('.parallax-img').forEach((img) => {
    gsap.to(img, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
            trigger: img.parentElement,
            scroller: '.case-study-overlay',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
        },
    });
});

const animateStagger = (selector, triggerSelector, yOffset = 40) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    elements.forEach((el, i) => {
        gsap.fromTo(
            el,
            { y: yOffset, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                },
                y: 0,
                opacity: 1,
                duration: 1.0,
                delay: i * 0.08,
                ease: 'power3.out',
            }
        );
    });
};

animateStagger('.service-row-minimal', '.services', 40);
animateStagger('.step-editorial', '.process', 50);
animateStagger('.skill-tag', '.skills-wrapper', 16);
animateStagger('.insight-row', '.insights', 30);

gsap.fromTo(
    '.t-card',
    { y: 60, opacity: 0, scale: 0.96 },
    {
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        clearProps: 'transform',
    }
);

document.querySelectorAll('.step-accent-line').forEach((line) => {
    gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: 'left' },
        {
            scaleX: 1,
            duration: 1.0,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: line,
                start: 'top 90%',
            },
        }
    );
});

gsap.fromTo(
    '.footer-col',
    { y: 50, opacity: 0 },
    {
        scrollTrigger: {
            trigger: '.footer-dense',
            start: 'top 90%',
        },
        y: 0,
        opacity: 1,
        duration: 1.3,
        stagger: 0.15,
        ease: 'power3.out',
    }
);

gsap.fromTo(
    '.footer-bottom',
    { y: 20, opacity: 0 },
    {
        scrollTrigger: {
            trigger: '.footer-bottom',
            start: 'top 95%',
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
    }
);

if (!prefersReducedMotion) {
    document.querySelectorAll('.step-asset-mask').forEach((mask) => {
        const img = mask.querySelector('.editorial-parallax-img');
        if (img) {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: mask,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
                y: '12%',
                ease: 'none',
            });
        }
    });
}

const setupHoverReveal = (rowSelector, revealSelector, imgSelector) => {
    const rows = document.querySelectorAll(rowSelector);
    const hoverContainer = document.querySelector(revealSelector);
    const imgElement = document.querySelector(imgSelector);

    if (rows.length > 0 && hoverContainer && !isTouchDevice) {
        let xTarget = 0;
        let yTarget = 0;

        window.addEventListener('mousemove', (e) => {
            xTarget = e.clientX;
            yTarget = e.clientY;
            gsap.to(hoverContainer, {
                x: xTarget,
                y: yTarget,
                duration: 0.6,
                ease: 'power2.out',
            });
        });

        rows.forEach((row) => {
            row.addEventListener('mouseenter', () => {
                const imgPath = row.getAttribute('data-img');
                if (imgPath && imgElement) imgElement.src = imgPath;
                gsap.to(hoverContainer, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            });

            row.addEventListener('mouseleave', () => {
                gsap.to(hoverContainer, {
                    opacity: 0,
                    scale: 0.85,
                    duration: 0.35,
                    ease: 'power2.in',
                });
            });
        });
    }
};

setupHoverReveal(
    '.insight-row',
    '.insight-hover-reveal',
    '.insight-reveal-img'
);
setupHoverReveal(
    '.service-row-minimal',
    '.service-hover-reveal',
    '.service-reveal-img'
);

document.querySelectorAll('.section-header').forEach((header) => {
    const border = header.style;
    gsap.fromTo(
        header,
        { '--border-scale': 0 },
        {
            '--border-scale': 1,
            scrollTrigger: {
                trigger: header,
                start: 'top 90%',
            },
            duration: 1.2,
            ease: 'expo.out',
        }
    );
});
