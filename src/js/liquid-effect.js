/**
 * Liquid Effect Animation
 * Adapted from threejs-components Liquid1
 */

export function initLiquidEffect() {
    const canvas = document.getElementById('liquid-canvas');
    if (!canvas) {
        console.warn('Liquid/Water effect canvas not found (#liquid-canvas)');
        return;
    }

    // Dynamic import of the library
    import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js')
        .then((module) => {
            const LiquidBackground = module.default;
            const app = LiquidBackground(canvas);

            // Asset from user request
            const imageUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/enhanced_8bfe61b0-d431-433a-8acb-49d508bf88b4-image-vWzKFKS7vQy7s8wfQYzEpaoiYaVMkr.png';

            app.loadImage(imageUrl);

            // Parameters from user request
            app.liquidPlane.material.metalness = 0.75;
            app.liquidPlane.material.roughness = 0.25;
            app.liquidPlane.uniforms.displacementScale.value = 5;
            app.setRain(false);

            // Store instance for potential cleanup
            window.__liquidApp = app;
        })
        .catch((err) => {
            console.error('Failed to load Liquid Effect library:', err);
        });
}
