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

app.get('/', async(req, res) => {
  res.render("index.html");
});

app.get('/maps', async(req, res) => {
  res.render("maps.html");
});

app.get('/webapps', async(req, res) => {
  res.render("webapps.html");
});

app.get('/consoleapps', async(req, res) => {
  res.render("consoleapps.html");
});

app.get('/scripts', async(req, res) => {
  res.render("scripts.html");
});

// listen to GAE port if it exists; 8001 otherwise
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
