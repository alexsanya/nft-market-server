import { type PaginationDto, type PaginationResponseEntity, RedisClient } from '../../shared';
import { BidEntity, type CreateBidDto, type FiltersDto, type BidDatasource } from '../domain';
import { DOMAIN_SEPARATORS, ONE } from '../../../core';
import { BID_INDEX_KEY } from './initializer';

export class BidDatasourceImpl implements BidDatasource {
	public async getAll(pagination: PaginationDto, filters: FiltersDto): Promise<PaginationResponseEntity<BidEntity[]>> {
		const { page, limit } = pagination;
		const { owner } = filters;
		const client = await RedisClient.getInstance().getClient();

		const query = owner ? `(@owner:'${owner}')` : '*';
		const { documents } = await client.ft.search(BID_INDEX_KEY, query, {
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
			results: documents.slice((page - ONE) * limit, page * limit).map((doc) => BidEntity.fromJson(doc.value)),
			currentPage: page,
			nextPage,
			prevPage,
			total,
			totalPages
		};
	}

	public async create(createDto: CreateBidDto): Promise<BidEntity> {
		const client = await RedisClient.getInstance().getClient();
		const json = createDto.toJson();
		const newListing = BidEntity.fromJson(json);
		const hash = createDto.listing.hash(DOMAIN_SEPARATORS[createDto.listing.chainId.toString()]);
		// eslint-disable-next-line
		await client.json.set(`bid:${hash}`, '.', json as any);
		return newListing;
	}
}
