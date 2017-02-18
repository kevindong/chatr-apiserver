'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			FBOAuthToken: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			FBSenderId: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			context: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			contextLastChanged: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			sessionToken: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: (queryInterface /* , Sequelize */) => {
		queryInterface.dropTable('Users');
	},
};