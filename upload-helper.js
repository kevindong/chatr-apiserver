const config = require('./webpack.config');
const webpack = require('webpack')(config);
const spawn = require('child_process').spawn;
const fs = require('fs');
const pg = require('pg');

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
	condenseFiles: condenseFiles,
	insertInDatabase: insertInDatabase
};