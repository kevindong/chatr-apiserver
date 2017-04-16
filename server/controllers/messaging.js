'use strict';
const User = require('../models').User;
const request = require('request');
const bots = require('./usermodules');

const linkUser = () => {

};

const sendMessage = (user, message, quickReplies) => {
	if (!user || user.match(/[^0-9]/g)) {
		console.error(`User, ${user}, must only contain numbers`);
		return;
	}
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

const sendMessageToAllUsers = (req, res) => {
	const message = req.body.message;
	if (!message) {
		res.status(400).send('Must post a message');
		return;
	}
	User
		.findAll({
			where: {
				FBSenderId: {
					$ne: null,
				},
			},
		})
		.then((users) => {
			users.forEach((user) => {
				sendMessage(user.FBSenderId, message);
			});
		});
	res.sendStatus(200);
};

const receiveMessage = (event) => {
	const messengerId = event.sender.id;
	User
		.findOne({
			where: {
				FBSenderId: messengerId,
			},
		})
		.catch((error) => {
			console.log(`Error: Could not find user with messengerId: ${messengerId}`);
			sendMessage(messengerId, 'Looks like we couldn\'t find you as a user!');
		})
		.then((user) => bots.getMessage(user.id, event.message.text))
		.then((response) => {
			// Successful!
			sendMessage(messengerId, response.message);
		})
		.catch((error) => {
			// sendMessage(messengerId, `Could not find a user with messenger id ${messengerId}`);

			let reason = '';
			switch (error.errorReason) {
			case bots.E_NO_CONTEXT:
				reason = 'you did not @mention a module';
				break;
			case bots.E_MODULE_NOT_ADDED:
				reason = 'this module is not added to your account';
				break;
			case bots.E_MODULE_PRODUCED_ERROR:
				reason = 'the module threw an error';
				break;
			default:
				reason = 'the universe hates you. Try again after the singularity';
			}

			sendMessage(messengerId, `Oops! There was an error! It was because ${reason}!`);

			// Stack trace
			console.log(error.error);
		});
	console.log(`Received a message: ${JSON.stringify(event)}`);
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
	sendMessageReq: sendMessageReq,
	webhookHandler: webhookHandler,
	webhookAuthenticator: webhookAuthenticator,
	sendMessageToAllUsers: sendMessageToAllUsers,
};