const User = require('../models').User;

module.exports = {
	testGet(req, res) {
		res.status(200).send('speaking from the users controller!');
	},
	create(req, res) {
		return User
			.create({
				FBOAuthToken: req.body.FBOAuthToken,
				FBSenderId: req.body.FBSenderId,
				context: req.body.context,
				contextLastChanged: req.body.contextLastChanged,
				sessionToken: req.body.sessionToken,
			})
			.then((user) => {
				res.status(201).send(user);
			})
			.catch((error) => {
				res.status(400).send(error);
			});
	},
	retrieve(req, res) {
		return User
			.findById(req.params.userId)
			.then((user) => {
				if (!user) {
					return res.status(404).send({
						message: 'User Not Found',
					});
				}
				return res.status(200).send(user);
			})
			.catch((error) => {
				res.status(400).send(error);
			});
	},
};