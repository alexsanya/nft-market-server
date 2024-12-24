import { type NextFunction, type Request, type Response } from 'express';

import { type SuccessResponse, ONE, TEN } from '../../../core';
import { PaginationDto, type PaginationResponseEntity } from '../../shared';

import {
    GetListings,
	type ListingEntity,
	type ListingRepository
} from '../domain';

interface Params {
	id: string;
}

interface RequestBody {
	text: string;
	isCompleted: string;
}

interface RequestQuery {
	page: string;
	limit: string;
}

export class ListingsController {
	//* Dependency injection
	constructor(private readonly repository: ListingRepository) {}

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
}