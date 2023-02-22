const express = require('express')
const router = express.Router()
const { requireAuth, orgCheck } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, Venue } = require('../../db/models');
const sequelize = require('sequelize')
const Op = sequelize.Op

router.put('/:venueId', requireAuth, orgCheck('Co-Host'), async (req, res, next) => {
    
})

module.exports = router;