const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 8080;

//Load '.env' into process.env
dotenv.config();

//Parses POST request bodys into req.body.[key] and Accepts JSON or url encoding.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, }));

// CORS
// Add headers
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});

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

app.listen(port, () => {
	console.log(`Api server listening on port ${port}`);
});

module.exports = app;
