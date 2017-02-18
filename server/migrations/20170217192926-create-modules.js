'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		queryInterface.createTable('Modules', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				onDelete: 'CASCADE',
				references: {
					model: 'Users',
					key: 'id',
					as: 'userId',
				},
			},
			code: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			codeIsApproved: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			pendingCode: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			pendingCodeIsApproved: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			active: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
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
		queryInterface.dropTable('Modules');
	},
};