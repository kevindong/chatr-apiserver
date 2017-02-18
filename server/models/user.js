'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		FBOAuthToken: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		FBSenderId: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		context: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		contextLastChanged: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		sessionToken: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	}, {
		classMethods: {
			associate: (models) => {
				User.hasMany(models.Module, {
					foreignKey: 'moduleId',
					as: 'modules',
				}),
				User.hasMany(models.UserModule, {
					foreignKey: 'userModuleId',
					as: 'userModules',
				});
			},
		},
	});
	return User;
};