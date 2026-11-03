# Installing and using blocks

## Add a block to your project

Edge Delivery loads a block by name: a table titled `Data Table` loads `blocks/data-table/data-table.js` and `blocks/data-table/data-table.css`. So installing is just copying the folder:

```
your-project/
└── blocks/
    └── data-table/
        ├── data-table.js
        └── data-table.css
```

You don't need to copy the README. Push to your repo and the block is live on your `.aem.page` preview after the next preview.

## Using variants

Variants go in brackets after the block name in the first row of the table:

```
FAQ (exclusive, open-first)
Timeline (alternate)
Data Table (no-filter)
```

Edge Delivery turns these into extra classes on the block, which is how each block reads them.

## Theming

Blocks use the boilerplate's custom properties with sensible fallbacks:

| Property | Used for |
| --- | --- |
| `--link-color` | Accents, active states, focus rings |
| `--light-color` | Borders, dividers, table stripes |
| `--background-color` | Card and header backgrounds |
| `--body-font-size-s`, `--body-font-size-xs` | Table and status text |

To change one block without touching the rest of the site, set its own properties, for example in your `styles.css`:

```css
.pricing-table {
  --pricing-accent: #0a7d4f;
}
```

## Using spreadsheets as data (Data Table)

1. Create a spreadsheet in your content source. The first row is the column headers.
2. Preview and publish it. Edge Delivery serves it as JSON at the same path plus `.json`.
3. Link to that `.json` URL in the first row of the Data Table block.

Tips:

- Only **published** sheets are available on `.aem.live`; preview them to see changes on `.aem.page`.
- Edge Delivery returns up to 1,000 rows by default. For larger sheets add `?limit=5000` (or another number) to the link.
- Keep the sheet on the same site as the page to avoid cross-origin issues.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Block shows as plain text | The folder and file names must exactly match the block name in kebab-case |
| Data Table says it couldn't load | Open the `.json` link in a browser; check it's published and the path is right |
| Styles look off | Look for global CSS in your project that targets `table`, `details` or `button` and is overriding the block |
