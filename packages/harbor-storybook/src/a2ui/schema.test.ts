import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMessages, CATALOG_ID, SURFACE_ID } from './schema.ts';

test('buildMessages wraps generated UI into three A2UI v0.9 messages', () => {
  const generated = {
    components: [
      { id: 'root', component: 'Stack', children: ['title', 'submit'] },
      { id: 'title', component: 'Text', text: { path: '/title' } },
      { id: 'submit', component: 'Button', label: 'Send', variant: 'primary' },
    ],
    dataModel: { title: 'Hello' },
  };

  const msgs = buildMessages(generated);

  assert.equal(msgs.length, 3);
  assert.deepEqual(msgs[0], {
    version: 'v0.9',
    createSurface: { surfaceId: SURFACE_ID, catalogId: CATALOG_ID },
  });
  assert.deepEqual(msgs[1], {
    version: 'v0.9',
    updateComponents: { surfaceId: SURFACE_ID, components: generated.components },
  });
  assert.deepEqual(msgs[2], {
    version: 'v0.9',
    updateDataModel: { surfaceId: SURFACE_ID, path: '/', value: { title: 'Hello' } },
  });
});

test('buildMessages defaults an empty data model', () => {
  const msgs = buildMessages({ components: [] });
  assert.deepEqual(msgs[2].updateDataModel.value, {});
});
