/**
 * Pricing Table block
 *
 * Each row is one plan, with five cells:
 *   1. Plan name (heading) + optional description. Italic text (e.g. *Most popular*)
 *      becomes a badge and marks the plan as featured.
 *   2. Monthly price, e.g. $19 (or text such as "Free" / "Contact us")
 *   3. Annual price, e.g. $190 (optional; leave empty to hide the toggle)
 *   4. Features (a bulleted list, or one feature per line)
 *   5. Call to action link
 *
 * Shows a Monthly / Annual toggle when any plan has an annual price.
 */

const PERIOD_LABELS = { monthly: '/month', annual: '/year' };

const hasDigits = (text) => /\d/.test(text);

function parseFeatures(cell) {
  if (!cell) return [];
  const list = cell.querySelector('ul, ol');
  if (list) return [...list.children].map((li) => li.innerHTML);
  return [...cell.querySelectorAll('p')].length
    ? [...cell.querySelectorAll('p')].map((p) => p.innerHTML)
    : cell.innerHTML.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
}

export function parsePlan(row) {
  const [nameCell, monthlyCell, annualCell, featuresCell, ctaCell] = row.children;
  const badgeEl = nameCell?.querySelector('em');
  const badge = badgeEl ? badgeEl.textContent.trim() : '';
  if (badgeEl) {
    const parent = badgeEl.parentElement;
    badgeEl.remove();
    if (parent !== nameCell && !parent.textContent.trim()) parent.remove();
  }

  const heading = nameCell?.querySelector('h1, h2, h3, h4, h5, h6');
  const paragraphs = nameCell ? [...nameCell.querySelectorAll('p')] : [];
  const nameSource = heading || paragraphs[0];
  const name = (nameSource || nameCell)?.textContent.trim() || '';
  const description = paragraphs
    .filter((p) => p !== nameSource)
    .map((p) => p.textContent.trim())
    .filter(Boolean)
    .join(' ');

  return {
    name,
    description,
    badge,
    featured: Boolean(badge),
    monthly: monthlyCell?.textContent.trim() || '',
    annual: annualCell?.textContent.trim() || '',
    features: parseFeatures(featuresCell),
    cta: ctaCell?.querySelector('a') || null,
  };
}

function buildToggle(onChange) {
  const toggle = document.createElement('div');
  toggle.className = 'pricing-table-toggle';
  toggle.setAttribute('role', 'group');
  toggle.setAttribute('aria-label', 'Billing period');

  const buttons = ['monthly', 'annual'].map((period) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.period = period;
    button.textContent = period === 'monthly' ? 'Monthly' : 'Annual';
    button.setAttribute('aria-pressed', String(period === 'monthly'));
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      onChange(period);
    });
    toggle.append(button);
    return button;
  });

  return toggle;
}

function buildCard(plan) {
  const card = document.createElement('div');
  card.className = 'pricing-table-plan';
  if (plan.featured) card.classList.add('featured');

  if (plan.badge) {
    const badge = document.createElement('span');
    badge.className = 'pricing-table-badge';
    badge.textContent = plan.badge;
    card.append(badge);
  }

  const name = document.createElement('h3');
  name.className = 'pricing-table-name';
  name.textContent = plan.name;
  card.append(name);

  if (plan.description) {
    const description = document.createElement('p');
    description.className = 'pricing-table-description';
    description.textContent = plan.description;
    card.append(description);
  }

  const price = document.createElement('p');
  price.className = 'pricing-table-price';
  const amount = document.createElement('span');
  amount.className = 'pricing-table-amount';
  const period = document.createElement('span');
  period.className = 'pricing-table-period';
  price.append(amount, period);
  card.append(price);

  if (plan.features.length) {
    const list = document.createElement('ul');
    list.className = 'pricing-table-features';
    plan.features.forEach((feature) => {
      const li = document.createElement('li');
      li.innerHTML = feature;
      list.append(li);
    });
    card.append(list);
  }

  if (plan.cta) {
    const cta = document.createElement('p');
    cta.className = 'pricing-table-cta button-container';
    plan.cta.className = plan.featured ? 'button primary' : 'button secondary';
    cta.append(plan.cta);
    card.append(cta);
  }

  const setPeriod = (selected) => {
    const useAnnual = selected === 'annual' && plan.annual;
    const value = useAnnual ? plan.annual : plan.monthly;
    amount.textContent = value;
    period.textContent = hasDigits(value) ? PERIOD_LABELS[useAnnual ? 'annual' : 'monthly'] : '';
  };

  return { card, setPeriod };
}

export default function decorate(block) {
  const plans = [...block.children].map(parsePlan).filter((plan) => plan.name);
  block.textContent = '';

  const cards = plans.map(buildCard);
  const setPeriod = (period) => {
    block.dataset.period = period;
    cards.forEach(({ setPeriod: update }) => update(period));
  };

  if (plans.some((plan) => plan.annual)) {
    block.append(buildToggle(setPeriod));
  }

  const grid = document.createElement('div');
  grid.className = 'pricing-table-grid';
  grid.append(...cards.map(({ card }) => card));
  block.append(grid);

  setPeriod('monthly');
}
