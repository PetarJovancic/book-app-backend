const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		role: {
			type: String,
			default: 'user',
			enum: ['user', 'admin'],
		},
		username: {
			type: String,
			required: true,
		},
		password: { type: String, required: true },
		books: { type: Array },
	},
	{ timestamps: true }
);

module.exports = model('users', UserSchema);
