import { type RedisClientType, RediSearchSchema, SchemaFieldTypes } from 'redis';

export const LISTING_INDEX_KEY = 'listing:index';
export const LISTING_KEY_PREFIX = 'listing:';

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
		await client.json.set('listing:1', '.', {
			owner: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			chainId: '11155111',
			minPriceCents: '150000',
			nftContract: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			tokenId: '72997',
			nonce: '0',
			signature: {
				v: 5,
				r: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712',
				s: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712'
			}
		});
		await client.json.set('listing:2', '.', {
			owner: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			chainId: '11155111',
			minPriceCents: '250000',
			nftContract: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			tokenId: '72997',
			nonce: '0',
			signature: {
				v: 5,
				r: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712',
				s: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712'
			}
		});
	}
}
