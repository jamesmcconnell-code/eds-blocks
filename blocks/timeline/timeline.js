/**
 * Timeline block
 *
 * Each row is one event: date or label (first cell) and content (second cell,
 * which can hold a heading, text, images and links).
 *
 * Variants:
 *  - alternate: events zig-zag either side of the line on wide screens
 *  - horizontal: events scroll sideways, one card per step
 *  - no-animation: skip the reveal-on-scroll effect
 */

function shouldAnimate(block) {
  if (block.classList.contains('no-animation')) return false;
  if (typeof window.IntersectionObserver !== 'function') return false;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return !reduced;
}

export default function decorate(block) {
  const list = document.createElement('ol');
  list.className = 'timeline-list';

  [...block.children].forEach((row) => {
    const [dateCell, contentCell] = row.children;
    if (!dateCell) return;

    const item = document.createElement('li');
    item.className = 'timeline-item';

    const date = document.createElement('p');
    date.className = 'timeline-date';
    date.textContent = dateCell.textContent.trim();

    const marker = document.createElement('span');
    marker.className = 'timeline-marker';
    marker.setAttribute('aria-hidden', 'true');

    const content = document.createElement('div');
    content.className = 'timeline-content';
    if (contentCell) content.append(...contentCell.childNodes);

    item.append(date, marker, content);
    list.append(item);
  });

  block.textContent = '';
  block.append(list);

  if (!shouldAnimate(block)) return;

  block.classList.add('timeline-animate');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  list.querySelectorAll('.timeline-item').forEach((item) => observer.observe(item));
}
