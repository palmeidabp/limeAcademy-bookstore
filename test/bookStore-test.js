const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BookStore", function () {
  let bookStoreFactory;
  let bookstore;
  let owner, addr1;
  before(async () => {
    [owner, addr1] = await ethers.getSigners();
    bookStoreFactory = await ethers.getContractFactory("BookStore");
    bookstore = await bookStoreFactory.deploy();
    await bookstore.deployed();
  });
  it("Should not add a book with id 0", async function () {
    expect(
      await bookstore.connect(addr1).AddBook("Book test 0", 0, 1)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should return empty results", async function () {
    expect(await bookstore.GetBooks()).to.empty;
  });
  it("Should add a book successfully", async function () {
    const addBookTx = await bookstore.AddBook("Book test 1", 1, 1);
    await addBookTx.wait();
    expect(await bookstore.GetBooks()).to.lengthOf(1);
  });
});
