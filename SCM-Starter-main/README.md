# Book Tracker - Starter Next/Hardhat Project

This project is a full-stack decentralized application (dApp) built with Next.js for the front-end and Hardhat for the smart contract development. The BookTracker smart contract allows users to add and view their books on the blockchain.

## Prerequisites
Before you begin, ensure you have the following installed:

1. Node.js (LTS version recommended) – Download Node.js
2. MetaMask or any Ethereum-compatible wallet installed in your browser
3. Hardhat (used for smart contract development and testing)
4. Next.js (used for building the front-end)

## Getting Started
1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

## Interacting with the Book Tracker dApp
Once you’ve deployed the smart contract and launched the front-end, you can interact with it:

1. Add a New Book: Use the form to add a book (title, author, genre) to the blockchain.
2. View Your Books: After adding a book, you can view the list of books associated with your Ethereum account.

## Author
Ana Mary Colin A. Rasonable
