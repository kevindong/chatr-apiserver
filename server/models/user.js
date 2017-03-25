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
	}, {
		classMethods: {
			associate: (models) => {
				User.hasMany(models.Module, {
					foreignKey: 'id',
				}),
				User.hasMany(models.UserModule, {
					foreignKey: 'id',
				});
			},
		},
	});
	return User;
};