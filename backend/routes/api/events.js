const express = require('express')
const router = express.Router()
const { requireAuth, orgCheckEv } = require('../../utils/auth');
const { Group, EventImage, Membership, User, Venue, Event, Attendance } = require('../../db/models');
const sequelize = require('sequelize')
const Op = sequelize.Op

router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
        include: [
            { model: Group, attributes: ['id', 'name', 'city', 'state'] },
            { model: Venue, attributes: ['id', 'city', 'state'] },
            { model: EventImage, attributes: [] },
            { model: Attendance, attributes: [] }],
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

router.get('/:eventId', async (req, res, next) => {
    const events = await Event.findByPk(req.params.eventId, {
        include: [
            { model: Group, attributes: ['id', 'name', 'private', 'city', 'state'] },
            { model: Venue, attributes: ['id', 'address', 'city', 'state', 'lat', 'lng'] },
            { model: EventImage, attributes: ['id', 'url', 'preview'] },
            { model: Attendance, attributes: [] }],
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col("Attendances.id")), "numAttending"]]
        },
    })
    if (!events.id) {
        const err = new Error();
        err.message = "Event couldn't be found"
        err.status = 404;
        next(err);
    } else {
        res.json({
            Events: events
        })
    }
})

router.post('/:eventId/images', requireAuth, orgCheckEv('Attendee'), async (req, res, next) => {
    const { url, preview } = req.body
    const newImage = await EventImage.create({
        eventId: req.params.eventId,
        url,
        preview
    })
    const checker = await EventImage.findOne({
        where: {
            url: url
        }
    })
    res.json(checker)
})

router.put('/:eventId', requireAuth, orgCheckEv('Co-Host'), async (req, res, next) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    const curEvent = await Event.findByPk(req.params.eventId)
    try {
        curEvent.venueId = venueId
        curEvent.name = name
        curEvent.type = type
        curEvent.capacity = capacity
        curEvent.price = price
        curEvent.description = description
        curEvent.startDate = startDate
        curEvent.endDate = endDate
        await curEvent.save();
        res.json(curEvent)
    } catch (error) {
        const newErr = new Error();
        newErr.status = 400
        newErr.message = 'Validation Error'
        newErr.errors = {
            "venueId": "Venue does not exist",
            "name": "Name must be at least 5 characters",
            "type": "Type must be Online or In person",
            "capacity": "Capacity must be an integer",
            "price": "Price is invalid",
            "description": "Description is required",
            "startDate": "Start date must be in the future",
            "endDate": "End date is less than start date"
        }
        next(newErr)
    }
})

module.exports = router;