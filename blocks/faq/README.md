# FAQ

An accessible accordion of questions and answers that also outputs `FAQPage` structured data (JSON-LD).

## Authoring

| FAQ | |
| --- | --- |
| What is Edge Delivery Services? | A way to build very fast websites where authors write in documents. |
| Do these blocks need dependencies? | No. Each block is one JS file and one CSS file. |

Answers can contain any formatting: paragraphs, lists, links, images.

## Variants

| Variant | Effect |
| --- | --- |
| `exclusive` | Opening one answer closes the others |
| `open-first` | The first answer starts open |
| `no-schema` | Don't output structured data |

Combine them: `FAQ (exclusive, open-first)`.

## Structured data

The block adds a single `<script type="application/ld+json">` to the page. If a page has several FAQ blocks, their questions are merged into that one script, so the page always has one valid `FAQPage`.

A note on expectations: since 2023 Google shows FAQ rich results mainly for well-known government and health sites. The markup is still valid, still read by other search engines and AI answer tools, and costs nothing to include. Use `no-schema` if you'd rather leave it out.

## Accessibility

Built on native `<details>` and `<summary>`, so it works with keyboards and screen readers without extra ARIA, and content stays findable with the browser's find-in-page.

## Styling hooks

Override on `.faq`: `--faq-border`, `--faq-accent`.
