'user strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
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
      'pendingCodeIsApproved',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      }
    );
	},
	down: (queryInterface /* , Sequelize */) => {
    queryInterface.changeColumn(
      'Modules',
      'codeIsApproved',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    );
    queryInterface.changeColumn(
      'Modules',
      'pendingCodeIsApproved',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    );
	},
};