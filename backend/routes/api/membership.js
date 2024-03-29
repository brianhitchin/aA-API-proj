const express = require('express')
const router = express.Router()
const { Attendance } = require('../../db/models');
const sequelize = require('sequelize')
const Op = sequelize.Op

router.get('/', async (req, res, next) => {
    let members = await Attendance.findAll()
    const resObj = []
    for (let i = 0; i < members.length; i++) {
        resObj.push(members[i].toJSON())
    }
    res.json(resObj)
})

module.exports = router;