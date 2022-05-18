const hre = require("hardhat");

const ethers = hre.ethers;

async function deployBookStoreContract() {
  await hre.run("compile"); // We are compiling the contracts using subtask
  const [deployer] = await ethers.getSigners(); // We are getting the deployer

  console.log("Deploying contracts with the account:", deployer.address); // We are printing the address of the deployer
  console.log("Account balance:", (await deployer.getBalance()).toString()); // We are printing the account balance

  const BookStore = await ethers.getContractFactory("BookStore"); //
  const bookStoreContract = await BookStore.deploy();
  console.log("Waiting for BookStore deployment...");
  await bookStoreContract.deployed();

  console.log("BookStore Contract address: ", bookStoreContract.address);
  console.log("Done!");
  await hre.run("verify:verify", {
    address: bookStoreContract.address,
    constructorArguments: [
      // if any
    ],
  });
}

module.exports = deployBookStoreContract;
