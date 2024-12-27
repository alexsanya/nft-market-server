import { type NextFunction, type Request, type Response } from 'express';

import { type SuccessResponse, Signature, HttpCode, ONE, TEN, envs } from '../../../core';
import { PaginationDto, type PaginationResponseEntity } from '../../shared';

import {
    CreateListingDto,
    GetListings,
    CreateListing,
	type ListingEntity,
	type ListingRepository
} from '../domain';
import { EvmUtils, OnChainDataSourceImpl } from '../../shared';
import { providers } from 'ethers';

export interface RequestBody {
    owner: string;
    chainId: string;
    nonce: string;
    minPriceCents: number;
    nftContract: string;
    tokenId: string;
    signature: Signature;
}

interface RequestQuery {
	page: string;
	limit: string;
}

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export class ListingsController {
	//* Dependency injection
	constructor(
        private readonly repository: ListingRepository,
        private readonly evmUtils: EvmUtils
    ) {}

	public getAll = (
		req: Request<unknown, unknown, unknown, RequestQuery>,
		res: Response<SuccessResponse<PaginationResponseEntity<ListingEntity[]>>>,
		next: NextFunction
	): void => {
		const { page = ONE, limit = TEN } = req.query;
		const paginationDto = PaginationDto.create({ page: +page, limit: +limit });
		new GetListings(this.repository)
			.execute(paginationDto)
			.then((result) => res.json({ data: result }))
			.catch((error) => {
				next(error);
			});
	};

    public create = (
		req: Request<unknown, unknown, RequestBody>,
		res: Response<SuccessResponse<ListingEntity>>,
		next: NextFunction
	): void => {
		const { owner, chainId, nonce, minPriceCents, nftContract, tokenId, signature } = req.body;
		const createDto = CreateListingDto.create({ owner, chainId, nonce, minPriceCents, nftContract, tokenId, signature });
        const onChainDataSource = new OnChainDataSourceImpl(new providers.JsonRpcProvider(envs.PROVIDER_JSON_RPC_ENDPOINTS[chainId]));
		new CreateListing(this.repository, onChainDataSource, this.evmUtils)
			.execute(createDto)
			.then((result) => res.status(HttpCode.CREATED).json({ data: result }))
			.catch(next);
	};
}