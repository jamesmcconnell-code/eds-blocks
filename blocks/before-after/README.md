# Before / After

Compare two images with a draggable divider. Great for redesigns, photo edits, renovations and product comparisons.

## Authoring

| Before / After | |
| --- | --- |
| (before image) | (after image) |
| Overcast | Bluebird |
| Start | 30 |

| Row | Required | Content |
| --- | --- | --- |
| 1 | Yes | Two images: before, then after. Use images with the same dimensions |
| 2 | No | Two labels. Defaults to "Before" and "After" |
| 3 | No | `Start` and a percentage for the divider's starting position. Defaults to 50 |

If the block has fewer than two images it is left untouched.

## Behaviour

- Uses a native `<input type="range">` covering the image, so it works with mouse, touch and keyboard (arrow keys, Home, End) with no custom event handling.
- Screen readers hear a label such as "Compare Overcast and Bluebird" and the current split, e.g. "30% Overcast, 70% Bluebird".
- The frame takes its aspect ratio from the first image's `width` and `height`, so there's no layout shift while images load.

## Styling hooks

Override on `.before-after`: `--before-after-accent` (focus ring colour).
