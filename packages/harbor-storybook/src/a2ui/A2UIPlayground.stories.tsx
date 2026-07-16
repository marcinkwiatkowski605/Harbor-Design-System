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
import { buildMessages, SURFACE_ID, type GeneratedUI } from './schema';

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
      if (!res.ok) {
        // The middleware's `detail` carries the actual `claude` CLI stderr or
        // parse exception — the most useful debugging info for a PoC. Surface
        // it instead of discarding it.
        throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error ?? 'Generation failed'));
      }
      const generated = data.generated as GeneratedUI;
      // buildMessages() always emits a createSurface for the fixed SURFACE_ID.
      // MessageProcessor.processCreateSurfaceMessage throws
      // A2uiStateError(`Surface ${SURFACE_ID} already exists.`) if that surface
      // is still registered (see
      // node_modules/@a2ui/web_core/src/v0_9/processing/message-processor.js),
      // and processMessages() processes messages in order and stops at the
      // first throw — so every generation after the first would fail before
      // its updateComponents/updateDataModel ever ran. Delete the previous
      // surface (if any) first so createSurface can succeed again.
      if (processor.model.getSurface(SURFACE_ID)) {
        processor.processMessages([{ version: 'v0.9', deleteSurface: { surfaceId: SURFACE_ID } }]);
      }
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

  // This chrome sits around the generated surface (which itself renders through real
  // tokened Harbor components via harborCatalog) — per docs/foundations/dimensions.md
  // and color.md, its spacing/border/text values below reference the same real
  // `--ds-semantic-*` tokens rather than hardcoded placeholders, even though the box
  // itself isn't a cataloged Harbor component.
  return (
    <div
      style={{
        maxWidth: 640,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-semantic-spacing-stack-lg)',
      }}
    >
      <div
        style={{
          minHeight: 120,
          padding: 'var(--ds-semantic-spacing-inset-xl)',
          border: 'var(--ds-semantic-border-width-sm) dashed var(--ds-semantic-color-border)',
          borderRadius: 'var(--ds-semantic-border-radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-semantic-spacing-stack-lg)',
        }}
      >
        {surfaces.length === 0 && (
          <em style={{ color: 'var(--ds-semantic-color-content-secondary)' }}>
            Generated UI will appear here.
          </em>
        )}
        {surfaces.map((s) => (
          <A2uiSurface key={s.id} surface={s} />
        ))}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="Describe the UI you want…"
        aria-label="Describe the UI you want"
        style={{ padding: 'var(--ds-semantic-spacing-inset-sm)', fontFamily: 'inherit' }}
      />
      <button
        onClick={generate}
        disabled={loading}
        style={{
          alignSelf: 'flex-start',
          padding: 'var(--ds-semantic-spacing-inset-sm) var(--ds-semantic-spacing-inset-lg)',
        }}
      >
        {loading ? 'Generating… (~3s)' : 'Generate UI'}
      </button>
      {error && <div style={{ color: 'var(--ds-semantic-color-content-error)' }}>Error: {error}</div>}
      <p
        style={{
          fontFamily: 'var(--ds-semantic-typography-body-sm-font-family)',
          fontSize: 'var(--ds-semantic-typography-body-sm-font-size)',
          lineHeight: 'var(--ds-semantic-typography-body-sm-line-height)',
          color: 'var(--ds-semantic-color-content-secondary)',
        }}
      >
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
