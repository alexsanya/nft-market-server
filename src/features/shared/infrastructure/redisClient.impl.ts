import { createClient, type RedisClientType } from 'redis';
import { envs } from '../../../core';
import { ListingDataInitializer } from '../../listings';
import { BidDataInitializer } from '../../bids';
import { SettlementDataInitializer } from '../../settlements/infrastructure/initializer';

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
			const client = await this.init();
			await this.populate();
			return client;
		}
		return this.client;
	}

	public async init(): Promise<RedisClientType> {
		console.log('Initialization of redis client');

		this.client = createClient({ url: envs.REDIS_HOST });
		await this.client.connect();

		await Promise.all([
			ListingDataInitializer.initListingsIndex(this.client),
			BidDataInitializer.initBidsIndex(this.client),
			SettlementDataInitializer.initSettlementIndex(this.client)
		]);

		return this.client;
	}

	public async populate(): Promise<void> {
		if (!this.client) {
			throw new Error('Client is not initialized');
		}
		console.log('Populate data');
		await Promise.all([
			ListingDataInitializer.populateListings(this.client),
			BidDataInitializer.populateBids(this.client),
			SettlementDataInitializer.populateSettlements(this.client)
		]);
	}
}
