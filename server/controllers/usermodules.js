"use strict";
const {UserModules, Modules, Users} = require('../models');

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
					.then((arr) => {
						res.send(arr);
					})
					.catch(e => {
						console.error(e);
						res.status(500).send(e);
					});
			})
			.catch(e => {
				console.error(e);
				res.status(500).send(e);
			})
	},
	E_MODULE_NOT_ADDED: 1,
	E_MODULE_PRODUCED_ERROR: 2,
	E_NO_CONTEXT: 3,
	/**
	 * Given the below parameters, this method should produce the message to return to the user
	 *
	 * Modules are given 2 global variables: the message "message" and a user id "userId". They must globally return
	 * the message as a string that they want to return to the user
	 *
	 * @param userId The ID of the user messaging their bot
	 * @param query The user's message
	 * @returns {Promise} A promise that resolves an object {message, errorReason, error}. If there is an error,
	 * errorReason will be set to 1 if the module is not in the user's bot, 2 if the module crashed, or 3 if the user
	 * didn't @mention a bot in their first message. If the module crashed, error will have the stack trace. If none
	 * of those happens, message will have the message.
	 */
	getMessage(userId, query) {
		return new Promise(function (resolve, reject) {
			const E_MODULE_NOT_ADDED = 1;
			const E_MODULE_PRODUCED_ERROR = 2;
			const E_NO_CONTEXT = 3;
			const response = {
				message: "",
				errorReason: 0,
				error: null
			};

			new Promise(function (resolve, reject) {
				if (query[0] === "@") {
					const mName = query.split(" ")[0].substr(1);
					Users.update({
						context: mName,
						where: {
							id: userId
						}
					}).then(() => resolve(mName)).catch(e => reject(e));
				} else {
					Users.findById(userId).then(user => {
						const context = user.dataValues.context;

						if (context === "" || context === null) {
							response.errorReason = E_NO_CONTEXT;
							resolve(response);
						}

						resolve(user.dataValues.context);
					}).catch(e => reject(e));
				}
			}).then((moduleName) => {
				// There was an error
				if (moduleName.hasOwnProperty("errorReason")) resolve(moduleName);

				let usersModules = [];

				UserModules.findAll({
					where: {
						userId: userId
					}
				}).then(modules => {
					usersModules = modules.map(e => e.dataValues);
				}).then(
					Modules.findAll({
						where: {
							name: moduleName
						}
					}).then(modules => {
						if (modules.length === 0) {
							response.errorReason = E_MODULE_NOT_ADDED;
							resolve(response);
						}

						try {
							response.message = eval('(function(message, userId){' + modules[0].dataValues.code +
								'})("' + query.replace("\"", "\\\"") + '", ' + userId + ')');
							resolve(response);
						} catch (e) {
							response.errorReason = E_MODULE_PRODUCED_ERROR;
							response.error = e;
							resolve(response);
						}
					}).catch(e => reject(e))
				).catch(e => reject(e));
			}).then(response => resolve(response)).catch((e) => reject(e));
		});
	},
};