import { type NextFunction, type Request, type Response } from 'express';

import { type SuccessResponse, ONE, TEN } from '../../../core';
import { PaginationDto, type PaginationResponseEntity } from '../../shared';

import {
    GetSettlements,
	type SettlementEntity,
	type SettlementRepository
} from '../domain';
import { EvmUtils } from '../../shared';

interface RequestQuery {
	page: string;
	limit: string;
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
}