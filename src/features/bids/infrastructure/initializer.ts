import { type RedisClientType, type RediSearchSchema, SchemaFieldTypes } from 'redis';
import { DOMAIN_SEPARATORS, SEPOLIA_ID } from '../../../core';
import { CreateListingDto } from '../../listings';

export const BID_INDEX_KEY = 'bid:index';
export const BID_KEY_PREFIX = 'bid:';

const BID_ONE = {
	bidder: '0xE98D94496aB9084f597a69978b593EBf83147335',
	listing: {
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
	},
	tokenAddress: '0xc29f6F8D639eF187DcFEfeFBaD989cF2C941a23A',
	validUntil: '1735504160',
	value: '250',
	signature: {
		v: 28,
		r: '0x1469ac6f9636c24d2d8c3fb2cbef73708876e15f23f23b1d33863939c905a21c',
		s: '0x7d9a7ea039465c928311bcb737b23153232028038beadba2a667aa720f17602b'
	}
};

export class BidDataInitializer {
	public static async initBidsIndex(client: RedisClientType): Promise<void> {
		const bidsSchema: RediSearchSchema = {
			'$.bidder': {
				type: SchemaFieldTypes.TEXT,
				AS: 'bidder'
			},
			'$.listing.owner': {
				type: SchemaFieldTypes.TEXT,
				AS: 'owner'
			}
		};
		try {
			/*
                 FT.DROPINDEX index [DD]
                 Dropping existing index
                 O(1) or O(N) if documents are deleted, where N is the number of keys in the keyspace
                */
			await client.ft.dropIndex(BID_INDEX_KEY);
		} catch (indexErr) {
			console.error(indexErr);
		}
		await client.ft.create(BID_INDEX_KEY, bidsSchema, {
			ON: 'JSON',
			PREFIX: BID_KEY_PREFIX
		});
	}

	public static async populateBids(client: RedisClientType): Promise<void> {
		await client.json.set(
			`bid:${CreateListingDto.create(BID_ONE.listing).hash(DOMAIN_SEPARATORS[SEPOLIA_ID])}`,
			'.',
			BID_ONE
		);
	}
}
