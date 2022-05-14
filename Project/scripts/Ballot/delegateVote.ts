import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";
import BallotArtifact from "../../artifacts/contracts/Ballot.sol/Ballot.json";

const EXPOSED_KEY =
	"8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
    const wallet = new ethers.Wallet(process.env.NEW_VOTER_KEY ?? EXPOSED_KEY);

    const provider = ethers.providers.getDefaultProvider("ropsten", { etherscan: process.env.ETHERSCAN_API_KEY });
    console.log(`Using address ${wallet.address}`);
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));

    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
        throw new Error("Not enough ether");
    };

    if (process.argv.length < 3) throw new Error("Ballot address missing");
    const ballotAddress = process.argv[2];

    const ballotContract: Ballot = new Contract(
        ballotAddress,
        ballotJson.abi,
        signer
    ) as Ballot;

    if (process.argv.length < 4) throw new Error("Delegee address missing");
    const tx = await ballotContract.delegate(process.argv[3]);
    console.log(tx);
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});