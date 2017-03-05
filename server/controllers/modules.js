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
};
