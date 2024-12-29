import { ONE } from '../../../core';
import { type PaginationDto, type PaginationResponseEntity } from '../../shared';
import { type CreateSettlementDto, SettlementEntity, type SettlementDatasource } from '../domain';

const SETTLEMENT_MOCKS: Array<Record<string, unknown>> = [
	{
		bid: {
			bidder: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			tokenAddress: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			validUntil: '1735255023397',
			value: '100500',
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
			signature: {
				v: 5,
				r: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712',
				s: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712'
			}
		},
		signature: {
			v: 5,
			r: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712',
			s: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712'
		}
	},
	{
		bid: {
			bidder: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			tokenAddress: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9',
			validUntil: '1735255023397',
			value: '100500',
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
			signature: {
				v: 5,
				r: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712',
				s: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712'
			}
		},
		signature: {
			v: 5,
			r: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712',
			s: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712'
		}
	}
];

export class SettlementDatasourceImpl implements SettlementDatasource {
	public async getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<SettlementEntity[]>> {
		const { page, limit } = pagination;

		const todos = SETTLEMENT_MOCKS;
		const total = SETTLEMENT_MOCKS.length;

		const totalPages = Math.ceil(total / limit);
		const nextPage = page < totalPages ? page + ONE : null;
		const prevPage = page > ONE ? page - ONE : null;

		return {
			results: todos.slice((page - ONE) * limit, page * limit).map((todo) => SettlementEntity.fromJson(todo)),
			currentPage: page,
			nextPage,
			prevPage,
			total,
			totalPages
		};
	}

	public async create(createDto: CreateSettlementDto): Promise<SettlementEntity> {
		const json = createDto.toJson();
		const newSettlement = SettlementEntity.fromJson(json);
		SETTLEMENT_MOCKS.push(json);
		return await Promise.resolve(newSettlement);
	}
}
