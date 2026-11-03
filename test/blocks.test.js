import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, buildBlock } from './helpers.js';

import decorateDataTable, { compareCells } from '../blocks/data-table/data-table.js';
import decorateFaq from '../blocks/faq/faq.js';
import decoratePricing from '../blocks/pricing-table/pricing-table.js';
import decorateBeforeAfter from '../blocks/before-after/before-after.js';
import decorateTimeline from '../blocks/timeline/timeline.js';

const rowTexts = (block) => [...block.querySelectorAll('tbody tr')]
  .map((tr) => [...tr.children].map((td) => td.textContent));

describe('data-table', () => {
  beforeEach(() => setupDom());

  it('compares currency and numbers numerically', () => {
    assert.ok(compareCells('$900', '$1,000') < 0);
    assert.ok(compareCells('9', '10') < 0);
    assert.ok(compareCells('apple', 'Banana') < 0);
  });

  it('renders an inline table and sorts by column', async () => {
    const block = buildBlock('data-table', [
      ['Product', 'Price'],
      ['Gamma', '$1,000'],
      ['Alpha', '$900'],
      ['Beta', '$25'],
    ]);
    await decorateDataTable(block);

    assert.deepEqual([...block.querySelectorAll('th')].map((th) => th.textContent), ['Product', 'Price']);
    assert.equal(block.querySelectorAll('tbody tr').length, 3);

    const priceButton = block.querySelectorAll('th button')[1];
    priceButton.click();
    assert.deepEqual(rowTexts(block).map((r) => r[0]), ['Beta', 'Alpha', 'Gamma']);
    assert.equal(priceButton.parentElement.getAttribute('aria-sort'), 'ascending');

    priceButton.click();
    assert.deepEqual(rowTexts(block).map((r) => r[0]), ['Gamma', 'Alpha', 'Beta']);
  });

  it('filters rows', async () => {
    const block = buildBlock('data-table', [['Name'], ['Denver'], ['Boulder'], ['Loveland']]);
    await decorateDataTable(block);
    const input = block.querySelector('input[type="search"]');
    input.value = 'love';
    input.dispatchEvent(new window.Event('input'));
    assert.deepEqual(rowTexts(block), [['Loveland']]);
  });

  it('loads a spreadsheet, applies options and paginates', async () => {
    const data = Array.from({ length: 12 }, (_, i) => ({ City: `City ${i + 1}`, Pop: String(i), Hidden: 'x' }));
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ ':type': 'sheet', data }) });

    const block = buildBlock('data-table', [
      ['<a href="/data/cities.json">/data/cities.json</a>'],
      ['Columns', 'City, Pop'],
      ['Page Size', '5'],
      ['Caption', 'Cities'],
    ]);
    await decorateDataTable(block);

    assert.equal(block.querySelector('caption').textContent, 'Cities');
    assert.equal(block.querySelectorAll('th').length, 2);
    assert.equal(block.querySelectorAll('tbody tr').length, 5);
    assert.match(block.querySelector('.data-table-status').textContent, /1–5 of 12/);

    const next = [...block.querySelectorAll('.data-table-pager button')].find((b) => b.textContent === 'Next');
    next.click();
    next.click();
    assert.equal(block.querySelectorAll('tbody tr').length, 2);
    assert.ok(next.disabled);
  });

  it('shows a friendly error when the sheet fails to load', async () => {
    globalThis.fetch = async () => ({ ok: false, status: 404 });
    const origError = console.error;
    console.error = () => {};
    const block = buildBlock('data-table', [['<a href="/missing.json">data</a>']]);
    await decorateDataTable(block);
    console.error = origError;
    assert.ok(block.querySelector('.data-table-error'));
  });
});

describe('faq', () => {
  beforeEach(() => setupDom());

  it('builds an accordion and one merged FAQPage schema', () => {
    const first = buildBlock('faq', [
      ['What is EDS?', '<p>Edge Delivery Services.</p>'],
      ['Is it fast?', '<p>Very.</p>'],
    ], ['exclusive', 'open-first']);
    decorateFaq(first);
    const second = buildBlock('faq', [['Third question?', '<p>Third answer.</p>']]);
    decorateFaq(second);

    const items = first.querySelectorAll('details');
    assert.equal(items.length, 2);
    assert.ok(items[0].open);
    assert.ok(items[0].getAttribute('name'));

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    assert.equal(scripts.length, 1);
    const schema = JSON.parse(scripts[0].textContent);
    assert.equal(schema['@type'], 'FAQPage');
    assert.equal(schema.mainEntity.length, 3);
    assert.equal(schema.mainEntity[0].acceptedAnswer.text, 'Edge Delivery Services.');
  });

  it('skips schema with the no-schema variant', () => {
    const block = buildBlock('faq', [['Q?', 'A.']], ['no-schema']);
    decorateFaq(block);
    assert.equal(document.querySelectorAll('script[type="application/ld+json"]').length, 0);
  });
});

describe('pricing-table', () => {
  beforeEach(() => setupDom());

  it('renders plans, a featured badge and a working billing toggle', () => {
    const block = buildBlock('pricing-table', [
      ['<h3>Starter</h3><p>For side projects</p>', 'Free', '', '<ul><li>1 site</li></ul>', '<a href="/signup">Start</a>'],
      ['<h3>Pro</h3><p><em>Most popular</em></p><p>For teams</p>', '$19', '$190', '<ul><li>10 sites</li><li>Support</li></ul>', '<a href="/buy">Buy</a>'],
    ]);
    decoratePricing(block);

    const plans = block.querySelectorAll('.pricing-table-plan');
    assert.equal(plans.length, 2);
    assert.ok(plans[1].classList.contains('featured'));
    assert.equal(plans[1].querySelector('.pricing-table-badge').textContent, 'Most popular');
    assert.equal(plans[1].querySelector('.pricing-table-description').textContent, 'For teams');
    assert.equal(plans[1].querySelector('.pricing-table-amount').textContent, '$19');
    assert.equal(plans[0].querySelector('.pricing-table-period').textContent, '');

    block.querySelector('button[data-period="annual"]').click();
    assert.equal(plans[1].querySelector('.pricing-table-amount').textContent, '$190');
    assert.equal(plans[1].querySelector('.pricing-table-period').textContent, '/year');
    assert.equal(plans[0].querySelector('.pricing-table-amount').textContent, 'Free');
  });

  it('hides the toggle when no plan has an annual price', () => {
    const block = buildBlock('pricing-table', [['<h3>Only</h3>', '$5', '', '', '']]);
    decoratePricing(block);
    assert.equal(block.querySelector('.pricing-table-toggle'), null);
  });
});

describe('before-after', () => {
  beforeEach(() => setupDom());

  const pic = (src) => `<picture><img src="${src}" width="1600" height="900" alt=""></picture>`;

  it('builds a slider with labels and start position', () => {
    const block = buildBlock('before-after', [
      [pic('/a.jpg'), pic('/b.jpg')],
      ['2019', '2026'],
      ['Start', '30'],
    ]);
    decorateBeforeAfter(block);

    const frame = block.querySelector('.before-after-frame');
    const range = block.querySelector('input[type="range"]');
    assert.equal(frame.style.getPropertyValue('--position'), '30%');
    assert.equal(frame.style.aspectRatio, '1600 / 900');
    assert.equal(range.getAttribute('aria-label'), 'Compare 2019 and 2026');

    range.value = '75';
    range.dispatchEvent(new window.Event('input'));
    assert.equal(frame.style.getPropertyValue('--position'), '75%');
    assert.match(range.getAttribute('aria-valuetext'), /75% 2019, 25% 2026/);
  });

  it('leaves the block alone without two images', () => {
    const block = buildBlock('before-after', [[pic('/a.jpg')]]);
    decorateBeforeAfter(block);
    assert.equal(block.querySelector('.before-after-frame'), null);
  });
});

describe('timeline', () => {
  beforeEach(() => setupDom());

  it('renders an ordered list of events', () => {
    const block = buildBlock('timeline', [
      ['2021', '<h3>Started</h3><p>First steps.</p>'],
      ['2026', '<h3>Launched</h3>'],
    ]);
    decorateTimeline(block);

    const items = block.querySelectorAll('ol.timeline-list > li.timeline-item');
    assert.equal(items.length, 2);
    assert.equal(items[0].querySelector('.timeline-date').textContent, '2021');
    assert.equal(items[1].querySelector('h3').textContent, 'Launched');
  });
});
