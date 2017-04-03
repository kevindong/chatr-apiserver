const UserModules = require('../models').UserModule;

module.exports = {
	testGet(req, res) {
		res.status(200).send('speaking from the userModules controller!');
	},
	retrieve(req, res) {
		return UserModules
			.findById(req.params.moduleId)
			.then((module) => {
				if (!module) {
					return res.status(404).send({
						message: 'Bot Not Found',
					});
				}
				return res.status(200).send(module);
			})
			.catch((error) => {
				console.log(error);
				res.status(400).send('Error looking up bot');
			});
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
	getCount(req, res) {
		UserModules.findAndCountAll({where: {moduleId: req.params.id}}).then(r => res.send(r.count));
	}
};