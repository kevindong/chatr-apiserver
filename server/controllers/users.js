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
	delete(req, res) {
		if (req.body.email === undefined) {
			return res.status(400).send('You must specify a user to delete using their email.');
		}
		return User
			.destroy({
				where: {
					email: req.body.email
				}
			})
			.then((value) => {
					if (value !== 0) {
						return res.status(200).send('User deleted.');
					} else {
						return res.status(404).send('User email not found in database.');
					}
				}
			)
			.catch((error) => {
				return res.status(400).send(error);
			});
	},
	getAll(req, res) {
		return User
			.findAll()
			.then((users) => {
				return res.status(200).send(users.map(e => e.dataValues));
			}).catch((error) => {
				console.log(error);
				return res.status(400).send('Error finding pending modules');
			})
	},
	banned(req, res) {
		return User
			.findAll({
				where: {
					isBanned: true,
				}
			}).then((users) => {
				if (!users) {
					return res.status(404).send({
						message: 'Users not found',
					});
				}
				return res.status(200).send(users);
			}).catch((error) => {
				console.log(error);
				res.status(400).send('Error finding banned users');
			})
	},
};
