export function checkViewport() {
    if (typeof window === 'undefined') return;
    return window.innerWidth < 768;
}

