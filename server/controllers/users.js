const User = require('../models').User;

module.exports = {
	testGet(req, res) {
		res.status(200).send('speaking from the users controller!');
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
	getByEmail(req, res) {
		return User
			.find({
				where: {
					email: req.params.userEmail
				}
			})
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
				return res.status(400).send('Error finding users');
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
	ban(req, res) {
		User
			.update({
				isBanned: true
			}, {
				where: {
					id: req.params.userId
				}
			}).then((user) => {
			res.status(200).send('User banned');
		}).catch((error) => {
			console.log(error);
			res.status(400).send('Error banning user');
		});
	},
	unBan(req, res) {
		User
			.update({
				isBanned: false
			}, {
				where: {
					id: req.params.userId
				}
			}).then((user) => {
			res.status(200).send('User unbanned');
		}).catch((error) => {
			console.log(error);
			res.status(400).send('Error unbanning user');
		});
	},
	makeAdmin(req, res) {
		User
			.update({
				isAdmin: true
			}, {
				where: {
					id: req.params.userId
				}
			}).then((user) => {
			res.status(200).send('User is an admin');
		}).catch((error) => {
			console.log(error);
			res.status(400).send('Error making user an admin');
		});
	},
	revokeAdmin(req, res) {
		User
			.update({
				isAdmin: false
			}, {
				where: {
					id: req.params.userId
				}
			}).then((user) => {
			res.status(200).send('User is no longer an admin');
		}).catch((error) => {
			console.log(error);
			res.status(400).send('Error revoking admin status');
		});
	},
};
