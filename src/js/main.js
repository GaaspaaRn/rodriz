import '../css/style.css';
import '../css/hero.css';
import '../css/releases.css';
import '../css/tour.css';
import '../css/visualizers.css';
import '../css/contact.css';
import '../css/social-proof.css';
import { initCarousel } from './releases.js';
import { initTour } from './tour.js';
import { initAnimations } from './animations.js';
import { initGrain } from './grain.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

console.log('DJ Rodriz Site Loaded');
initCarousel();
initAnimations();
initGrain();
initTour();

// Album Shake Animation
document.addEventListener('DOMContentLoaded', () => {
  // Select the wrapper that handles the shake, NOT the layout container
  const albumWrapper = document.querySelector('.album-shake-wrapper');
  if (!albumWrapper) return;

  let lastScrollY = window.scrollY;
  let currentSkew = 0;

  // Physics parameters
  // Physics parameters
  const maxSkew = 20; // Aggressive wobble (was 7)
  const friction = 0.9; // Damping
  const sensitivity = 0.5; // Very sensitive to scroll speed (was 0.15)

  function update() {
    const currentScrollY = window.scrollY;
    // Calculate speed
    const speed = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Apply force based on speed
    // "Aggressive" means we react strongly to speed.
    // We add some chaos for "chacoalhar" (sideways shake)

    // Vertical Tilt (Rotate X) - Existing but stronger
    let targetSkewX = speed * 0.8;

    // Horizontal Wobble (Rotate Y) - Random direction based on speed parity or just speed
    // We can use a sine wave of the scroll position to alternate sides rapidly
    let targetSkewY = speed * 0.5 * Math.sin(currentScrollY * 0.1);

    // Vertical Movement (Translate Y) - "Mais acima e mais abaixo"
    // Move the element up/down based on speed to exaggerate the scroll feeling
    let translateY = speed * 1.5;

    // Clamp values to prevent breaking the layout too much
    const limit = 45; // Huge limit for "aggressive"
    if (targetSkewX > limit) targetSkewX = limit;
    if (targetSkewX < -limit) targetSkewX = -limit;

    // Determine rotation
    // We combine them into a chaotic transform

    // Apply transform
    // perspective(1000px) is crucial for 3D feel
    // rotateX: tilts up/down
    // rotateY: tilts left/right (sideways wobble)
    // translateY: physical up/down displacement
    albumWrapper.style.transform = `
      perspective(1000px) 
      rotateX(${targetSkewX}deg) 
      rotateY(${targetSkewY}deg) 
      translateY(${translateY}px)
      scale(${1 + Math.abs(speed * 0.002)}) /* Subtle zoom on fast scroll */
    `;

    requestAnimationFrame(update);
  }

  update();
});
/*
document.querySelector('#app').innerHTML = `
  <main>
    <!-- Content will be injected here -->
  </main>
`;
*/
