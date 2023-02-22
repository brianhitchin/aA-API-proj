const express = require('express')
const router = express.Router()
const { requireAuth, orgCheckVe } = require('../../utils/auth');
const { Group, EventImage, Membership, User, Venue, Event, Attendance } = require('../../db/models');
const sequelize = require('sequelize')
const Op = sequelize.Op

router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
        include: [
        {model: Group, attributes: ['id', 'name', 'city', 'state']},
        {model: Venue, attributes: ['id', 'city', 'state']},
        {model: EventImage, attributes: []},
        {model: Attendance, attributes: []}],
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col("Attendances.id")), "numAttending"],
            [sequelize.col("EventImages.url"), "previewImage"]]
        },
        group: ['Event.id']
    })
    res.json({
        Events: events
    })
})

module.exports = router;