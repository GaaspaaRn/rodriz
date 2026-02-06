export function initTour() {
    const items = document.querySelectorAll('.tour-item');
    const today = new Date();
    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);

    // Manual mapping for "FEV" -> Month Index (0-11)
    // Assuming 2026 as per context
    const year = 2026;
    const monthMap = {
        'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
        'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11
    };

    let nextShowFound = false;

    items.forEach(item => {
        if (nextShowFound) return;

        const dayEl = item.querySelector('.day');
        const monthEl = item.querySelector('.month');

        if (!dayEl || !monthEl) return;

        const day = parseInt(dayEl.textContent, 10);
        const monthTxt = monthEl.textContent.trim().toUpperCase();
        const month = monthMap[monthTxt];

        if (month !== undefined) {
            const showDate = new Date(year, month, day);

            // If showDate is today or future
            if (showDate >= today) {
                item.classList.add('next-show');

                // Add "NEXT" badge
                const info = item.querySelector('.tour-info');
                const badge = document.createElement('span');
                badge.textContent = 'NEXT SHOW';
                badge.style.cssText = `
                    font-size: 0.7rem;
                    background: white;
                    color: black;
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-left: 10px;
                    vertical-align: middle;
                    font-weight: bold;
                 `;
                const city = info.querySelector('.city');
                city.appendChild(badge);

                nextShowFound = true;
            }
        }
    });
}
