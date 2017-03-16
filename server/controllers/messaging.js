module.exports = {
	receiveMessage(req, res) {
		console.log('Received a message!');
		res.end();
	},
	sendMessage(req, res) {
		const facebookUrl = '';
		const accessToken = process.env.PAGE_ACCESS_TOKEN;
	},
};