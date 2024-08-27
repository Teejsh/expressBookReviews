const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=> { //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    let book_keys = Object.keys(books);
    const new_books = JSON.stringify(books);
    let filtered_book = {}
    let filtered_keys = book_keys.filter((isbn) => isbn === req.params.isbn);
    
    if (filtered_keys.length > 0) {
        // Select the first matching user and update attributes if provided
        filtered_book = books[filtered_keys[0]];
        //console.log(filtered_book)

        let review = req.query.review;    
        if (review) {
            filtered_book["reviews"]["review"] = review
        }
        
        
        books = JSON.parse(new_books);
    
        res.send(`Review with the isbn ${req.params.isbn} updated.`);
    } else {
        // Send error message if no book found
        res.send("Unable to find book!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let book_keys = Object.keys(books);
    const new_books = JSON.stringify(books);
    filtered_keys = book_keys.filter((isbn) => isbn === req.params.isbn);

    if (filtered_keys.length > 0) {
        delete books[filtered_keys[0]];
               
        // Send a success message as the response, indicating the book has been deleted
        res.send(`Book with the isbn ${req.params.isbn} deleted.`);
    } else {
        // Send error message if no book found
        res.send("Unable to find book!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
