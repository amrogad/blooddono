import { describe, it, expect } from 'vitest';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

// Flatten every leaf key (objects recurse, arrays count as one leaf).
function keyPaths(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...keyPaths(v, key));
    else out.push(key);
  }
  return out.sort();
}

describe('i18n key parity', () => {
  const enKeys = keyPaths(en);
  const arKeys = keyPaths(ar);

  it('has no English keys missing from Arabic', () => {
    expect(enKeys.filter((k) => !arKeys.includes(k))).toEqual([]);
  });

  it('has no Arabic keys missing from English', () => {
    expect(arKeys.filter((k) => !enKeys.includes(k))).toEqual([]);
  });

  it('keeps array-valued keys the same length across locales', () => {
    const at = (obj, path) => path.split('.').reduce((acc, k) => acc[k], obj);
    for (const key of ['date.weekdays', 'date.months', 'about.reasons']) {
      expect(at(ar, key).length).toBe(at(en, key).length);
    }
  });
});
