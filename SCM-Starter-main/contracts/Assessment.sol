// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address public owner;

    struct Book {
        string title;
        string author;
        string genre; 
    }

    // Mapping to store user's books (indexed by user address)
    mapping(address => Book[]) public userBooks;

    // Event for adding a book
    event BookAdded(address indexed user, string title, string author, string genre);

    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict actions to the owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this contract.");
        _; // Continue execution
    }

    // Add a new book to the contract
    function addBook(string memory _title, string memory _author, string memory _genre) public {
        Book memory newBook = Book({
            title: _title,
            author: _author,
            genre: _genre 
        });

        userBooks[msg.sender].push(newBook);

        emit BookAdded(msg.sender, _title, _author, _genre);
    }

    // Get the books of the caller (user)
    function getBooks() public view returns (Book[] memory) {
        return userBooks[msg.sender];
    }

    // Only the owner can reset the contract (optional, depending on your use case)
    function resetContract() public onlyOwner {
        selfdestruct(payable(owner)); // Self-destructs the contract and sends remaining balance to the owner
    }
}
