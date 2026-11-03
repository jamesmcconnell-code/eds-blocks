/**
 * Data Table block
 *
 * Renders a sortable, filterable, paginated table from either:
 *  - an Edge Delivery spreadsheet (link to its .json endpoint in the first row), or
 *  - a table authored directly inside the block (first row = column headers).
 *
 * Variants: no-sort, no-filter
 * Options (sheet mode, one per row): Columns, Page Size, Caption
 */

const DEFAULT_PAGE_SIZE = 10;

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const toKey = (text) => text.trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const toNumber = (text) => {
  const cleaned = text.replace(/[\s$€£¥%,]/g, '');
  if (cleaned === '' || Number.isNaN(Number(cleaned))) return null;
  return Number(cleaned);
};

/**
 * Compares two cell values, numerically when both look like numbers
 * (including currency and percentages), otherwise as natural-order text.
 */
export function compareCells(a, b) {
  const numA = toNumber(a);
  const numB = toNumber(b);
  if (numA !== null && numB !== null) return numA - numB;
  return collator.compare(a, b);
}

/**
 * Loads rows from an Edge Delivery spreadsheet JSON endpoint.
 * Supports single sheets and multi-sheet workbooks (uses the first sheet,
 * or the one selected with ?sheet=name in the URL).
 */
export async function fetchSheetRows(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to load ${url} (${resp.status})`);
  const json = await resp.json();
  if (json[':type'] === 'multi-sheet') {
    const [first] = json[':names'] || [];
    return (first && json[first]?.data) || [];
  }
  return json.data || [];
}

function readConfig(rows) {
  const config = {};
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) config[toKey(cells[0].textContent)] = cells[1].textContent.trim();
  });
  return config;
}

function findSheetUrl(block) {
  const link = block.querySelector(':scope > div:first-child a[href]');
  if (!link) return null;
  const url = new URL(link.getAttribute('href'), window.location.href);
  return url.pathname.endsWith('.json') ? url : null;
}

function buildRecord(cells) {
  const tr = document.createElement('tr');
  const values = cells.map((cell) => {
    const td = document.createElement('td');
    if (typeof cell === 'string') {
      td.textContent = cell;
    } else {
      td.append(...cell.childNodes);
    }
    tr.append(td);
    return td.textContent.trim();
  });
  return { tr, values, search: values.join(' ').toLowerCase() };
}

async function loadModel(block) {
  const sheetUrl = findSheetUrl(block);
  const rows = [...block.children];

  if (sheetUrl) {
    const config = readConfig(rows.slice(1));
    const data = await fetchSheetRows(sheetUrl.toString());
    const headers = config.columns
      ? config.columns.split(',').map((c) => c.trim()).filter(Boolean)
      : Object.keys(data[0] || {}).filter((key) => !key.startsWith(':'));
    const records = data.map((row) => buildRecord(headers.map((h) => String(row[h] ?? ''))));
    return { headers, records, config };
  }

  const [headerRow, ...bodyRows] = rows;
  const headers = headerRow ? [...headerRow.children].map((c) => c.textContent.trim()) : [];
  const records = bodyRows.map((row) => buildRecord([...row.children]));
  return { headers, records, config: {} };
}

function parsePageSize(value) {
  if (value === undefined || value === '') return DEFAULT_PAGE_SIZE;
  const size = parseInt(value, 10);
  return Number.isNaN(size) || size < 0 ? DEFAULT_PAGE_SIZE : size;
}

export default async function decorate(block) {
  let model;
  try {
    model = await loadModel(block);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('data-table:', error);
    block.textContent = '';
    const message = document.createElement('p');
    message.className = 'data-table-error';
    message.textContent = 'Sorry, this table could not be loaded.';
    block.append(message);
    return;
  }

  const { headers, records, config } = model;
  const sortable = !block.classList.contains('no-sort');
  const filterable = !block.classList.contains('no-filter');
  const pageSize = parsePageSize(config['page-size']);
  const state = {
    query: '', sortIndex: null, sortDir: 1, page: 1,
  };

  block.textContent = '';

  // filter
  let filterInput;
  if (filterable) {
    const filter = document.createElement('div');
    filter.className = 'data-table-filter';
    const label = document.createElement('label');
    const inputId = `data-table-filter-${Math.random().toString(36).slice(2, 8)}`;
    label.setAttribute('for', inputId);
    label.textContent = 'Filter';
    filterInput = document.createElement('input');
    filterInput.type = 'search';
    filterInput.id = inputId;
    filterInput.placeholder = 'Type to filter rows';
    filter.append(label, filterInput);
    block.append(filter);
  }

  // table
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table-scroll';
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', config.caption || 'Data table');

  const table = document.createElement('table');
  if (config.caption) {
    const caption = document.createElement('caption');
    caption.textContent = config.caption;
    table.append(caption);
  }

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  const headerCells = headers.map((text, index) => {
    const th = document.createElement('th');
    th.scope = 'col';
    if (sortable) {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = '<span class="data-table-label"></span><span class="data-table-sort-icon" aria-hidden="true"></span>';
      button.querySelector('.data-table-label').textContent = text;
      button.addEventListener('click', () => {
        if (state.sortIndex === index) {
          state.sortDir *= -1;
        } else {
          state.sortIndex = index;
          state.sortDir = 1;
        }
        state.page = 1;
        // eslint-disable-next-line no-use-before-define
        render();
      });
      th.append(button);
    } else {
      th.textContent = text;
    }
    headRow.append(th);
    return th;
  });
  thead.append(headRow);

  const tbody = document.createElement('tbody');
  table.append(thead, tbody);
  wrapper.append(table);
  block.append(wrapper);

  // status + pagination
  const footer = document.createElement('div');
  footer.className = 'data-table-footer';
  const status = document.createElement('p');
  status.className = 'data-table-status';
  status.setAttribute('aria-live', 'polite');
  footer.append(status);

  const pager = document.createElement('nav');
  pager.className = 'data-table-pager';
  pager.setAttribute('aria-label', 'Table pages');
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.textContent = 'Previous';
  const pageLabel = document.createElement('span');
  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = 'Next';
  pager.append(prev, pageLabel, next);
  if (pageSize) footer.append(pager);
  block.append(footer);

  const emptyRow = document.createElement('tr');
  const emptyCell = document.createElement('td');
  emptyCell.colSpan = Math.max(headers.length, 1);
  emptyCell.className = 'data-table-empty';
  emptyCell.textContent = 'No matching rows.';
  emptyRow.append(emptyCell);

  function render() {
    const query = state.query.trim().toLowerCase();
    let visible = query ? records.filter((r) => r.search.includes(query)) : records;
    if (state.sortIndex !== null) {
      const i = state.sortIndex;
      visible = [...visible].sort((a, b) => compareCells(a.values[i], b.values[i]) * state.sortDir);
    }

    const total = visible.length;
    const pageCount = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
    state.page = Math.min(state.page, pageCount);
    const start = pageSize ? (state.page - 1) * pageSize : 0;
    const pageRows = pageSize ? visible.slice(start, start + pageSize) : visible;

    tbody.replaceChildren(...(total ? pageRows.map((r) => r.tr) : [emptyRow]));

    headerCells.forEach((th, index) => {
      if (!sortable) return;
      if (state.sortIndex === index) {
        th.setAttribute('aria-sort', state.sortDir === 1 ? 'ascending' : 'descending');
      } else {
        th.removeAttribute('aria-sort');
      }
    });

    status.textContent = total
      ? `Showing ${start + 1}–${start + pageRows.length} of ${total}`
      : 'No matching rows';
    pageLabel.textContent = `Page ${state.page} of ${pageCount}`;
    prev.disabled = state.page <= 1;
    next.disabled = state.page >= pageCount;
    pager.hidden = pageCount <= 1;
  }

  prev.addEventListener('click', () => { state.page -= 1; render(); });
  next.addEventListener('click', () => { state.page += 1; render(); });
  filterInput?.addEventListener('input', () => {
    state.query = filterInput.value;
    state.page = 1;
    render();
  });

  render();
}
