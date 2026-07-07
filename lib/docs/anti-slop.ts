/**
 * Anti-slop writing rules: the tells of AI-generated prose, and what to do
 * instead. Sourced from real research (peer-reviewed word-frequency studies,
 * journalism, Wikipedia's "Signs of AI writing", and working editors), not
 * invented. See SOURCES below for attribution.
 *
 * Pure data, mirroring decisions.ts and launch-checklist.ts: the handbook page,
 * the /claude.md ruleset, and the playbook header all read from here, so the
 * rules an AI ingests are the same rules a human reads. The point is that an
 * agent fed this handbook writes the way the author does, plain and specific,
 * instead of in the inflated register that gives machine text away.
 */

export interface SlopRule {
  /** The tell to avoid: a word, phrase, construction, habit, or tic. */
  avoid: string;
  /** The human alternative, what to do instead. */
  instead: string;
  /** How widely sources cite this, so a reader can weight it. */
  evidence: string;
}

export interface SlopCategory {
  /** Display heading for the group. */
  category: string;
  /** One line on what this category of tell is. */
  blurb: string;
  rules: SlopRule[];
}

/**
 * The single most-cited overused words, ranked by how often sources flag them.
 * This is the fast ban-list: if a draft leans on these, it reads as machine
 * text. Drawn from the two excess-vocabulary studies plus the editor lists.
 */
export const SLOP_WORDS: string[] = [
  "delve",
  "underscore",
  "showcase",
  "tapestry",
  "realm",
  "pivotal",
  "landscape",
  "intricate",
  "crucial",
  "meticulous",
  "testament",
  "robust",
  "seamless",
  "leverage",
  "transformative",
  "notably",
  "navigate",
  "foster",
  "potential",
  "comprehensive",
  "vibrant",
  "utilize",
  "additionally",
];

/** Named sources behind the catalog, shown on the page for credibility. */
export const SLOP_SOURCES: { label: string; url: string }[] = [
  {
    label: "Science Advances: excess vocabulary in LLM-assisted writing",
    url: "https://www.science.org/doi/10.1126/sciadv.adt3813",
  },
  {
    label: "arXiv: ChatGPT excess vocabulary in academic writing",
    url: "https://arxiv.org/html/2406.07016v1",
  },
  {
    label: "Wikipedia: Signs of AI writing",
    url: "https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing",
  },
  {
    label: "The Conversation: ChatGPT is changing how we write",
    url: "https://theconversation.com/chatgpt-is-changing-the-way-we-write-heres-how-and-why-its-a-problem-239601",
  },
  {
    label: "FSU: why ChatGPT overuses certain words",
    url: "https://artsandsciences.fsu.edu/article/why-does-chatgpt-delve-so-much-fsu-researchers-begin-uncover-why-chatgpt-overuses-certain",
  },
  {
    label: "Pangram: a guide to spotting AI writing patterns",
    url: "https://www.pangram.com/blog/comprehensive-guide-to-spotting-ai-writing-patterns",
  },
];

/**
 * The catalog, grouped by the kind of tell. Ordered strongest-signal first
 * within reason: vocabulary and the manufactured-contrast sentence pattern are
 * the most-cited, so they lead their groups.
 */
export const slopCategories: SlopCategory[] = [
  {
    category: "Vocabulary",
    blurb:
      "Decorative style-words that inflate without adding meaning. The studies found two thirds of excess AI words are verbs: the spike is stylistic, not topical.",
    rules: [
      {
        avoid: "delve, delve into, delving",
        instead: "explore, look at, dig into, or just name the thing directly",
        evidence: "The single most-cited tell: two studies measured it at ~25 to 28x normal frequency, plus FSU, The Conversation, Wikipedia, and most editor lists",
      },
      {
        avoid: "underscore, underscores (as a verb)",
        instead: "shows, proves, or cut the sentence and state the point",
        evidence: "Named by both excess-vocabulary studies, The Conversation, Wikipedia, Pangram",
      },
      {
        avoid: "showcase, showcasing",
        instead: "shows, presents, includes",
        evidence: "Named by both studies, The Conversation, Wikipedia, Pangram",
      },
      {
        avoid: "tapestry, especially rich tapestry",
        instead: "drop the metaphor and describe the actual mix of things",
        evidence: "The notorious editor flag; named by Wikipedia, The Conversation, Pangram, and several blogs",
      },
      {
        avoid: "realm, in the realm of",
        instead: "field, area, world, or name it: in software, in chess",
        evidence: "Named by a study, FSU, The Conversation, Pangram",
      },
      {
        avoid: "landscape, ever-evolving landscape",
        instead: "name the actual situation or market",
        evidence: "Named by Wikipedia, The Conversation, Pangram, and more",
      },
      {
        avoid: "pivotal, crucial",
        instead: "important, key, or say why it actually mattered",
        evidence: "Named by studies, The Conversation, Wikipedia",
      },
      {
        avoid: "intricate, intricacies, meticulous, meticulously",
        instead: "complex, careful, or describe the specific complication",
        evidence: "Named by both studies, FSU, The Conversation, Wikipedia, Pangram",
      },
      {
        avoid: "testament, a testament to, stands as a testament to",
        instead: "shows, proves, or state the evidence plainly",
        evidence: "Named by Wikipedia, Pangram, and editor lists",
      },
      {
        avoid: "robust, seamless, transformative, groundbreaking, game changer",
        instead: "say concretely what changed, how strong, and by how much",
        evidence: "Inflated adjectives named by Wikipedia, Pangram, and editor lists",
      },
      {
        avoid: "leverage, utilize",
        instead: "use",
        evidence: "Named by Walter Writes, Learning Data, and community ban-lists",
      },
      {
        avoid: "empower, foster, facilitate, harness, streamline, elevate, unlock, navigate",
        instead: "help, support, enable, handle, or a plain verb",
        evidence: "Inflated business verbs named across the editor lists and Wikipedia",
      },
      {
        avoid: "notably, additionally, moreover, furthermore",
        instead: "also, and, or just start the sentence",
        evidence: "Stiff connectives named by both studies, Pangram, and editor lists",
      },
      {
        avoid: "symphony, mosaic, kaleidoscope, odyssey, beacon, cornerstone",
        instead: "skip the prestige metaphor noun entirely",
        evidence: "Named by Pangram and the Vollmer field guide",
      },
      {
        avoid: "résumé, café, naïve, and other accented spellings of naturalized English words",
        instead: "use the plain English spelling: resume, cafe, naive",
        evidence: "A reach for a fancier or foreign-derived form when the plain spelling is standard; the same instinct as inflated vocabulary, applied to spelling",
      },
    ],
  },
  {
    category: "Stock phrases",
    blurb: "Prefab transitions and openers that signal nothing and could front any topic.",
    rules: [
      {
        avoid: "It's important to note that, it's worth noting that",
        instead: "if it matters, just say it; if not, cut it",
        evidence: "Named across the editor field guides",
      },
      {
        avoid: "In today's fast-paced world, in an ever-evolving landscape, as technology continues to evolve",
        instead: "open with the actual subject",
        evidence: "Vapid openers named by Vollmer, Walter Writes, Hunting the Muse, ignorance.ai",
      },
      {
        avoid: "In conclusion, in summary, overall, ultimately (as a closing label)",
        instead: "end on a real last point, not a recap announcement",
        evidence: "Closing rituals named by Pangram, Vollmer, and editor lists",
      },
      {
        avoid: "Here's the thing, here's what nobody talks about, at the end of the day",
        instead: "make the point without the drumroll",
        evidence: "False-profundity fillers named by several editors and Reddit-derived lists",
      },
      {
        avoid: "shed light on, deeper understanding, valuable insights, significant impact on",
        instead: "state what was learned and the measured effect",
        evidence: "Named by Pangram, Wikipedia, Learning Data",
      },
      {
        avoid: "Great question, hope this helps, let me know if you'd like me to go deeper",
        instead: "drop sycophancy openers and cheap-warmth sign-offs",
        evidence: "The earnest-helpfulness tell, named by Vollmer and Pangram",
      },
      {
        avoid: "experts argue, studies suggest, observers have cited (with no source)",
        instead: "cite the actual person or paper, or cut the claim",
        evidence: "Vague attribution named by Wikipedia and Pangram",
      },
    ],
  },
  {
    category: "Sentence patterns",
    blurb: "Formulaic templates that recur regardless of subject. The manufactured contrast and the triplet are the loudest.",
    rules: [
      {
        avoid: "It's not X, it's Y; it's not just X, it's Y; not X but Y",
        instead: "make one clear assertion without the manufactured contrast",
        evidence: "One of the most-cited patterns, named by Wikipedia, Pangram, and at least five editor sources",
      },
      {
        avoid: "The rule of three: fast, simple, powerful; plan it, build it, ship it",
        instead: "use one or two items, or vary the count; reserve triplets for rare emphasis",
        evidence: "Named by Wikipedia and five editor sources",
      },
      {
        avoid: "Question-then-answer crutch: The secret? Consistency. The result?",
        instead: "state the point as a plain sentence",
        evidence: "Named by four editor sources",
      },
      {
        avoid: "No X. No Y. Just Z; stacking negations before a pivot",
        instead: "describe what it is, not a stack of what it isn't",
        evidence: "Named by three editor sources",
      },
      {
        avoid: "not only X but also Y",
        instead: "split into plain clauses or pick the stronger point",
        evidence: "Named by Wikipedia and Pangram",
      },
      {
        avoid: "Trailing -ing tails: ..., underscoring its importance; ..., marking a pivotal moment",
        instead: "end the sentence on the noun; start a new one if there's more to say",
        evidence: "Named by Wikipedia and Vollmer",
      },
      {
        avoid: "Dressing up is/has as serves as, stands as, boasts, features",
        instead: "use is, are, has",
        evidence: "Named by Wikipedia",
      },
    ],
  },
  {
    category: "Structure",
    blurb: "Habits in how the whole piece is shaped: even rhythm, reflexive bullets, and templated arcs.",
    rules: [
      {
        avoid: "Uniform rhythm: every paragraph three to four sentences of the same length",
        instead: "vary sentence and paragraph length deliberately; let some be very short",
        evidence: "The burstiness tell, named by Pangram, Vollmer, and four more editors",
      },
      {
        avoid: "Over-bulleting: lists for ideas that are not list-shaped",
        instead: "write prose; reserve bullets for genuinely parallel items",
        evidence: "Named by Pangram, Vollmer, ignorance.ai, Wikipedia",
      },
      {
        avoid: "Templated arc: intro, three bodies, recap; or significance, challenges, future outlook",
        instead: "let the content dictate the structure",
        evidence: "Named by Vollmer and Wikipedia",
      },
      {
        avoid: "Missing fingerprints: no names, dates, numbers, or lived detail, byline interchangeable",
        instead: "anchor with specific names, numbers, dates, and real experience",
        evidence: "Named by the 500-articles editor, Vollmer, ignorance.ai",
      },
      {
        avoid: "Aphoristic kicker endings: That's the whole game. And that changes everything.",
        instead: "end sections on substance, not a pull-quote",
        evidence: "Named by three editor sources",
      },
      {
        avoid: "Excessive signposting: first we'll look at, second, finally",
        instead: "let transitions emerge from the ideas",
        evidence: "Named by Vollmer",
      },
    ],
  },
  {
    category: "Punctuation and formatting",
    blurb: "The surface tics, led by the em-dash, that survive even when the prose is otherwise clean.",
    rules: [
      {
        avoid: "Em-dash overuse for dramatic pauses and additive qualifiers",
        instead: "use commas, colons, or two sentences",
        evidence: "The most-cited punctuation tell across nearly every source, with two dedicated essays on it",
      },
      {
        avoid: "Zero contractions paired with flawless, spotless grammar",
        instead: "use contractions and let a natural voice show",
        evidence: "Named by Vollmer, Pangram, and the em-dash essay",
      },
      {
        avoid: "Random mid-prose bolding without clear emphasis",
        instead: "bold sparingly, only for true emphasis",
        evidence: "Named by ignorance.ai and Wikipedia",
      },
      {
        avoid: "Emoji in headings, emoji-led bullets, Title Case Headings In Odd Places",
        instead: "plain sentence-case headings, no decorative emoji",
        evidence: "Named by Vollmer, ignorance.ai, Wikipedia",
      },
      {
        avoid: "Decorative unicode (arrows, curly quotes) and leaked markdown",
        instead: "plain straight punctuation matching the target format",
        evidence: "Named by ignorance.ai and Wikipedia",
      },
    ],
  },
  {
    category: "Tone",
    blurb: "The underlying register: inflated, relentlessly positive, hedged, and stance-free.",
    rules: [
      {
        avoid: "Flowery style-word inflation divorced from the subject",
        instead: "prefer plain, precise words; flowery prose costs clarity and credibility",
        evidence: "The core finding of both studies: the excess is stylistic, not substantive",
      },
      {
        avoid: "Relentless promotional positivity and press-release puffery",
        instead: "state limits and tradeoffs; be willing to call something mediocre",
        evidence: "Named by Wikipedia, Vollmer, Pangram",
      },
      {
        avoid: "Generic, stance-free blandness with no point of view",
        instead: "take a position and stake a claim",
        evidence: "Named by the 500-articles editor, The Conversation, ignorance.ai",
      },
      {
        avoid: "Over-hedging: balanced pros and cons with no verdict",
        instead: "commit to a judgment after the analysis",
        evidence: "Named by Hunting the Muse, Vollmer, Walter Writes",
      },
      {
        avoid: "Throat-clearing and restating the same idea in new clothes",
        instead: "cut the padding; say it once, plainly",
        evidence: "Named by the 500-articles editor, Learning Data, Walter Writes",
      },
    ],
  },
];

/** Rank for nothing here yet; kept parallel to decisions.ts for future use. */
export function slopRuleCount(): number {
  return slopCategories.reduce((n, c) => n + c.rules.length, 0);
}

/**
 * Render the catalog as grouped markdown for the one-drop endpoint and llms.txt,
 * so an AI consumer gets the real rules instead of a dead <AntiSlopRules /> tag.
 * Mirrors decisionsMarkdown() in registry.ts.
 */
export function antiSlopMarkdown(): string {
  const lines: string[] = [
    `\nMost-flagged words to avoid: ${SLOP_WORDS.join(", ")}.\n`,
  ];
  for (const { category, rules } of slopCategories) {
    lines.push(`\n**${category}**\n`);
    for (const r of rules) {
      lines.push(`- Avoid ${r.avoid}. Instead: ${r.instead}.`);
    }
  }
  return lines.join("\n");
}

/**
 * The anti-slop block for the generated CLAUDE.md: a short framing line, the
 * word ban-list, then each rule as a "WHEN writing prose" directive so it reads
 * like the rest of the rules file and an agent applies it on every prose write.
 */
export function antiSlopClaudeMd(): string[] {
  const out: string[] = [
    "## Writing without AI slop",
    "",
    "These rules make prose read as human and specific, not machine-generated. Apply them to all user-facing text: copy, docs, comments, commit messages, and READMEs. They are sourced from word-frequency studies and editors, not preference.",
    "",
    `- WHEN writing any prose: never use an em-dash; use commas, colons, or two sentences.`,
    `- WHEN writing any prose: avoid these inflated words entirely: ${SLOP_WORDS.join(", ")}. Prefer the plainest accurate word.`,
    `- WHEN writing any prose: never use the "it's not X, it's Y" or "not only X but also Y" manufactured-contrast construction; make one clear claim.`,
    `- WHEN writing any prose: do not pad with the rule of three (three parallel items or triplet sentences) unless the content genuinely has three things.`,
    `- WHEN writing any prose: cut stock transitions and openers (in today's world, it's important to note, in conclusion, moreover, furthermore); say the thing directly.`,
    `- WHEN writing any prose: vary sentence and paragraph length; do not write every paragraph at the same three-to-four-sentence rhythm.`,
    `- WHEN writing any prose: use bullets only for genuinely parallel items; otherwise write prose.`,
    `- WHEN writing any prose: anchor claims with specific names, numbers, and detail; take a position instead of hedging to a balanced non-verdict.`,
    `- WHEN writing any prose: no decorative emoji, no random mid-sentence bolding, no Title Case Headings; sentence case and plain punctuation.`,
    "",
  ];
  return out;
}
