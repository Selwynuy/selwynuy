---
name: brand-voice
description: "Build a source-derived writing voice profile from real posts, docs, or site copy, then reuse it across content and outreach so every draft sounds like the same person instead of generic AI copy. Use before drafting anything user-facing when voice consistency matters: articles, launch notes, social posts, outbound messages. Falls back to Selwyn's own default voice (direct, plain-word, sourced) when no other source material is given, not a generic one."
---

# Brand Voice

Derive a voice profile from real source material first. Only fall back to the default voice below when there is nothing else to draw from, and say so when you do.

## How to run it

1. **Gather source material**, 5 to 20 samples if available: recent posts, articles, launch notes, outbound messages that worked, or site copy. Prefer recent over old unless told the older writing is more canonical.
2. **Extract the signature**, not just adjectives: sentence rhythm, how compressed vs. explained the writing is, how claims get made (asserted plainly vs. hedged), whether numbers and specifics show up or get replaced with adjectives, what the source never does.
3. **Write the profile** using the schema in `references/voice-profile-schema.md`. Keep it short enough to reuse in context, not a literary analysis.
4. **Reuse the profile** across the drafting task and anything downstream in the same session. Don't re-derive it from scratch each time you write something.
5. **If no source material exists**, use the default voice below and say plainly that you're using the default, not a derived one, so the gap is visible instead of silently papered over.

## Selwyn's default voice

Used only when no real source material is available. Sourced from the handbook's own anti-slop ruleset (`writing-without-ai-slop`), not invented separately.

- Plain words over inflated ones: use, not leverage or utilize. Dig into, not delve. Solid, not robust.
- State the claim once, plainly. No "it's not just X, it's Y" manufactured contrast.
- No hedging: if it's true, say it; if it's not, cut it. Skip "somewhat," "arguably," "can help to."
- No throat-clearing: no "it's worth noting that," no "in today's fast-paced world," no "in conclusion."
- Specifics beat adjectives. A number, a file path, a real example outranks "fast, reliable, and scalable."
- No em-dashes. A period or comma carries the same pause.
- The test: read it aloud. If it sounds like someone who knows the subject talking to another person, it passes. If it sounds like a press release, rewrite it.

## Hard bans (delete and rewrite, regardless of derived voice)

- Fake curiosity hooks ("You won't believe...")
- "No fluff" as a self-description
- Bait questions used as an opener
- "Excited to share" and generic founder-journey filler
- Forced lowercase or forced quirk that isn't in the actual source material

## What NOT to do

- Don't default to a generic "professional/friendly" voice when source material exists. Use the real signature.
- Don't apply the hard bans list as the whole voice. It catches AI tells; it is not a personality.
- Don't silently fall back to the default voice when source material was requested but not provided. Say so.

## Bundled files

- `references/voice-profile-schema.md` (reference): the structured output format a derived voice profile should follow.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/brand-voice

Adapted from the `brand-voice` skill in [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) (MIT licensed) by Affaan Mustafa: the collection workflow and profile-schema structure are the same shape, with the hardcoded upstream-author voice defaults replaced by Selwyn's own, sourced from his handbook's anti-slop ruleset instead.
