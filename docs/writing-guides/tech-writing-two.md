# Tech Writing Two — Reference

Source: https://developers.google.com/tech-writing/two

## Key principles

### Self-editing
- Adopt and follow a single style guide (e.g., Google Developer Documentation Style Guide)
- Write in the second person: address the reader as "you", not "we" or "one"
- Conditions before instructions: "If you want X, do Y" (not: "Do Y if you want X")
- Before submitting a document: wait, return with fresh eyes, read it aloud
- Changing format (print, different font) helps catch errors invisible on screen
- Peer review: the reviewer doesn't need to know the subject, just the style guide

### Large documents
- Short documents work better for new audiences (how-to, overview, conceptual guide)
- Long documents work better for experienced readers (tutorials, best practices, reference)
- Document introduction must include: (1) what the document covers, (2) required prior knowledge, (3) what the document does NOT cover
- Verify at the end of writing that the content matches what the introduction promises
- Headings: describe reader activity ("Configure the token pipeline") not terminology ("Token pipeline configuration")
- Place a short context sentence under each heading before any subheading appears
- Content: progressive disclosure — simple to complex; alternate concepts with exercises

### Illustrations and diagrams
- Only *instructive* graphics help readers learn; decorative graphics do not
- Diagram caption: short (a few words), explains what the reader should take away
- Max. one unit of information (≈one paragraph or ≤5 bullet points) per diagram
- Complex systems: break into subsystems, one diagram per subsystem
- Visual cues (circles, arrows, callouts) direct attention better than long text
- Colors: ensure sufficient contrast; don't convey information through color alone
- Export format: SVG (scalable, high quality)
- Revision questions: How to simplify? Should it be split? Is text readable against the background?

### Sample code
- Good sample code is: **correct, concise, understandable, reusable, sequenced by complexity**
- Correctness: must build without errors, do what it claims, be production-ready (no vulnerabilities)
- Comments: explain *why*, not *what*; skip the obvious; for advanced readers explain unexpected design decisions
- Identifiers: descriptive names for classes, methods, variables; no cryptic abbreviations
- Sequence: start with the simplest example → intermediate → advanced
- Every code example: include setup instructions, dependencies, expected output
- Unit tests ≠ sample code: tests verify behavior, examples educate

### Using LLMs in documentation writing
- Give the LLM a role: "You are an experienced technical writer writing design system documentation"
- Specify audience, document type, goal, and style before generating
- Constrain scope: "Only use information from the following text:"
- Iterate: refine the prompt incrementally; when editing the response is faster than refining the prompt — just edit
- Always verify generated content for errors and inconsistencies
- LLMs are useful for: first draft, reorganization, copy-editing, format conversion, summaries

## Patterns to apply

| Before | After |
|---|---|
| "We recommend configuring..." | "Configure the token..." |
| "Click Submit if you want to save." | "To save, click Submit." |
| Heading: "Token Pipeline" | Heading: "Configure the token pipeline" |
| One large diagram of the entire system | Separate diagrams: tokens → components → themes |

## Patterns to avoid

- Addressing the reader as "we" or "one"
- Condition after instruction: "Do X if you want Y"
- Subheading directly under a heading without a context sentence
- Sample code that doesn't compile or doesn't do what it claims
- Comments explaining obvious things ("// set x to 5")
- Decorative graphics with no informational value

## Application in DS

- **Component page structure**: introduction (what it is, when to use, what it does NOT do) → props → variants → sample code (basic → with options → advanced)
- **Token/component sample code**: imports, setup, expected output — always complete and working
- **Token relationship diagrams**: one diagram per level (primitive → semantic → component)
- **Section headings**: describe what the reader does ("Use the Button component") not what it is ("Button component")
- **LLM for drafts**: provide the existing component as context + role "DS technical writer"
