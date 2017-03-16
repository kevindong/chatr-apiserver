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
		const providedToken = req.query['hub.verify_token'];
		const accessToken = process.env.PAGE_ACCESS_TOKEN;
		
		res.send(req.query['hub.challenge']);
	},
};