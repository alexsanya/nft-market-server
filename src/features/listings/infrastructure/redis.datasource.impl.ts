import { type PaginationDto, type PaginationResponseEntity } from '../../shared';
import { type CreateListingDto, type ListingDatasource, ListingEntity } from '../domain';
import { ONE } from '../../../core';
import { AbiCoder, keccak256 } from 'ethers';
import { RedisClient } from '../../shared/infrastructure/redisClient.impl';

const LISTING_INDEX_KEY = 'listing:index';

export class ListingDatasourceImpl implements ListingDatasource {
	public async getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<ListingEntity[]>> {
		const { page, limit } = pagination;
		const client = await RedisClient.getInstance().getClient();

		const { documents } = await client.ft.search(LISTING_INDEX_KEY, '*', {
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
		const encoder = new AbiCoder();
		const hash = keccak256(
			encoder.encode(['address', 'address', 'uint256'], [createDto.owner, createDto.nftContract, createDto.tokenId])
		);
		// eslint-disable-next-line
		await client.json.set(`listing:${hash}`, '.', json as any);
		return newListing;
	}
}
