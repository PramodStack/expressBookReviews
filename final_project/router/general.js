const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://" + "localhost:5000";

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered"
    });
});

// Task 10: Get all books using Async/Await with Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});

// Internal endpoint for Axios
public_users.get('/books', function (req, res) {
    res.json(books);
});

// Task 11: Get book by ISBN using Async/Await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`${BASE_URL}/books`);

        if (response.data[isbn]) {
            return res.status(200).json(response.data[isbn]);
        }

        return res.status(404).json({
            message: "Book not found"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book"
        });
    }
});

// Task 12: Get books by author using Async/Await with Axios
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(`${BASE_URL}/books`);

        const result = {};

        Object.keys(response.data).forEach((key) => {
            if (
                response.data[key].author.toLowerCase() ===
                author.toLowerCase()
            ) {
                result[key] = response.data[key];
            }
        });

        if (Object.keys(result).length > 0) {
            return res.status(200).json(result);
        }

        return res.status(404).json({
            message: "No books found for this author"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});

// Task 13: Get books by title using Async/Await with Axios
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get(`${BASE_URL}/books`);

        const result = {};

        Object.keys(response.data).forEach((key) => {
            if (
                response.data[key].title.toLowerCase() ===
                title.toLowerCase()
            ) {
                result[key] = response.data[key];
            }
        });

        if (Object.keys(result).length > 0) {
            return res.status(200).json(result);
        }

        return res.status(404).json({
            message: "No books found for this title"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
