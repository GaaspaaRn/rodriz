import gsap from 'gsap';

export function initCarousel() {
    init3DCylinder('#recent-releases');
    init3DCylinder('#visualizers');
}

function init3DCylinder(sectionSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const container = section.querySelector('.cylinder-container');
    const faces = Array.from(container.querySelectorAll('.cylinder-face'));
    const faceCount = faces.length;

    // Geometry Settings
    let faceWidth = container.offsetWidth;
    // Radius Calculation
    // R = width / (2 * tan(PI / n))
    // We multiply by 1.1 just to give a tiny gap, but keep it tight
    let radius = Math.round((faceWidth / 2) / Math.tan(Math.PI / faceCount)) * 1.1;

    // Spacing adjustment
    // radius += 20; // Removed extra padding to keep arrows close

    // 1. POSITION FACES (The Setup)
    // 360 degrees / count
    const angleStep = 360 / faceCount;

    faces.forEach((face, i) => {
        const angle = angleStep * i;
        // Rotate Y then Translate Z push it out
        face.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        // Store angle for logic
        face.dataset.angle = angle;
    });


    // 2. DRAG LOGIC (The Interaction)
    let isDragging = false;
    let startX = 0;
    let currentRotation = 0;

    // We use a proxy object for GSAP to tween (Inertia)
    const proxy = { rotation: 0 };

    // Update Loop to sync Container with Proxy
    function update() {
        // Apply rotation
        container.style.transform = `rotateY(${proxy.rotation}deg)`;
        requestAnimationFrame(update);
    }
    update(); // Start loop

    // BUTTON HANDLERS (NEW)
    const prevBtn = section.querySelector('.prev-btn');
    const nextBtn = section.querySelector('.next-btn');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            rotateToStep(1); // Rotate Left (Positive Y)
        });
        nextBtn.addEventListener('click', () => {
            rotateToStep(-1); // Rotate Right (Negative Y)
        });
    }

    function rotateToStep(direction) {
        // Snap to next angle
        const currentM = Math.round(proxy.rotation / angleStep);
        const targetM = currentM + direction;
        const targetRot = targetM * angleStep;

        gsap.to(proxy, {
            rotation: targetRot,
            duration: 0.6,
            ease: "out", // Smooth mechanical turn
            onComplete: () => enableActiveFaceInteraction(proxy.rotation, faces, angleStep)
        });
    }

    // INPUT HANDLERS
    const onStart = (x) => {
        isDragging = true;
        startX = x;
        gsap.killTweensOf(proxy);
        currentRotation = proxy.rotation;
        container.style.cursor = 'grabbing';
        faces.forEach(f => f.querySelector('iframe').style.pointerEvents = 'none');
    };

    const onMove = (x) => {
        if (!isDragging) return;
        const diff = x - startX;
        // Sensitivity factor
        const sensitive = 0.5;

        proxy.rotation = currentRotation + (diff * sensitive);
    };

    const onEnd = () => {
        isDragging = false;
        container.style.cursor = 'grab';

        // Snap logic
        const snapAngle = Math.round(proxy.rotation / angleStep) * angleStep;

        gsap.to(proxy, {
            rotation: snapAngle,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => enableActiveFaceInteraction(proxy.rotation, faces, angleStep)
        });
    };

    // Mobile / Desktop Events
    section.addEventListener('mousedown', e => onStart(e.clientX));
    window.addEventListener('mousemove', e => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    section.addEventListener('touchstart', e => onStart(e.touches[0].clientX));
    window.addEventListener('touchmove', e => onMove(e.touches[0].clientX));
    window.addEventListener('touchend', onEnd);

    // Resize Handler
    window.addEventListener('resize', () => {
        // Recalculate Radius if width changed (responsive)
        faceWidth = container.offsetWidth;
        radius = Math.round((faceWidth / 2) / Math.tan(Math.PI / faceCount)) + 20;
        faces.forEach((face, i) => {
            const angle = angleStep * i;
            face.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
    });
}

function enableActiveFaceInteraction(currentRot, faces, angleStep) {
    // Determine which face is at the front (0 degrees in world space)
    // The container is rotated by currentRot. Face is at faceAngle.
    // Result = faceAngle + currentRot. Minimize absolute distance to k*360.

    // Simpler: The index is roughly -currentRot / angleStep
    // Wrap index
    const faceCount = faces.length;
    let index = Math.round(-currentRot / angleStep) % faceCount;
    if (index < 0) index += faceCount;

    // Reset all
    faces.forEach(f => {
        f.classList.remove('active-face');
        f.querySelector('iframe').style.pointerEvents = 'none';
        f.style.opacity = '0.5'; // Dim others
    });

    // Activate target
    const activeFace = faces[index];
    if (activeFace) {
        activeFace.classList.add('active-face');
        activeFace.querySelector('iframe').style.pointerEvents = 'auto';
        activeFace.style.opacity = '1';
    }
}
