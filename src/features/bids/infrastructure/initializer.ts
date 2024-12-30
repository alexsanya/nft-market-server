import { type RedisClientType, type RediSearchSchema, SchemaFieldTypes } from 'redis';

export const BID_INDEX_KEY = 'bid:index';
export const BID_KEY_PREFIX = 'bid:';

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
		await client.json.set('bid:1', '.', {
			bidder: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			listing: {
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
			},
			tokenAddress: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			validUntil: '1735255023397',
			value: '100500',
			signature: {
				v: 5,
				r: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712',
				s: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712'
			}
		});
		await client.json.set('bid:2', '.', {
			bidder: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			listing: {
				owner: '0x5d2fcc71dFf7182bf49927a2ed3C8FcE0De87723',
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
			},
			tokenAddress: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			validUntil: '1735255023397',
			value: '100500',
			signature: {
				v: 5,
				r: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712',
				s: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712'
			}
		});
	}
}
