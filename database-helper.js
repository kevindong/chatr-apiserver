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

module.exports = {
	listModules: listModules
};