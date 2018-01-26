# Assets dump proxy for GBF

requirement:

* yarn (npm is bugged)

environment variables:

| env           | default         | note                                                      |
|---------------|-----------------|-----------------------------------------------------------|
| targetFolder  | {CWD}/collected | output destination                                        |
| applyPrettier | false           | create 'prettified' folder and put prettified js,css      |
| threads       | (all logic cpu) | how much threads do you want to share to prettier process |

PS: each thread may require more than 1 GB RAM if input file is too big.