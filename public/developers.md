# MegaBrain Market Developer Portal

Last updated: July 7, 2026

The MegaBrain Market Developer Portal is the single entry point for building on MegaBrain Market — the real-time global-intelligence platform that correlates geopolitics, markets, commodities, shipping, aviation, infrastructure, cyber threats, weather, and live news as source-attributed structured JSON. Every developer surface below shares one authentication model and one tool inventory, so you can start with the MCP server and drop down to the REST API or an SDK without relearning anything.

This page names and links every developer resource type. For the machine-readable companion, see [agents.md](https://megabrain.market/agents.md) and the [API llms.txt](https://megabrain.market/api/llms.txt).

## Developer Resources

- **[MegaBrain Market MCP Server](https://megabrain.market/mcp-server.md):** the recommended agent surface — `https://megabrain.market/mcp`, Streamable HTTP, 39 tools. Connect Claude, Cursor, and any MCP-compatible client to live intelligence data. Details: [mcp-server.md](https://megabrain.market/mcp-server.md) · [MCP Overview](https://www.megabrain.market/docs/mcp-overview) · Server card: https://megabrain.market/.well-known/mcp/server-card.json
- **[MegaBrain Market OpenAPI Specification](https://megabrain.market/openapi.md):** the OpenAPI 3.1 contract for the REST API — [openapi.yaml](https://megabrain.market/openapi.yaml) · [openapi.json](https://megabrain.market/openapi.json). Details: [openapi.md](https://megabrain.market/openapi.md)
- **MegaBrain Market REST API:** base `https://api.megabrain.market` — the same tools and data as the MCP server, exposed as granular endpoints over plain HTTP. Machine-readable [API catalog (RFC 9727)](https://megabrain.market/.well-known/api-catalog) · human docs at [/docs/documentation](https://www.megabrain.market/docs/documentation)
- **[MegaBrain Market SDKs](https://megabrain.market/sdks.md):** official zero-dependency client libraries for Python, Ruby, Go, and JavaScript. Details: [sdks.md](https://megabrain.market/sdks.md) · [SDK guide](https://www.megabrain.market/docs/sdks)
- **MegaBrain Market CLI:** `npx megabrain-market tools` scripts every tool from a shell — [npm `megabrain-market`](https://www.npmjs.com/package/megabrain-market) · [CLI guide](https://www.megabrain.market/docs/cli)
- **MegaBrain Market Agent Skills:** installable skills for agent frameworks — discovery index at https://megabrain.market/.well-known/agent-skills/index.json · `npx skills add vinidias/megabrain-market`
- **MegaBrain Market API documentation:** the full developer documentation site at [/docs](https://www.megabrain.market/docs/documentation), including the [MCP Quickstart](https://www.megabrain.market/docs/mcp-quickstart), [tool reference](https://www.megabrain.market/docs/mcp-tools-reference), and [JMESPath projection guide](https://www.megabrain.market/docs/mcp-jmespath).
- **MegaBrain Market authentication:** the agent auth walkthrough at [auth.md](https://megabrain.market/auth.md) — API keys (`X-MegaBrainMarket-Key: wm_<40-hex>`) and OAuth 2.1 (`scope=mcp`) with dynamic client registration.

## Authentication in one line

Discovery endpoints and `tools/list` are public. Data calls need either an API key header `X-MegaBrainMarket-Key: wm_<40-hex>` (issue one at https://megabrain.market/pro) or OAuth 2.1 with scope `mcp`. The full walkthrough — including dynamic client registration and the Pro sign-in flow — lives at [auth.md](https://megabrain.market/auth.md).

## Pricing, limits & support

- **Pricing and plan limits:** [pricing.md](https://megabrain.market/pricing.md) · live JSON catalog `GET https://www.megabrain.market/api/product-catalog`
- **Rate limits:** 60 requests/minute (per key, or per user for OAuth); any OAuth-connected context (Pro *or* API tier) also shares one 50 quota-consuming MCP calls/UTC day counter, while `wm_…`-key MCP clients have no daily reservation. Honor `Retry-After` on 429.
- **Support:** [support.md](https://megabrain.market/support.md) — support@megabrain.market · Status: https://status.megabrain.market
- **Source (AGPL-3.0):** https://github.com/vinidias/megabrain-market · Issues: https://github.com/vinidias/megabrain-market/issues

## Important query matches

- MegaBrain Market developer portal
- MegaBrain Market API for developers
- Build on MegaBrain Market
- MegaBrain Market MCP server, OpenAPI, SDK, and CLI
- How to access MegaBrain Market data programmatically
