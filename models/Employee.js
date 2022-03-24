const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for the Employee."]
    },
    username: {
        type: String,
        required: [true, "Please provide username"],
        unique: true,
        maxlength: 30
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 8,
        maxlength: 40
    },
    phone: {
        type: String,
        required: [true, "Please provide phone"],
        default: "Edit phone here"
    },
    email: {
        type: String,
        required: [true, "Please provide an email."],
        //match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide valid email"],
        unique: true,
        default: "Edit email here"
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "active", "nonactive"],
        default: "active"
    },
    notes: {
        type: String,
        required: false,
        default: "",
        maxLength: 1000
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: [true, "Please provide admin"],
    }
    },{ timestamps: true }
);

EmployeeSchema.pre('save', async function() {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt)
})

EmployeeSchema.methods.createJWT = function() {
	return jwt.sign({employeeID: this._id, username: this.username}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

EmployeeSchema.methods.comparePassword = function (password) {
	const isMatch = bcrypt.compare(password, this.password);
	return isMatch;
}

module.exports = mongoose.model("Employee", EmployeeSchema);
