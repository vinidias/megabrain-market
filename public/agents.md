# MegaBrain Market — Agent Guide

> How AI agents should work with megabrain.market: machine surfaces, authentication, crawl policy, rate limits, and discovery endpoints. Prefer the structured surfaces below over scraping the HTML dashboard — the dashboard is a WebGL SPA and yields nothing useful to a text parser.

MegaBrain Market is a real-time global intelligence dashboard: 500+ news feeds, 56 map layer types, country risk/resilience scores, AI briefs, forecasts, and market/supply-chain correlation, served as machine-readable JSON with documented methodology and provenance.

## Machine surfaces (use these)

- **MCP server (recommended):** `https://megabrain.market/mcp` — Streamable HTTP, 40 tools; issue `tools/list` for the live inventory. Server card: https://megabrain.market/.well-known/mcp/server-card.json
- **Docs MCP server:** `https://www.megabrain.market/docs/mcp` — Streamable HTTP, public (no auth); search-and-retrieval tools over the documentation. Use it for "how do I…" questions; use the product MCP above for live data.
- **REST API:** base `https://api.megabrain.market` — OpenAPI spec: https://megabrain.market/openapi.yaml (JSON: /openapi.json) · API catalog: https://megabrain.market/.well-known/api-catalog
- **NLWeb:** `POST https://www.megabrain.market/ask` (supports SSE) for natural-language questions; machine-readable dashboard view at `https://www.megabrain.market/?mode=agent`
- **Agent Skills:** discovery index at https://megabrain.market/.well-known/agent-skills/index.json · install via `npx skills add vinidias/megabrain-market` (https://skills.sh/vinidias/megabrain-market)
- **CLI:** `npx megabrain-market tools` lists every tool (public, no key) — https://www.npmjs.com/package/megabrain-market
- **SDKs:** Python `pip install megabrain-market-sdk` · Ruby `gem install megabrain-market` · Go `go get github.com/vinidias/megabrain-market/sdk/go` · JavaScript npm `megabrain-market` — guide: https://www.megabrain.market/docs/sdks
- **LLM briefings:** https://megabrain.market/llms.txt (overview) · https://megabrain.market/llms-full.txt (full reference) · https://megabrain.market/api/llms.txt (API section)
- **Developer portal:** https://megabrain.market/developers.md — links every developer resource by name. Named resource pages: [MCP Server](https://megabrain.market/mcp-server.md) · [OpenAPI Specification](https://megabrain.market/openapi.md) · [SDKs](https://megabrain.market/sdks.md)

## Authentication

- **Anonymous** works for discovery endpoints, `tools/list`, and public data (world brief, product catalog, story pages).
- **API key:** header `X-MegaBrainMarket-Key: wm_<40-hex>` for REST and MCP data calls — issue one at https://megabrain.market/pro. Full agent walkthrough: https://megabrain.market/auth.md
- **OAuth2** for MCP (`scope=mcp`), with dynamic client registration at `/oauth/register`. Details in auth.md.

## Crawl & content-usage policy

- **robots.txt** (https://www.megabrain.market/robots.txt): AI search/assistant agents (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, DuckAssistBot, MistralAI-User) are explicitly allowed; bulk training-only scrapers (CCBot, Bytespider, anthropic-ai) are disallowed. `/api/` is off-limits to crawlers except the allowlisted story/OG/llms.txt/product-catalog routes.
- **Content-Signal:** `ai-train=no, search=yes, ai-input=yes` — declared as a robots.txt group directive and as an origin-wide HTTP response header. Search indexing and assistant grounding/citation are welcome; bulk model training is opted out.
- **User-Agent:** always send a descriptive `User-Agent` (e.g. `mytool/1.0 (+https://yoursite.example)`). Default HTTP-library UAs (`curl/*`, `python-requests/*`, empty strings) may get a 403 from the edge firewall — a 403 does NOT mean the endpoint is missing; retry with a real UA.

## Rate limits & plans

- Machine-readable pricing and plan limits: https://megabrain.market/pricing.md · live JSON catalog: `GET https://www.megabrain.market/api/product-catalog` (public, no key)
- Rate-limit documentation: https://www.megabrain.market/docs/usage-rate-limits.md · auth matrix: https://www.megabrain.market/docs/usage-auth
- Plan-limit responses include upgrade guidance; back off on 429 and honor `Retry-After`.

## Support & escalation

- https://megabrain.market/support.md — support@megabrain.market (general) · enterprise@megabrain.market (sales)
- Status: https://status.megabrain.market · Issues: https://github.com/vinidias/megabrain-market/issues
- Source (AGPL-3.0): https://github.com/vinidias/megabrain-market
