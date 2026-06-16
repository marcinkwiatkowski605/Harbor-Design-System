# Tech Writing for Accessibility — Reference

Source: https://developers.google.com/tech-writing/accessibility

## Key principles

### Design for everyone
- Accessible documentation = readable and understandable by everyone, including people using screen readers
- Accessibility principles apply to: design docs, code comments, UI text, CLI help, error messages — not just formal documentation
- Check: is the content understandable without color? without images? using text alone?

### Alt text for images and diagrams
- Every informational image requires alt text
- Alt text describes the *content and purpose* of the image, not its appearance ("A diagram showing the token hierarchy from primitive to semantic to component-level" not "A colorful diagram")
- For complex technical diagrams: alt text + full text description in the document body
- Decorative images: empty alt (`alt=""`) or omit — screen readers will skip them
- Alt text length: as long as needed, but concise; long descriptions → move to page body

### Color contrast
- Text on background: min. 4.5:1 (normal size), 3:1 (large text)
- Don't convey information through color alone (e.g., "red = error" without an icon or text label)
- Diagrams: choose colorblind-friendly palettes or add patterns/shapes as a second information channel

### Inclusive language
- Avoid terms with a history of exclusion (whitelist/blacklist → allowlist/denylist)
- Avoid terms that demean ability ("simple", "easy", "just", "obviously")
- Avoid cultural assumptions and idioms
- Write in second person ("you") — gender-neutral and direct
- Code examples: use descriptive, culturally neutral variable names

### Accessible visuals
- Diagrams: add a text alternative in the document body (not just alt text)
- Table structure: always use column headers (`<th>`); avoid tables for layout
- Don't rely solely on position/spatial layout to convey meaning
- Provide a text version of diagram content (e.g., as a list or descriptive text below the diagram)

### Editing for accessibility
- Check: does every image have alt text?
- Check: does information conveyed by color also have a text equivalent?
- Check: is the language inclusive (no "simple", "easy", "obviously")?
- Check: do headings form a logical hierarchy (H1 → H2 → H3)?
- Check: do links have descriptive text ("See the Button API" not "Click here")?

## Patterns to apply (before → after)

| Before | After |
|---|---|
| "whitelist / blacklist" | "allowlist / denylist" |
| "simple configuration" | "configuration" |
| "just add the token" | "add the token" |
| "obviously, use Button for..." | "use Button for..." |
| Link: "Click here" | Link: "See Button component API" |
| Alt: "image.png" | Alt: "Diagram showing Button variants: primary, secondary, ghost" |

## Patterns to avoid

- Images without alt text
- Information conveyed by color alone
- "simple", "easy", "just", "obviously" — assume the reader already knows
- "Click here", "Read more" — non-descriptive link text
- Tables used for layout instead of data
- Idioms and cultural metaphors

## Application in DS

- **Every token/component diagram**: alt text + text equivalent below the diagram
- **Color examples**: always include the hex/token value alongside the color swatch
- **Token status (deprecated, experimental)**: mark with text, not color alone
- **Links to Storybook/sandbox**: descriptive text ("Open Button in Storybook") not "here"
- **Component accessibility section**: describe how the component behaves with a screen reader, which ARIA roles/attributes it exposes
- **Avoid in descriptions**: "easy to use", "simply pass", "obviously", "just set"
