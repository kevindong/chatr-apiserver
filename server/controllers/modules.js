"use strict";
const Modules = require('../models').Module;
const config = require('../../webpack.config')(__dirname);
const webpack = require('webpack')(config);
const exec = require('child_process').exec;
const fs = require('fs');

function condenseFiles(files) {
	return new Promise((resolve, reject) => {
		if (files.length > 1) {
			if (!fs.existsSync(__dirname + '/tmp')) fs.mkdirSync(__dirname + '/tmp');
			files.forEach(f => fs.writeFileSync(__dirname + '/tmp/' + f.originalname, f.buffer));
			exec('cd ' + __dirname + '/tmp && npm install', (err, stdout, stderr) => {
				webpack.run();
				resolve(fs.readFileSync(__dirname + '/tmp/bundle.js', 'utf-8'));
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
			})
			.catch((error) => {
				console.log(error);
				res.status(400).send('Error looking up module');
			});
	},
	pending(req, res) {
		return Modules
			.findAll({
				where: {
					$or: [
						{codeIsApproved: false},
						{
							$and: [
								{pendingCode: null},
								{pendingCodeIsApproved: false},
							]
						},
					]
				}
			})
			.then((modules) => {
				if (!modules) {
					return res.status(404).send({
						message: 'Modules not found',
					});
				}
				return res.status(200).send(modules);
			})
			.catch((error) => {
				console.log(error);
				res.status(400).send('Error finding pending modules');
			})
	},
	approve(req, res) {
		retrieve(req, res).set("pendingCodeIsApproved", true);
	},
	deny(req, res) {
		retrieve(req, res).set("pendingCodeIsDenied", true);
	},
	uploadModule(req, res) {
		condenseFiles(req.files).then(code => {
			Modules.create({
				name: req.body.module_name,
				userId: req.body.userId,
				description: req.body.module_desc,
				code: code
			});

			res.status(200).send(code);
		});
	},
	getModules(req, res) {
		Modules.findAll().then(res.send);
	},
	getModulesForUser(req, res) {
		Modules.findAll({where: {userId: req.params.userId}}).then(res.send);
	}
};
