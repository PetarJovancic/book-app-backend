const router = require('express').Router();

// Bring in functions from controller
const {
	userAuth,
	checkRole,
	editedUser,
	deleteBook,
} = require('../controllers/controller');

// Add Book to the specific User Route
router.put('/add-book', userAuth, checkRole(['user']), async (req, res) => {
	return editedUser(req, res);
});

// Delete Book to specific User Route
router.put('/delete-book', userAuth, checkRole(['user']), async (req, res) => {
	return deleteBook(req, res);
});

module.exports = router;
