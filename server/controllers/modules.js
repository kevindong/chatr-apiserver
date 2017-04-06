"use strict";
const Modules = require('../models').Module;
const config = require('../../webpack.config');
const webpack = require('webpack')(config);
const fs = require('fs');
const os = require('os');
const npmi = require('npmi');

function condenseFiles(files) {
	return new Promise((resolve, reject) => {
		if (files.length > 1) {
			files.forEach(f => fs.writeFileSync(os.tmpdir() + '/' + f.originalname, f.buffer));
			npmi({path: os.tmpdir()}, (err, data) => {
				if (err) {
					console.error(err);
					reject(err);
				}

				webpack.run((err, stats) => {
					if (err) {
						console.error(err);
						reject(err);
					}

					resolve(fs.readFileSync(os.tmpdir() + '/bundle.js', 'utf-8'));
				});
			});
		} else resolve(files[0].buffer.toString());
	});
}

module.exports = {
	testGet(req, res) {
		res.status(200).send('speaking from the modules controller!');
	},
	retrieve(req, res) {
		return Modules
			.findById(req.params.moduleId)
			.then((module) => {
				if (!module) {
					return res.status(404).send({
						message: 'Module Not Found',
					});
				}
				return res.status(200).send(module);
			}).catch((error) => {
				console.log(error);
				res.status(400).send('Error looking up module');
			});
	},
	pending(req, res) {
		return Modules
			.findAll({
				where: {
					pendingCode: {
						$ne: null,
					},
					pendingCodeIsApproved: null,
				}
			}).then((modules) => {
				if (!modules) {
					return res.status(404).send({
						message: 'Modules not found',
					});
				}
				return res.status(200).send(modules);
			}).catch((error) => {
				console.log(error);
				res.status(400).send('Error finding pending modules');
			})
	},
	approve(req, res) {
		Modules
			.update({
				pendingCodeIsApproved: true
			}, {
				where: {
					id: req.params.moduleId
				}
			}).then((module) => {
			res.status(200).send('Module approved');
		}).catch((error) => {
			console.log(error);
			res.status(400).send('Error approving module');
		});
	},
	deny(req, res) {
		Modules
			.update({
				pendingCodeIsApproved: false
			}, {
				where: {
					id: req.params.moduleId
				}
			}).then((module) => {
			res.status(200).send('Module denied');
		}).catch((error) => {
			console.log(error);
			res.status(400).send('Error denying module');
		});
	},
	uploadModule(req, res) {
		condenseFiles(req.files).then(code => {
			Modules.create({
				name: req.body.module_name,
				userId: req.body.userId,
				description: req.body.module_desc,
				code: code,
				codeIsApproved: false,
				createdAt: new Date()
			}).then(() => {
				res.status(200).end();
			}).catch((e) => {
				res.status(500).send(e)
			});
		});
	},
	update(req, res) {
		condenseFiles(req.files).then(code => {
			Modules.update({
				pendingCode: code,
				pendingCodeIsApproved: false,
				updatedAt: new Date()
			}, {
				where: {
					id: req.body.moduleId
				}
			}).then(() => {
				res.status(200).end()
			}).catch((e) => {
				res.status(500).send(e)
			});
		});
	},
	getModules(req, res) {
		return Modules
			.findAll({
				where: {
					code: {
						$ne: null,
					},
					active: true
				}
			}).then((modules) => {
				return res.status(200).send(modules);
			}).catch((error) => {
				console.log(error);
				return res.status(400).send('Error finding pending modules');
			})
	},
	getModulesForUser(req, res) {
		Modules.findAll({where: {userId: req.params.userId}}).then(res.send);
	},
	search(req, res) {
		let query = req.query.q;

		let searchIn = Object.keys(req.query).filter(k => {
			return k !== 'q' && req.query[k];
		});

		let or = [];
		searchIn.forEach(i => {
			const item = {};
			item[i] = {$iLike: '%' + query.toLowerCase() + '%'};
			or.push(item);
		});

		return Modules.findAll({where: {"$or": or}}).then(modules => res.send(modules));
	},
	delete(req, res) {
		if (req.body.id === undefined) {
			return res.status(400).send('You must specify the ID of the module to be deleted.');
		}
		return Modules
			.destroy({
				where: {
					id: req.body.id
				}
			}).then((value) => {
					if (value !== 0) {
						return res.status(200).send('Module deleted.');
					} else {
						return res.status(404).send('Module not found in database.');
					}
				}
			).catch((error) => {
				return res.status(400).send(error);
			});
	},
	banned(req, res) {
		return Modules
			.findAll({
				where: {
					isBanned: true,
				}
			}).then((modules) => {
				if (!modules) {
					return res.status(404).send({
						message: 'Modules not found',
					});
				}
				return res.status(200).send(modules);
			}).catch((error) => {
				console.log(error);
				res.status(400).send('Error finding banned modules');
			})
	},
};
