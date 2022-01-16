const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user.model');
const { SECRET } = require('../config');

const userRegister = async (userDets, role, res) => {
	try {
		// Validate the username
		let usernameNotTaken = await validateUsername(userDets.username);
		if (!usernameNotTaken) {
			return res.status(400).json({
				message: `Username is already taken.`,
				success: false,
			});
		}

		// validate the email
		let emailNotRegistered = await validateEmail(userDets.email);
		if (!emailNotRegistered) {
			return res.status(400).json({
				message: `Email is already registered.`,
				success: false,
			});
		}

		// Get the hashed password
		const password = await bcrypt.hash(userDets.password, 12);

		const books = [];
		if (userDets.books[0] !== undefined) {
			const splitBooks = userDets.books.split(', ');

			splitBooks.forEach(el => {
				books.push(el);
			});
		}

		const newUser = new User({
			...userDets,
			password,
			role,
			books,
		});

		await newUser.save();
		return res.status(201).json({
			message: 'You are successfully registred. Please  login.',
			success: true,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Unable to create your account.',
			success: false,
		});
	}
};

const userLogin = async (userCreds, res) => {
	let { username, password } = userCreds;
	// First Check if the username is in the database
	const user = await User.findOne({ username });
	if (!user) {
		return res.status(404).json({
			message: 'Username is not found. Invalid login credentials.',
			success: false,
		});
	}

	// Check for the password
	let isMatch = await bcrypt.compare(password, user.password);
	if (isMatch) {
		// Sign in the token
		let token = jwt.sign(
			{
				user_id: user._id,
				role: user.role,
				username: user.username,
				email: user.email,
			},
			SECRET,
			{ expiresIn: '5m' }
		);

		let result = {
			username: user.username,
			role: user.role,
			email: user.email,
			token: `Bearer ${token}`,
			expiresIn: 300,
		};

		return res.status(200).json({
			...result,
			message: 'You are now logged in.',
			success: true,
		});
	} else {
		return res.status(403).json({
			message: 'Incorrect password.',
			success: false,
		});
	}
};

const validateUsername = async username => {
	let user = await User.findOne({ username });
	return user ? false : true;
};

const userAuth = passport.authenticate('jwt', { session: false });

const checkRole = roles => (req, res, next) =>
	!roles.includes(req.user.role)
		? res.status(401).json('Unauthorized')
		: next();

const validateEmail = async email => {
	let user = await User.findOne({ email });
	return user ? false : true;
};

const serializeUser = user => {
	return {
		_id: user._id,
		username: user.username,
		email: user.email,
		name: user.name,
		books: user.books,
		updatedAt: user.updatedAt,
		createdAt: user.createdAt,
	};
};

const editedUser = async (req, res) => {
	try {
		const username = req.user.username;
		const tempUser = await User.findOne({
			username: { $regex: username, $options: '$i' },
		});

		const id = tempUser._id;

		if (req.body.books[0] !== undefined) {
			const splitBooks = req.body.books.split(', ');
			splitBooks.forEach(el => {
				tempUser.books.push(el);
			});
		}

		var reqBody = {
			books: tempUser.books,
		};
		const user = await User.findByIdAndUpdate(id, reqBody, {
			useFindAndModify: false,
		});

		return res.status(200).json({
			result: user,
			message: 'User has been edited.',
			success: true,
		});
	} catch (err) {
		return res.status(400).json({ message: err.message, success: false });
	}
};

const deleteBook = async (req, res) => {
	try {
		const username = req.user.username;
		const tempUser = await User.findOne({
			username: { $regex: username, $options: '$i' },
		});
		const id = tempUser._id;

		if (req.body.books[0] !== undefined) {
			const splitBooks = req.body.books.split(', ');
			splitBooks.forEach(el => {
				const index = tempUser.books.indexOf(el);
				if (index > -1) {
					tempUser.books.splice(index, 1);
				}
			});
		}

		var reqBody = {
			books: tempUser.books,
		};

		const user = await User.findByIdAndUpdate(id, reqBody, {
			useFindAndModify: false,
		});

		return res.status(200).json({
			result: user,
			message: 'Book has been deleted.',
			success: true,
		});
	} catch (err) {
		return res.status(400).json({ message: err.message, success: false });
	}
};

const allUsers = async (req, res) => {
	try {
		const users = await User.find();
		return res.status(200).json({
			result: users,
			message: 'Users have been found.',
			success: true,
		});
	} catch (err) {
		return res.status(400).json({ message: err.message, success: false });
	}
};

const searchUser = async (req, res) => {
	try {
		const name = req.query.name;
		const user = await User.findOne({ name: { $regex: name, $options: '$i' } });

		return res.status(200).json({
			result: user,
			message: 'User has been found.',
			success: true,
		});
	} catch (err) {
		return res.status(400).json({ message: err.message, success: false });
	}
};

const deleteUser = async (req, res) => {
	try {
		const username = req.body.username;
		const tempUser = await User.findOne({
			username: { $regex: username, $options: '$i' },
		});
		const id = tempUser._id;

		const user = await User.deleteOne({
			_id: id,
		});

		return res.status(200).json({
			result: user,
			message: 'User deleted.',
			success: true,
		});
	} catch (err) {
		return res.status(400).json({
			message: 'Unable to delete user.',
			success: false,
		});
	}
};

const editUser = async (req, res) => {
	try {
		const username = req.body.username;
		const tempUser = await User.findOne({
			username: { $regex: username, $options: '$i' },
		});
		const id = tempUser._id;
		const name = tempUser.name;
		const email = tempUser.email;
		const books = tempUser.books;

		const tempList = [];

		if (req.body.books[0] !== undefined) {
			const splitBooks = req.body.books.split(', ');
			splitBooks.forEach(el => {
				tempList.push(el);
			});
			req.body.books = tempList;
		}

		if (req.body.name === '') {
			req.body.name = name;
		}
		if (req.body.email === '') {
			req.body.email = email;
		}

		if (req.body.books[0] === undefined) {
			req.body.books = books;
		}

		const user = await User.findByIdAndUpdate(id, req.body, {
			useFindAndModify: false,
		});

		return res.status(200).json({
			result: user,
			message: 'User has been edit.',
			success: true,
		});
	} catch (err) {
		return res.status(400).json({
			message: 'Unable to edit user.',
			success: false,
		});
	}
};

module.exports = {
	userAuth,
	checkRole,
	userLogin,
	userRegister,
	serializeUser,
	allUsers,
	searchUser,
	deleteUser,
	editUser,
	editedUser,
	deleteBook,
};
