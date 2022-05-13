import { ethers } from "ethers";
import "dotenv/config";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";
import BallotArtifact from "../../artifacts/contracts/Ballot.sol/Ballot.json";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  // const provider = ethers.providers.getDefaultProvider("ropsten");
  // const provider = ethers.providers.getDefaultProvider( "ropsten", { etherscan: "CNFTTPMDZXH68PGVY3NBVV2G1NMVZ436VQ"} );
  const provider = ethers.providers.getDefaultProvider( "ropsten", { etherscan: process.env.ETHERSCAN_API_KEY} );
  console.log(`Using address ${wallet.address}`);
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  const lastBlock = await provider.getBlock("latest");
  console.log(`Connected to the ropsten network at height ${lastBlock.number}`);
  const ballotFactory = new ethers.ContractFactory(
    BallotArtifact.abi,
    BallotArtifact.bytecode,
    signer
  );
  console.log("Deploying Ballot contract");
  const ballotContract: Ballot = (await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS)
  )) as Ballot;
  console.log("Awaiting confirmations");
  const deploymentTx = await ballotContract.deployed();
  console.log("Completed");
  // console.log({ deploymentTx });
  for (let index = 0; index < PROPOSALS.length; index++) {
    const proposal = await ballotContract.proposals(index);
    console.log(
      `Proposal at ${index} is named ${ethers.utils.parseBytes32String(
        proposal[0]
      )}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
