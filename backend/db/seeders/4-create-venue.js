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
        address: '111 Fake Address',
        city: 'Irvine',
        state: 'CA',
        lat: 1.1,
        lng: 1.11
      },
      {
        groupId: 2,
        address: '222 Fake Address',
        city: 'NYC',
        state: 'NY',
        lat: 2.2,
        lng: 2.22
      },
      {
        groupId: 3,
        address: '333 Fake Address',
        city: 'Chicago',
        state: 'IL',
        lat: 3.3,
        lng: 3.33
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