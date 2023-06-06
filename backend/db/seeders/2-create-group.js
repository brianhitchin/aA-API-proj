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
        name: 'Brunch with the Dogs',
        about: 'Get brunch with Dogs! What else?.',
        type: 'Outdoor',
        private: true,
        city: 'SF',
        state: 'CA'
      },
      {
        organizerId: 2,
        name: 'NYC Dog Walks',
        about: 'This group is for dog owners who want to socialize, enrich and exercise their dog and prefer on-leash group activities.',
        type: 'Outdoor',
        private: false,
        city: 'NYC',
        state: 'NY'
      },
      {
        organizerId: 3,
        name: 'BarkHappy Dogs Chicago: Doggy meetup',
        about: 'This group is for Chicago area dog lovers.',
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
      name: { [Op.in]: ['Brunch with the Dogs', 'NYC Dog Walks', 'BarkHappy Dogs Chicago: Doggy meetup'] }
    }, {});
  }
};
