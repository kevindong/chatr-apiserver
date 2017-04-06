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
			allowNull: true,
			defaultValue: null,
		},
		pendingCode: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		pendingCodeIsApproved: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: null,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		isBanned: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	}, {
		classMethods: {
			associate: (models) => {
				Module.belongsTo(models.User, {
					foreignKey: 'id',
					onDelete: 'CASCADE',
				}),
				Module.hasMany(models.UserModule, {
					foreignKey: 'id',
				});
			},
		},
	});
	return Module;
};
