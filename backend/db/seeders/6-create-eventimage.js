'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: 'https://cdn.maikoapp.com/3d4b/4r2dg/180h.jpg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://cdn.maikoapp.com/3d4b/4qy9k/180w.jpg',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://cdn.maikoapp.com/3d4b/4qwzz/180w.png',
        preview: true
      },
      {
        eventId: 1,
        url: 'EventImages1 url f',
        preview: false
      },
      {
        eventId: 2,
        url: 'EventImages2 url f',
        preview: false
      },
      {
        eventId: 3,
        url: 'EventImages3 url f',
        preview: false
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};