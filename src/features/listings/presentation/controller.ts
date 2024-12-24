import { type NextFunction, type Request, type Response } from 'express';

import { type SuccessResponse, HttpCode, ONE, TEN } from '../../../core';
import { PaginationDto, type PaginationResponseEntity } from '../../shared';

import {
    CreateListingDto,
    GetListings,
	type ListingEntity,
	type ListingRepository
} from '../domain';
import { Signature } from 'ethers';
import { CreateListing } from '../domain/usecases/create.usecase';

interface Params {
	id: string;
}

interface RequestBody {
    owner: string;
    chainId: number;
    minPriceCents: number;
    nftContract: string;
    tokenId: number;
    signature: Signature;
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

    public create = (
		req: Request<unknown, unknown, RequestBody>,
		res: Response<SuccessResponse<ListingEntity>>,
		next: NextFunction
	): void => {
		const { owner, chainId, minPriceCents, nftContract, tokenId, signature } = req.body;
		const createDto = CreateListingDto.create({ owner, chainId, minPriceCents, nftContract, tokenId, signature });
		new CreateListing(this.repository)
			.execute(createDto)
			.then((result) => res.status(HttpCode.CREATED).json({ data: result }))
			.catch(next);
	};
}