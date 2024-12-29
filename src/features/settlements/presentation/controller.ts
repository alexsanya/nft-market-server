import { type NextFunction, type Request, type Response } from 'express';

import { type SuccessResponse, DOMAIN_SEPARATORS, envs, HttpCode, ONE, type Signature, TEN } from '../../../core';
import { EvmUtilsImpl, OnChainDataSourceImpl, PaginationDto, type PaginationResponseEntity } from '../../shared';
import { type RequestBody as BidRequestBody } from '../../bids/presentation/controller';

import {
	GetSettlements,
	CreateSettlement,
	CreateSettlementDto,
	type SettlementEntity,
	type SettlementRepository
} from '../domain';
import { JsonRpcProvider } from 'ethers';

interface RequestQuery {
	page: string;
	limit: string;
}

interface RequestBody {
	bid: BidRequestBody;
	signature: Signature;
}

export class SettlementController {
	//* Dependency injection
	constructor(private readonly repository: SettlementRepository) {}

	public getAll = (
		req: Request<unknown, unknown, unknown, RequestQuery>,
		res: Response<SuccessResponse<PaginationResponseEntity<SettlementEntity[]>>>,
		next: NextFunction
	): void => {
		const { page = ONE, limit = TEN } = req.query;
		const paginationDto = PaginationDto.create({ page: +page, limit: +limit });
		new GetSettlements(this.repository)
			.execute(paginationDto)
			.then((result) => res.json({ data: result }))
			.catch((error) => {
				next(error);
			});
	};

	public create = (
		req: Request<unknown, unknown, RequestBody>,
		res: Response<SuccessResponse<SettlementEntity>>,
		next: NextFunction
	): void => {
		const { bid, signature } = req.body;
		const createDto = CreateSettlementDto.create({ bid, signature });
		const onChainDataSource = new OnChainDataSourceImpl(
			new JsonRpcProvider(envs.PROVIDER_JSON_RPC_ENDPOINTS[bid.listing.chainId])
		);
		const evmUtils = new EvmUtilsImpl(DOMAIN_SEPARATORS[bid.listing.chainId]);
		new CreateSettlement(this.repository, onChainDataSource, evmUtils)
			.execute(createDto)
			.then((result) => res.status(HttpCode.CREATED).json({ data: result }))
			.catch(next);
	};
}
