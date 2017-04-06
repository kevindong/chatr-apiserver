const User = require('../models').User;
const request = require('request');

const linkUser = () => {

};

const sendMessage = (user, message, quickReplies) => {
	if (!user || !message) {
		console.error(`Could not send message, "${message}", to user, ${user}`);
		return;
	}
	const postData = {
		recipient: {
			id: `${user}`,
		},
		message: {
			text: message,
		},
	};
	request.post({
		url: `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
		json: postData,
	}, (error, response, body) => {
		if (response.statusCode !== 200 || error) {
			console.error(response);
			console.error(error);
			return;
		}
		console.log(`Sent message_id ${body.message_id} to recipient_id ${body.recipient_id}`);
	});
};

const sendMessageReq = (req, res) => {
	const message = req.body.message;
	const user = req.params.id;
	sendMessage(user, message);
	res.status(200).end();
};
const receiveMessage = (event) => {
	console.log(`Received a message: ${JSON.stringify(event)}`);
	sendMessage(event.sender.id, 'Hey there!');
};
/* For next sprint
const receiveMessage = (event) => {
	const messengerId = event.sender.id;
	User
		.find({
			where: {
				messengerId: messengerId,
			},
		})
		.then((user) => {
			sendMessage(messengerId, `Hello there, ${messengerId}!`);
		})
		.catch((error) => {
			sendMessage(messengerId, `Could not find a user with messenger id ${messengerId}`);
		});
	console.log(`Received a message: ${JSON.stringify(event)}`);
};
*/
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
	sendMessageReq: sendMessageReq,
	webhookHandler: webhookHandler,
	webhookAuthenticator: webhookAuthenticator,
};