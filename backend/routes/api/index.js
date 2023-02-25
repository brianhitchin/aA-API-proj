const router = require('express').Router();
const sessionRouter = require('./session.js');
const userRouter = require('./users.js');
const groupRouter = require('./groups.js')
const venueRouter = require('./venues.js')
const eventRouter = require('./events.js')
const groupImageRouter = require('./group-images.js')
const eventImageRouter = require('./event-images.js')
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', userRouter);
router.use('/groups', groupRouter);
router.use('/venues', venueRouter)
router.use('/events', eventRouter)
router.use('/group-images', groupImageRouter)
router.use('/event-images', eventImageRouter)

router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;