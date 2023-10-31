export function isTouchDevice() {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    );
}

export function rand(min, max) {
    return min + Math.random() * (max - min);
}

export function get_random_color() {
    let h = Math.floor(rand(0, 360));
    let s = Math.floor(rand(50, 100));
    let l = Math.floor(rand(30, 70));
    return `hsl(${h}deg,${s}%,${l}%)`;
}