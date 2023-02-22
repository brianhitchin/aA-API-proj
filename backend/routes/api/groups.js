const express = require('express')
const router = express.Router()
const { requireAuth, orgCheck } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, Venue, EventImage, Attendance, Event } = require('../../db/models');
const sequelize = require('sequelize')
const Op = sequelize.Op

router.get('/', async (req, res, next) => {
    //maybe refactor later, cannot think of any other way than N+1. Tried including.
    let groups = await Group.findAll({
        include: [{ model: Membership, attributes: [] }, { model: GroupImage, attributes: [] }],
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"], [sequelize.col("GroupImages.url"), "previewImage"]],
        },
        group: ['Group.id']
    });
    res.json(groups)
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
    console.log(joinedGroupList, joinedGroup)
    let groups = await Group.findAll({
        where: {
            id: {
                [Op.in]: [...joinedGroupList]
            }
        },
        include: [
            { model: Membership, attributes: [] },
            { model: GroupImage, attributes: [] }
        ],
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"],
            [sequelize.col("GroupImages.url"), "previewImage"]]
        },
        group: ['Group.id']
    });
    if (groups !== undefined) {
        res.json({
            Groups: groups
        }
        )
    } else {
        const err = new Error('No groups!');
        err.status = 404;
        next(err);
    }
})

router.get('/:groupId', async (req, res, next) => {
    let group = await Group.findByPk(req.params.groupId, {
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"],
            [sequelize.col("GroupImages.url"), "previewImage"]]
        },
        include: [
            { model: Membership, attributes: [] },
            { model: GroupImage, attributes: ['id', 'url', 'preview'] },
            { model: User, attributes: ['id', 'firstName', 'lastName'], as: "Organizer" },
            { model: Venue, attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'] }
        ]
    })
    if (group.id == undefined) {
        const err = new Error();
        err.status = 404;
        err.message = "Group couldn't be found"
        next(err);
    } else res.json(group)
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

router.put('/:groupId', requireAuth, orgCheck('Member'), async (req, res, next) => {
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
            const err = new Error();
            err.message = "Group couldn't be found"
            err.status = 404;
            next(err);
        } else {
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
    if (!venues || venues == undefined || venues == null) {
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
        const err = new Error();
        err.message = "Group couldn't be found"
        err.status = 404;
        next(err);
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
        const err = new Error();
        err.message = "Group couldn't be found"
        err.status = 404;
        next(err);
    }
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
        where: {
            groupId: req.params.groupId
        },
        group: ['Event.id']
    })
    res.json({
        Events: events
    })
})

module.exports = router;