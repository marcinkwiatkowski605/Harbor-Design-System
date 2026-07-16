import { execFile } from 'node:child_process';
import type { Plugin } from 'vite';
// Import from source; Storybook's Vite resolves TS.
import { GENERATION_JSON_SCHEMA } from '../src/a2ui/schema';
import { A2UI_SYSTEM_PROMPT } from '../src/a2ui/systemPrompt';

/**
 * Dev-only Vite plugin. Exposes POST /api/a2ui-generate. Body: { prompt }.
 * Shells out to the Claude Code CLI in headless mode and returns the
 * schema-constrained { components, dataModel } object as JSON.
 *
 * NOT available in the built static Storybook (no dev server → no `claude`).
 */
export function a2uiMiddleware(): Plugin {
  return {
    name: 'harbor-a2ui-middleware',
    configureServer(server) {
      server.middlewares.use('/api/a2ui-generate', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          let prompt = '';
          try {
            prompt = String(JSON.parse(body).prompt ?? '');
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
          }
          if (!prompt.trim()) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Empty prompt' }));
            return;
          }

          const args = [
            '-p',
            prompt,
            '--output-format',
            'json',
            '--json-schema',
            JSON.stringify(GENERATION_JSON_SCHEMA),
            '--append-system-prompt',
            A2UI_SYSTEM_PROMPT,
            '--model',
            'sonnet',
          ];

          // 60s cap; large maxBuffer for the verbose JSON envelope.
          execFile(
            'claude',
            args,
            { timeout: 60_000, maxBuffer: 10 * 1024 * 1024 },
            (err, stdout, stderr) => {
              if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'claude CLI failed', detail: String(stderr || err) }));
                return;
              }
              try {
                const envelope = JSON.parse(stdout);
                // Verified envelope shape: `structured_output` is the parsed,
                // schema-conforming object. Fall back to parsing `result`.
                const generated =
                  envelope.structured_output ??
                  JSON.parse(envelope.result ?? '{}');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ generated }));
              } catch (parseErr) {
                res.statusCode = 500;
                res.end(
                  JSON.stringify({ error: 'Could not parse claude output', detail: String(parseErr) }),
                );
              }
            },
          );
        });
      });
    },
  };
}
