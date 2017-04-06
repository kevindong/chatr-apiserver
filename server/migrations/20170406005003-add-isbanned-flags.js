'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Modules',
      'isBanned',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
    queryInterface.addColumn(
      'Users',
      'isBanned',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'Modules',
      'isBanned'
    );
    queryInterface.removeColumn(
      'Users',
      'isBanned'
    );
  }
};
