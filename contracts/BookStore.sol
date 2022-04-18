// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;
import "./Owner.sol";

contract BookStore is Owner {

    struct Book{
        string title;
        uint id;
        uint copies;
        uint borrowed;
        address[] borrow_history;
    }

    Book[] public books;
    mapping(address => uint) public borrows;
    


    function AddBook(string memory _title, uint _id,  uint _copies) external isOwner {
        require(_copies > 0,"copies should be > 0");
        require(_id > 0,"Book id should be greather than 0");
        books.push(Book(_title,_id,_copies,0,new address[](0))); 
    }

    function Borrow(uint _id) public {
        uint bookIndex = _getById(_id);
        require(books[bookIndex].id == _id,"book id not found");
        require(books[bookIndex].copies > books[bookIndex].borrowed, "All copies are already borrowed");
        require(borrows[msg.sender] == 0, "address already borrowed a book");
        borrows[msg.sender] = _id;
        books[bookIndex].borrowed++;
        books[bookIndex].borrow_history.push(msg.sender);
    }

    function ReturnBook(uint _id) public{
        uint bookIndex = _getById(_id);
        require(books[bookIndex].id == _id,"book id not found");
        require(books[bookIndex].borrowed > 0, "No copy was borrowed yet.");
        require(borrows[msg.sender] == _id,"you can't return a book that you did not borrow");
        borrows[msg.sender] = 0;
        books[bookIndex].borrowed--;
    }

    function GetBooks() public view returns(Book[] memory){
        return books;
    }

    function _getById(uint _id) private view returns (uint _i ){
        for (uint i = 0; i< books.length; i++){
            if (books[i].id == _id){
                return i;
            }
        }
        return 0;
    }

}