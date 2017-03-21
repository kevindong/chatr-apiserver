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
	if (files.length > 1) {
		spawn('mkdir', ['/temp/chatr', '&&', 'cd', '/temp/chatr']);
		files.forEach(file => fs.writeFileSync(file.name, file, null));
		spawn('npm', ['install']);
		webpack.run();
		return fs.readFileSync('bundle.js', 'utf-8');
	} else {
		return files[0];
	}
}

function insertInDatabase(name, desc, userId, code) {
	Modules.create({
		name: name,
		userId: userId,
		description: desc,
		code: code
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

		insertInDatabase(name, desc, userId, code);
		res.status(200);
	},
	getModules(req, res) {
		res.send(listModules(null));
	},
	getModulesForUser(req, res) {
		Modules.findAll().then(m => res.send(m));
	},
	getModule(req, res) {
		Modules.findAll({
			where: {userId: req.params.moduleId}
		}).then(m => res.send(m));
	}
};
