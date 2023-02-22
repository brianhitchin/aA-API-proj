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

const orgCheck = (role = 'Member') => {
    return async (req, _res, next) => {
        const err = new Error('Authorization required');
        err.status = 401;
        const checkIfExists = await Group.findByPk(req.params.groupId)
        if (checkIfExists == null || checkIfExists == undefined) {
            err.status = 404
            err.message = "Group couldnt be found"
            return next(err)
        }
        switch (role) {
            case 'Member':
                let member = await Membership.findOne({
                    where: {
                        userId: req.user.id,
                        groupId: req.params.groupId
                    }
                })
                if (member !== null) {
                    return next();
                }
                err.errors = { message: 'Authorization required' };
                return next(err);
            case 'Co-Host':
                let cohost = await Membership.findOne({
                    where: {
                        userId: req.user.id,
                        groupId: req.params.groupId
                    }
                })
                if (cohost !== null && (cohost.dataValues.status == 'Co-host' || cohost.dataValues.status == 'Organizer' )) {
                    return next();
                }
                err.errors = { message: 'Authorization required - not Co-Host or Organizer' };
                return next(err);
            case 'Organizer':
                let group = await Group.findOne({
                    where: {
                        id: req.params.groupId
                    }
                })
                if (group !== null && group !== undefined) {
                    if (group.organizerId == req.user.id) {
                        return next();
                    }
                }
                err.errors = { message: 'Authorization required - not Organizer' };
                return next(err);
        }
    }
}
module.exports = { setTokenCookie, restoreUser, requireAuth, orgCheck };