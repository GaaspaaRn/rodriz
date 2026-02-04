export function initCarousel() {
    const carousels = document.querySelectorAll('.carousel-wrapper');

    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const nextBtn = wrapper.querySelector('.next-btn');
        const prevBtn = wrapper.querySelector('.prev-btn');

        if (!track || !nextBtn || !prevBtn) return;

        // Dynamic scroll calculation
        const getScrollAmount = () => {
            const card = track.querySelector('.release-card');
            return card ? card.offsetWidth + 32 : 350; // Width + Gap (2rem = 32px)
        };

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
    });
}
