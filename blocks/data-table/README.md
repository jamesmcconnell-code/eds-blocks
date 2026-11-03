# Data Table

A sortable, filterable, paginated table. Feed it from a spreadsheet so authors can update the data without touching the page, or author the table directly in the document.

## Authoring: from a spreadsheet

1. Create a spreadsheet (e.g. `/data/products`) and preview/publish it. Edge Delivery serves it as JSON at `/data/products.json`.
2. Add this block to a page:

| Data Table | |
| --- | --- |
| https://main--site--owner.aem.page/data/products.json | |
| Columns | Product, Category, Price |
| Page Size | 10 |
| Caption | Winter gear catalog |

The first row holds the link to the `.json` endpoint. Every other row is an optional setting.

| Option | Default | Description |
| --- | --- | --- |
| Columns | All columns | Comma-separated list of columns to show, in order |
| Page Size | 10 | Rows per page. Use `0` to show every row |
| Caption | none | Visible table caption, also used as the accessible label |

Workbooks with several sheets use the first sheet. To pick another, add `?sheet=name` to the link.

## Authoring: inline table

Leave out the link. The first row becomes the column headers:

| Data Table | | |
| --- | --- | --- |
| Product | Category | Price |
| Trail Pack 30L | Bags | $129 |
| Alpine Gloves | Apparel | $59 |

Inline cells keep their formatting (links, bold text and so on).

## Variants

| Variant | Effect |
| --- | --- |
| `no-sort` | Plain column headers, no sorting |
| `no-filter` | Hides the filter box |

Example: `Data Table (no-filter)`.

## Behaviour

- Sorts numbers, currency (`$1,049`) and percentages numerically, and text in natural order (`Item 2` before `Item 10`).
- Header buttons expose `aria-sort`; the row count is announced through a polite live region.
- On narrow screens the table scrolls sideways inside its own focusable region.
- If the spreadsheet can't be loaded, a short message replaces the table and the error is logged to the console.

## Styling hooks

Override these custom properties on `.data-table`: `--data-table-border`, `--data-table-accent`, `--data-table-stripe`.
