const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const AdminSchema = new mongoose.Schema( {
	username: {
		type: String,
		required: [true, 'Please provide a username.'],
		minLength: 3,
		maxlength: 30
	},
	email: {
		type: String,
		required: [true, 'Please provide an email.'],
		match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
		unique: true
	},
	password: {
		type: String,
		required: [true, 'Please provide a password.'],
		minLength: 8
	}
});

AdminSchema.pre('save', async function() {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt)
})

AdminSchema.methods.createJWT = function() {
	return jwt.sign({adminID: this._id, username: this.username}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

AdminSchema.methods.comparePassword = function (password) {
	const isMatch = bcrypt.compare(password, this.password);
	return isMatch;
}

module.exports = mongoose.model('Admin', AdminSchema)