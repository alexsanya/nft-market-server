import request from 'supertest';
import { envs, HttpCode, SuccessResponse } from './core';
import { testServer } from './testServer';
import { PaginationResponseEntity } from './features/shared';
import { ListingEntity } from './features/listings';

describe('test listing routes', () => {
	const url = `${envs.API_PREFIX}/listings`;

	beforeAll(async () => {
		await testServer.start();
	});

	test('should return listings /listings', async () => {
		await request(testServer.app)
			.get(url)
			.expect(HttpCode.OK)
			.expect('Content-Type', /json/)
			.then(({ body }: { body: SuccessResponse<PaginationResponseEntity<ListingEntity[]>> }) => {
				expect(body).toMatchSnapshot();
				expect(body.data?.results.length).toBe(1);
			});
	});
});
