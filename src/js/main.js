import '../css/style.css';
import '../css/hero.css';
import '../css/releases.css';
import '../css/tour.css';
import '../css/visualizers.css';
import '../css/contact.css';
import { initCarousel } from './releases.js';
import { initAnimations } from './animations.js';
import { initGrain } from './grain.js';

console.log('DJ Rodriz Site Loaded');
initCarousel();
initAnimations();
initGrain();

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
    const speed = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Apply force based on speed
    // If scrolling down (pos speed), skew one way. Up, skew other way.
    let targetSkew = speed * sensitivity;

    // Clamp target
    if (targetSkew > maxSkew) targetSkew = maxSkew;
    if (targetSkew < -maxSkew) targetSkew = -maxSkew;

    // Smoothly interpolate currentSkew towards targetSkew (or just set it for direct reactivity)
    // Here we just use the speed frame directly but decay it if speed is 0
    // A simple approach is adding speed to a velocity, but for "shake" direct mapping feels tighter.

    currentSkew = targetSkew;

    // Apply transform
    // We keep the initial translate if needed, but CSS handles layout.
    // We apply a rotation or skew. Rotate usually looks like a "dangle".
    // Apply transform to wrapper only
    albumWrapper.style.transform = `perspective(1000px) rotateX(${currentSkew}deg)`;

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
