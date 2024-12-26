import { ONE } from '../../../core';
import { type PaginationDto, type PaginationResponseEntity } from '../../shared';
import {
	ListingEntity,
	type ListingDatasource
} from '../domain';
import { CreateListingDto } from '../domain/dtos';

const LISTING_MOCK: Array<Record<string, unknown>> = [
	{
		owner: "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9",
		chainId: "11155111",
		minPriceCents: "150000",
		nftContract: "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9",
		tokenId: "72997",
		nonce: "0",
		signature: {
			v: 5,
			r: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712",
			s: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712"
		}
	},
	{
		owner: "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9",
		chainId: "11155111",
		minPriceCents: "150000",
		nftContract: "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9",
		tokenId: "72997",
		nonce: "0",
		signature: {
			v: 5,
			r: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712",
			s: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712"
		}
	}
];

export class ListingDatasourceImpl implements ListingDatasource {
	public async getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<ListingEntity[]>> {
		const { page, limit } = pagination;

		const todos = LISTING_MOCK;
		const total = LISTING_MOCK.length;

		const totalPages = Math.ceil(total / limit);
		const nextPage = page < totalPages ? page + ONE : null;
		const prevPage = page > ONE ? page - ONE : null;

		return {
			results: todos.slice((page - ONE) * limit, page * limit).map((todo) => ListingEntity.fromJson(todo)),
			currentPage: page,
			nextPage,
			prevPage,
			total,
			totalPages
		};
	}

	public async create(createDto: CreateListingDto): Promise<ListingEntity> {
		const json = createDto.toJson();
		const newListing = ListingEntity.fromJson(json);
		LISTING_MOCK.push(json);
		return newListing;
	}
}