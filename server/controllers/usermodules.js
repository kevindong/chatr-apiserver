const UserModules = require('../models').UserModule;

module.exports = {
	testGet(req, res) {
		res.status(200).send('speaking from the userModules controller!');
	},
};