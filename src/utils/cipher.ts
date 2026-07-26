export const K1 = 0xB16B00B5;
export const ROT = 11;

export function rotl32(v: number, n: number): number {
  return ((v << n) | (v >>> (32 - n))) >>> 0;
}

export function rotr32(v: number, n: number): number {
  return ((v >>> n) | (v << (32 - n))) >>> 0;
}
