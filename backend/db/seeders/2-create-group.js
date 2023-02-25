'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Group1',
        about: 'Group1about',
        type: 'Outdoor',
        private: true,
        city: 'SF',
        state: 'CA'
      },
      {
        organizerId: 2,
        name: 'Group2',
        about: 'Group2about',
        type: 'Indoor',
        private: false,
        city: 'NYC',
        state: 'NY'
      },
      {
        organizerId: 3,
        name: 'Group3',
        about: 'Group3about',
        type: 'Social',
        private: true,
        city: 'Chicago',
        state: 'IL'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Group1', 'Group2', 'Group3'] }
    }, {});
  }
};