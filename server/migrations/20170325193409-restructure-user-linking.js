'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Users',
      'FBOAuthToken'
    );
    queryInterface.renameColumn(
      'Users',
      'sessionToken',
      'email'
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameColumn(
      'Users',
      'email',
      'sessionToken'
    );
    queryInterface.addColumn(
      'Users',
      'FBOAuthToken',
      {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    );
  }
};
