const express = require('express')
const router = express.Router()
const { requireAuth, orgCheck } = require('../../utils/auth');
const { GroupImage, Group, User, Membership } = require('../../db/models');

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const thisimage = await GroupImage.findByPk(req.params.imageId)
    if (!thisimage || !thisimage.id) {
        const err = new Error();
        err.status = 404;
        err.message = "Group Image couldn't be found"
        return next(err)
    }
    const thismember = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: thisimage.groupId
        }
    })
    if (!thismember || (thismember.status !== 'Co-Host' && thismember.status !== 'Organizer')) {
        const err = new Error('Authorization required');
        err.status = 401;
        err.errors = { message: 'Authorization required - not Co-Host or Organizer' };
        return next(err)
    }
    await GroupImage.destroy({
        where: {
            id: req.params.imageId
        }
    })
    res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})

module.exports = router;