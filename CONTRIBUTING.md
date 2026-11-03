# Contributing

Thanks for helping out. A few principles keep this collection easy to use:

1. **One JS file, one CSS file, no dependencies.** A block must work when copied into any Edge Delivery project on its own. If a block needs a library, load it lazily and only when the block is on the page.
2. **Authoring comes first.** Design the table an author fills in before writing code. Keep it short, forgiving, and readable in a document.
3. **Accessible by default.** Prefer native elements (`<details>`, `<input type="range">`, `<button>`) over custom widgets. Test with a keyboard.
4. **Performance budget.** No layout shift, no work in the eager phase, nothing that drops Lighthouse below 100.
5. **Scope all CSS** under the block class (`.my-block ...`) and expose theme hooks as custom properties.

## Adding a block

```
blocks/my-block/
├── my-block.js     # export default function decorate(block)
├── my-block.css
└── README.md       # authoring table, options, variants, styling hooks
```

Then:

- add an example to `demo/index.html`
- add tests to `test/blocks.test.js`
- run `npm run lint` and `npm test`
- add a row to the block table in the main README

## Pull requests

Keep each PR to one block or one fix, and include a screenshot of the demo page.
