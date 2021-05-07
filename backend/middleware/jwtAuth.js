const jwt = require('jsonwebtoken')
const secretKey = require('../secret/key');
const db = require('../database/db');


const jwtAuth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        const data = jwt.verify(token, secretKey);
        const user = await db.User.findByPk(data.id);
        
        if (!user || !user.isActive) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send('Nieautoryzowany dostęp')
    }
}
module.exports = jwtAuth