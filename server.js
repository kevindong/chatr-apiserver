const uploadHelper = require('./upload-helper');
const databaseHelper = require('./database-helper');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.text());
const port = process.env.PORT || 8080;
const fs = require('fs');

app.get('*', (req, res) => {
	res.send('Hello from the api server!');
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