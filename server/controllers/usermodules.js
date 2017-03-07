const UserModules = require('../models').UserModule;

module.exports = {
	testGet(req, res) {
		res.status(200).send('speaking from the userModules controller!');
	},
	enableModule(req, res) {
		return UserModules
			.findOrCreate({
				where: {
					userId: req.body.userId,
					moduleId: req.body.moduleId,
				},
				defaults: {
					active: true,
				},
			})
			.spread((user, created) => {
				user
				.update({
					active: true,
				})
				.then((userModule) => {
					res.status(200).send(userModule);
				});
			});
	},
	disableModule(req, res) {
		return UserModules
			.findOrCreate({
				where: {
					userId: req.body.userId,
					moduleId: req.body.moduleId,
				},
				defaults: {
					active: false,
				},
			})
			.spread((user, created) => {
				user
				.update({
					active: false,
				})
				.then((userModule) => {
					res.status(200).send(userModule);
				});
			});
	},
};