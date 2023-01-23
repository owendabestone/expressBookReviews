const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    console.log(username)
    console.log(password)
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
    }
//only registered users can login
regd_users.post("/login", urlencodedParser,(req, res) => {
    console.log(users);
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", urlencodedParser,(req, res) => {
    let username = req.session.username;
    books[(req.params.isbn).toString()].reviews[username] = req.body.review;

    return res.status(200).send(JSON.stringify( books[(req.params.isbn).toString()]));
});

regd_users.delete("/auth/review/:isbn", urlencodedParser,(req, res) => {
    let username = req.session.username;
    let remainusers = Object.keys(books[(req.params.isbn).toString()].reviews).filter(
        (user)=>{
            user != username;
        }
    )
    let out = {}
    for (let i = 0; i < remainusers.length; i ++){
        out[remainusers[i]] = books[(req.params.isbn).toString()].reviews[remainusers[i]]
    }
    books[(req.params.isbn).toString()]['reviews'] = out;

    return res.status(200).send('Review deleted. Exisiting reviews:'+JSON.stringify( books[(req.params.isbn).toString()]));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
