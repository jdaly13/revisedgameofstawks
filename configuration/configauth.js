module.exports = {
    sendGrid: {
    user: process.env['SGUSER'],
    pass: process.env['SGPASS']
    },
    secret: process.env['SECRET'],
    mongo: process.env['DATABASE'],
    "jwtSecret" : process.env['JWTSECRET']
    };