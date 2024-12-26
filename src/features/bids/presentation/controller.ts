import { type NextFunction, type Request, type Response } from 'express';

import { type SuccessResponse, ONE, TEN } from '../../../core';
import { PaginationDto, type PaginationResponseEntity } from '../../shared';

import {
    GetBids,
	type BidEntity,
	type BidRepository
} from '../domain';

interface RequestQuery {
	page: string;
	limit: string;
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

}