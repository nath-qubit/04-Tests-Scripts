# Nathan & Felipe - Weekend Project

## Scripts

### Deployment
Script - `deployment.ts`.
Deploys contract.
```
yarn hardhat run --network ropsten scripts/Ballot/deployment.ts
```
### Giving vote
Script - `givingVote.ts`.
Gives voting right to an address. Takes the contract address and voter address as arguments.
```
yarn run ts-node --files ./scripts/Ballot/givingVote.ts {contractAddress} {voterAddress}
```

### Query proposals
Script - `getProposals.ts`.
Queries proposals. Takes a proposal index as an argument e.g. 0, 1, 2.
```
yarn run ts-node --files ./scripts/Ballot/getProposals.ts {index}
```

### Cast vote
Script - `vote.ts`.
Casts vote if the sender has voting privileges. Takes contract address & index of proposal as arguments.
```
yarn run ts-node --files ./scripts/Ballot/vote.ts {contractAddress} {index}
```

### Delegate vote
Script - `delegateVote.ts`.
Delegates sender's vote to another address, if the sender has voting privileges. Takes contract address and delegee address as arguments.
```
yarn run ts-node --files ./scripts/Ballot/delegateVote.ts {contractAddress} {delegeeAddress}
```

### Query voting results
Script - `getResult.ts`.
Calls the contract `winnerName` function and returns the winning proposal index, then parses and logs the winner's name.
```
yarn run ts-node --files ./scripts/Ballot/getResult.ts
```

## Etherscan contract transactions:
URL - https://ropsten.etherscan.io/address/0xf7f2477fa656f9c0507c871d1ecb235bf8d3b8b8

Screenshot:
