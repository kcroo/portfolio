/*
Author: Kirsten Corrao
Date: 06/08/2020
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


/*** error codes ***/ 
// error when request's body is missing an attribute
const attributeMissingError = {
  "code": 400,
  "data": {
    "error": "The requested object is missing at least one of the required attributes"
  }
};

// error if ID token is not valid and user can't be authenticated
const userNotAuthenticatedError = {
  "code": 401,
  "data": {
    "error": "The user cannot be authenticated."
  }
}

// error when authenticated user tries to modify an item that they don't own
const forbiddenError = {
  "code": 403,
  "data": {
    "error": "That action is forbidden for the authenticated user."
  }
};

// error when authenticated user tries to add trailhead to trail that already exists
const alreadyExistsError = {
  "code": 403,
  "data": {
    "error": "That content already exists and cannot be added again."
  }
};

// error when authenticated user tries to add trailhead to trail that already exists
const relationshipDoesNotExistError = {
  "code": 403,
  "data": {
    "error": "That relationship does not exist."
  }
};

// error when non-protected resource is not found
const doesNotExistError = {
  "code": 404,
  "data": {
    "error": "The requested item does not exist."
  }
};

// error when trying to access a route that is not supported by API 
const methodNotAllowedError = {
  "code": 405,
  "data": {
    "error": "That method is not allowed."
  }
}

// error when request's Accept header isn't set to */* or JSON (or HTML for getBoat)
const acceptTypeError = {
  "code": 406,
  "data": {
    "error": "The request's accept type is not valid."
  }
};

// *** routes *** 

// welcome page: sends authentication request to google
app.get('/', async(req, res) => {
  res.render("index.html");
});

// // returns a trail by its ID that is owned by the authenticated user
// app.get('/trails/:trailId', async function(req, res){
//   const result = await getEntity(req.params.trailId, TRAIL, req.headers);
//   res.status(result.code).send(result.data);
// });

// // returns a trailhead by its ID (no authentication needed)
// app.get('/trailheads/:trailheadId', async function(req, res){
//   const result = await getEntity(req.params.trailheadId, TRAILHEAD, req.headers);
//   res.status(result.code).send(result.data);
// });

// // returns array of all trails that are owned by the authenticated user, with pagination
// app.get('/trails', async function(req, res){
//   const result = await getEntitiesPagination(TRAIL, req.headers, req.query.nextPage);
//   res.status(result.code).send(result.data);
// });

// // returns array of all trailheads, with pagination
// app.get('/trailheads', async function(req, res){
//   const result = await getEntitiesPagination(TRAILHEAD, req.headers, req.query.nextPage);
//   res.status(result.code).send(result.data);
// });

// // creates new trail if all data is provided in body; request and response must be JSON; otherwise error message
// app.post('/trails', async(req, res) => {
//   const result = await postEntity(TRAIL, req.headers, req.body).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // creates new trailhead if all data is provided in body; request and response must be JSON; otherwise error message
// app.post('/trailheads', async(req, res) => {
//   const result = await postEntity(TRAILHEAD, req.headers, req.body).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // replaces existing trails's information with that provided in body
// app.put("/trails/:trailId", async(req, res) => {
//   const result = await putEntity(req.params.trailId, TRAIL, req.headers, req.body).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // replaces existing trailhead's information with that provided in body
// app.put("/trailheads/:trailheadId", async(req, res) => {
//   const result = await putEntity(req.params.trailheadId, TRAILHEAD, req.headers, req.body).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // edits some or all of a trails's information
// app.patch("/trails/:trailId", async(req, res) => {
//   const result = await patchEntity(req.params.trailId, TRAIL, req.headers, req.body).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // edits some or all of a trailheads's information
// app.patch("/trailheads/:trailheadId", async(req, res) => {
//   const result = await patchEntity(req.params.trailheadId, TRAILHEAD, req.headers, req.body).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // deletes a trail from datastore if the authenticated user owns it
// app.delete("/trails/:trailId", async(req, res) => {
//   const result = await deleteEntity(req.params.trailId, TRAIL, req.headers).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // deletes a trailhead from datastore. also removes it from any trail it is assigned to. no authentication
// app.delete("/trailheads/:trailheadId", async(req, res) => {
//   const result = await deleteEntity(req.params.trailheadId, TRAILHEAD, req.headers).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // can't get a trail's trailheads directoy -> 405 error
// app.put('/trails/:trailId/trailheads/:trailheadId', async(req, res) => {
//   const result = await assignTrailheadToTrail(req.params.trailId, req.params.trailheadId, req.headers).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // adds a trailhead to a trail, if the authenticated user owns that trail
// app.put('/trails/:trailId/trailheads/:trailheadId', async(req, res) => {
//   const result = await assignTrailheadToTrail(req.params.trailId, req.params.trailheadId, req.headers).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // removes a trailhead from a trail, if the authenticated user owns that trail
// app.delete('/trails/:trailId/trailheads/:trailheadId', async(req, res) => {
//   const result = await removeTrailheadFromTrail(req.params.trailId, req.params.trailheadId, req.headers).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// // returns userId, first name, adn last name of all users (no authentication required)
// app.get('/users', async(req, res) => {
//   const result = await getEntitiesPagination(USER, req.headers, req.query.nextPage).catch(error => console.log(error));
//   res.status(result.code).send(result.data);
// });

// no other methods allowed for /trails
app.all('/', async(req, res) => {
  const result = methodNotAllowedError;
  res.setHeader('Allow', 'GET, POST')
  res.status(result.code).send(result.data);
});

// // no other methods allowed for /trailheads
// app.all('/trailheads', async(req, res) => {
//   const result = methodNotAllowedError;
//   res.setHeader('Allow', 'GET, POST')
//   res.status(result.code).send(result.data);
// });

// // no other methods allowed for /users
// app.all('/users', async(req, res) => {
//   const result = methodNotAllowedError;
//   res.setHeader('Allow', 'GET')
//   res.status(result.code).send(result.data);
// });

// listen to GAE port if it exists; 8001 otherwise
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
