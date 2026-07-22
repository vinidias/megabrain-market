import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  API_KEY_HEADER,
  USER_AGENT,
  VERSION,
  parseArgs,
  planRequest,
} from '../cli/src/core.mjs';
import { run } from '../cli/src/run.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLI_DIR = join(ROOT, 'cli');
const pkg = JSON.parse(readFileSync(join(CLI_DIR, 'package.json'), 'utf-8'));

// Guards the published `megabrain-market` CLI package (orank Access "CLI tool
// available" gap). The CLI ships from cli/ and is advertised in llms.txt, so
// these assertions stop the package wiring, its User-Agent (a Cloudflare-WAF
// workaround), and the llms.txt advertisement from silently drifting apart.
describe('megabrain-market CLI package wiring', () => {
  it('is the public unscoped `megabrain-market` npm package', () => {
    assert.equal(pkg.name, 'megabrain-market');
    assert.equal(pkg.type, 'module');
    assert.equal(pkg.publishConfig?.access, 'public');
    assert.match(pkg.license, /^MIT$/);
  });

  it('exposes the megabrain-market bin pointing at the shipped entry', () => {
    assert.equal(pkg.bin?.megabrain-market, 'bin/megabrain-market.mjs');
    const bin = readFileSync(join(CLI_DIR, pkg.bin.megabrain-market), 'utf-8');
    assert.match(bin, /^#!\/usr\/bin\/env node/);
    assert.match(bin, /from '\.\.\/src\/run\.mjs'/);
  });

  it('ships the bin and src directories', () => {
    for (const entry of ['bin/', 'src/']) assert.ok(pkg.files.includes(entry), `files must include ${entry}`);
  });

  it('keeps VERSION in sync with package.json (drift guard)', () => {
    assert.equal(VERSION, pkg.version);
  });
});

describe('megabrain-market CLI request construction', () => {
  it('maps a curated command to the right MCP tool call', () => {
    const rpc = JSON.parse(planRequest(parseArgs(['risk', 'IR', '--api-key', 'wm_k'])).body);
    assert.equal(rpc.method, 'tools/call');
    assert.deepEqual(rpc.params, { name: 'get_country_risk', arguments: { country_code: 'IR' } });
  });

  it('always sends the CLI User-Agent (Cloudflare WAF passes it, not `node`)', () => {
    const plan = planRequest(parseArgs(['tools']));
    assert.equal(plan.headers['user-agent'], USER_AGENT);
    assert.match(USER_AGENT, /^megabrain-market-cli\//);
  });

  it('injects the API key header from the environment', () => {
    const plan = planRequest(parseArgs(['world']), { apiKey: 'wm_env' });
    assert.equal(plan.headers[API_KEY_HEADER], 'wm_env');
  });
});

describe('megabrain-market CLI run() with a mocked transport', () => {
  function stubFetch(body) {
    const calls = [];
    const fetchImpl = async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        text: async () => body,
      };
    };
    return { fetchImpl, calls };
  }

  it('unwraps an MCP result and exits 0', async () => {
    let out = '';
    const { fetchImpl, calls } = stubFetch(JSON.stringify({ jsonrpc: '2.0', id: 1, result: { ok: true } }));
    const code = await run(['risk', 'US', '--api-key', 'wm_k'], {
      fetch: fetchImpl,
      env: {},
      stdout: (s) => {
        out += s;
      },
      stderr: () => {},
    });
    assert.equal(code, 0);
    assert.equal(calls[0].init.headers[API_KEY_HEADER], 'wm_k');
    assert.deepEqual(JSON.parse(out), { ok: true });
  });
});

describe('llms.txt advertises the CLI', () => {
  const llms = readFileSync(join(ROOT, 'public/llms.txt'), 'utf-8');

  it('references the npm package so the discovery entry is not dropped', () => {
    assert.match(llms, /megabrain-market/);
    assert.match(llms, /npm|npx/i, 'llms.txt should mention how to install/run the CLI');
  });
});
