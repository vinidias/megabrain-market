# Support & Contact - MegaBrain Market

Last updated: July 5, 2026

How to reach MegaBrain Market, by concern. Human-readable version: https://www.megabrain.market/docs/support

## Channels

| Concern | Channel | Notes |
| --- | --- | --- |
| General support, account or billing issues | support@megabrain.market | Primary support channel for all plans |
| Enterprise, sales, custom quotas | enterprise@megabrain.market | Custom pricing, deployments, higher API limits |
| Bug reports & feature requests | https://github.com/vinidias/megabrain-market/issues | Public open-source repository |
| Community & quick questions | https://discord.gg/re63kWKxaz | Community Discord |
| Service status & incidents | https://status.megabrain.market | Email subscription available on the page |
| In-app contact form | Form on https://megabrain.market/pro | Submits `POST /api/leads/v1/submit-contact`; Turnstile-protected, intended for humans in a browser — agents should email support@ instead |

## Response Expectations

- Free and Pro: best-effort support via email, GitHub and Discord. No formal SLA.
- API: best-effort support via email; include your key prefix (never the full key) and request IDs.
- Enterprise: dedicated support with committed response times, agreed per contract — contact enterprise@megabrain.market.

## Common Self-Serve Answers

- Find, create, or replace a `wm_` key: https://www.megabrain.market/docs/api-keys. Full keys are shown only once and cannot be recovered; revoke a lost key and create a replacement.
- API key rotation or limit increases: see https://www.megabrain.market/docs/usage-auth and https://www.megabrain.market/docs/usage-rate-limits, or email support@megabrain.market.
- Pricing and plans: https://megabrain.market/pricing.md (markdown) or `GET https://www.megabrain.market/api/product-catalog` (JSON, public).
- Billing portal (invoices, cancel/renew): sign in at https://megabrain.market/pro and open the customer portal.
- Security reports: see https://www.megabrain.market/.well-known/security.txt

## Machine-Readable Summary

```json
{
  "product": "MegaBrain Market",
  "support_email": "support@megabrain.market",
  "enterprise_email": "enterprise@megabrain.market",
  "issues_url": "https://github.com/vinidias/megabrain-market/issues",
  "community_url": "https://discord.gg/re63kWKxaz",
  "status_url": "https://status.megabrain.market",
  "security_txt": "https://www.megabrain.market/.well-known/security.txt",
  "sla": { "free": "best-effort", "pro": "best-effort", "api": "best-effort", "enterprise": "contracted" }
}
```
