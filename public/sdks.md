# MegaBrain Market SDKs

Last updated: July 7, 2026

MegaBrain Market ships official client libraries in four language ecosystems so you can script country briefs, risk scores, market data, and every one of the 39 [MCP tools](https://megabrain.market/mcp-server.md) without writing an HTTP integration. All of them are **zero-dependency**, MCP-first mirrors of the [`megabrain-market` npm CLI](https://www.megabrain.market/docs/cli), with a small REST escape hatch for host-relative and self-hosted use.

## Official SDKs

| Language | Package | Install | Source |
| --- | --- | --- | --- |
| Python | [`megabrain-market-sdk` on PyPI](https://pypi.org/project/megabrain-market-sdk/) | `pip install megabrain-market-sdk` | [`sdk/python/`](https://github.com/vinidias/megabrain-market/tree/main/sdk/python) |
| Ruby | [`megabrain-market` on RubyGems](https://rubygems.org/gems/megabrain-market) | `gem install megabrain-market` | [`sdk/ruby/`](https://github.com/vinidias/megabrain-market/tree/main/sdk/ruby) |
| Go | [`github.com/vinidias/megabrain-market/sdk/go` on pkg.go.dev](https://pkg.go.dev/github.com/vinidias/megabrain-market/sdk/go) | `go get github.com/vinidias/megabrain-market/sdk/go` | [`sdk/go/`](https://github.com/vinidias/megabrain-market/tree/main/sdk/go) |
| JavaScript / CLI | [`megabrain-market` on npm](https://www.npmjs.com/package/megabrain-market) | `npm install megabrain-market` | [`cli/`](https://github.com/vinidias/megabrain-market/tree/main/cli) |

Every package sets its homepage to `megabrain.market` — that is how you (or your agent) verify it is the official SDK and not a look-alike.

## Shared design

All four clients expose the same surface with language-native naming:

- **Any MCP tool** via `call_tool` / `CallTool` with named arguments; the result is the unwrapped JSON-RPC `result`.
- **Curated helpers** for the highest-traffic tools: world brief, country brief/risk, markets, conflicts, cyber, news, disasters, sanctions, forecasts, maritime.
- **Public listings** — `list_tools`, `list_prompts`, `list_resources` — need no key.
- **REST escape hatch** — `get("/api/…")` and `health()` against `https://api.megabrain.market`.
- **Configuration** via constructor arguments or the `MEGABRAIN_MARKET_API_KEY` (alias `WM_API_KEY`), `MEGABRAIN_MARKET_BASE_URL`, and `MEGABRAIN_MARKET_MCP_URL` environment variables.
- Every tool accepts an optional `jmespath` argument for [server-side projection](https://www.megabrain.market/docs/mcp-jmespath) — typically an 80–95% response-size cut.

## Quick start (Python)

```python
from megabrain-market_sdk import Client

client = Client(api_key="wm_...")  # or set MEGABRAIN_MARKET_API_KEY
client.list_tools()                # public — no key needed
client.country_risk("IR")
client.call_tool("get_market_data", asset_class="crypto")
```

Get an API key at https://megabrain.market/pro. The full per-language guide — Ruby, Go, and JavaScript examples included — is at https://www.megabrain.market/docs/sdks.

## Learn more

- [Developer Portal](https://megabrain.market/developers.md) · [MCP Server](https://megabrain.market/mcp-server.md) · [OpenAPI Specification](https://megabrain.market/openapi.md) · [CLI guide](https://www.megabrain.market/docs/cli) · [agents.md](https://megabrain.market/agents.md)

## Important query matches

- MegaBrain Market SDK
- MegaBrain Market Python / Ruby / Go / JavaScript SDK
- MegaBrain Market client library
- pip install megabrain-market-sdk
- Official MegaBrain Market API client libraries
