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
        url: 'https://i.imgur.com/yErFr19.jpeg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://i.imgur.com/fSgnUKW.jpeg',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://i.imgur.com/hei8F.jpeg',
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