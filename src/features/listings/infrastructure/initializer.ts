import { type RedisClientType, type RediSearchSchema, SchemaFieldTypes } from 'redis';
import { CreateListingDto } from '../domain';
import { DOMAIN_SEPARATORS, SEPOLIA_ID } from '../../../core';

export const LISTING_INDEX_KEY = 'listing:index';
export const LISTING_KEY_PREFIX = 'listing:';

const LISTING_ONE = {
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

export class ListingDataInitializer {
	public static async initListingsIndex(client: RedisClientType): Promise<void> {
		const listingSchema: RediSearchSchema = {
			'$.owner': {
				type: SchemaFieldTypes.TEXT,
				AS: 'owner'
			},
			'$.nftContract': {
				type: SchemaFieldTypes.TEXT,
				AS: 'nftContract'
			},
			'$.tokenId': {
				type: SchemaFieldTypes.TEXT,
				AS: 'tokenId'
			}
		};
		try {
			/*
                 FT.DROPINDEX index [DD]
                 Dropping existing index
                 O(1) or O(N) if documents are deleted, where N is the number of keys in the keyspace
                */
			await client.ft.dropIndex(LISTING_INDEX_KEY);
		} catch (indexErr) {
			console.error(indexErr);
		}
		await client.ft.create(LISTING_INDEX_KEY, listingSchema, {
			ON: 'JSON',
			PREFIX: LISTING_KEY_PREFIX
		});
	}

	public static async populateListings(client: RedisClientType): Promise<void> {
		await client.json.set(
			`listing:${CreateListingDto.create(LISTING_ONE).hash(DOMAIN_SEPARATORS[SEPOLIA_ID])}`,
			'.',
			LISTING_ONE
		);
	}
}
