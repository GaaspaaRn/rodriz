export function initGrain() {
    const canvas = document.getElementById('noise-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width, height;
    let animationId;

    // Grain settings
    const patternSize = 256; // Generate a smaller pattern to tile (performance optimization)
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const patternCtx = patternCanvas.getContext('2d');
    const patternData = patternCtx.createImageData(patternSize, patternSize);

    // Resize handler
    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    function update() {
        // Determine how "fast" the noise changes. 
        // Updating every frame is standard for "TV static".
        // For "Cinematic", maybe skip frames, but user asked for "real procedural... frame a frame".

        // Generate random noise on the small pattern canvas
        const buffer32 = new Uint32Array(patternData.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
            // Random grayscale value (0-255)
            // Optimization: We only care about random brightness.
            // We can just set a random 32-bit integer, but visuals might naturally look colorful if we don't force grayscale.
            // For true grayscale noise:
            const value = (Math.random() * 255) | 0;

            // ABGR order (little-endian)
            // Alpha is 255 (0xFF), Blue=value, Green=value, Red=value
            buffer32[i] =
                (255 << 24) | // Alpha
                (value << 16) | // Blue
                (value << 8) | // Green
                value;         // Red
        }

        patternCtx.putImageData(patternData, 0, 0);

        // Draw the pattern logic
        // Instead of drawing 1000s of times, we can use createPattern
        // However, createPattern is slow to regenerate every frame.
        // Faster Approach:
        // Just draw random rectangles or use simple random noise per pixel on full screen?
        // Full screen putImageData is heavy on 4K screens.
        // "Tile" approach with drawImage might be better.

        // Let's try filling the screen with random offsets of the pattern for "infinite" non-repetitive feel
        // Actually, simply generating full screen noise might be too heavy for JS on weak devices.
        // The user mentions "grain não repetitivo".

        // Optimized approach:
        // 1. Generate noise on a pattern canvas (256x256 or 512x512).
        // 2. Clear main canvas.
        // 3. Create a pattern from it and fillRect? No, pattern generation is slow.
        // 4. Just drawImage the pattern multiple times tile-style?

        // Let's stick to the MOST performant method for per-pixel noise:
        // Writing directly to a 32-bit buffer of the MAIN canvas is actually viable if resolution isn't huge.
        // But since this is a hero section, let's use a scaled-down canvas (e.g. 50% size) or just optimize the loop.

        // User wants "Micro" grain.
        // Let's try filling the pattern canvas and using it as a fill style?
        // Or simpler: Just Tile the drawImage. 

        // Re-evaluating: standard per-pixel loop on full 1080p is ~2M iterations -> ~2-3ms in modern JS. It's fine.

        // Let's implement full-screen noise for maximum "non-repetitive" quality.

        const w = canvas.width;
        const h = canvas.height;

        // Optimization: Create ImageData only once if size matches, but simpler to just Create new or reuse.
        // We'll reuse a buffer if possible, but canvas size changes.
        // Let's just create image data for the current frame.
        const idata = ctx.createImageData(w, h);
        const buffer32Main = new Uint32Array(idata.data.buffer);
        const lenMain = buffer32Main.length;

        for (let i = 0; i < lenMain; i++) {
            // Fast random
            if (Math.random() < 0.5) {
                // Darker
                buffer32Main[i] = 0xff000000; // Black fully opaque? No, css controls opacity.
                // Actually, we want white/black noise?
                // If blend mode is 'overlay', we want mostly mid-grey with deviations.
                // Or typically Film Grain is black/white random.

                // Let's do random grayscale.
                // (Math.random() * 255) | 0
                // But Math.random() is slow-ish 2 Million times.

                // Super fast Approximation:
                // Math.random() is actually optimized in V8. 
            }

            // Simpler: Just random value.
            const val = (Math.random() * 255) | 0;
            buffer32Main[i] = (255 << 24) | (val << 16) | (val << 8) | val;
        }

        ctx.putImageData(idata, 0, 0);

        animationId = requestAnimationFrame(update);
    }

    update();
}
