import request from 'supertest';
import { envs, HttpCode, SuccessResponse } from './core';
import { testServer } from './testServer';
import { PaginationResponseEntity } from './features/shared';
import { ListingEntity } from './features/listings';

const NEW_LISTING = {
	owner: '0x3897326cEda92B3da2c27a224D6fDCFefCaCf57A',
	chainId: '11155111',
	minPriceCents: '150000',
	nftContract: '0xf44b599a0aB6b8cb14E992994BEC0dc59dF883B2',
	tokenId: '1',
	nonce: '0',
	signature: {
		v: 28,
		r: '0x5ef4620f4b296763ff15209456d75e868f149a8d1c6821f1ff11fab70bca0ee0',
		s: '0x337ddcb26ea919a2bf5ad6e1d49bd6951a27d1d2e940a5543a70eabc5dbe237e'
	}
};

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

	test('should fail creating new listing if signature is invalid', async () => {
		await request(testServer.app)
			.post(url)
			.send({
				...NEW_LISTING,
				signature: {
					...NEW_LISTING.signature,
					v: 27
				}
			})
			.expect(HttpCode.BAD_REQUEST);
	});

	test('should create new listing /listings', async () => {
		await request(testServer.app)
			.post(url)
			.send(NEW_LISTING)
			.expect(HttpCode.CREATED)
			.expect('Content-Type', /json/)
			.then(({ body }: { body: SuccessResponse<ListingEntity> }) => {
				expect(body).toMatchSnapshot();
			});
	});
});
