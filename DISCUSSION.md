## Kicking things off

Fun and open-ended exercise, love the idea.

Clean README with some good setup instructions. For this exercise I'm running on my Windows battlestation, which always has some fun hiccups when swapping around between stacks. Realized I had a local postgres server running by default that was getting clogged (ran down some Docker rabbit holes before checking on this). I'll throw a bone to any other Windows hopefuls running this take down: Just swap the docker config to 5433 or similar and update your connection string. We're back in business - Drizzle is a new ORM to me, but I get the gist here.

We're swapped from the static data to the postgres db and we've seeded, awesome! Let's crack on.

## Initial observations

Starting with the front-end, taking a look through page.txs, a couple of things jump out at me

- We're in a typescript project but missing explicit typing
- We're performing some vanilla-js DOM manipulation in a React project (`getElementById`)
-
