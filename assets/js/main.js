// --------------------------------------------------
// GSAP PLUGINS
// --------------------------------------------------

gsap.registerPlugin(ScrollTrigger, SplitText);

// --------------------------------------------------
// DOM REFERENCES
// --------------------------------------------------

const sections = [
    { el: document.querySelector(".hero"), name: "HERO" },
    { el: document.querySelector(".about"), name: "ABOUT" },
    { el: document.querySelector(".work"), name: "WORK" },
];

const progressBar = document.querySelector(".progress");
const percentText = document.querySelector(".scroll-percent");
const sectionText = document.querySelector(".scroll-section");

// --------------------------------------------------
// LENIS
// --------------------------------------------------

const lenis = new Lenis({
    duration: 1.4,
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --------------------------------------------------
// SCROLL BADGE
// --------------------------------------------------

let currentPercent = 0;
let activeSection = "";

function animatePercent(target) {
    gsap.to(
        { value: currentPercent },
        {
            value: target,
            duration: 0.4,
            ease: "power2.out",

            onUpdate() {
                currentPercent = this.targets()[0].value;
                percentText.textContent = Math.round(currentPercent) + "%";
            },
        }
    );
}

function updateSectionLabel() {
    let current = "HERO";

    sections.forEach((section) => {
        if (!section.el) return;

        const rect = section.el.getBoundingClientRect();

        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
            current = section.name;
        }
    });

    if (current === activeSection) return;

    activeSection = current;

    gsap.to(sectionText, {
        opacity: 0,
        y: -5,
        duration: 0.2,

        onComplete() {
            sectionText.textContent = current;

            gsap.to(sectionText, {
                opacity: 1,
                y: 0,
                duration: 0.3,
            });
        },
    });
}

lenis.on("scroll", ({ scroll }) => {
    ScrollTrigger.update();

    updateSectionLabel();

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    const progress = (scroll / docHeight) * 100;

    animatePercent(progress);

    gsap.to(progressBar, {
        width: `${progress}%`,
        overwrite: true,
    });
});

// --------------------------------------------------
// HERO INTRO
// --------------------------------------------------

const heroSplit = new SplitText(".hero .split", {
    type: "chars,words",
    charsClass: "char",
    wordsClass: "word",
});

const introTl = gsap.timeline();

introTl
    .from(".logo", {
        y: 40,
        opacity: 0,
        duration: 1,
    })
    .from(
        ".hero p",
        {
            y: 40,
            opacity: 0,
            duration: 1,
        },
        "-=0.8"
    );

gsap.from(heroSplit.chars, {
    yPercent: 120,
    opacity: 0,
    stagger: 0.02,
    duration: 1.2,
    ease: "power4.out",
});

// --------------------------------------------------
// HERO PARALLAX
// --------------------------------------------------

gsap.to(".hero-content", {
    y: -150,
    opacity: 0,
    ease: "none",

    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
    },
});

gsap.to(".hero", {
    scale: 1.1,

    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
    },
});

// --------------------------------------------------
// SPLIT TEXT REVEALS
// --------------------------------------------------

document.querySelectorAll(".about .split, .work .split").forEach((element) => {
    const split = new SplitText(element, {
        type: "chars",
        charsClass: "char",
    });

    gsap.set(split.chars, {
        yPercent: 120,
        opacity: 0,
    });

    ScrollTrigger.create({
        trigger: element,
        start: "top 80%",

        onEnter() {
            gsap.to(split.chars, {
                yPercent: 0,
                opacity: 1,
                stagger: 0.015,
                duration: 1,
                ease: "power4.out",
            });
        },

        onLeaveBack() {
            gsap.set(split.chars, {
                yPercent: 120,
                opacity: 0,
            });
        },
    });
});

// --------------------------------------------------
// TEXT REVEALS
// --------------------------------------------------

gsap.from(".about .reveal", {
    y: 120,
    opacity: 0,
    duration: 1.4,

    scrollTrigger: {
        trigger: ".about",
        start: "top 70%",
    },
});

gsap.fromTo(
    ".work .reveal",
    {
        y: 80,
        opacity: 0,
    },
    {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",

        scrollTrigger: {
            trigger: ".work",
            start: "top 80%",
            toggleActions: "play none none reverse",
        },
    }
);

// --------------------------------------------------
// WORK PARALLAX
// --------------------------------------------------

gsap.to(".work-inner", {
    y: -80,

    scrollTrigger: {
        trigger: ".work",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    },
});

// --------------------------------------------------
// FLOATING SCROLL BADGE
// --------------------------------------------------

gsap.to(".scroll-badge", {
    y: -10,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
});

// --------------------------------------------------
// MAGNETIC ELEMENTS
// --------------------------------------------------

document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();

        const x = event.clientX - rect.left - rect.width / 2;

        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
            x: x * 0.25,
            y: y * 0.25,
            duration: 0.4,
            ease: "power3.out",
        });
    });

    element.addEventListener("mouseleave", () => {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
        });
    });
});
