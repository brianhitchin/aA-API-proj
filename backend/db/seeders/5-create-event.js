'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    function dc(x) {
      let y = new Date(x.toString().slice(0,15))
      return y
    }
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: 'JF event',
        description: 'Event1 description',
        type: 'In Person',
        capacity: 50,
        price: 30,
        startDate: dc('2022-01-01 00:00:00'),
        endDate: dc('2022-01-01 00:00:00')
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'RC event',
        description: 'Event2 description',
        type: 'Online',
        capacity: 20,
        price: 10,
        startDate: dc('2022-01-01 00:00:00'),
        endDate: dc('2022-01-03 00:00:00')
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'BH event',
        description: 'Event3 description',
        type: 'In Person',
        capacity: 1000,
        price: 100,
        startDate: dc('2022-01-03 00:00:00'),
        endDate: dc('2022-01-04 00:00:00')
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