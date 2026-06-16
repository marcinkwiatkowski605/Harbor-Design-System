# Writing Helpful Error Messages — Reference

Source: https://developers.google.com/tech-writing/error-messages

## Key principles

### The fundamental rule
A good error message answers two questions:
1. **What went wrong?** (cause)
2. **How does the user fix it?** (solution)

A message that doesn't answer both questions → bad message.

### Explaining the problem
- Identify the specific cause of the error, not just the symptom
  - "Error occurred" ❌ — doesn't say what happened
  - "The `color` token value `#ZZZ` is not a valid hex color." ✅
- Point to the invalid user input when that is the cause
  - State what was provided and why it is invalid
- Specify requirements and constraints
  - "Token names must start with a letter and contain only letters, numbers, and hyphens."

### Explaining the solution
- Tell the user exactly what to do
  - "Check the API documentation" ❌
  - "Set `variant` to one of: primary, secondary, ghost, danger." ✅
- Provide an example of a valid value when possible
- Don't make the user guess the solution

### Writing clearly
- **Conciseness**: remove all words that carry no information
  - "An error has occurred in the system" → "The token value is invalid."
- **No double negatives**: "not invalid" → "valid"; "not disabled" → "enabled"
- **Consistent terminology**: use the same names as in the documentation and UI
- **Format**: use lists for complex errors; one line for simple errors
- **Tone**: helpful, not accusatory
  - "You forgot to specify..." ❌
  - "Specify the required `name` prop." ✅
- **No technical jargon** (unless writing for developers)

### Bad error messages — patterns to recognize
- Unspecified cause: "Something went wrong", "Invalid value", "Error"
- No guidance on how to fix: "Authentication failed" (what to do?)
- Imprecise information: "The value is too long" (what is the limit?)
- Confusing language or double negatives
- Unknown next steps: a message that doesn't say what to do next

## Patterns to apply (before → after)

| Before | After |
|---|---|
| "Invalid token value." | "The token `brand.color.primary` has an invalid value `#ZZZ`. Use a valid hex color (e.g., `#0057FF`)." |
| "Error in configuration." | "The `borderRadius` token is missing. Add it to your `tokens.json` file." |
| "Authentication failed." | "Your API key is invalid or expired. Generate a new key at [link]." |
| "The value is not valid." | "The `spacing` value must be a number in pixels (e.g., `16`). Received: `medium`." |
| "You provided wrong input." | "The `size` prop accepts: `sm`, `md`, `lg`. Received: `large`." |

## Patterns to avoid

- Generic: "Error", "Something went wrong", "Invalid input"
- Accusatory: "You forgot to...", "You provided..."
- No solution: error with no guidance on what to do
- Imprecise: missing the value that was provided, missing the expected value
- Double negatives: "not an invalid value"
- Jargon unknown to the reader

## Application in DS

- **Token validation**: "Token `{name}` has value `{value}` which is not a valid {type}. Expected: {format}."
- **Missing props**: "The `{component}` component requires the `{prop}` prop. Add `{prop}=\"{example}\"` to your usage."
- **Invalid variants**: "`{value}` is not a valid variant for `{component}`. Use one of: {list}."
- **TypeScript errors**: type messages should explain the cause and provide the correct structure
- **Deprecated API**: "The `{prop}` prop is deprecated and will be removed in v{version}. Use `{replacement}` instead."
- **Build-time errors (e.g., Style Dictionary)**: include the file, line, token name, and the specific problem
