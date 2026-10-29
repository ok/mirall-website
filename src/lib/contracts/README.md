# Contracts from the Mirall Console

The Console owns these files; the website copies them verbatim and never edits them here.
To update one, copy the new version from `mirall-console`, change the source line below, and
run `npm run check:contract`.

| File | Source in `mirall-console` |
|---|---|
| `beta-request-v1.schema.json` | `packages/contracts/website/beta-request-v1.schema.json` |
| `beta-request-v1.vectors.json` | `packages/core/website/vectors/beta-request-v1.json` |

**Copied from:** `93fc155` (`feat/beta-requests`, mirall-console PR #64), before it was tagged.
Replace this with the tag that publishes it.

`src/lib/betaRequest.ts` sends the body and checks it against the schema before sending.
`scripts/check-beta-request.mjs` holds that check to the vectors: every accepted body passes,
every invalid one fails, and the website's choice codes are the schema's.
