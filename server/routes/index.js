const usersController = require('../controllers').users;
const userModulesController = require('../controllers').usermodules;
const modulesController = require('../controllers').modules;
const messagingController = require('../controllers').messaging;

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

	// Proof that the three controllers work
	app.get('/users/testGet', usersController.testGet);
	app.get('/usermodules/testGet', userModulesController.testGet);
	app.get('/modules/testGet', modulesController.testGet);

	// Module endpoints
	app.get('/modules/get/:moduleId', modulesController.retrieve);
	
	// Admin Console
	app.get('/modules/pending', modulesController.pending);
    app.post('/modules/approve', modulesController.approve);
    app.post('/modules/deny', modulesController.deny);

	// Messaging endpoints
	app.post('/receivemessage', messagingController.receiveMessage);
};
