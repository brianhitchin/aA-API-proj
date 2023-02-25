'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: 'Organizer'
      },
      {
        userId: 2,
        groupId: 2,
        status: 'Co-Host'

      },
      {
        userId: 3,
        groupId: 3,
        status: 'Organizer'

      },
      {
        userId: 1,
        groupId: 3,
        status: 'Member'
      },
      {
        userId: 2,
        groupId: 3,
        status: 'Pending'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1,2,3] }
    }, {});
  }
};