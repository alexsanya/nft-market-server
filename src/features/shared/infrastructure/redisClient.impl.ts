import { createClient, type RedisClientType, type RediSearchSchema, SchemaFieldTypes } from 'redis';
import { envs } from '../../../core';

export const LISTING_INDEX_KEY = 'listing:index';
export const LISTING_KEY_PREFIX = 'listing:';

export const BID_INDEX_KEY = 'bid:index';
export const BID_KEY_PREFIX = 'bid:';

export class RedisClient {
	private static instance: RedisClient;
	private client: RedisClientType | undefined;

	private constructor() {}

	public static getInstance(): RedisClient {
		if (RedisClient.instance) {
			return this.instance;
		}
		RedisClient.instance = new RedisClient();
		return RedisClient.instance;
	}

	public async getClient(): Promise<RedisClientType> {
		if (!this.client) {
			return await this.init();
		}
		return this.client;
	}

	public async init(): Promise<RedisClientType> {
		console.log('Initialization of redis client');

		this.client = createClient({ url: envs.REDIS_HOST });
		await this.client.connect();
		await this.initListingsIndex();
		await this.initBidsIndex();

		return this.client;
	}

	private async initListingsIndex(): Promise<void> {
		if (!this.client) {
			throw new Error('Client is not initialized');
		}
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
			await this.client.ft.dropIndex(LISTING_INDEX_KEY);
		} catch (indexErr) {
			console.error(indexErr);
		}
		await this.client.ft.create(LISTING_INDEX_KEY, listingSchema, {
			ON: 'JSON',
			PREFIX: LISTING_KEY_PREFIX
		});
	}

	private async initBidsIndex(): Promise<void> {
		if (!this.client) {
			throw new Error('Client is not initialized');
		}
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
			await this.client.ft.dropIndex(BID_INDEX_KEY);
		} catch (indexErr) {
			console.error(indexErr);
		}
		await this.client.ft.create(BID_INDEX_KEY, bidsSchema, {
			ON: 'JSON',
			PREFIX: BID_KEY_PREFIX
		});
	}

	public async populate(): Promise<void> {
		await this.populateListings();
		await this.populateBids();
	}

	private async populateListings(): Promise<void> {
		if (!this.client) {
			throw new Error('Client is not initialized');
		}
		await this.client.json.set('listing:1', '.', {
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
		await this.client.json.set('listing:2', '.', {
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

	private async populateBids(): Promise<void> {
		if (!this.client) {
			throw new Error('Client is not initialized');
		}
		await this.client.json.set('bid:1', '.', {
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
		await this.client.json.set('bid:2', '.', {
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
