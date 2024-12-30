import { type PaginationDto, type PaginationResponseEntity } from '../../shared';
import { type CreateListingDto, type FiltersDto, type ListingDatasource, ListingEntity } from '../domain';
import { DOMAIN_SEPARATORS, ONE } from '../../../core';
import { LISTING_INDEX_KEY, RedisClient } from '../../shared/infrastructure/redisClient.impl';

export class ListingDatasourceImpl implements ListingDatasource {
	public async getAll(
		pagination: PaginationDto,
		filters: FiltersDto
	): Promise<PaginationResponseEntity<ListingEntity[]>> {
		const { page, limit } = pagination;
		const { collection } = filters;
		const client = await RedisClient.getInstance().getClient();

		const query = collection ? `(@nftContract:'${collection}')` : '*';
		const { documents } = await client.ft.search(LISTING_INDEX_KEY, query, {
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
			results: documents.slice((page - ONE) * limit, page * limit).map((doc) => ListingEntity.fromJson(doc.value)),
			currentPage: page,
			nextPage,
			prevPage,
			total,
			totalPages
		};
	}

	public async create(createDto: CreateListingDto): Promise<ListingEntity> {
		const client = await RedisClient.getInstance().getClient();
		const json = createDto.toJson();
		const newListing = ListingEntity.fromJson(json);
		const hash = createDto.hash(DOMAIN_SEPARATORS[createDto.chainId.toString()]);
		// eslint-disable-next-line
		await client.json.set(`listing:${hash}`, '.', json as any);
		return newListing;
	}
}
