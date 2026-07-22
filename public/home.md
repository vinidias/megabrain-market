# MegaBrain Market — By the time it's news, you already knew.

Free real-time global intelligence dashboard. MegaBrain Market streams the world's raw signals — ships, jets, sirens, cables, markets — onto one live map, with AI that flags when they converge into something that matters.

Open-source (AGPL-3.0), used by 2M+ people across 190+ countries, as featured in WIRED. Runs as a web app, installable PWA, and native desktop app for macOS, Windows, and Linux. No signup required.

## What you get

- Real-time global map with 56 data layers and 500+ curated news feeds
- Country Instability Index across 196 countries, live conflict tracking
- Market quotes, sector heatmaps, and macro indicators
- 13 shipping chokepoints with live AIS vessel-transit intelligence
- Satellite tracking, GPS jamming zones, submarine cables, AI datacenters
- Daily AI brief, Scenario Engine, custom monitors and breaking alerts
- 39-tool MCP server so AI agents can query everything above

## Live instances

- [MegaBrain Market](https://www.megabrain.market/dashboard) — geopolitics, military, conflicts, infrastructure
- [Tech Monitor](https://tech.megabrain.market/dashboard) — startups, AI/ML, cloud, cybersecurity
- [Finance Monitor](https://finance.megabrain.market/dashboard) — global markets, trading, central banks
- [Commodity Monitor](https://commodity.megabrain.market/dashboard) — mining, metals, energy, supply chains
- [Happy Monitor](https://happy.megabrain.market/dashboard) — positive news, breakthroughs, conservation
- [Energy Monitor](https://energy.megabrain.market/dashboard) — power grids, LNG, renewables

## For AI agents

- **MCP server:** `https://megabrain.market/mcp` (Streamable HTTP) — server card at [/.well-known/mcp/server-card.json](https://megabrain.market/.well-known/mcp/server-card.json)
- **A2A:** agent card at [/.well-known/agent-card.json](https://megabrain.market/.well-known/agent-card.json) — JSON-RPC endpoint at `https://www.megabrain.market/a2a`
- **REST API:** base `https://api.megabrain.market` — OpenAPI spec at [/openapi.json](https://megabrain.market/openapi.json)
- **Agent guidance:** [/llms.txt](https://megabrain.market/llms.txt) · skills at [/.well-known/agent-skills/index.json](https://megabrain.market/.well-known/agent-skills/index.json)
- **CLI:** `npx megabrain-market tools` — [npm package](https://www.npmjs.com/package/megabrain-market)
- **Auth:** [/auth.md](https://megabrain.market/auth.md) · plans and limits at [/pricing.md](https://megabrain.market/pricing.md)

## Documentation

- [Product & API docs](https://www.megabrain.market/docs/documentation)
- [Pricing](https://www.megabrain.market/pro) · [GitHub](https://github.com/vinidias/megabrain-market)
