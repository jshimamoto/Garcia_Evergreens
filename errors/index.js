const CustomAPIError = require('./custom-api')
const BadRequest = require('./bad-request')
const UnauthenticatedError = require('./auth-error')
const NotFoundError = require('./not-found')

module.exports = {
	CustomAPIError,
	BadRequest,
	UnauthenticatedError,
	NotFoundError
}