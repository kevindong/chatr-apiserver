const UserModules = require('../models').UserModule;

module.exports = {
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

};