const Modules = require('../models').Module;

module.exports = {
	testGet(req, res) {
		res.status(200).send('speaking from the modules controller!');
	},
};