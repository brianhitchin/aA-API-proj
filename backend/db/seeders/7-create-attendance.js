'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 1,
        status: 'Attendee'
      },
      {
        eventId: 2,
        userId: 2,
        status: 'Co-Host'

      },
      {
        eventId: 3,
        userId: 3,
        status: 'Host'
      },
      {
        eventId: 3,
        userId: 1,
        status: 'Attendee'
      },
      {
        eventId: 1,
        userId: 3,
        status: 'Pending'
      },
      {
        eventId: 3,
        userId: 2,
        status: 'Co-Host'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1,2,3] }
    }, {});
  }
};