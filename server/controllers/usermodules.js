"use strict";
const UserModules = require('../models').UserModule;
const Modules = require('../models').Module;

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
		UserModules.findAndCountAll({
			where: {
				moduleId: req.params.moduleId
			}
		})
			.then(r => res.send(r.count.toString()))
			.catch(e => {
				console.error(e);
				res.status(500).send(e);
			});
	},
	getModules(req, res) {
		UserModules.findAll({
			where: {
				id: req.params.botId
			}
		})
			.then(modules => {
				const ids = modules.map(e => e.dataValues.moduleId);
				let result = [];
				new Promise(function (resolve, reject) {
					(function f(id) {
						Modules
							.findById(ids[id])
							.then(module => result.push(module.dataValues))
							.then(() => {
								if (id === ids.length - 1) resolve(result);
								else f(id + 1);
							})
							.catch(reject);
					})(0);
				})
					.then((arr) => { res.send(arr); })
					.catch(e => {
						console.error(e);
						res.status(500).send(e);
					});
			})
			.catch(e => {
				console.error(e);
				res.status(500).send(e);
			})
	}
};