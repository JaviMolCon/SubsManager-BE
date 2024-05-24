const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	username: { type: String, required: true },
	profilePic: { type: String },
	firstName: { type: String },
	lastName: { type: String },
	country: { type: String },
	sharedSubscriptions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subscription',
		},
	],
	subscriptions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subscription',
		},
	],
});

// Virtual property for profile completion score
userSchema.virtual('profileCompletionScore').get(function () {
	let score = 0;
	const scorePerField = 25;
	const fields = ['profilePic', 'firstName', 'lastName', 'country'];
	fields.forEach((field) => {
		if (this[field]) {
			score += scorePerField;
		}
	});

	return score;
});

// custome validation for username
function isValidUsername(username) {
	return (
		validator.isAlphanumeric(username) &&
		validator.isLength(username, { min: 3 })
	);
}

// Creating a custom static method for sign up
userSchema.statics.signup = async function (email, password, username) {
	// validation
	const exists = await this.findOne({ email });
	if (exists) {
		throw Error('Email already in use');
	}

	if (!email || !password || !username) {
		throw Error('All fields must be filled');
	}

	if (!validator.isEmail(email)) {
		throw Error('email is not valid');
	}

	if (!validator.isStrongPassword(password)) {
		throw Error(
			'Make sure to use at least 8 characters, one upper case letter, a number and a symbol'
		);
	}

	if (!isValidUsername(username)) {
		throw Error('enter valid username');
	}

	const salt = await bcrypt.genSalt(10);

	const hash = await bcrypt.hash(password, salt);

	const user = await this.create({ email, password: hash, username });

	return user;
};

// static custom login method
userSchema.static.login = async function (email, password) {
	if (!email || !password) {
		throw Error('All fields must be field');
	}

	const user = await this.findOne({ email });

	if (!user) {
		throw Error(`User doesn't exist or incorrect email`);
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		throw Error('Incorrect password');
	}
	return user;
};

module.exports = mongoose.model('User', userSchema);

//! Create a new user obj in order to not send the user's pass
// const getUser = async (req, res) => {
//     try {
//         const user = User.findById()
//          .populate('sharedSubscriptions')
//          .populate('subscriptions')
//         const newUser = {user.firstName, user.lastName,}
//         res.json(newUser)
//     } catch () {

//     }
// }
