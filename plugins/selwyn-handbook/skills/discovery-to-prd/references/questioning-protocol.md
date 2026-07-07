# The questioning protocol

How to interrogate an idea into a spec without drowning the person in a wall of
questions. This is the Discover phase in detail.

## Rules

1. **Batch small.** Three to four questions at a time. A long list gets skimmed
   and half-answered. A short batch gets real answers.
2. **Force concrete choices.** "What kind of auth?" invites a shrug. "Email and
   password, Google sign-in, or magic link?" gets a decision. Offer the real
   options.
3. **One decision per question.** Do not bundle "who is this for and how will
   they pay" into one line. Split them.
4. **Follow the gaps, not a script.** After each batch, ask what you still could
   not fill in the PRD. Those gaps are your next batch. The seed questions start
   you; your follow-ups finish the job.
5. **Stop when guesses run out.** When a new batch stops surfacing decisions and
   you could draft every PRD section from what you have, stop asking and draft.

## Where questions come from

- **Seed questions:** grouped by the PRD section they feed (problem, user,
  scope, architecture). Start here.
- **Follow-ups:** generated live from the answers. If they say "it is for busy
  parents," the follow-up is "on phone or desktop, and in what spare moment?"

## The handoff to PRD

You are done questioning when every PRD section can be written from recorded
answers with no `[OPEN]` left that you could have simply asked about. Anything
still open should be a real unknown (needs research, needs a decision from the
owner), not a question you forgot to ask.
