import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Select elements
    const logo = document.querySelector('.hero-logo-img');
    const subtitle = document.querySelector('.hero-subtitle');
    const socials = document.querySelector('.footer-links');
    const scrollCue = document.querySelector('.scroll-cue');
    const video = document.querySelector('.video-background video');

    // Initial States (in case CSS didn't catch them, but better to rely on CSS for FOUC)
    gsap.set([logo, subtitle, socials, scrollCue], { autoAlpha: 0 });
    gsap.set(logo, { scale: 0.95, filter: 'blur(5px)' });
    gsap.set(subtitle, { y: 20 });
    gsap.set(socials, { y: 20 });

    // Intro Sequence
    heroTl
        .to(video, { scale: 1, duration: 3, ease: 'power1.inOut' }, 0) // Video subtle zoom reset
        .to(logo, {
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 2.5
        }, 0.5)
        .to(subtitle, { autoAlpha: 1, y: 0, duration: 1.5 }, '-=1.5')
        .to(socials, { autoAlpha: 1, y: 0, duration: 1 }, '-=1.0')
        .to(scrollCue, { autoAlpha: 1, duration: 1 }, '-=0.5');

    // Hero Logo Parallax / Fade on scroll
    gsap.to(logo, {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        opacity: 0,
        scale: 0.9
    });

    // Global Reveal Animation (for sections with .reveal class)
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        gsap.fromTo(el,
            { autoAlpha: 0, y: 50 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                }
            }
        );
    });
}
