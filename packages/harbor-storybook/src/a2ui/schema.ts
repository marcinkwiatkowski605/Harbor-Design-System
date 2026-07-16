// A2UI PoC — shared constants, the JSON schema handed to `claude --json-schema`,
// and the envelope builder that wraps Claude's output into A2UI v0.9 messages.
//
// Reconcile the message field names against src/a2ui/API-NOTES.md (Task 2). If
// the installed @a2ui/web_core uses different keys, update these three objects.

export const CATALOG_ID = 'https://harbor.design/a2ui/catalog/v1.json';
export const SURFACE_ID = 'a2ui-playground';

/** The four component names the agent may use. Keep in sync with catalog.tsx. */
export const CATALOG_COMPONENTS = ['Stack', 'Text', 'Button', 'TextField'] as const;

export interface ComponentNode {
  id: string;
  component: (typeof CATALOG_COMPONENTS)[number];
  children?: string[];
  // Component-specific props (label, variant, text, placeholder, ...) live here.
  [prop: string]: unknown;
}

export interface GeneratedUI {
  components: ComponentNode[];
  dataModel?: Record<string, unknown>;
}

export interface A2UIMessage {
  version: 'v0.9';
  createSurface?: { surfaceId: string; catalogId: string };
  updateComponents?: { surfaceId: string; components: ComponentNode[] };
  updateDataModel?: { surfaceId: string; path: string; value: Record<string, unknown> };
}

/** Wrap Claude's `{ components, dataModel }` into the standard 3-message sequence. */
export function buildMessages(generated: GeneratedUI): A2UIMessage[] {
  return [
    { version: 'v0.9', createSurface: { surfaceId: SURFACE_ID, catalogId: CATALOG_ID } },
    {
      version: 'v0.9',
      updateComponents: { surfaceId: SURFACE_ID, components: generated.components },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: SURFACE_ID,
        path: '/',
        value: generated.dataModel ?? {},
      },
    },
  ];
}

/**
 * JSON Schema passed to `claude --json-schema`. Constrains `component` to the
 * catalog enum (blocks invented component types) and allows per-component props
 * as free-form keys (invented *props* are filtered later by each wrapper's Zod
 * schema at render time). `text` bindings use A2UI's `{ path }` form.
 */
export const GENERATION_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['components'],
  properties: {
    components: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'component'],
        properties: {
          id: { type: 'string' },
          component: { type: 'string', enum: [...CATALOG_COMPONENTS] },
          children: { type: 'array', items: { type: 'string' } },
          label: { type: 'string' },
          variant: { type: 'string', enum: ['primary', 'secondary', 'outline'] },
          placeholder: { type: 'string' },
          description: { type: 'string' },
          text: {
            type: 'object',
            properties: { path: { type: 'string' } },
          },
        },
        additionalProperties: true,
      },
    },
    dataModel: { type: 'object', additionalProperties: true },
  },
} as const;
