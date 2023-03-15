'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(
        models.Venue,
        {foreignKey: 'venueId', onDelete: 'cascade', hooks: true}
      ),
      Event.belongsTo(
        models.Group,
        {foreignKey: 'groupId', onDelete: 'cascade', hooks: true, allowNull: false}
      ),
      Event.hasMany(
        models.EventImage,
        {foreignKey: 'eventId', onDelete: 'cascade', hooks: true}
      ),
      Event.hasMany(
        models.Attendance,
        {foreignKey: 'eventId', onDelete: 'cascade', hooks: true}
      )
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['In Person', 'Online', 'online', 'In person', 'in person']]
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ['capacity', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      cevent: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    }
  });
  return Event;
};