# Random Keeper Generator

## Use Case
Create a random number generator for selecting keepers. This is mainly for practice with React. Trying to keep this simple (famouse last words).

## Notes
- Using mostly CoPilot to make this quickly
- Can currently work as intended
- Next step is to pull in Yahoo FFB API
  - Auto pull current rosters for each team
  - Pull original draft data for each player
  - calculate what draft position the cut will result in
    - will require referencing whether or not the play is on the team that was drafted
    - i.e. players not on team are automatically placed in round 9 for keeper selection
    - optional: check to see if the player was kept on the team each season (want to eliminate dropped and picked back up players)

## Server
- starting a separate server on localhost:5000
- 