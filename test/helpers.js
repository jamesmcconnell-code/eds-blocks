import { JSDOM } from 'jsdom';

/**
 * Creates a fresh DOM and exposes it as globals, the way blocks expect
 * to find window and document in the browser.
 */
export function setupDom(url = 'https://main--demo--owner.aem.page/') {
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><main></main></body></html>', { url });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  return dom;
}

/**
 * Builds a block the way Edge Delivery renders it:
 * <div class="name variants"><div>row<div>cell</div></div></div>
 * Each row is an array of cell HTML strings.
 */
export function buildBlock(name, rows, variants = []) {
  const block = document.createElement('div');
  block.classList.add(name, ...variants);
  rows.forEach((cells) => {
    const row = document.createElement('div');
    cells.forEach((html) => {
      const cell = document.createElement('div');
      cell.innerHTML = html;
      row.append(cell);
    });
    block.append(row);
  });
  document.querySelector('main').append(block);
  return block;
}
