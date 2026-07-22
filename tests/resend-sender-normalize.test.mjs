import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { normalizeResendSender } = require('../scripts/lib/resend-from.cjs');

const silent = () => {};

test('returns null for empty, null, undefined, or whitespace-only input', () => {
  assert.equal(normalizeResendSender(null, 'MegaBrainMarket', silent), null);
  assert.equal(normalizeResendSender(undefined, 'MegaBrainMarket', silent), null);
  assert.equal(normalizeResendSender('', 'MegaBrainMarket', silent), null);
  assert.equal(normalizeResendSender('   ', 'MegaBrainMarket', silent), null);
});

test('passes a properly wrapped sender through unchanged', () => {
  assert.equal(
    normalizeResendSender('MegaBrainMarket <alerts@megabrain.market>', 'Default', silent),
    'MegaBrainMarket <alerts@megabrain.market>',
  );
  assert.equal(
    normalizeResendSender('MegaBrainMarket Brief <brief@megabrain.market>', 'Default', silent),
    'MegaBrainMarket Brief <brief@megabrain.market>',
  );
});

test('trims surrounding whitespace before returning a wrapped sender', () => {
  assert.equal(
    normalizeResendSender('  MegaBrainMarket Brief <brief@megabrain.market>  ', 'Default', silent),
    'MegaBrainMarket Brief <brief@megabrain.market>',
  );
});

test('wraps a bare email address with the supplied default display name', () => {
  assert.equal(
    normalizeResendSender('brief@megabrain.market', 'MegaBrainMarket Brief', silent),
    'MegaBrainMarket Brief <brief@megabrain.market>',
  );
  assert.equal(
    normalizeResendSender('alerts@megabrain.market', 'MegaBrainMarket Alerts', silent),
    'MegaBrainMarket Alerts <alerts@megabrain.market>',
  );
});

test('emits exactly one warning when coercing a bare address', () => {
  const warnings = [];
  normalizeResendSender('brief@megabrain.market', 'MegaBrainMarket Brief', (m) => warnings.push(m));
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /lacks display name/);
  assert.match(warnings[0], /MegaBrainMarket Brief <brief@megabrain-market\.app>/);
});

test('does not warn when the value already has a display-name wrapper', () => {
  const warnings = [];
  normalizeResendSender(
    'MegaBrainMarket Brief <brief@megabrain.market>',
    'Default',
    (m) => warnings.push(m),
  );
  assert.equal(warnings.length, 0);
});

test('defaults to console.warn when no warning sink is supplied', () => {
  const original = console.warn;
  const captured = [];
  console.warn = (m) => captured.push(m);
  try {
    normalizeResendSender('bare@example.com', 'Name');
    assert.equal(captured.length, 1);
    assert.match(captured[0], /lacks display name/);
  } finally {
    console.warn = original;
  }
});
