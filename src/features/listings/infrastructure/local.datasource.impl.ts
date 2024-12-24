import { ONE } from '../../../core';
import { type PaginationDto, type PaginationResponseEntity } from '../../shared';
import {
	ListingEntity,
	type ListingDatasource
} from '../domain';

const LISTING_MOCK = [
	{
		minPriceCents: "150000",
		nftContract: "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9",
		tokenId: 72997
	},
	{
		minPriceCents: "150000",
		nftContract: "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9",
		tokenId: 72997
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
}