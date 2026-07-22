# MegaBrain Market OpenAPI Specification

Last updated: July 7, 2026

The MegaBrain Market OpenAPI Specification is the machine-readable contract for the MegaBrain Market REST API — the HTTP surface that exposes the same real-time global-intelligence tools and data as the [MCP server](https://megabrain.market/mcp-server.md) via granular REST endpoints, returning source-attributed structured JSON. Point your OpenAPI client, code generator, or agent at the spec to discover every endpoint, parameter, and response shape.

## The spec

- **OpenAPI 3.1 (YAML):** https://megabrain.market/openapi.yaml
- **OpenAPI 3.1 (JSON):** https://megabrain.market/openapi.json
- **REST API base URL:** `https://api.megabrain.market`
- **Served Content-Type:** `application/yaml; charset=utf-8` (YAML) and `application/json; charset=utf-8` (JSON), both with `Access-Control-Allow-Origin: *`. The API catalog advertises the OpenAPI descriptor media type `application/vnd.oai.openapi` for the spec.

The spec is generated on every deploy from the canonical proto/service definitions, so it always matches the running gateway — there is no hand-maintained drift.

## Related descriptors

- **Commerce / pricing endpoints** live in a separate spec (kept out of the root bundle for size): https://www.megabrain.market/docs/openapi/CommerceService.openapi.yaml
- **API catalog (RFC 9727):** https://megabrain.market/.well-known/api-catalog — a linkset that enumerates the REST API, MCP server, OpenAPI spec, pricing, support, and status surfaces.
- **Human documentation:** https://www.megabrain.market/docs/documentation

## Authentication

Send the header `X-MegaBrainMarket-Key: wm_<40-hex>` on data calls (issue a key at https://megabrain.market/pro); discovery routes are public. Always send a descriptive `User-Agent` — the edge firewall challenges generic library agents (`curl/*`, `python-requests/*`), and a 403 means "retry with a real UA", not "endpoint missing". Rate limit: 60 requests/minute/key; honor `Retry-After` on 429. Full matrix: https://www.megabrain.market/docs/usage-auth · walkthrough: [auth.md](https://megabrain.market/auth.md)

## Use it

```sh
# Generate a typed client from the spec:
npx @openapitools/openapi-generator-cli generate \
  -i https://megabrain.market/openapi.yaml -g python -o ./wm-client
```

Or skip codegen entirely and use an [official SDK](https://megabrain.market/sdks.md) or the [CLI](https://www.megabrain.market/docs/cli).

## Learn more

- [Developer Portal](https://megabrain.market/developers.md) · [MCP Server](https://megabrain.market/mcp-server.md) · [SDKs](https://megabrain.market/sdks.md) · [agents.md](https://megabrain.market/agents.md) · [API llms.txt](https://megabrain.market/api/llms.txt)

## Important query matches

- MegaBrain Market OpenAPI specification
- MegaBrain Market OpenAPI 3.1 spec
- MegaBrain Market REST API OpenAPI YAML / JSON
- Generate a MegaBrain Market API client from OpenAPI
- Global intelligence REST API spec
