/**
 * Before / After block
 *
 * Row 1: two images (before, after), in two cells or one cell.
 * Row 2 (optional): two labels, e.g. "2019 | 2026". Defaults to "Before | After".
 * Row 3 (optional): starting position as a percentage, e.g. "Start | 30".
 *
 * Uses a native range input, so it works with mouse, touch and keyboard.
 */

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function readLabels(row) {
  if (!row || row.querySelector('picture')) return null;
  const cells = [...row.children].map((c) => c.textContent.trim());
  if (cells.length < 2 || /^start$/i.test(cells[0])) return null;
  return cells.slice(0, 2);
}

function readStart(rows) {
  const row = rows.find((r) => /^start$/i.test(r.children[0]?.textContent.trim() || ''));
  const value = parseFloat(row?.children[1]?.textContent || '');
  return Number.isNaN(value) ? 50 : clamp(value, 0, 100);
}

export default function decorate(block) {
  const rows = [...block.children];
  const pictures = [...block.querySelectorAll('picture')];
  if (pictures.length < 2) return;

  const [before, after] = pictures;
  const [beforeLabel, afterLabel] = readLabels(rows[1]) || ['Before', 'After'];
  const start = readStart(rows);

  const frame = document.createElement('div');
  frame.className = 'before-after-frame';
  frame.style.setProperty('--position', `${start}%`);

  const img = before.querySelector('img');
  const width = parseInt(img?.getAttribute('width'), 10);
  const height = parseInt(img?.getAttribute('height'), 10);
  if (width && height) frame.style.aspectRatio = `${width} / ${height}`;

  const afterLayer = document.createElement('div');
  afterLayer.className = 'before-after-after';
  afterLayer.append(after);

  const beforeLayer = document.createElement('div');
  beforeLayer.className = 'before-after-before';
  beforeLayer.append(before);

  const labels = [[beforeLabel, 'before'], [afterLabel, 'after']].map(([text, side]) => {
    const label = document.createElement('span');
    label.className = `before-after-label before-after-label-${side}`;
    label.setAttribute('aria-hidden', 'true');
    label.textContent = text;
    return label;
  });

  const range = document.createElement('input');
  range.type = 'range';
  range.min = '0';
  range.max = '100';
  range.step = '1';
  range.value = String(start);
  range.className = 'before-after-range';
  range.setAttribute('aria-label', `Compare ${beforeLabel} and ${afterLabel}`);

  const handle = document.createElement('div');
  handle.className = 'before-after-handle';
  handle.setAttribute('aria-hidden', 'true');

  const update = () => {
    const value = clamp(Number(range.value), 0, 100);
    frame.style.setProperty('--position', `${value}%`);
    range.setAttribute('aria-valuetext', `${value}% ${beforeLabel}, ${100 - value}% ${afterLabel}`);
  };
  range.addEventListener('input', update);

  frame.append(afterLayer, beforeLayer, ...labels, range, handle);
  block.textContent = '';
  block.append(frame);
  update();
}
