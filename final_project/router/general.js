const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

let url = 'https://towaojosipe-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let book_keys = Object.keys(books);
  let filtered_book = {}
  for (const key of book_keys) {
    if(books[key].author.match(author)) {
        filtered_book = books[key];
    }
  }
  return res.send(filtered_book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let book_keys = Object.keys(books);
  let filtered_book = {}
  for (const key of book_keys) {
  if(books[key].title.match(title)) {
        filtered_book = books[key];
    }
  }
  return res.send(filtered_book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

async function getData() {
    try {
        let result = await axios.get(url)
        console.log(result.data);
    } catch (error) {
        console.error('Error getting data', error);
    }
}

async function getData(isbn) {
    try {
        let result = await axios.get(`${url}/isbn/${isbn}`);
        console.log(result.data);
    } catch (error) {
        console.error('Error getting data', error);
    }
}

async function getDataByAuthor(author) {
    try {
        let result = await axios.get(`${url}/author/${author}`);
        console.log(result.data);
    } catch (error) {
        console.error('Error getting data', error);
    }
}

async function getDataByTitle(title) {
    try {
        let result = await axios.get(`${url}/title/${title}`);
        console.log(result.data);
    } catch (error) {
        console.error('Error getting data', error);
    }
}

getDataByTitle("The Divine Comedy");

module.exports.general = public_users;


