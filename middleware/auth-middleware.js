const UnauthenticatedError = require('../errors/auth-error');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authenticationMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')){
		throw new UnauthenticatedError('Authentication invalid')
	}
	const token = authHeader.split(' ')[1]

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET)
		req.admin = {adminID: payload.adminID, username: payload.username}
		next()
	} catch (error) {
		throw new UnauthenticatedError('Athentication invalid')
	}
}

module.exports = authenticationMiddleware