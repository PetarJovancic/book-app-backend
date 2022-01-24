const request = require('supertest');
const expect = require('chai').expect;

const app = require('../../src/index');
const User = require('../../src/models/user.model');

describe('/api/users', () => {
	beforeEach(async () => {
		await User.deleteMany({});
	});

	describe('PUT /delete book', function () {
		it('Should delete book', async function () {
			let data = {
				name: 'John',
				email: 'john@gmail.com',
				username: 'user',
				password: 'user',
				books: 'Book1',
			};

			await request(app).post('/api/users/register-user').send(data); //depends on above [Signup].

			dataB = {
				username: 'user',
				password: 'user',
			};

			let res = await request(app).post('/api/users/login').send(dataB); //depends on above [Login].

			let token = res.body.token;

			let dataC = {
				username: 'user',
				books: 'Book1',
			};

			res = await request(app)
				.put('/api/users/delete-book')
				.send(dataC)
				.set('Authorization', token);

			expect(res.status).to.equal(200);
		});
	});
	describe('PUT /add book', function () {
		it('Should add book', async function () {
			let data = {
				name: 'John',
				email: 'john@gmail.com',
				username: 'user',
				password: 'user',
				books: 'Book1',
			};

			await request(app).post('/api/users/register-user').send(data); //depends on above [Signup].

			dataB = {
				username: 'user',
				password: 'user',
			};

			let res = await request(app).post('/api/users/login').send(dataB); //depends on above [Login].

			let token = res.body.token;

			let dataC = {
				username: 'user',
				books: 'Book2',
			};

			res = await request(app)
				.put('/api/users/add-book')
				.send(dataC)
				.set('Authorization', token);

			expect(res.status).to.equal(200);
		});
	});
});
