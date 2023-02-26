const express = require('express')
const router = express.Router()
const { requireAuth, orgCheck } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, Venue, EventImage, Attendance, Event } = require('../../db/models');
const sequelize = require('sequelize')
const Op = sequelize.Op

router.get('/', async (req, res, next) => {
    //maybe refactor later, cannot think of any other way than N+1. Tried including.
    let groups = await Group.findAll()
    const resObj = []
    for (let i = 0; i < groups.length; i++) {
        resObj.push(groups[i].toJSON())
    }
    for (let obj of resObj) {
        const members = await Membership.findAll({
            where: {
                groupId: obj.id
            }
        })
        obj.numMembers = members.length
        const images = await GroupImage.findOne({
            where: {
                groupId: obj.id,
                preview: true
            }
        })
        if (images) {
            obj.previewImage = images.url
        } else {
            obj.previewImage = 'No preview image yet.'
        }
    }
    res.json(resObj)
})

router.get('/current', requireAuth, async (req, res, next) => {
    let joinedGroup = await Membership.findAll({
        where: {
            userId: req.user.id
        }
    })
    let joinedGroupList = []
    for (let group of joinedGroup) {
        joinedGroupList.push(group.dataValues.groupId)
    }
    let groups = await Group.findAll({
        where: {
            id: {
                [Op.in]: [...joinedGroupList]
            }
        },
    });
    const resObj = []
    for (let i = 0; i < groups.length; i++) {
        resObj.push(groups[i].toJSON())
    }
    for (let obj of resObj) {
        const members = await Membership.findAll({
            where: {
                groupId: obj.id
            }
        })
        obj.numMembers = members.length
        const images = await GroupImage.findOne({
            where: {
                groupId: obj.id,
                preview: true
            }
        })
        if (images) {
            obj.previewImage = images.url
        } else {
            obj.previewImage = 'No preview image yet.'
        }
    }
    if (resObj) {
        res.json({
            Groups: resObj
        })
    } else {
        return res.status(404).json({
            message: "No groups!",
            statusCode: 404
        })
        const err = new Error('No groups!');
        err.status = 404;
        next(err);
    }
})

router.get('/:groupId', async (req, res, next) => {
    let group = await Group.findByPk(req.params.groupId)
    if (!group || !group.id) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
        const err = new Error();
        err.status = 404;
        err.message = "Group couldn't be found"
        next(err);
    }
    let resObj = group.toJSON()
    const images = await GroupImage.findAll({
        where: {
            groupId: resObj.id
        },
        attributes: ['id', 'url', 'preview']
    })
    const orger = await User.findByPk(resObj.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    })
    const members = await Membership.findAll({
        where: {
            groupId: resObj.id
        }
    })
    const rightvenue = await Venue.findAll({
        where: {
            groupId: resObj.id
        }
    })
    if (members) {
        resObj.numMembers = members.length
    } else {
        resObj.numMembers = 'No members'
    }
    if (images) {
        resObj.GroupImages = images
    } else {
        resObj.GroupImages = 'No group images.'
    }
    resObj.Organizer = orger
    if (rightvenue) {
        resObj.Venues = rightvenue
    } else {
        resObj.Venues = 'No venues'
    }
    res.json(resObj)
})

router.post('/', requireAuth, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body
    try {
        const newGroup = await Group.create({
            organizerId: req.user.id,
            name,
            about,
            type,
            private,
            city,
            state
        })
        const checker = await Group.findOne({ where: { name: name } })
        res.json(checker)
    } catch (err) {
        return res.status(400).json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                "name": "Name must be 60 characters or less",
                "about": "About must be 50 characters or more",
                "type": "Type must be 'Online' or 'In person'",
                "private": "Private must be a boolean",
                "city": "City is required",
                "state": "State is required"
            }
        })
        const newErr = new Error();
        newErr.status = 400
        newErr.message = 'Validation Error'
        newErr.errors = {
            "name": "Name must be 60 characters or less",
            "about": "About must be 50 characters or more",
            "type": "Type must be 'Online' or 'In person'",
            "private": "Private must be a boolean",
            "city": "City is required",
            "state": "State is required",
        }
        next(newErr)
    }
})

router.post('/:groupId/images', requireAuth, orgCheck('Organizer'), async (req, res, next) => {
    const { url, preview } = req.body
    const group = await Group.findByPk(req.params.groupId)
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
        const err = new Error();
        err.message = "Group couldn't be found"
        err.status = 404;
        next(err);
    }
    const newImage = await GroupImage.create({
        groupId: req.params.groupId,
        url,
        preview
    })
    const checker = await GroupImage.findOne({
        where: {
            url: url
        },
        attributes: ['id', 'url', 'preview']
    })
    if (checker) {
        res.json(checker)
    } else {
        throw new Error('No group made')
    }
})

router.put('/:groupId', requireAuth, orgCheck('Organizer'), async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body
    const group = await Group.findByPk(req.params.groupId)
    try {
        group.name = name
        group.about = about
        group.type = type
        group.private = private
        group.city = city
        group.state = state
        await group.save()
        res.json(group)
    } catch (err) {
        if (!group || group == undefined || group == null) {
            return res.status(404).json({
                message: "Group couldn't be found",
                statusCode: 404
            })
            const err = new Error();
            err.message = "Group couldn't be found"
            err.status = 404;
            next(err);
        } else {
            return res.status(400).json({
                message: "Validation Error",
                statusCode: 400,
                errors: {
                    "name": "Name must be 60 characters or less",
                    "about": "About must be 50 characters or more",
                    "type": "Type must be 'Online' or 'In person'",
                    "private": "Private must be a boolean",
                    "city": "City is required",
                    "state": "State is required"
                }
            })
            const err = new Error();
            err.status = 400
            err.message = 'Validation Error'
            err.errors = {
                "name": "Name must be 60 characters or less",
                "about": "About must be 50 characters or more",
                "type": "Type must be 'Online' or 'In person'",
                "private": "Private must be a boolean",
                "city": "City is required",
                "state": "State is required",
            }
            next(err)
        }
    }
})

router.delete('/:groupId', requireAuth, orgCheck('Organizer'), async (req, res, next) => {
    try {
        await Group.destroy({
            where: {
                id: req.params.groupId
            }
        })
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    } catch (error) {
        return res.status(404).json({
            message: "Group couldn't be found",
            what: error,
            statusCode: 404
        })
        const err = new Error();
        err.message = "Group couldn't be found"
        err.status = 404;
        next(err);
    }
})

router.get('/:groupId/venues', requireAuth, orgCheck('Co-Host'), async (req, res, next) => {
    const venues = await Venue.findAll({
        where: {
            groupId: req.params.groupId
        }
    })
    const venus = await Group.findByPk(req.params.groupId)
    if (!venus || venus == undefined || venus == null) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
        const err = new Error();
        err.message = "Group couldn't be found"
        err.status = 404;
        next(err);
    } else {
        res.json({
            Venues: venues
        })
    }
})

router.post('/:groupId/venues', requireAuth, orgCheck('Co-Host'), async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body
    const group = await Group.findByPk(req.params.groupId)
    if (!group || group == undefined || group == null) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    }
    try {
        const newVenue = await Venue.create({
            groupId: req.params.groupId,
            address,
            city,
            state,
            lat,
            lng
        })
        res.json(await Venue.findOne({
            where: {
                address: address
            }
        }))
    } catch (error) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                "address": "Street address is required",
                "city": "City is required",
                "state": "State is required",
                "lat": "Latitude is not valid",
                "lng": "Longitude is not valid"
            }
        })
        const err = new Error();
        err.message = 'Validation error'
        err.errors = {
            "address": "Street address is required",
            "city": "City is required",
            "state": "State is required",
            "lat": "Latitude is not valid",
            "lng": "Longitude is not valid"
        }
        err.status = 400;
        next(err);
    }
})

router.get('/:groupId/events', async (req, res, next) => {
    const groupchk = await Group.findByPk(req.params.groupId)
    if (!groupchk) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    }
    const events = await Event.findAll({
        where: {
            groupId: req.params.groupId
        },
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'capacity', 'price', 'description', 'startDate', 'endDate']
    })
    const resObj = []
    for (let i = 0; i < events.length; i++) {
        resObj.push(events[i].toJSON())
    }
    for (let j = 0; j < resObj.length; j++) {
        const resOb = resObj[j]
        const ei = await EventImage.findOne({
            where: {
                eventId: resOb.id,
                preview: true
            }
        })
        const att = await Attendance.findAll({
            where: {
                eventId: resOb.id
            }
        })
        const gp = await Group.findOne({
            where: {
                id: resOb.groupId
            },
            attributes: ['id', 'name', 'city', 'state']
        })
        const vn = await Venue.findOne({
            where: {
                id: resOb.venueId,
                groupId: resOb.groupId
            }
        })
        if (att) resOb.numAttending = att.length
        if (ei) { resOb.previewImage = ei.url } else { resOb.previewImage = 'No preview image yet!' }
        resOb.Group = gp
        if (vn) { resOb.Venue = vn } else { resOb.Venue = null }

    }
    res.json({
        Events: resObj
    })
})

router.post('/:groupId/events', requireAuth, orgCheck('Co-Host'), async (req, res, next) => {
    let { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    startDate = new Date(startDate.toString().slice(0, 15)).toDateString()
    endDate = new Date(endDate.toString().slice(0, 15)).toDateString()
    const groupchk = await Group.findByPk(req.params.groupId)
    if (!groupchk) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    }
    if (!newEventChk || !newEventChk.id || !startDate || !endDate || startDate > endDate || !venueId || !name
        || !type || !capacity || !price || !description) {
        return res.status(400).json({
            message: "Validation error",
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
    const newEvent = await Event.create({
        venueId,
        groupId: req.params.groupId,
        name,
        description,
        type,
        capacity,
        price,
        startDate,
        endDate
    })
    const newEventChk = await Event.scope('cevent').findOne({
        where: {
            name: name
        }
    })
    newEventChk.price = parseFloat(newEventChk.price)
    res.json(newEventChk)
})

router.get('/:groupId/members', async (req, res, next) => {
    const groupChk = await Group.findByPk(req.params.groupId)
    if (!groupChk || !groupChk.dataValues) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    }
    const members = await Membership.findAll({
        where: {
            groupId: req.params.groupId
        }
    })
    const memberList = []
    for (let member of members) {
        memberList.push(member.dataValues.userId)
    }
    const resObj = []
    const memberDetails = await User.findAll({
        where: {
            id: {
                [Op.in]: [...memberList]
            }
        },
        attributes: ['id', 'firstName', 'lastName']
    })
    for (let i = 0; i < memberDetails.length; i++) {
        resObj.push(memberDetails[i].toJSON())
    }
    let spliceMe = [];
    for (let j = 0; j < resObj.length; j++) {
        const resOb = resObj[j]
        const resObM = await Membership.findOne({
            where: {
                userId: resOb.id,
                groupId: req.params.groupId
            }
        })
        resOb.Membership = { status: resObM.status }
        if (resObM.status == 'Pending') {
            if (groupChk.organizerId !== req.user.id) {
                spliceMe.push(j)
            }
        }
    }
    let final = []
    if (spliceMe.length) {
        for (let y of resObj) {
            if (!spliceMe.includes(resObj.indexOf(y))) {
                final.push(y)
            }
        }
        res.json({
            Members: final
        })
    }
    res.json({
        Members: resObj
    })
})

//N+1 ok. tojson members and attach the 342 include as N+1 for all
//prob memberDetails, leave upto 341, and foreach 342

router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const groupChk = await Group.findByPk(req.params.groupId)
    if (!groupChk || !groupChk.dataValues) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    }
    const { memberId, status } = req.body
    const existChk = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: req.params.groupId,
        }
    })
    if (existChk && existChk.status == 'Pending') {
        return res.status(400).json({
            message: "Membership has already been requested",
            statusCode: 400
        })
        const err = new Error();
        err.message = "Membership has already been requested"
        err.status = 400;
        next(err);
    }
    if (existChk) {
        return res.status(400).json({
            message: "User is already a member of the group",
            statusCode: 400
        })
        const err = new Error();
        err.message = "User is already a member of the group"
        err.status = 400;
        next(err)
    }
    const newMembership = await Membership.create({
        userId: req.user.id,
        groupId: req.params.groupId,
        status: 'Pending'
    })
    res.json({
        userId: newMembership.userId,
        status: newMembership.status
    })
})

router.put('/:groupId/membership', requireAuth, orgCheck('Co-Host'), async (req, res, next) => {
    const { memberId, status } = req.body
    if (status == 'Pending') {
        return res.status(400).json({
            message: "Validation required",
            statusCode: 400,
            errors: { status: "Cannot change a membership status to pending" }
        })
        const err = new Error('Validations required');
        err.status = 400;
        err.errors = { status: "Cannot change a membership status to pending" };
        return next(err)
    }
    if (status == 'Co-Host') {
        if (req.coro !== 'Organizer') {
            return res.status(401).json({
                message: "Authorization required",
                statusCode: 401,
                errors: { message: 'Authorization required - to change to Co-Host, you need to be the organizer' }
            })
            const err = new Error('Authorization required');
            err.status = 401;
            err.errors = { message: 'Authorization required - to change to Co-Host, you need to be the organizer' };
            return next(err)
        }
    }
    const rightUser = await User.findByPk(memberId)
    if (!rightUser || !rightUser.id) {
        return res.status(400).json({
            message: "Validations required",
            statusCode: 400,
            errors: { memberId: "User couldn't be found" }
        })
        const err = new Error('Validations required');
        err.status = 400;
        err.errors = { memberId: "User couldn't be found" };
        return next(err)
    }
    const rightMembership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: req.params.groupId
        }
    })
    if (!rightMembership || !rightMembership.id) {
        return res.status(404).json({
            message: "Membership between the user and the group does not exist",
            statusCode: 404,
        })
        const err = new Error("Membership between the user and the group does not exist");
        err.status = 404;
        return next(err)
    }
    rightMembership.status = status
    await rightMembership.save();
    res.json({
        id: rightMembership.id,
        groupId: rightMembership.groupId,
        memberId,
        status: rightMembership.status
    })
})

router.delete('/:groupId/membership', requireAuth, orgCheck('Member'), async (req, res, next) => {
    const { memberId } = req.body
    if (req.coro !== 'Organizer') {
        if (req.user.id !== memberId) {
            return res.status(401).json({
                message: "Authorization required",
                statusCode: 401,
                errors: { message: 'Authorization required - not organizer nor user' }
            })
            const err = new Error('Authorization required')
            err.status = 401;
            err.errors = { message: 'Authorization required - not organizer nor user' };
            return next(err);
        }
    }
    const rightUser = await User.findByPk(memberId)
    if (!rightUser || !rightUser.id) {
        return res.status(400).json({
            message: 'Validations required',
            statusCode: 400,
            errors: { memberId: "User couldn't be found" }
        })
        const err = new Error('Validations required');
        err.status = 400;
        err.errors = { memberId: "User couldn't be found" };
        return next(err)
    }
    const groupChk = await Group.findByPk(req.params.groupId)
    if (!groupChk || !groupChk.dataValues) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404,
        })
        const err = new Error();
        err.message = "Group couldn't be found"
        err.status = 404;
        next(err);
    }
    const rightMembership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: req.params.groupId
        }
    })
    if (!rightMembership || !rightMembership.id) {
        return res.status(404).json({
            message: "Membership does not exist for this User",
            statusCode: 404,
        })
        const err = new Error("Membership does not exist for this User");
        err.status = 404;
        return next(err)
    }
    try {
        await Membership.destroy({
            where: {
                userId: memberId,
                groupId: req.params.groupId
            }
        });
        res.json({
            message: "Successfully deleted membership from group"
        })
    } catch (error) {
        return res.status(404).json({
            message: "wtf",
            statusCode: 404,
        })
    }
})

module.exports = router;