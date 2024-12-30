import request from 'supertest';
import { envs, HttpCode, SuccessResponse } from './core';
import { testServer } from './testServer';
import { PaginationResponseEntity } from './features/shared';
import { ListingEntity } from './features/listings';
import { BidEntity } from './features/bids';

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

const NEW_BID = {
	bidder: '0xE98D94496aB9084f597a69978b593EBf83147335',
	listing: NEW_LISTING,
	tokenAddress: '0xc29f6F8D639eF187DcFEfeFBaD989cF2C941a23A',
	validUntil: '1735504160',
	value: '250',
	signature: {
		v: 28,
		r: '0x1469ac6f9636c24d2d8c3fb2cbef73708876e15f23f23b1d33863939c905a21c',
		s: '0x7d9a7ea039465c928311bcb737b23153232028038beadba2a667aa720f17602b'
	}
};

const NEW_SETTLEMENT = {
    "bid": NEW_BID,
    "signature": {
        "v": 27,
        "r": "0xc21f88f00f01849ecbe4bcb75bd8f6cc2ac1f3507498e385b78df7db5f5ae334",
        "s": "0x6adc46861e9888247b6b4f55cd7eb73449d835c94a0c3fd5e2df1b8cb6f77c4c"
    }
}

describe('test routes', () => {
	beforeAll(async () => {
		await testServer.start();
	});

	describe('test bid routes', () => {
		const url = `${envs.API_PREFIX}/bids`;

		test('should return bids /bids', async () => {
			await request(testServer.app)
				.get(url)
				.expect(HttpCode.OK)
				.expect('Content-Type', /json/)
				.then(({ body }: { body: SuccessResponse<PaginationResponseEntity<ListingEntity[]>> }) => {
					expect(body).toMatchSnapshot();
					expect(body.data?.results.length).toBe(1);
				});
		});

		test('should fail creating new bid if signature is invalid', async () => {
			await request(testServer.app)
				.post(url)
				.send({
					...NEW_BID,
					signature: {
						...NEW_BID.signature,
						v: 27
					}
				})
				.expect(HttpCode.BAD_REQUEST);
		});

		test('should create new bid /bids', async () => {
			await request(testServer.app)
				.post(url)
				.send(NEW_BID)
				.expect(HttpCode.CREATED)
				.expect('Content-Type', /json/)
				.then(({ body }: { body: SuccessResponse<BidEntity> }) => {
					expect(body).toMatchSnapshot();
				});
		});
	});

	describe('listing routes', () => {
		const url = `${envs.API_PREFIX}/listings`;
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


	describe('Settlement routes', () => {
		const url = `${envs.API_PREFIX}/settlements`;
		test('should return settlements /settlements', async () => {
			await request(testServer.app)
				.get(url)
				.expect(HttpCode.OK)
				.expect('Content-Type', /json/)
				.then(({ body }: { body: SuccessResponse<PaginationResponseEntity<ListingEntity[]>> }) => {
					expect(body).toMatchSnapshot();
					expect(body.data?.results.length).toBe(1);
				});
		});

		test('should fail creating new settlement if signature is invalid', async () => {
			await request(testServer.app)
				.post(url)
				.send({
					...NEW_SETTLEMENT,
					signature: {
						...NEW_LISTING.signature,
						v: 27
					}
				})
				.expect(HttpCode.BAD_REQUEST);
		});

		test('should create new settlement /settlements', async () => {
			await request(testServer.app)
				.post(url)
				.send(NEW_SETTLEMENT)
				.expect(HttpCode.CREATED)
				.expect('Content-Type', /json/)
				.then(({ body }: { body: SuccessResponse<ListingEntity> }) => {
					expect(body).toMatchSnapshot();
				});
		});
	})
});
