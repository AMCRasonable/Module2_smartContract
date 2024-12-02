import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json"; // Import the ABI

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [books, setBooks] = useState([]); // Stores books for the current account
  const [newBook, setNewBook] = useState({ title: "", author: "", genre: "" }); // Stores new book input

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
  const atmABI = atm_abi.abi;

  // Get the user's wallet
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      console.log("Ethereum wallet detected");
    } else {
      console.log("No Ethereum wallet detected");
      alert("Please install MetaMask!");
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  // Handle the connected account
  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
      getBookTrackerContract();
    } else {
      console.log("No account found");
      alert("Please connect to MetaMask");
    }
  };

  // Connect the account to the wallet
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
  };

  // Get the contract instance
  const getBookTrackerContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const bookTrackerContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(bookTrackerContract);
  };

  // Fetch books from the contract
  const fetchBooks = async () => {
    if (atm && account) {
      try {
        const userBooks = await atm.getBooks();
        console.log("Fetched books:", userBooks);

        // Map through the books and structure them for the frontend
        const processedBooks = userBooks.map((book) => ({
          title: book.title,
          author: book.author,
          genre: book.genre, 
        }));

        setBooks(processedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        alert("Failed to fetch books from the contract");
      }
    }
  };

  // Add a new book to the contract
  const addBook = async () => {
    if (atm && newBook.title && newBook.author && newBook.genre) {
      try {
        const tx = await atm.addBook(newBook.title, newBook.author, newBook.genre); // Add book to contract
        await tx.wait(); // Wait for transaction confirmation
        setNewBook({ title: "", author: "", genre: "" }); // Clear input fields
        fetchBooks(); // Fetch books after adding a new one
      } catch (error) {
        console.error("Error adding book:", error);
        alert("Failed to add book");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Initialize user interface
  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this Book Tracker.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        
        <h2>Add a New Book</h2>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="Genre (e.g., Fiction)"
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
        />
        <button onClick={addBook}>Add Book</button>

        <h2>Your Books</h2>
        {books.length > 0 ? (
          <ul>
            {books.map((book, index) => (
              <li key={index}>
                <strong>{book.title}</strong> by {book.author} (Genre: {book.genre})
              </li>
            ))}
          </ul>
        ) : (
          <p>No books added yet.</p>
        )}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (atm) {
      fetchBooks(); // Fetch books when contract is ready
    }
  }, [atm]);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Your Book Tracker!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
