export function initAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Optional: Run once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(el => observer.observe(el));

    // Specific logic for Album Cover Parallax/Scroll Animation
    const albumCover = document.querySelector('.album-cover');
    if (albumCover) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Create a subtle "floating" or "shake" effect based on scroll speed/position
            // Dividing by a larger number makes it subtle. 
            // We want it to stay mostly in place but feel 'loose'.
            const offset = Math.sin(scrollY * 0.05) * 5; // -5px to 5px wobble

            // Apply transform. Note: We must respect the slideUpFade animation logic.
            // Since slideUpFade sets final state to translateY(0), we can just modify it here.
            // However, inline styles override CSS animations once set.
            // We must add the offset to the base position.
            requestAnimationFrame(() => {
                albumCover.style.transform = `translateY(${offset}px)`;
            });

        }, { passive: true });
    }
}
