const receiveMessage = (event) => {
	console.log(`Received a message: ${event}`);
};

const sendMessage = (message) => {

};

const webhookHandler = (req, res) => {
	const data = req.body;
	if (data.object === 'page') {
		data.entry.forEach((entry) => {
			const pageID = entry.id;
			const timeOfEvent = entry.time;

			entry.messaging.forEach((event) => {
				if (event.message) {
					receiveMessage(event);
				} else {
					console.log(`Received unknown webhook event: ${event}`);
				}
			});
		});
	}

	//Must send a response to tell Facebook we got the events
	res.sendStatus(200);
};

const webhookAuthenticator = (req, res) => {
	if (req.query['hub.mode'] === 'subscribe') {
		//Verify the access token
		if (req.query['hub.verify_token'] === process.env.PAGE_ACCESS_TOKEN) {
			console.log('Authenticated...');
			res.status(200).send(req.query['hub.challenge']);
		} else {
			//Failed authentication
			console.log(`Authentication failed. Token received: ${req.query['hub.verify_token']}, expected: ${process.env.PAGE_ACCESS_TOKEN}`);
			res.sendStatus(403);
		}
	}
};

module.exports = {
	receiveMessage: receiveMessage,
	sendMessage: sendMessage,
	webhookHandler: webhookHandler,
	webhookAuthenticator: webhookAuthenticator,
};