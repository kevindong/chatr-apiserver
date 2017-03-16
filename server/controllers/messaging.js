module.exports = {
	receiveMessage(req, res) {
		console.log('Received a message!');
		res.end();
	},
	sendMessage(req, res) {
		const facebookUrl = '';
		const accessToken = process.env.PAGE_ACCESS_TOKEN;
	},
	facebookSubscription(req, res) {
		console.log(req.params);
		const providedToken = req.params['hub.verify_token'];
		const accessToken = process.env.PAGE_ACCESS_TOKEN;
		console.log(`Have: ${accessToken}, got: ${providedToken}`);
		res.send(req.params['hub.challenge']);
	},
};