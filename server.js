const uploadHelper = require('./upload-helper');
const databaseHelper = require('./database-helper');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.text());
const port = process.env.PORT || 8080;

app.get('*', (req, res) => {
	res.send('Hello from the api server!');
});

app.post('/modules/upload', function uploadModule(req, res) {
	let files = [];
	let userId = 0;

	let code = uploadHelper.condenseFiles(files);
	uploadHelper.insertInDatabase(code, userId);
});

app.get('/modules/list', function getModules(req, res) {
	res.send(databaseHelper.listModules(null));
});

app.get('/modules/:user/list', function getModulesForUser(req, res) {
	res.send(databaseHelper.listModules(req.params.user))
});

app.listen(port, () => {
	console.log(`Api server listening on port ${port}`);
});