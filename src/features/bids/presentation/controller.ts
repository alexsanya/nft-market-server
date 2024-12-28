import { type NextFunction, type Request, type Response } from 'express';

import { type SuccessResponse, DOMAIN_SEPARATORS, envs, HttpCode, ONE, Signature, TEN } from '../../../core';
import { EvmUtils, EvmUtilsImpl, OnChainDataSourceImpl, PaginationDto, type PaginationResponseEntity } from '../../shared';
import { RequestBody as ListingRequestBody } from '../../listings/presentation/controller';

import {
    GetBids,
    CreateBid,
    CreateBidDto,
	type BidEntity,
	type BidRepository
} from '../domain';
import { JsonRpcProvider } from 'ethers';

interface RequestQuery {
	page: string;
	limit: string;
}

export interface RequestBody {
    bidder: string;
    listing: ListingRequestBody;
    tokenAddress: string;
    validUntil: BigInt;
    value: BigInt;
    signature: Signature;
}

export class BidsController {
	//* Dependency injection
	constructor(
        private readonly repository: BidRepository
    ) {}

	public getAll = (
		req: Request<unknown, unknown, unknown, RequestQuery>,
		res: Response<SuccessResponse<PaginationResponseEntity<BidEntity[]>>>,
		next: NextFunction
	): void => {
		const { page = ONE, limit = TEN } = req.query;
		const paginationDto = PaginationDto.create({ page: +page, limit: +limit });
		new GetBids(this.repository)
			.execute(paginationDto)
			.then((result) => res.json({ data: result }))
			.catch((error) => {
				next(error);
			});
	};

    public create = (
		req: Request<unknown, unknown, RequestBody>,
		res: Response<SuccessResponse<BidEntity>>,
		next: NextFunction
	): void => {
		const { bidder, listing, tokenAddress, validUntil, value, signature } = req.body;
		const createDto = CreateBidDto.create({ bidder, listing, tokenAddress, validUntil, value, signature });
        const onChainDataSource = new OnChainDataSourceImpl(new JsonRpcProvider(envs.PROVIDER_JSON_RPC_ENDPOINTS[listing.chainId]));
        const evmUtils = new EvmUtilsImpl(DOMAIN_SEPARATORS[listing.chainId]);
		new CreateBid(this.repository, onChainDataSource, evmUtils)
			.execute(createDto)
			.then((result) => res.status(HttpCode.CREATED).json({ data: result }))
			.catch(next);
	};

}