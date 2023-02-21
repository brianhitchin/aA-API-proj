'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: 'Venue1 address',
        city: 'Venue1 city',
        state: 'CA',
        lat: '1.1',
        lng: '1.11'
      },
      {
        groupId: 2,
        address: 'Venue2 address',
        city: 'Venue2 city',
        state: 'NY',
        lat: '2.2',
        lng: '2.22'
      },
      {
        groupId: 3,
        address: 'Venue3 address',
        city: 'Venue3 city',
        state: 'IL',
        lat: '3.3',
        lng: '3.33'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2,3] }
    }, {});
  }
};