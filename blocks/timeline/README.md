# Timeline

A sequence of dated events: company history, product roadmaps, project milestones, a personal journey.

## Authoring

| Timeline | |
| --- | --- |
| 2021 | **First AEM project** (heading) Started building enterprise sites. |
| 2024 | **Moved to Edge Delivery** (heading) Rebuilt a classic site with blocks. |
| Q1 2026 | **Open-sourced the block kit** (heading) Published reusable blocks. |

The first cell is the date or label (any text). The second cell can hold headings, text, images and links.

## Variants

| Variant | Effect |
| --- | --- |
| `alternate` | Events zig-zag either side of a centre line on screens 900px and wider |
| `horizontal` | Events sit in a sideways-scrolling row with scroll snapping |
| `no-animation` | Turns off the reveal-on-scroll effect |

## Behaviour

- Renders as an ordered list (`<ol>`), so the sequence is meaningful to assistive tech.
- Events fade up as they scroll into view. This is skipped automatically for visitors who prefer reduced motion, and in browsers without `IntersectionObserver`.

## Styling hooks

Override on `.timeline`: `--timeline-accent`, `--timeline-line`, `--timeline-marker-size`.
