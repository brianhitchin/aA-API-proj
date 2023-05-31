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
        url: 'https://en.wikipedia.org/wiki/Galaxy#/media/File:NGC_4414_(NASA-med).jpg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://en.wikipedia.org/wiki/Dark_matter#/media/File:CMS_Higgs-event.jpg',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://en.wikipedia.org/wiki/Anisotropy#/media/File:WMAP_2010.png',
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