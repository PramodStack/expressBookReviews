const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// ===============================
// Task 6: Register a new user
// ===============================
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check if username already exists
    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    // Add new user
    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered"
    });
});


// ===============================
// Task 1: Get all books
// ===============================
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 2));
});


// ===============================
// Task 2: Get book by ISBN
// ===============================
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


// ===============================
// Task 3: Get books by author
// ===============================
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = {};

    const keys = Object.keys(books);

    keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result[key] = books[key];
        }
    });

    if (Object.keys(result).length > 0) {
        return res.status(200).json(result);
    }

    return res.status(404).json({
        message: "No books found for this author"
    });
});


// ===============================
// Task 4: Get books by title
// ===============================
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const result = {};

    const keys = Object.keys(books);

    keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result[key] = books[key];
        }
    });

    if (Object.keys(result).length > 0) {
        return res.status(200).json(result);
    }

    return res.status(404).json({
        message: "No books found for this title"
    });
});


// ===============================
// Task 5: Get book review
// ===============================
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (Object.keys(books[isbn].reviews).length === 0) {
        return res.status(200).json({
            message: "No reviews found for this book."
        });
    }

    return res.status(200).json(books[isbn].reviews);
});


module.exports.general = public_users;
