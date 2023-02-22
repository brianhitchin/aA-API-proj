const express = require('express')
const router = express.Router()
const { requireAuth, orgCheck } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, Venue } = require('../../db/models');
const sequelize = require('sequelize')

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
    let groups = await Group.findAll({
        where: {
            organizerId: req.user.id
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
    if (groups[0].id !== undefined) {
        console.log(groups.length)
        res.json(groups)
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

router.post('/:groupId/images', requireAuth, async (req, res, next) => {
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
        throw new Error('no chkr')
    }
})

module.exports = router;