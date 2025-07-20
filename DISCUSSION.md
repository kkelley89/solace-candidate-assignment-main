## Kicking things off

Fun and open-ended exercise, love the idea.

Clean README with some good setup instructions. For this exercise I'm running on my Windows battlestation, which always has some fun hiccups when swapping around between stacks. Realized I had a local postgres server running by default that was getting clogged (ran down some Docker rabbit holes before checking on this). I'll throw a bone to any other Windows hopefuls running this take down: Just swap the docker config to 5433 or similar and update your connection string. We're back in business - Drizzle is a new ORM to me, but I get the gist here.

We're swapped from the static data to the postgres db and we've seeded, awesome! Let's crack on.

## Initial observations

Starting with the front-end, taking a look through page.txs, a couple of things jump out at me

### Front-end bugs/anitpatterns

- We're in a typescript project but missing explicit typing (\*ts linter giving a bit of an assist here, red squiggles abound)
- We're performing some vanilla-js DOM manipulation in a React project (`getElementById`)
- An easy gotcha, but `yearsOfExperience` being a number, `.includes()` will fail

  - Not sure on the conversions of json-blob (specialties) yet, could have similar issues here on the search filter

- Zooming out a bit, our useEffect is a bit busy;

  - Our nested .then doesn't have any awaiting
  - our fetch doesn't have any try/catch bounds

- Looking at the HTML content, we're a bit too static;

  - We have tailwind, but aren't utilizing it here (inline styling)
  - We aren't using keys (react loves to yell about this one, not that I'm speaking from experience of course... )

- Final gotcha - our search isn't case-insensitive, so we'd miss except for exact matches

### API issues

- No error handling on our db.select
- No query params - we're doing all of the filtering in the client instead of in a service-based fashion

  - Bonus: later on, this would limit us from things like pagination, servier-side search/perf optimizations

- Taking another gander at our schema, specialties is mapping to "payload"; we'll likely hit some collisions here without noticing that first

## First PR - Frontend

I'll put some notes in the PR as well, but here's the thinking:

- Create a simple `Advocate` type, and update the page
- Make use of state instead of the DOM manip for our search term
- Convert our yearsofexperience to a number for a small lift to prevent that from breaking (can optimize later)
- Add some try/catch blocks for posterity/best practice, even if they are a bit light
- Add keys to those rendered HTML elements
- Get some styles going
  - I followed modern design system principles using Tailwind's semantic color scales and spacing system. The table design draws from enterprise SaaS applications like GitHub's interface - clean, accessible, with proper hover states and visual hierarchy. I tried to keep things basic but functional (hover contrast for instance)
  - I used Tailwind's @apply directive to extract repeated utility combinations into semantic CSS classes. This maintains Tailwind's utility-first benefits while improving maintainability. For example, instead of repeating the same 8-class button pattern throughout the app, I created .btn-primary that can be updated in one place and reused everywhere.
- Bring `specialties` into the mix by adding `.some()` instead of `.includes()` ✅
- Bring the correct type of event into our `onChange` (HTMLInputElement)
- Component creation:
  - In the spirit of best practices, created some re-usable components for further maintainability and flexibility, a searchInput and a button
