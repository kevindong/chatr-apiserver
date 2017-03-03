const usersController = require('../controllers').users;
const userModulesController = require('../controllers').usermodules;
const modulesController = require('../controllers').modules;

module.exports = (app) => {
	app.post('/users/create', usersController.create);
	app.get('/users/get/:userId', usersController.retrieve);

	app.post('/modules/upload', modulesController.uploadModule);
	app.get('/modules/list', modulesController.getModules);
	app.get('/modules/:user/list', modulesController.getModulesForUser);
	app.get('/modules/:moduleId', modulesController.getModule);
};