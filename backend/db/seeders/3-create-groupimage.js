'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: 'http://commondatastorage.googleapis.com/codeskulptor-assets/cards.jfitz.png',
        preview: true
      },
      {
        groupId: 1,
        url: 'GroupImages1 url f',
        preview: false
      },
      {
        groupId: 2,
        url: 'http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/debris3_brown.png',
        preview: true
      },
      {
        groupId: 2,
        url: 'GroupImages2 url f',
        preview: false
      },
      {
        groupId: 3,
        url: 'http://codeskulptor-demos.commondatastorage.googleapis.com/pang/9v5ehnO.png',
        preview: true
      },
      {
        groupId: 3,
        url: 'GroupImages3 url f',
        preview: false
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2,3] }
    }, {});
  }
};