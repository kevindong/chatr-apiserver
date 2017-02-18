'use strict';
module.exports = (sequelize, DataTypes) => {
	const Module = sequelize.define('Module', {
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		code: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		codeIsApproved: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		pendingCode: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		pendingCodeIsApproved: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	}, {
		classMethods: {
			associate: (models) => {
				Module.belongsTo(models.User, {
					foreignKey: 'userId',
					onDelete: 'CASCADE',
				}),
				Module.hasMany(models.UserModule, {
					foreignKey: 'userModuleId',
					as: 'userModules',
				});
			},
		},
	});
	return Module;
};