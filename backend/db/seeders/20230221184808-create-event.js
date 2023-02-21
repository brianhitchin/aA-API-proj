'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: 'Event1',
        description: 'Event1 description',
        type: 'Event1 type',
        capacity: 50,
        price: 30,
        startDate: '2022-01-01',
        endDate: '2022-01-02'
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Event2',
        description: 'Event2 description',
        type: 'Event2 type',
        capacity: 20,
        price: 10,
        startDate: '2022-01-02',
        endDate: '2022-01-03'
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Event3',
        description: 'Event3 description',
        type: 'Event3 type',
        capacity: 1000,
        price: 100,
        startDate: '2022-01-03',
        endDate: '2022-01-04'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Event1', 'Event2', 'Event3'] }
    }, {});
  }
};