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
	if (typeof files === Array) {
		spawn('mkdir', ['/temp/chatr', '&&', 'cd', '/temp/chatr']);
		files.forEach(file => fs.writeFileSync(file.name, file, null));
		spawn('npm', ['install']);
		webpack.run();
		return fs.readFileSync('bundle.js', 'utf-8');
	} else {
		// files is actually just a file
		return files;
	}
}

function insertInDatabase(code) {
	let client = new pg.Client();
	client.connect(function connect(err) {
		if (err) throw err;
		client.query("", function query(err, res) {
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