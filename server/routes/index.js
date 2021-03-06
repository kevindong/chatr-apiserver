const usersController = require('../controllers').users;
const userModulesController = require('../controllers').usermodules;
const modulesController = require('../controllers').modules;
const messagingController = require('../controllers').messaging;
const multer = require('multer')();

module.exports = (app) => {
	// Example non-trivial code; delete at will
	app.get('/route', (req, res) => {
		res.status(200).send(
			{
				message: 'Welcome to the main routes file!',
			}
		);
	});
	app.post('/users/makeadmin/:userId', usersController.makeAdmin);
	app.post('/users/revokeadmin/:userId', usersController.revokeAdmin);
	app.get('/users/banned', usersController.banned);
	app.post('/users/ban/:userId', usersController.ban);
	app.post('/users/unban/:userId', usersController.unBan);
	app.get('/users/get/:userId', usersController.retrieve);
	app.get('/users/get/:userEmail/email', usersController.getByEmail);
	app.get('/users/get', usersController.getAll);
	app.post('/users/delete', usersController.delete);

	// Proof that the three controllers work
	app.get('/users/testGet', usersController.testGet);
	app.get('/usermodules/testGet', userModulesController.testGet);
	app.get('/modules/testGet', modulesController.testGet);

	// Module endpoints
	app.get('/modules/get/:moduleId', modulesController.retrieve);
	app.post('/modules/upload', multer.array('code'), modulesController.uploadModule);
	app.get('/modules/getByUser/:userId', modulesController.getModulesForUser);
	app.get('/modules/get', modulesController.getModules);
	app.get('/modules/search', modulesController.search);
	app.get('/modules/delete/:moduleId', modulesController.delete);
	app.post('/modules/update', multer.array('code'), modulesController.update);
	app.get('/modules/banned', modulesController.banned);
	app.post('/modules/ban/:moduleId', modulesController.ban);
	app.post('/modules/unban/:moduleId', modulesController.unBan);
	app.get('/modules/pending', modulesController.pending);
	app.post('/modules/approve/:moduleId', modulesController.approve);
	app.post('/modules/deny/:moduleId', modulesController.deny);

	// User-Modules endpoints
	app.get('/usermodules/message', (req, res) => userModulesController.getMessage(1, req.query.query).then(e => res.send(e)).catch(e => res.send(e)));
	app.get('/usermodules/:moduleId/getCount', userModulesController.getCount);
	app.get('/usermodules/:id', userModulesController.retrieve);
	app.get('/usermodules/:botId/getModules', userModulesController.getModules);
	app.post('/usermodules/enable', userModulesController.enableModule);
	app.post('/usermodules/disable', userModulesController.disableModule);

	// Messaging endpoints
	app.get('/webhookhandler', messagingController.webhookAuthenticator);
	app.post('/webhookhandler', messagingController.webhookHandler);
	app.post('/bot/send-to/:id', messagingController.sendMessageReq);
	app.post('/bot/messageall/users', messagingController.sendMessageToAllUsers);
};
