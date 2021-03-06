'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
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
		email: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		isBanned: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	}, {
		classMethods: {
			associate: (models) => {
				User.hasMany(models.Module, {
					foreignKey: 'userId',
				});
				User.hasMany(models.UserModule, {
					foreignKey: 'userId',
				});
			},
		},
	});
	return User;
};
