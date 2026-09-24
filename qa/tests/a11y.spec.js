// T-006 axe-core: zero critical/serious violations (NFR-002).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { indexPages } from '../site-map.js';

for (const page of indexPages) {
  for (const width of [375, 1440]) {
    test(`T-006 axe ${page.path} @${width}`, async ({ page: p }) => {
      await p.setViewportSize({ width, height: 900 });
      await p.goto(page.path);
      await p.waitForLoadState('networkidle');
      const { violations } = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      const blocking = violations
        .filter((v) => ['critical', 'serious'].includes(v.impact))
        .map((v) => `${v.impact} ${v.id} ×${v.nodes.length}: ${v.help}`);
      expect(blocking).toEqual([]);
    });
  }
}
