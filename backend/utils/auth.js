const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group, Membership } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
    // Create the token.
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.scope('currentUser').findByPk(id);
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

const orgCheck = (roleName = 'member') => {
    return async (req, res, next) => {
        if (req.params.groupId) {
            const group = await Group.findOne({ where: { id: req.params.groupId } })
            if (!group) {
                const err = new Error();
                err.message = "Group couldn't be found"
                err.status = 404;
                next(err);
            }
            if (roleName = 'organizer') {
                if (group.organizerId !== req.user.id) {
                    const err = new Error('Authorization required');
                    err.title = 'Authorization required';
                    err.errors = { message: 'Authorization required - not organizer' };
                    err.status = 403;
                    next(err);
                } next();
            }
            if (roleName = 'member') {
                const membershipVerification = await Membership.findOne({where: {userId: req.user.id, groupId: req.params.groupId}})
                if (!membershipVerification) {
                    const err = new Error('Authorization required');
                    err.title = 'Authorization required';
                    err.errors = { message: 'Authorization required - not member' };
                    err.status = 403;
                    next(err);
                } next();
            }
        }
    }
}

module.exports = { setTokenCookie, restoreUser, requireAuth, orgCheck };