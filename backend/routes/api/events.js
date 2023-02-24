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

router.delete('/:eventId', requireAuth, orgCheckEv('Co-Host'), async (req, res, next) => {
    await Event.destroy({
        where: {
            id: req.params.eventId
        }
    })
    res.json({
        "message": "Successfully deleted"
    })
})

router.get('/:eventId/attendees', async (req, res, next) => {
    const rightEvent = await Event.findByPk(req.params.eventId)
    if (!rightEvent || !rightEvent.id) {
        const err = new Error();
        err.status = 404;
        err.message = "Event couldn't be found"
        return next(err)
    }
    let regid = rightEvent.dataValues.groupId
    const ruorg = await Group.findByPk(regid)
    let ruorgChk = ruorg.dataValues.organizerId
    const attenders = await Attendance.findAll({
        where: { eventId: req.params.eventId }
    })
    const attenderList = []
    const attenderListWStatus = []
    if (req.user.id == ruorgChk) {
        for (let attender of attenders) {
            attenderList.push(attender.toJSON().userId)
            attenderListWStatus.push({
                id: attender.toJSON().userId,
                status: attender.toJSON().status
            })
        }
    } else {
        for (let attender of attenders) {
            if (attender.toJSON().status !== 'Pending') {
                attenderList.push(attender.toJSON().userId)
                attenderListWStatus.push({
                    id: attender.toJSON().userId,
                    status: attender.toJSON().status
                })
            }
        }
    }
    const resObj = []
    const attendees = await User.findAll({
        where: {
            id: {
                [Op.in]: [...attenderList]
            }
        },
    })
    for (let item of attendees) {
        resObj.push(item.toJSON())
    }
    for (let i = 0; i < resObj.length; i++) {
        const entree = resObj[i]
        for (let j = 0; j < attenderListWStatus.length; j++) {
            const fulllist = attenderListWStatus[j]
            if (entree.id == fulllist.id) {
                entree.Attendance = {
                    status: fulllist.status
                }
            }
        }
    }
    res.json({
        Attendees: resObj
    })
})

router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const rightEvent = await Event.findByPk(req.params.eventId)
    if (!rightEvent || !rightEvent.id) {
        const err = new Error();
        err.status = 404;
        err.message = "Event couldn't be found"
        return next(err)
    }
    const alreadyexist = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.user.id
        }
    })
    if (alreadyexist) {
        if (alreadyexist.status == 'Pending') {
            const err = new Error();
            err.status = 400;
            err.message = "Attendance has already been requested"
            return next(err)
        } else {
            const err = new Error();
            err.status = 400;
            err.message = "User is already an attendee of the event"
            return next(err)
        }
    }
    const newAttendance = await Attendance.create({
        eventId: req.params.eventId,
        userId: req.user.id,
        status: "Pending"
    })
    res.json({
        eventId: req.params.eventId,
        userId: req.user.id,
        status: "Pending"
    })
})

router.put('/:eventId/attendance', requireAuth, orgCheckEv('Co-Host'), async (req, res, next) => {
    const { userId, status } = req.body
    const rightEvent = await Event.findByPk(req.params.eventId)
    if (!rightEvent || !rightEvent.id) {
        const err = new Error();
        err.status = 404;
        err.message = "Event couldn't be found"
        return next(err)
    }
    if (status == 'Pending') {
        const err = new Error();
        err.status = 400;
        err.message = "Cannot change a attendance status to pending"
        return next(err)
    }
    const aretheycoming = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId
        },
        attributes: ['id', 'eventId', 'userId', 'status']
    })
    console.log(aretheycomingeve)
    if (!aretheycoming || !aretheycoming.id) {
        const err = new Error();
        err.status = 404;
        err.message = "Attendance between the user and the event does not exist"
        return next(err)
    }
    aretheycoming.status = status
    await aretheycoming.save();
    res.json(aretheycoming)
})

router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const {userId} = req.body
    const thisevent = await Event.findByPk(req.params.eventId)
    if (!thisevent || !thisevent.id) {
        const err = new Error();
        err.status = 404;
        err.message = "Event couldn't be found"
        return next(err)
    }
    const thisgroup = await Group.findByPk(thisevent.groupId)
    const thisattendance = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId
        }
    })
    if (!thisattendance || !thisattendance.id) {
        const err = new Error();
        err.status = 404;
        err.message = "Attendance does not exist for this User"
        return next(err)
    }
    if (thisgroup.organizerId !== req.user.id && req.user.id !== userId) {
        const err = new Error();
        err.status = 403;
        err.message = "Only the User or organizer may delete an Attendance"
        return next(err)
    }
    await thisattendance.destroy();
    res.json({
        message: "Successfully deleted attendance from event"
    })
})

module.exports = router;