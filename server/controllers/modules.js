const Modules = require('../models').Module;
const config = require('../../webpack.config');
const webpack = require('webpack')(config);
const spawn = require('child_process').spawn;
const fs = require('fs');

/**
 * @param {Array} files array of files
 * @return {File} the condensed file
 */
function condenseFiles(files) {
	new Promise((resolve, reject) => {
		if (files.length > 1) {
			spawn('mkdir', ['/temp/chatr'])
				.on('close', status => {
					spawn('cd', ['/temp/chatr'])
						.on('close', status => {
							files.forEach(file => fs.writeFileSync(file.name, file, null));
							spawn('npm', ['install'])
								.on('close', status => {
									webpack.run();
									resolve(fs.readFileSync('bundle.js', 'utf-8'));
								});
						});
				});
		} else {
			resolve(fs.readFileSync(files[0], 'utf-8'));
		}
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
		let files = req.files.map(file => file.path);
		let code = condenseFiles(files);
		let userId = req.body.userId;
		let name = req.body.module_name;
		let desc = req.body.module_id;

		Modules.create({
			name: name,
			userId: userId,
			description: desc,
			code: code
		});
		res.status(200);
	},
	getModules(req, res) {
		Modules.findAll().then(r => res.send(r));
	},
	getModulesForUser(req, res) {
		Modules.findAll({where: {userId: req.params.userId}}).then(m => res.send(m));
	}
};
