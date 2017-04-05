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
	app.post('/users/create', usersController.create);
	app.get('/users/get/:userId', usersController.retrieve);
	app.post('/users/enablemodule', userModulesController.enableModule);
	app.post('/users/disablemodule', userModulesController.disableModule);
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
	app.post('/modules/delete', modulesController.delete);
	app.post('/modules/update', modulesController.update);

	// Admin Console
	app.get('/modules/pending', modulesController.pending);
	app.post('/modules/approve/:moduleId', modulesController.approve);
	app.post('/modules/deny/:moduleId', modulesController.deny);

	// User-Modules endpoints
	app.get('/usermodules/:id/getCount', userModulesController.getCount);
	app.get('/usermodules/:id', userModulesController.retrieve);

	// Messaging endpoints
	app.get('/webhookhandler', messagingController.webhookAuthenticator);
	app.post('/webhookhandler', messagingController.webhookHandler);
	app.post('/bot/send-to/:id', messagingController.sendMessageReq);
};
