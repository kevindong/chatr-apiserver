'use strict';
module.exports = (sequelize, DataTypes) => {
	const UserModule = sequelize.define('UserModule', {
		moduleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	}, {
		classMethods: {
			associate: (models) => {
				UserModule.belongsTo(models.User, {
					foreignKey: 'id',
					onDelete: 'CASCADE',
				});
				UserModule.belongsTo(models.Module, {
					foreignKey: 'id',
					onDelete: 'CASCADE',
				});
			},
		},
	});
	return UserModule;
};