# Pricing Table

Plan cards with an optional Monthly / Annual billing toggle and a highlighted "featured" plan.

## Authoring

Each row is one plan with five cells:

| Pricing Table | | | | |
| --- | --- | --- | --- | --- |
| **Starter** (heading) For personal projects | Free | | • 1 site • Community support | [Get started](/signup) |
| **Pro** (heading) *Most popular* For small teams | $19 | $190 | • 10 sites • Premium blocks • Email support | [Buy Pro](/buy) |

| Cell | Content |
| --- | --- |
| 1. Name | A heading with the plan name, then an optional description. Any *italic* text becomes a badge and marks the plan as featured |
| 2. Monthly price | e.g. `$19`, or text such as `Free` or `Contact us` |
| 3. Annual price | e.g. `$190`. Leave empty if the plan has no annual price |
| 4. Features | A bulleted list (or one feature per paragraph) |
| 5. Call to action | A link; it is styled as a button |

## Behaviour

- The billing toggle only appears when at least one plan has an annual price. Plans without one keep showing their monthly price.
- Period suffixes (`/month`, `/year`) are added only to prices that contain a number, so `Free` and `Contact us` read naturally.
- The featured plan's button uses the `primary` button style; others use `secondary`.
- The toggle is a group of two buttons with `aria-pressed`.

## Styling hooks

Override on `.pricing-table`: `--pricing-border`, `--pricing-accent`, `--pricing-surface`.
