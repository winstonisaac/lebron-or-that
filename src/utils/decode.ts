import { K1, ROT, rotl32, rotr32 } from '../utils/cipher';
import { K2 } from '../utils/constants';
import { K3 } from '../game/config';

function getCategoryOffset(category: string, id: number): number {
  switch (category) {
    case 'tech': return id * 7;
    case 'movies': return id * 13;
    case 'games': return id * 3;
    case 'events': return id * 17;
    case 'culture': return id * 23;
    case 'tv': return id * 19;
    case 'music': return id * 29;
    case 'nba': return id * 37;
    default: return id * 11;
  }
}

export function encodeYear(year: number, id: number, category: string): number {
  let v = year >>> 0;
  v ^= K1;
  v = rotl32(v, ROT);
  v ^= K2;
  v = (v + getCategoryOffset(category, id)) >>> 0;
  v ^= K3;
  return v;
}

export function decodeYear(encoded: number, id: number, category: string): number {
  let v = encoded >>> 0;
  v ^= K3;
  v = (v - getCategoryOffset(category, id)) >>> 0;
  v ^= K2;
  v = rotr32(v, ROT);
  v ^= K1;
  return v;
}
