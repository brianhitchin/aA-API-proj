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
        name: 'CHIHUAHUA CHAT - CHIHUA-WOW!',
        description: 'JUST TALKING ABOUT CHIHUAHUAS-the magical beasts. CAMERAS ON! CHIHUAHUAS UP!',
        type: 'Online',
        capacity: 50,
        price: 30,
        startDate: dc('2022-01-01 00:00:00'),
        endDate: dc('2022-01-01 00:00:00')
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Ask a trainer!',
        description: 'Ever had burning questions? Come ask!',
        type: 'Online',
        capacity: 20,
        price: 10,
        startDate: dc('2022-01-01 00:00:00'),
        endDate: dc('2022-01-03 00:00:00')
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Dinner with dogs!',
        description: 'Nice Italian place in the suburbs. Good food. Doggy friendly.',
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
      name: { [Op.in]: ['CHIHUAHUA CHAT - CHIHUA-WOW!', 'Ask a trainer!', 'Dinner with dogs!'] }
    }, {});
  }
};