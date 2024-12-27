import { type NextFunction, type Request, type Response } from 'express';

import { type SuccessResponse, envs, HttpCode, ONE, Signature, TEN } from '../../../core';
import { OnChainDataSourceImpl, PaginationDto, type PaginationResponseEntity } from '../../shared';
import { RequestBody as BidRequestBody } from '../../bids/presentation/controller';

import {
    GetSettlements,
    CreateSettlement,
    CreateSettlementDto,
	type SettlementEntity,
	type SettlementRepository
} from '../domain';
import { EvmUtils } from '../../shared';
import { JsonRpcProvider } from 'ethers';

interface RequestQuery {
	page: string;
	limit: string;
}

interface RequestBody {
    bid: BidRequestBody;
    signature: Signature;
}

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export class SettlementController {
	//* Dependency injection
	constructor(
        private readonly repository: SettlementRepository,
        private readonly evmUtils: EvmUtils
    ) {}

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
        const onChainDataSource = new OnChainDataSourceImpl(new JsonRpcProvider(envs.PROVIDER_JSON_RPC_ENDPOINTS[bid.listing.chainId]));
		new CreateSettlement(this.repository, onChainDataSource, this.evmUtils)
			.execute(createDto)
			.then((result) => res.status(HttpCode.CREATED).json({ data: result }))
			.catch(next);
	};
}