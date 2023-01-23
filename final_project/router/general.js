const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let new_user = req.query.username;
  let password = req.query.password
    if(!new_user || !password){
        return  res.status(200).json({message: "registration error"});
    }

  if (isValid(new_user)){
    users.push({"username":new_user,"password":password});
    return res.status(200).json({message: "User successfully registred. Now you can login"});
  } else {
      return  res.status(200).json({message: "User has already exist."});
  }

 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let ISBN = req.params.isbn

  return res.status(200).send(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    for (var index = 0; index < Object.keys(books).length; index++){
        if (books[(index+1).toString()].author == req.params.author){
            return res.status(200).send(books[index+1]);
        }
    };
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    for (var index = 0; index < Object.keys(books).length; index++){
        if (books[(index+1).toString()].title== req.params.title){
            return res.status(200).send(books[index+1]);
        }
    };
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let ISBN = req.params.isbn

    return res.status(200).send(books[ISBN].review);
});

module.exports.general = public_users;
