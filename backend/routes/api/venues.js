const express = require('express')
const router = express.Router()
const { requireAuth, orgCheckVe } = require('../../utils/auth');
const { Venue } = require('../../db/models');

router.put('/:venueId', requireAuth, orgCheckVe('Co-Host'), async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body
    const relvenue = await Venue.findByPk(req.params.venueId)
    if (!relvenue || !relvenue.id) {
        const err = new Error();
        err.status = 404;
        err.message = "Venue couldn't be found"
        next(err);
    }
    try {
        relvenue.address = address
        relvenue.city = city
        relvenue.state = state
        relvenue.lat = lat
        relvenue.lng = lng
        await relvenue.save()
        res.json(relvenue)
    } catch (error) {
        const err = new Error();
        err.status = 400;
        err.message = "Validation error"
        err.errors = {
            "address": "Street address is required",
            "city": "City is required",
            "state": "State is required",
            "lat": "Latitude is not valid",
            "lng": "Longitude is not valid"
        }
        next(err);
    }
})

module.exports = router;