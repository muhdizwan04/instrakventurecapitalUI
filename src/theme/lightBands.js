/** Alternating light-mode section surfaces (a → b → c → …). */
export function lightBandAt(index) {
    const n = Number(index);
    if (!Number.isFinite(n)) return 'a';
    const i = ((Math.floor(n) % 3) + 3) % 3;
    return ['a', 'b', 'c'][i];
}
