import { expect } from "chai";
import { ethers } from "ethers";
import "dotenv/config";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";
import BallotArtifact from "../../artifacts/contracts/Ballot.sol/Ballot.json";

let apiKey, walletAddress;
const EXPOSED_KEY =
	"8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

// helper functions
function convertStringArrayToBytes32(array: string[]) {
	const bytes32Array = [];
	for (let index = 0; index < array.length; index++) {
		bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
	}
	return bytes32Array;
};

function createWallet(walletApiKey: any) {
	const wallet = new ethers.Wallet(walletApiKey);
	return wallet;
};

function connectToRopsten() {
	const provider = ethers.providers.getDefaultProvider("ropsten", { etherscan: process.env.ETHERSCAN_API_KEY });
	return provider;
};

async function checkBalance(signer: any) {
	const balanceBN = await signer.getBalance();
	const balance = Number(ethers.utils.formatEther(balanceBN));
	return balance;
};

// tests
describe("test scripts", function () {

	describe("deployment.ts", function () {
		const wallet = createWallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
		const provider = connectToRopsten();
		const signer = wallet.connect(provider);
		const ballotFactory = new ethers.ContractFactory(
			BallotArtifact.abi,
			BallotArtifact.bytecode,
			signer
		);

		it("should check for sufficient balance", async function () {
			const balance = await checkBalance(signer);
			expect(balance).to.be.above(0);
		});

		it("should deploy the contract successfully", async function () {
			const ballotContract: Ballot = (await ballotFactory.deploy(
				convertStringArrayToBytes32(PROPOSALS)
			)) as Ballot;
			const deploymentTx = await ballotContract.deployed();
			expect(deploymentTx).to.not.be.undefined;
			expect(deploymentTx).to.have.property("deployTransaction");
		});
	});
});

