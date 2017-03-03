"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 8080;
const fs = require('fs');

//Load '.env' into process.env
dotenv.config();

//Parses POST request bodys into req.body.[key] and Accepts JSON or url encoding.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, }));

// Imports routes from controller
require('./server/routes')(app);

//Error handling for invalid requests.
app.use((err, req, res, next) => {
	console.error(`Error in request. ${err.stack}`);
	res.status(500).send('Uh oh, your request had an error! Make sure it\'s formatted correctly.');
});

app.listen(port, () => {
	console.log(`Api server listening on port ${port}`);
});

module.exports = app;