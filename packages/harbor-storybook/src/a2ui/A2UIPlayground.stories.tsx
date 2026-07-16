// A2UI PoC — interactive Playground story.
//
// Lets a Storybook viewer type a prompt, sends it to the dev-only
// `/api/a2ui-generate` middleware (Task 6/7, shells out to the local `claude`
// CLI), and renders the returned component tree through the real
// `MessageProcessor` / `A2uiSurface` pipeline against `harborCatalog`
// (Task 5). See src/a2ui/API-NOTES.md for the verified API this file adapts
// to — imports, constructor signatures, and `A2uiSurface`'s single `surface`
// prop all follow the "End-to-end example" and "Canonical wiring" snippets
// there, not the plan's draft verbatim (the draft matched, once reconciled).
import { useState, useEffect, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MessageProcessor, type A2uiMessage, type SurfaceModel } from '@a2ui/web_core/v0_9';
import { A2uiSurface, type ReactComponentImplementation } from '@a2ui/react/v0_9';
import { harborCatalog } from './catalog';
import { buildMessages, type GeneratedUI } from './schema';

function Playground() {
  const [prompt, setPrompt] = useState('a contact form with a name field and a submit button');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processor] = useState(() => new MessageProcessor([harborCatalog]));
  const [surfaces, setSurfaces] = useState<SurfaceModel<ReactComponentImplementation>[]>([]);

  useEffect(() => {
    const sync = () => setSurfaces(Array.from(processor.model.surfacesMap.values()));
    const created = processor.onSurfaceCreated(sync);
    const deleted = processor.onSurfaceDeleted(sync);
    return () => {
      created.unsubscribe();
      deleted.unsubscribe();
    };
  }, [processor]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/a2ui-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');
      const generated = data.generated as GeneratedUI;
      // schema.ts's `A2UIMessage` is a deliberately loose builder-side type (all
      // three message-kind fields optional, so `buildMessages` can return a
      // uniform array); the library's `A2uiMessage` is the exact zod-inferred
      // discriminated union. The values buildMessages produces conform to that
      // union at runtime (each element sets exactly one of createSurface /
      // updateComponents / updateDataModel, matching API-NOTES.md §6) — the cast
      // just bridges the two static shapes.
      processor.processMessages(buildMessages(generated) as A2uiMessage[]);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }, [prompt, processor]);

  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          minHeight: 120,
          padding: 24,
          border: '1px dashed #ccc',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {surfaces.length === 0 && <em style={{ color: '#888' }}>Generated UI will appear here.</em>}
        {surfaces.map((s) => (
          <A2uiSurface key={s.id} surface={s} />
        ))}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="Describe the UI you want…"
        style={{ padding: 8, fontFamily: 'inherit' }}
      />
      <button onClick={generate} disabled={loading} style={{ alignSelf: 'flex-start', padding: '8px 16px' }}>
        {loading ? 'Generating… (~3s)' : 'Generate UI'}
      </button>
      {error && <div style={{ color: 'crimson' }}>Error: {error}</div>}
      <p style={{ fontSize: 12, color: '#888' }}>
        Dev-only: requires <code>npm run storybook</code> (calls the local <code>claude</code> CLI).
        Does not work in the published static Storybook.
      </p>
    </div>
  );
}

const meta: Meta<typeof Playground> = {
  title: 'Experimental/A2UI Playground',
  component: Playground,
  parameters: { layout: 'padded' },
};
export default meta;

export const Default: StoryObj<typeof Playground> = {};
