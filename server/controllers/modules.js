const Modules = require('../models').Module;

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
};