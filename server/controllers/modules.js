const Modules = require('../models').Module;
const config = require('../../webpack.config');
const webpack = require('webpack')(config);
const spawn = require('child_process').spawn;
const fs = require('fs');
const pg = require('pg');

function listModules(user) {
	let client = new pg.Client();
	client.connect(function (err) {
		if (err) throw err;

		// execute a query on our database
		client.query("SELECT name FROM Modules" + (user != null ? " WHERE userId=" + user : ""), function (err, result) {
			if (err) throw err;

			// disconnect the client
			client.end(function (err) {
				if (err) throw err;
			});

			return result.rows.map(item => item.name);
		});
	});
}

function getModules(req, res) {
	res.send(listModules(null));
}

function getModulesForUser(req, res) {
	res.send(listModules(req.params.user))
}

function getModule(req, res) {
	let client = new pg.Client();
	client.connect(function connect(err) {
		if (err) throw err;
		client.query("SELECT * FROM Modules WHERE id=" + req.params.moduleId, function query(err, result) {
			if (err) throw err;

			res.send(result);

			client.end(function end(err) {
				if (err) throw err;
			});
		});
	});
}

function uploadModule(req, res) {
	let files = req.files.map(file => file.path);
	let code = condenseFiles(files);
	let userId = req.body.userId;
	let name = req.body.module_name;
	let desc = req.body.module_id;

	insertInDatabase(name, desc, userId, code);
}

/**
 * @param {Array} files array of files
 * @return {File} the condensed file
 */
function condenseFiles(files) {
	if (files.length > 1) {
		spawn('mkdir', ['/temp/chatr', '&&', 'cd', '/temp/chatr']);
		files.forEach(file => fs.writeFileSync(file.name, file, null));
		spawn('npm', ['install']);
		webpack.run();
		return fs.readFileSync('bundle.js', 'utf-8');
	} else {
		return files[0];
	}
}

function insertInDatabase(name, desc, userId, code) {
	let client = new pg.Client();
	client.connect(function connect(err) {
		if (err) throw err;
		client.query(`INSERT INTO Modules (name, description, userId, code) VALUES (name, desc, userId, code)`, function query(err, res) {
			if (err) throw err;

			client.end(function end(err) {
				if (err) throw err;
			});
		});
	});
}

module.exports = {
	getModules, getModule, uploadModule, getModulesForUser
};