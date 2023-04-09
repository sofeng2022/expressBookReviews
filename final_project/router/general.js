const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    for (let i = 1; i <= 10; i++) {
        if (books[i].author === author)
            return res.send(books[i])

    }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    for (let i = 1; i <= 10; i++) {
        if (books[i].title === title)
            return res.send(books[i])

    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews)
});


function getAllBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });

}
getAllBooks();

function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    })
}
getByISBN(1)

function getByAuthor(author) {
    return new Promise((resolve, reject) => {
        let authorname = author;
        if (books[author]) {
            resolve(books[author]);
        }
    })
}
getByAuthor("Chinua Achebe")


function getByTitle(title) {
    return new Promise((resolve, reject) => {

        if (books[title]) {
            resolve(books[title]);
        }
    })
}
getByTitle("Things Fall Apart")

module.exports.general = public_users;
