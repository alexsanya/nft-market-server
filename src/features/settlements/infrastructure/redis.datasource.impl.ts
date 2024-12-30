import { type PaginationDto, type PaginationResponseEntity, RedisClient } from '../../shared';
import { type FiltersDto, SettlementEntity, type CreateSettlementDto, SettlementDatasource } from '../domain';
import { DOMAIN_SEPARATORS, ONE } from '../../../core';
import { SETTLEMENT_INDEX_KEY } from './initializer';

export class SettlementDatasourceImpl implements SettlementDatasource {
	public async getAll(
		pagination: PaginationDto,
		filters: FiltersDto
	): Promise<PaginationResponseEntity<SettlementEntity[]>> {
		const { page, limit } = pagination;
		const { bidder } = filters;
		const client = await RedisClient.getInstance().getClient();

		const query = bidder ? `(@bidder:'${bidder}')` : '*';
		const { documents } = await client.ft.search(SETTLEMENT_INDEX_KEY, query, {
			LIMIT: {
				from: 0,
				size: pagination.limit
			}
		});

		const total = documents.length;

		const totalPages = Math.ceil(total / limit);
		const nextPage = page < totalPages ? page + ONE : null;
		const prevPage = page > ONE ? page - ONE : null;

		return {
			results: documents.slice((page - ONE) * limit, page * limit).map((doc) => SettlementEntity.fromJson(doc.value)),
			currentPage: page,
			nextPage,
			prevPage,
			total,
			totalPages
		};
	}

	public async create(createDto: CreateSettlementDto): Promise<SettlementEntity> {
		const client = await RedisClient.getInstance().getClient();
		const json = createDto.toJson();
		const newListing = SettlementEntity.fromJson(json);
		const hash = createDto.bid.listing.hash(DOMAIN_SEPARATORS[createDto.bid.listing.chainId.toString()]);
		// eslint-disable-next-line
		await client.json.set(`settlement:${hash}`, '.', json as any);
		return newListing;
	}
}
