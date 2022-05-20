const hre = require("hardhat");
// Get BookStore Contract definition
const BookStore = require("../artifacts/contracts/BookStore.sol/BookStore.json");
const defaultNetwork = "local";

const NETWORK = process.env.ENV ?? "local";

require("dotenv").config({
  path: "./scripts/confs/" + NETWORK + "/.env",
  override: false,
});

run = (async function () {
  exec = async function () {
    const provider = getProvider(NETWORK);

    const wallet = getWallet(provider);

    const contract = getContract(wallet);

    const balance = await wallet.getBalance();
    console.log(balance);

    var books = await contract.GetBooks();
    console.log(books);
    // Create if not exists
    book1 = bookExists(books, 1);
    if (!book1) {
      const transactionAddBook = await contract.AddBook("Book test 1", 1, 1);
      const transactionAddBookReceipt = await transactionAddBook.wait();
      if (transactionAddBookReceipt.status != 1) {
        console.log("Transaction was not successful");
        return;
      }
      books = await contract.GetBooks();
      console.log(books);
    }

    book1 = bookExists(books, 1);
    // Borrow
    if (book1.copies > book1.borrowed) {
      const transactionBorrowBook = await contract.Borrow(1);
      const transactionBorrowReceipt = await transactionBorrowBook.wait();
      if (transactionBorrowReceipt.status != 1) {
        console.log("Transaction was not successful");
        return;
      }
      console.log("Book Borrowed successfully");
      books = await contract.GetBooks();
      console.log(books);
    }
    book1 = bookExists(books, 1);
    // Return book
    if (book1.borrowed > 0) {
      const transactionReturnBook = await contract.ReturnBook(1);
      const transactionReturnReceipt = await transactionReturnBook.wait();
      if (transactionReturnReceipt.status != 1) {
        console.log("Transaction was not successful");
        return;
      }
      console.log("Book Returned successfully");
      books = await contract.GetBooks();
      console.log(books);
    }
  };

  bookExists = function (books, id) {
    for (var i = 0; i < books.length; i++) {
      if (books[i].id == id) {
        return books[i];
      }
    }
    return false;
  };

  getContract = function (wallet) {
    return new hre.ethers.Contract(
      process.env.BOOK_STORE_CONTRACT_ADDRESS,
      BookStore.abi,
      wallet
    );
  };
  getWallet = function (provider) {
    return new hre.ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  };
  getProvider = function (providername) {
    switch (providername) {
      case "rinkeby":
        return new hre.ethers.providers.InfuraProvider(
          providername,
          process.env.INFURA_PROJECT_ID
        );
      default:
        return new hre.ethers.providers.JsonRpcProvider(
          "http://localhost:8545"
        );
    }
  };
  exec();
})();
