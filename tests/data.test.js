import { expect, test } from 'vitest';
import portalData from '../src/portal-data.json';

test('portal data has required fields', () => {
  expect(portalData.brand).toBe('卜仙堂');
  expect(Array.isArray(portalData.navigation)).toBe(true);
  expect(portalData.navigation.length).toBeGreaterThan(0);
});

test('navigation items have valid structure', () => {
  portalData.navigation.forEach(item => {
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('url');
    expect(item.url).toMatch(/^https?:\/\//);
  });
});
