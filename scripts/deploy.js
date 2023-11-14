// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Game = await hre.ethers.getContractFactory("ExplodingKittens");
  const game_ = await Game.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  await game_.deployed("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

  console.log("Deployed contract address:", `${game_.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x5FbDB2315678afecb367f032d93F642f64180aa3
