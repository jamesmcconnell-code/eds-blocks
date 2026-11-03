# EDS Blocks

Open-source, copy-paste blocks for [Edge Delivery Services](https://www.aem.live/) sites.

Every block is **one JavaScript file and one CSS file** with **zero dependencies**: no libraries, no build step, no imports from your project. Copy a folder into `blocks/`, add the block to a page, and you're done. They're written to keep your Lighthouse score at 100 and to be accessible by default.

## Blocks

| Block | What it does | Highlights |
| --- | --- | --- |
| [Data Table](blocks/data-table/) | Sortable, filterable, paginated table | Loads straight from a spreadsheet's JSON endpoint, or from an inline table |
| [FAQ](blocks/faq/) | Question and answer accordion | Generates merged `FAQPage` JSON-LD; native `<details>` |
| [Pricing Table](blocks/pricing-table/) | Plan cards with Monthly / Annual toggle | Featured plan and badge from simple italic text |
| [Before / After](blocks/before-after/) | Draggable image comparison | Native range input: mouse, touch and keyboard for free |
| [Timeline](blocks/timeline/) | Dated events, vertical / alternating / horizontal | Reveal on scroll that respects reduced motion |

Each block's folder has a README with the authoring table, options, variants and styling hooks.

## Install a block

1. Copy the block folder (for example `blocks/data-table/`) into the `blocks/` folder of your Edge Delivery project.
2. Commit and push. Code Sync deploys it.
3. In your document, add a table whose first row is the block name (for example `Data Table`), then the rows described in the block's README.
4. Preview the page.

That's it. See [docs/installing.md](docs/installing.md) for variants, theming and troubleshooting.

## Preview locally

The demo page renders every block from authored-style markup, with no AEM site needed:

```bash
npx http-server .
# open http://localhost:8080/demo/
```

## Theming

Blocks read the standard boilerplate custom properties (`--link-color`, `--light-color`, `--background-color`, `--body-font-size-s` and so on), so they pick up your site's look automatically. Each block also exposes its own properties, such as `--data-table-accent`, documented in its README.

## Development

```bash
npm install
npm run lint   # ESLint (airbnb-base, like the boilerplate) + Stylelint
npm test       # unit tests in jsdom via node:test
```

Contributions are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md). Planned blocks are listed in [ROADMAP.md](ROADMAP.md).

## License

[MIT](LICENSE)

---

This is an independent community project and is not affiliated with, sponsored by, or endorsed by Adobe. Adobe, Adobe Experience Manager and related marks are trademarks of Adobe Inc.
