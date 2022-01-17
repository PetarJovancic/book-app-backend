const router = require('express').Router();

// Bring in functions from controller
const {
	userAuth,
	userLogin,
	checkRole,
	userRegister,
	allUsers,
	searchUser,
	deleteUser,
	editUser,
} = require('../controllers/controller');

// Users Registeration Route
router.post('/register-user', async (req, res) => {
	await userRegister(req.body, 'user', res);
});

// Admin Registration Route
router.post('/register-admin', async (req, res) => {
	await userRegister(req.body, 'admin', res);
});

//  Login Route
router.post('/login', async (req, res) => {
	await userLogin(req.body, res);
});

// Get all users Route
router.get('/all-users', userAuth, async (req, res) => {
	return allUsers(req, res);
});

// Search user Route
router.get('/search', userAuth, async (req, res) => {
	return searchUser(req, res);
});

// Delete user Route
router.delete(
	'/delete-user',
	userAuth,
	checkRole(['admin']),
	async (req, res) => {
		return deleteUser(req, res);
	}
);

// Update user Route
router.put('/edit', userAuth, checkRole(['admin']), async (req, res) => {
	return editUser(req, res);
});

module.exports = router;
