/*
Author: Kirsten Corrao
Date: 07/08/2020
Portfolio Website
*/

// set up necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const nunjucks = require('nunjucks');

const app = express();
app.use('/public', express.static('public'))
app.use(bodyParser.json());

nunjucks.configure('views', { 
  autoescape: true,
  express: app
 });

// *** routes *** 

// welcome page: sends authentication request to google
app.get('/', async(req, res) => {
  res.render("index.html");
});

// no other methods allowed for /trails
app.all('/', async(req, res) => {
  const result = methodNotAllowedError;
  res.setHeader('Allow', 'GET, POST')
  res.status(result.code).send(result.data);
});

// listen to GAE port if it exists; 8001 otherwise
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
