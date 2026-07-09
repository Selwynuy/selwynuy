# What a green build hides

A passing typecheck, lint, and test run proves the code compiles and the
logic you tested is correct. It proves nothing about whether the page
actually looks and reads right. Check the rendered output for these
specifically, they are the failure class a build cannot catch.

## Frontmatter and metadata leaks

MDX or template frontmatter (`title:`, `summary:`, YAML keys) rendering as
literal text on the page instead of being parsed. Look for a stray `---` or
a raw `key: value` line at the top of rendered content.

## Unstyled or truncated text

A component that renders with no CSS applied (a missing class, a typo'd
Tailwind utility that silently does nothing), or text that gets cut off
because a container assumed a shorter string than the real content.

## Broken layout at real breakpoints

Resize to at least a phone width and a tablet width, not just the desktop
viewport you built at. Overflow, wrapped nav items, and clipped cards
usually only show up below the width you were looking at while coding.

## Placeholder and debug artifacts

`TODO`, `Lorem ipsum`, `console.log` output, a hardcoded test value that was
meant to be temporary. These pass every automated check and still ship if
nobody looks at the actual page.

## Theme regressions

If the change touches color, spacing, or any CSS variable, check both light
and dark mode. A hardcoded hex value or a token that only exists in one
theme's `:root` block passes typecheck and looks broken in the other mode.

## How to actually check

Start the dev server and load the real route. Curl it if you want the raw
HTML (`curl localhost:3000/path`), or open it in a browser if the defect is
visual. Don't infer correctness from the diff, the diff shows what you
intended to change, not what actually rendered.
