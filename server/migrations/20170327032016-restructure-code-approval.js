'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Modules',
      'codeIsApproved'
    );
    queryInterface.changeColumn(
      'Modules',
      'code',
      {
		  type: Sequelize.TEXT,
		  allowNull: true,
		  defaultValue: null
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Modules',
      'codeIsApproved',
      {
		  type: Sequelize.BOOLEAN,
		  allowNull: true,
		  defaultValue: null,
      }
    );
    queryInterface.changeColumn(
      'Modules',
      'code',
      {
		  type: Sequelize.TEXT,
		  allowNull: false,
      }
    );
  }
};
