const request = require('supertest');
const expect = require('chai').expect;

const app = require('../../src/index');
const User = require('../../src/models/user.model');

describe('/api/users', () => {
	beforeEach(async () => {
		await User.deleteMany({});
	});

	describe('POST /signup', function () {
		it('Should create and return admin user', async function () {
			let data = {
				name: 'John',
				email: 'john@gmail.com',
				username: 'admin',
				password: 'admin',
				books: 'Book1',
			};

			let res = await request(app).post('/api/users/register-admin').send(data);
			expect(res.status).to.equal(201);
		});
	});

	describe('POST /login', function () {
		it('Should return a token and user information', async function () {
			let data = {
				name: 'John',
				email: 'john@gmail.com',
				username: 'admin',
				password: 'admin',
				books: 'Book1',
			};

			await request(app).post('/api/users/register-admin').send(data); //depends on above [signup].

			data = {
				username: 'admin',
				password: 'admin', // correct pass
			};

			let res = await request(app).post('/api/users/login').send(data);

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('token');
		});
		it('Should return error if wrong pass / username provided', async function () {
			let data = {
				name: 'John',
				email: 'john@gmail.com',
				username: 'admin',
				password: 'admin',
				books: 'Book1',
			};

			await request(app).post('/api/users/register-admin').send(data); //depends on above [Signup].

			data = {
				username: 'admin',
				password: '$0m3Rand0mPa556asdfasd', //wrong pass
			};

			let res = await request(app).post('/api/users/login').send(data);

			expect(res.status).to.equal(403);
		});
	});

	describe('GET /all-users', function () {
		it('Should return all users', async function () {
			let data = {
				name: 'John',
				email: 'john@gmail.com',
				username: 'admin',
				password: 'admin',
				books: 'Book1',
			};

			await request(app).post('/api/users/register-admin').send(data); //depends on above [Signup].

			dataB = {
				username: 'admin',
				password: 'admin',
			};

			let res = await request(app).post('/api/users/login').send(dataB); //depends on above [Login].

			let token = res.body.token;

			res = await request(app)
				.get('/api/users/all-users')
				.set('Authorization', token);

			expect(res.status).to.equal(200);
		});

		it('Should require authorization', async function () {
			res = await request(app).get('/api/users/all-users');

			expect(res.status).to.equal(401);
		});
	});

	describe('GET /search user', function () {
		it('Should return specific user', async function () {
			let data = {
				name: 'John',
				email: 'john@gmail.com',
				username: 'admin',
				password: 'admin',
				books: 'Book1',
			};

			await request(app).post('/api/users/register-admin').send(data); //depends on above [Signup].

			dataB = {
				username: 'admin',
				password: 'admin',
			};

			let res = await request(app).post('/api/users/login').send(dataB); //depends on above [Login].

			let token = res.body.token;

			res = await request(app)
				.get('/api/users/search')
				.query('name', 'John')
				.set('Authorization', token);

			expect(res.status).to.equal(200);
		});
	});

	describe('DELETE /delete user', function () {
		it('Should delete specific user', async function () {
			let data = {
				name: 'John',
				email: 'john@gmail.com',
				username: 'admin',
				password: 'admin',
				books: 'Book1',
			};

			await request(app).post('/api/users/register-admin').send(data); //depends on above [Signup].

			dataB = {
				username: 'admin',
				password: 'admin',
			};

			let res = await request(app).post('/api/users/login').send(dataB); //depends on above [Login].

			let token = res.body.token;

			const user = new User({
				name: 'John2',
				email: 'jogn22oe.com',
				username: 'jon',
				password: '$0m3Rand0mPa55',
				books: 'Book2',
			});
			let savedUser = await user.save();

			let username = {
				username: savedUser.username,
			};

			res = await request(app)
				.delete('/api/users/delete-user')
				.send(username)
				.set('Authorization', token);

			expect(res.status).to.equal(200);
		});
	});

	describe('PUT /edit user', function () {
		it('Should edit specific user', async function () {
			let data = {
				name: 'John',
				email: 'john@gmail.com',
				username: 'admin',
				password: 'admin',
				books: 'Book1',
			};

			await request(app).post('/api/users/register-admin').send(data); //depends on above [Signup].

			dataB = {
				username: 'admin',
				password: 'admin',
			};

			let res = await request(app).post('/api/users/login').send(dataB); //depends on above [Login].

			let token = res.body.token;

			const user = new User({
				name: 'John2',
				email: 'jogn22oe.com',
				username: 'jon',
				password: '$0m3Rand0mPa55',
				books: 'Book2',
			});
			let savedUser = await user.save();

			let dataC = {
				name: 'NewName',
				email: 'jogn22oe.com',
				username: 'jon',
				password: savedUser.username,
				books: 'Book2',
			};

			res = await request(app)
				.put('/api/users/edit')
				.send(dataC)
				.set('Authorization', token);

			expect(res.status).to.equal(200);
		});
	});
});
