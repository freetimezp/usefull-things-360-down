gsap.registerPlugin(ScrollTrigger, SplitText);

const sections = [
    { el: document.querySelector(".hero"), name: "HERO" },
    { el: document.querySelector(".about"), name: "ABOUT" },
    { el: document.querySelector(".work"), name: "WORK" },
];

let current = 0;

function smoothPercent(target) {
    gsap.to(
        { val: current },
        {
            val: target,
            duration: 0.4,
            ease: "power2.out",
            onUpdate: function () {
                current = this.targets()[0].val;

                document.querySelector(".scroll-percent").textContent = Math.round(current) + "%";
            },
        }
    );
}

let lastSection = "";

function updateSectionLabel() {
    let current = "HERO";

    sections.forEach((section) => {
        if (!section.el) return;

        const rect = section.el.getBoundingClientRect();

        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
            current = section.name;
        }
    });

    if (current !== lastSection) {
        lastSection = current;

        gsap.to(".scroll-section", {
            opacity: 0,
            y: -5,
            duration: 0.2,
            onComplete: () => {
                document.querySelector(".scroll-section").textContent = current;

                gsap.to(".scroll-section", {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                });
            },
        });
    }
}

const lenis = new Lenis({
    duration: 1.4,
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

lenis.on("scroll", () => {
    ScrollTrigger.update();
    updateSectionLabel();

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    const progress = (scrollTop / docHeight) * 100;

    smoothPercent(progress);
});

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const splitHero = new SplitText(".hero .split", {
    type: "chars,words",
    charsClass: "char",
    wordsClass: "word",
});

const tl = gsap.timeline();

tl.from(".logo", {
    y: 40,
    opacity: 0,
    duration: 1,
}).from(
    ".hero p",
    {
        y: 40,
        opacity: 0,
        duration: 1,
    },
    "-=0.8"
);

gsap.from(splitHero.chars, {
    yPercent: 120,
    opacity: 0,
    stagger: 0.02,
    duration: 1.2,
    ease: "power4.out",
});

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

gsap.from(".reveal", {
    y: 120,
    opacity: 0,
    stagger: 0.2,
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

gsap.to(".work-inner", {
    y: -80,
    scrollTrigger: {
        trigger: ".work",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    },
});

gsap.to(".scroll-badge", {
    y: -10,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
});

document.querySelectorAll(".about").forEach((section) => {
    const split = new SplitText(section.querySelector(".split"), {
        type: "chars",
    });

    ScrollTrigger.create({
        trigger: section,
        start: "top 75%",

        onEnter: () => {
            gsap.from(split.chars, {
                yPercent: 120,
                opacity: 0,
                stagger: 0.015,
                duration: 1,
                ease: "power4.out",
            });
        },

        onEnterBack: () => {
            gsap.from(split.chars, {
                yPercent: 120,
                opacity: 0,
                stagger: 0.015,
                duration: 1,
                ease: "power4.out",
            });
        },
    });
});

window.addEventListener("scroll", () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;

    const progress = (window.scrollY / height) * 100;

    gsap.to(".progress", {
        width: progress + "%",
    });
});

//magnetic
const magneticElements = document.querySelectorAll(".magnetic");

magneticElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
            x: x * 0.25,
            y: y * 0.25,
            duration: 0.4,
            ease: "power3.out",
        });
    });

    el.addEventListener("mouseleave", () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
        });
    });
});
