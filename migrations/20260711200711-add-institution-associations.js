'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Campuses', 'institutionId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Institutions', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('Majors', 'campusId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Campuses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Campuses', 'institutionId');
    await queryInterface.removeColumn('Majors', 'campusId');
  },
};
