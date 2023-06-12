const express = require('express')
const router = express.Router()
const { requireAuth, orgCheckEv } = require('../../utils/auth');
const { Group, EventImage, Membership, User, Venue, Event, Attendance } = require('../../db/models');
const sequelize = require('sequelize')
const Op = sequelize.Op

router.get('/', async (req, res, next) => {
    let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    let size = req.query.size === undefined ? 20 : parseInt(req.query.size);
    if (req.query.name) {
        let numlist = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        for (letter of req.query.name) {
            if (numlist.includes(letter)) {
                return res.status(400).json({
                    message: "Validation Error",
                    statusCode: 400,
                    errors: {
                        page: "Page must be greater than or equal to 1",
                        size: "Size must be greater than or equal to 1",
                        name: "Name must be a string",
                        type: "Type must be 'Online' or 'In Person'",
                        startDate: "Start date must be a valid datetime"
                    }
                })
            }
        }
    }
    if (req.query.type) {
        if (req.query.type !== 'In Person' && req.query.type !== 'Online' && req.query.type !== 'online' && req.query.type !== 'In person' &&
        req.query.type !== 'in person') {
            return res.status(400).json({
                message: "Validation Error",
                statusCode: 400,
                errors: {
                    page: "Page must be greater than or equal to 1",
                    size: "Size must be greater than or equal to 1",
                    name: "Name must be a string",
                    type: "Type must be 'Online' or 'In Person'",
                    startDate: "Start date must be a valid datetime"
                }
            })
        }
    }
    if (req.query.startDate) {
        if (req.query.startDate.split('-').length !== 3) {
            return res.status(400).json({
                message: "Validation Error",
                statusCode: 400,
                errors: {
                    page: "Page must be greater than or equal to 1",
                    size: "Size must be greater than or equal to 1",
                    name: "Name must be a string",
                    type: "Type must be 'Online' or 'In Person'",
                    startDate: "Start date must be a valid datetime"
                }
            })
        }
    }
    if (page > 10 || size > 20) {
        return res.status(400).json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                page: "Page must be greater than or equal to 1",
                size: "Size must be greater than or equal to 1",
                name: "Name must be a string",
                type: "Type must be 'Online' or 'In Person'",
                startDate: "Start date must be a valid datetime"
            }
        })
    }
    const pagination = {};
    if (page >= 1 && size >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }
    let where = {}
    if (req.query.name) {
        where.name = req.query.name
    }
    if (req.query.type) {
        where.type = req.query.type
    }
    try {
        const events = await Event.findAll({
            where,
            include: [
                { model: Group, attributes: ['id', 'name', 'city', 'state'] },
                { model: Venue, attributes: ['id', 'city', 'state'] },
                { model: EventImage, attributes: [] },
                { model: Attendance, attributes: [] }],
            group: ['Event.id'],
            order: [['startDate', 'DESC']],
            ...pagination
        })
        let resObj = []
        let resObjF = []
        for (let i = 0; i < events.length; i++) {
            const entree = events[i]
            resObj.push(entree.toJSON())
        }
        for (let j = 0; j < resObj.length; j++) {
            const entree = resObj[j]
            const entreeAttendance = await Attendance.findAll({
                where: {
                    eventId: entree.id
                }
            })
            const entreeImage = await EventImage.findOne({
                where: {
                    eventId: entree.id
                },
                attributes: ['url']
            })
            entree.numAttending = entreeAttendance.length
            if (entreeImage) {
                entree.previewImage = entreeImage.url
            } else {
                entree.previewImage = 'No image yet!'
            }
            if (req.query.startDate) {
                const day = new Date(req.query.startDate).toDateString()
                const splicedday = entree.startDate.toDateString()
                if (day == splicedday) {
                    resObjF.push(entree)
                }
            }
        }
        if (req.query.startDate) { res.json(resObjF) }
        else { res.json(resObj) }
    } catch (error) {
        return res.status(400).json({
            message: "Event couldn't be found",
            statusCode: 400,
            errors: {
                page: "Page must be greater than or equal to 1",
                size: "Size must be greater than or equal to 1",
                name: "Name must be a string",
                type: "Type must be 'Online' or 'In Person'",
                startDate: "Start date must be a valid datetime"
            }
        })
        let err = new Error();
        err.status = 400
        err.message = "Validation Error"
        err.errors = {
            page: "Page must be greater than or equal to 1",
            size: "Size must be greater than or equal to 1",
            name: "Name must be a string",
            type: "Type must be 'Online' or 'In Person'",
            startDate: "Start date must be a valid datetime"
        }
        return next(err)
    }
})

router.get('/:eventId', async (req, res, next) => {
    const events = await Event.findByPk(req.params.eventId)
    if (!events) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
    const resObj = events.toJSON()
    const rightvenue = await Venue.findOne({
        where: {
            id: resObj.venueId
        }
    })
    const images = await EventImage.findAll({
        where: {
            eventId: resObj.id
        },
        attributes: ['id', 'url', 'preview']
    })
    const orger = await Group.findByPk(resObj.groupId, {
        attributes: ['id', 'name', 'private', 'city', 'state']
    })
    const attender = await Attendance.findAll({
        where: {
            eventId: resObj.id
        }
    })
    resObj.numAttending = attender.length
    resObj.Group = orger
    resObj.Venue = rightvenue
    resObj.EventImages = images
    resObj.attendees = attender
    res.json(resObj)
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
        },
        attributes: ['id', 'url', 'preview']
    })
    res.json(checker)
})

router.put('/:eventId', requireAuth, orgCheckEv('Co-Host'), async (req, res, next) => {
    let { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    startDate = new Date(startDate.toString().slice(0, 10))
    endDate = new Date(endDate.toString().slice(0, 10))
    const curEvent = await Event.findByPk(req.params.eventId)
    if (!curEvent) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
    if (venueId) {
        const exist = await Venue.findByPk(venueId)
        if (!exist) {
            return res.status(404).json({
                message: "Venue couldn't be found",
                statusCode: 404
            })
        }
    }
    if (!venueId || !startDate || !endDate || startDate > endDate || !name || !type || !capacity || !price || !description) {
        return res.status(400).json({
            message: "Event couldn't be found",
            statusCode: 400,
            errors: {
                "venueId": "Venue does not exist",
                "name": "Name must be at least 5 characters",
                "type": "Type must be Online or In person",
                "capacity": "Capacity must be an integer",
                "price": "Price is invalid",
                "description": "Description is required",
                "startDate": "Start date must be in the future",
                "endDate": "End date is less than start date"
            }
        })
    }
    curEvent.venueId = venueId
    curEvent.name = name
    curEvent.type = type
    curEvent.capacity = capacity
    curEvent.price = price
    curEvent.description = description
    curEvent.startDate = startDate
    curEvent.endDate = endDate
    await curEvent.save();
    res.json({
        id: curEvent.id,
        groupId: curEvent.groupId,
        venue: curEvent.venueId,
        name: curEvent.name,
        type: curEvent.type,
        capacity: curEvent.capacity,
        price: curEvent.price,
        description: curEvent.description,
        startDate: curEvent.startDate,
        endDate: curEvent.endDate
    })
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
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
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
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
    const alreadyexist = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.user.id
        }
    })
    if (alreadyexist) {
        if (alreadyexist.status == 'Pending') {
            return res.status(400).json({
                message: "Attendance has already been requested",
                statusCode: 400
            })
            const err = new Error();
            err.status = 400;
            err.message = "Attendance has already been requested"
            return next(err)
        } else {
            return res.status(400).json({
                message: "User is already an attendee of the event",
                statusCode: 400
            })
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
    res.json(newAttendance.toJSON())
})

router.put('/:eventId/attendance', requireAuth, orgCheckEv('Co-Host'), async (req, res, next) => {
    const { userId, status } = req.body
    const rightEvent = await Event.findByPk(req.params.eventId)
    if (!rightEvent || !rightEvent.id) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
    if (status == 'Pending' || status == 'pending') {
        return res.status(400).json({
            message: "Cannot change a attendance status to pending",
            statusCode: 400
        })
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
    if (!aretheycoming || !aretheycoming.id) {
        return res.status(404).json({
            message: "Attendance between the user and the event does not exist",
            statusCode: 404
        })
        const err = new Error();
        err.status = 404;
        err.message = "Attendance between the user and the event does not exist"
        return next(err)
    }
    aretheycoming.status = status
    await aretheycoming.save();
    res.json({
        id: aretheycoming.id,
        eventId: aretheycoming.groupId,
        userId: aretheycoming.userId,
        status: aretheycoming.status
    })
})

router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const { userId } = req.body
    const thisevent = await Event.findByPk(req.params.eventId)
    if (!thisevent || !thisevent.id) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
    const thisgroup = await Group.findByPk(thisevent.groupId)
    const thisattendance = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId
        }
    })
    if (!thisattendance || !thisattendance.id) {
        return res.status(404).json({
            message: "Attendance does not exist for this User",
            statusCode: 404
        })
        const err = new Error();
        err.status = 404;
        err.message = "Attendance does not exist for this User"
        return next(err)
    }
    if (thisgroup.organizerId !== req.user.id && req.user.id !== userId) {
        return res.status(403).json({
            message: "Only the User or organizer may delete an Attendance",
            statusCode: 403
        })
        const err = new Error();
        err.status = 403;
        err.message = "Only the User or organizer may delete an Attendance"
        return next(err)
    }
    await Attendance.destroy({
        where: {
            eventId: req.params.eventId,
            userId
        }
    });
    res.json({
        message: "Successfully deleted attendance from event"
    })
})

module.exports = router;