# Analytics & tracking

**OWNS:** GTM, cookie consent, marketing event fires.

## Recent additions (from git log)
- `525d51d add generate_lead event trigger` — a `generate_lead` event is fired (presumably on form submit / CTA click) and consumed by GTM.
- `6a24f91 add cookie consent banner` — cookie consent banner gates analytics scripts until user opts in.

The exact load-order and conditional logic isn't extracted yet — confirm via grep before assuming.

**INVARIANT:**
- GTM and analytics scripts SHOULD be gated by cookie consent. Adding a new tracking script without the gate will leak data before consent — and is a legal issue for the EU/UK markets this site likely serves.
- The `generate_lead` event name is a GTM/GA4 conventional name — don't rename without coordinating with whoever owns the GTM container.

**FLOW (add a new tracking event):**
1. Identify the user action (CTA click, form submit, video play).
2. Fire `window.dataLayer.push({ event: '<event_name>', ...payload })` in the relevant JS module.
3. Confirm the GTM container has a matching trigger + tag — without it, the dataLayer push is a no-op.
4. Verify in browser DevTools `dataLayer` array AND in GTM Preview mode on staging before merging to `live`.

**TENSION:**
- Repo doesn't store the GTM container ID in tracked code (it's likely inline in `head.ejs` or injected via env). Confirm where the GTM-XXX ID lives before duplicating tracking logic.
- Cookie consent may suppress events even on staging — test with consent given.

**DECIDED:** (none recorded yet)
