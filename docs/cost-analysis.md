# Feature 'list of notes'. 

Sonnet 4.6 at $3/1M input tokens and $15/1M output tokens
Sonnet 5 has a temporary introductory rate of $2/1M input tokens and $10/1M output tokens
Decision was to use Sonnet 5 for comparison of cost with Opus 4.6 with expectation of lower cost for Sonnet 5 due to lower pricing and better performance.

## Sonnet 4.6

Session

Total cost:            $0.87
Total duration (API):  3m 30s
Total duration (wall): 9m 29s
Total code changes:    402 lines added, 62 lines removed
Usage by model:
claude-haiku-4-5:  490 input, 18 output, 0 cache read, 0 cache write ($0.0006)
claude-sonnet-4-6:  425 input, 10.0k output, 1.9m cache read, 41.4k cache write ($0.87)

## Sonnet 5

Session

Total cost:            $1.14   
Total duration (API):  3m 34s
Total duration (wall): 14m 34s
Total code changes:    282 lines added, 60 lines removed
Usage by model:                
claude-haiku-4-5:  934 input, 41 output, 0 cache read, 0 cache write ($0.0011)
claude-sonnet-5:  6.5k input, 13.0k output, 2.0m cache read, 86.9k cache write ($1.13)

## Conclusions

1. **Newer model ≠ lower cost.** Despite Sonnet 5's introductory pricing being cheaper per token ($2/$10 vs $3/$15), the actual session cost was **31 % higher** ($1.14 vs $0.87). 
Sonnet 5 consumed significantly more cache-write tokens (86.9 k vs 41.4 k) and roughly 15× more direct input tokens (6.5 k vs 425), suggesting it required more context re-reads and reasoning steps to complete the same feature.

2. **Sonnet 4.6 delivered more output per dollar.** It produced 402 lines of net-added code versus 282 for Sonnet 5, at a lower total cost and in less wall-clock time (9 m 29 s vs 14 m 34 s). 
For routine feature work where output volume and cost efficiency matter more than cutting-edge capability, the older model was the better economic choice in this experiment.
