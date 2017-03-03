const uploadHelper = require('./upload-helper');
const databaseHelper = require('./database-helper');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.text());
const port = process.env.PORT || 8080;
const fs = require('fs');

//Load '.env' into process.env
dotenv.config();

//Parses POST request bodys into req.body.[key] and Accepts JSON or url encoding.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, }));

// Imports routes from controller
require('./server/routes')(app);

app.get('/', (req, res) => {
	res.send('Hello from the dev api server!');
});

//Used to test the parsing of data for both the server and client.
app.post('/testPost', (req, res) => {
	console.log(`Incoming test post, body: ${JSON.stringify(req.body)}`);

	//Get all keys from the req.body in an array.
	const keys = Object.keys(req.body);
	//Map each key/value pair into a \n seperated string.
	const bodyPairs = keys.map((key) => {
		return `req.body.${key}: ${req.body[key]}`;
	}).join('\n');

	const responseText =
`Got a request with body:
${bodyPairs}`;
	res.send(responseText);
});

//Error handling for invalid requests.
app.use((err, req, res, next) => {
	console.error(`Error in request. ${err.stack}`);
	res.status(500).send('Uh oh, your request had an error! Make sure it\'s formatted correctly.');
});

app.post('/modules/upload', function uploadModule(req, res) {
	let files = req.files.map(file => file.path);
	let code = uploadHelper.condenseFiles(files);
	let userId = req.body.userId;
	let name = req.body.module_name;
	let desc = req.body.module_id;

	uploadHelper.insertInDatabase(name, desc, userId, code);
});

app.get('/modules/list', function getModules(req, res) {
	res.send(databaseHelper.listModules(null));
});

app.get('/modules/:user/list', function getModulesForUser(req, res) {
	res.send(databaseHelper.listModules(req.params.user))
});

app.get('/modules/:moduleId', function getModule(req, res) {

});

app.listen(port, () => {
	console.log(`Api server listening on port ${port}`);
});

module.exports = app;